import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./knowledge";
import { DailyQuota, quotaKey } from "./quota";

export { DailyQuota };

/*
 * Portfolio chat proxy.
 *
 * The site (a static GitHub Pages export) cannot hold an API key, so it posts the
 * conversation here. This Worker adds the key from its encrypted secret store, calls
 * the Claude API and streams the answer back as plain text.
 *
 * Abuse guards: request bodies, conversations and messages are capped in size, answers are
 * capped in length, each visitor IP is rate limited per minute, and each visitor gets a
 * daily allowance of free-form questions (the site answers its suggested questions itself,
 * without calling this Worker). The per-IP rate limit (plus a
 * monthly spend limit on the Anthropic account) is what protects the bill.
 *
 * The Origin check below only stops *other websites* from calling this Worker from a
 * visitor's browser. It is not authentication: any non-browser client can send a forged
 * Origin header.
 */

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ANTHROPIC_API_KEY: string; // set with `wrangler secret put` / the deploy workflow, never in code
  ALLOWED_ORIGINS: string; // comma-separated
  MODEL: string;
  DAILY_LIMIT: string; // free-form questions per visitor per UTC day
  CHAT_LIMITER?: RateLimiter;
  QUOTA: DurableObjectNamespace<DailyQuota>;
}

const MAX_BODY_BYTES = 16 * 1024; // far above any valid conversation (see limits below)
const MAX_MESSAGES = 12; // most recent turns kept per request
const MAX_MESSAGE_CHARS = 1000;
const MAX_TOTAL_CHARS = 8000;

const FRIENDLY_ERROR =
  "Sorry, I can't answer right now. Please try again in a moment, or email Burcu at burcukizilaslan.05@gmail.com.";

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "X-Chat-Remaining, X-Chat-Limit",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

/** Reads the body as text, stopping as soon as it exceeds `limit` bytes (returns null then). */
async function readCapped(request: Request, limit: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

/** Validates the visitor's conversation and returns it as API messages, or an error string. */
function parseMessages(input: unknown): Anthropic.MessageParam[] | string {
  if (!input || typeof input !== "object" || !Array.isArray((input as { messages?: unknown }).messages)) {
    return "Expected { messages: [...] }";
  }
  const raw = (input as { messages: unknown[] }).messages.slice(-MAX_MESSAGES);
  const messages: Anthropic.MessageParam[] = [];
  let total = 0;
  for (const m of raw) {
    if (!m || typeof m !== "object") return "Invalid message";
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return "Invalid message";
    const text = content.trim();
    if (!text) continue;
    if (text.length > MAX_MESSAGE_CHARS) return "Message too long";
    total += text.length;
    messages.push({ role, content: text });
  }
  if (total > MAX_TOTAL_CHARS) return "Conversation too long";
  // The API expects the conversation to start with the user and end with the user.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return "Last message must be from the user";
  return messages;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json(405, { error: "Method not allowed" }, cors);
    if (!cors["Access-Control-Allow-Origin"]) return json(403, { error: "Origin not allowed" }, cors);

    if (env.CHAT_LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      const { success } = await env.CHAT_LIMITER.limit({ key: ip });
      if (!success) {
        return json(429, { error: "Too many messages. Please wait a minute and try again." }, cors);
      }
    }

    // Reject oversized bodies before reading them into memory. Content-Length can be
    // missing or wrong, so the size is checked again on the bytes actually received.
    const declaredLength = Number(request.headers.get("Content-Length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) return json(413, { error: "Request too large" }, cors);
    const raw = await readCapped(request, MAX_BODY_BYTES);
    if (raw === null) return json(413, { error: "Request too large" }, cors);

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { error: "Invalid JSON" }, cors);
    }
    const messages = parseMessages(body);
    if (typeof messages === "string") return json(400, { error: messages }, cors);

    // Count the question only once it is valid, right before it costs anything.
    const dailyLimit = Number(env.DAILY_LIMIT) || 10;
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const quota = env.QUOTA.get(env.QUOTA.idFromName(await quotaKey(ip)));
    const { allowed, remaining } = await quota.consume(dailyLimit);
    const quotaHeaders = { "X-Chat-Remaining": String(remaining), "X-Chat-Limit": String(dailyLimit) };
    if (!allowed) {
      return json(
        429,
        {
          error: `You've reached today's limit of ${dailyLimit} questions. To learn more, contact Burcu by email at burcukizilaslan.05@gmail.com or on LinkedIn: https://www.linkedin.com/in/bkozcan`,
          limitReached: true,
        },
        { ...cors, ...quotaHeaders },
      );
    }

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const encoder = new TextEncoder();

    const stream = client.messages.stream({
      model: env.MODEL,
      max_tokens: 1024, // answers are meant to be a few sentences (thinking counts toward this too)
      output_config: { effort: "low" }, // quick, conversational replies
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
    });

    const output = new ReadableStream<Uint8Array>({
      async start(controller) {
        let sentText = false;
        stream.on("text", (delta) => {
          sentText = true;
          controller.enqueue(encoder.encode(delta));
        });
        try {
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal" && !sentText) {
            controller.enqueue(
              encoder.encode("Sorry, I can't help with that. Feel free to ask about Burcu's work and experience."),
            );
          }
        } catch (error) {
          if (error instanceof Anthropic.RateLimitError) {
            console.error("Anthropic rate limit", error.status);
          } else if (error instanceof Anthropic.APIError) {
            console.error("Anthropic API error", error.status, error.message);
          } else {
            console.error("Stream failed", error);
          }
          controller.enqueue(encoder.encode((sentText ? "\n\n" : "") + FRIENDLY_ERROR));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort(); // visitor closed the chat mid-answer: stop paying for tokens
      },
    });

    return new Response(output, {
      headers: {
        ...cors,
        ...quotaHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};
