"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { FAQ_INITIAL, faq } from "@/data/chat";
import { profile } from "@/data/profile";

type Message = { role: "user" | "assistant"; content: string };

const MAX_CHARS = 1000;
const LOW_REMAINING = 3; // show the "questions left" note from this point down

/** Turns URLs and email addresses in plain text into links. */
function linkify(text: string): ReactNode[] {
  const pattern = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
  return text.split(pattern).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a
        key={i}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="break-all text-accent underline underline-offset-2"
      >
        {part}
      </a>
    );
  });
}

/**
 * Chat panel. Suggested questions always work (pre-written answers, no network).
 * Typing free-form questions is enabled only when `apiUrl` points at the chat Worker.
 */
export function ChatWidget({ apiUrl }: { apiUrl: string }) {
  const canType = Boolean(apiUrl);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null); // free-form questions left today
  const [limitReached, setLimitReached] = useState(false);
  const [showAll, setShowAll] = useState(false); // all suggested questions, not just the first few
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const suggestions = faq.filter((item) => !asked.has(item.question));

  // Keep the newest message in view while an answer streams in.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!open) {
      // Closing the chat stops a running answer, so no tokens are spent on text nobody reads.
      abortRef.current?.abort();
      return;
    }
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Stop a running answer if the component unmounts.
  useEffect(() => () => abortRef.current?.abort(), []);

  /** Clears the conversation (the daily allowance of typed questions is kept by the Worker). */
  function startOver() {
    if (busy) return;
    setMessages([]);
    setShowAll(false);
    inputRef.current?.focus();
  }

  /** Suggested questions are answered instantly from pre-written text: no AI call, no quota. */
  function askSuggested(item: (typeof faq)[number]) {
    if (busy) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: item.question },
      { role: "assistant", content: item.answer },
    ]);
  }

  /** Free-form questions go to the chat Worker, which streams the AI's answer back. */
  async function send(text: string) {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!canType || !question || busy || limitReached) return;

    const history: Message[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const appendToAnswer = (chunk: string) =>
      setMessages((prev) => {
        const next = prev.slice();
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + chunk };
        return next;
      });

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      const left = res.headers.get("X-Chat-Remaining");
      if (left !== null) setRemaining(Number(left));

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          limitReached?: boolean;
        } | null;
        if (data?.limitReached) setLimitReached(true);
        appendToAnswer(data?.error ?? "Sorry, something went wrong. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToAnswer(decoder.decode(value, { stream: true }));
      }
      // Flush any bytes of a multi-byte character (e.g. "ş") left over from the last chunk.
      const rest = decoder.decode();
      if (rest) appendToAnswer(rest);
      if (left === "0") setLimitReached(true);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // Stopped by the visitor: keep a partial answer, drop an empty bubble.
        setMessages((prev) => (prev[prev.length - 1]?.content === "" ? prev.slice(0, -1) : prev));
      } else {
        appendToAnswer("Sorry, I couldn't connect. Please check your connection and try again.");
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const suggestionButtons = (compact: boolean) => {
    const limit = compact ? 4 : FAQ_INITIAL;
    const visible = showAll ? suggestions : suggestions.slice(0, limit);
    const hidden = suggestions.length - visible.length;
    const base = "rounded-xl border text-left transition disabled:opacity-50";
    const size = compact ? "px-2.5 py-1 text-xs" : "w-full px-3 py-2 text-sm";
    return (
      <ul className={compact ? "flex flex-wrap gap-2" : "mt-3 flex flex-col gap-2"}>
        {visible.map((item) => (
          <li key={item.question}>
            <button
              type="button"
              onClick={() => askSuggested(item)}
              disabled={busy}
              className={`${base} ${size} border-line hover:border-terracotta hover:text-accent`}
            >
              {item.question}
            </button>
          </li>
        ))}
        {hidden > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className={`${base} ${size} border-dashed border-terracotta/60 text-accent hover:bg-peach`}
            >
              More questions ({hidden})
            </button>
          </li>
        )}
      </ul>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Ask about Burcu"}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-terracotta px-4 py-3 font-medium text-white shadow-lg shadow-terracotta/30 transition hover:brightness-110 sm:right-6 sm:bottom-6 dark:text-background"
      >
        <svg
          viewBox="0 0 24 24"
          className={`size-5 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
          )}
        </svg>
        <span className="hidden sm:inline">{open ? "Close" : "Ask about Burcu"}</span>
      </button>

      <section
        id="chat-panel"
        role="dialog"
        aria-label="Chat with Burcu's portfolio assistant"
        // Stays mounted so it can animate; `inert` keeps the closed panel out of the tab order
        // and away from screen readers.
        inert={!open}
        className={`fixed inset-x-4 bottom-20 z-40 flex max-h-[min(70vh,560px)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-terracotta/15 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[380px] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-3 scale-95 opacity-0"
        }`}
      >
        <header className="relative bg-peach px-4 py-3 pr-12">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={startOver}
              disabled={busy}
              aria-label="Start over"
              title="Start over"
              className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-accent transition hover:bg-terracotta/10 disabled:opacity-40"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          )}
          <p className="font-serif text-xl text-rust">Ask about Burcu</p>
          <p className="text-xs text-muted">
            {canType
              ? "Pick a question for an instant answer, or type your own. Typed questions are answered by an AI from Burcu's CV and it can make mistakes."
              : "Pick a question for an instant answer."}
          </p>
        </header>

        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          aria-live="polite"
          // While an answer streams in, screen readers wait and announce it once complete
          // instead of reading every fragment.
          aria-busy={busy}
        >
          {messages.length === 0 ? (
            <div>
              <p className="text-sm text-muted">
                {canType
                  ? "Hi! Ask me anything about Burcu's experience, skills or projects."
                  : "Hi! Pick a question about Burcu's experience, skills or projects."}
              </p>
              {suggestionButtons(false)}
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-terracotta text-white dark:text-background"
                        : "bg-peach text-foreground"
                    }`}
                  >
                    {m.role === "assistant" && m.content
                      ? linkify(m.content)
                      : m.content ||
                        (busy && i === messages.length - 1 ? (
                          <span className="inline-flex gap-1" aria-label="Thinking">
                            <span className="size-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:-0.3s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-terracotta [animation-delay:-0.15s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-terracotta" />
                          </span>
                        ) : null)}
                  </p>
                </div>
              ))}
              {suggestions.length > 0 && !busy && (
                <div className="pt-1">{suggestionButtons(true)}</div>
              )}
              {suggestions.length === 0 && !canType && (
                <p className="pt-1 text-xs text-muted">
                  Have another question? Email Burcu at {linkify(profile.email)} or reach her on
                  LinkedIn: {linkify(profile.linkedin)}
                </p>
              )}
            </>
          )}
        </div>

        {canType && (
          <>
            {(limitReached || (remaining !== null && remaining <= LOW_REMAINING)) && (
              <p
                className="border-t border-line bg-peach/60 px-4 py-2 text-xs text-muted"
                role="status"
              >
                {limitReached
                  ? "You've used today's typed questions. The suggested questions still work."
                  : `${remaining} typed ${remaining === 1 ? "question" : "questions"} left today.`}
              </p>
            )}

            <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-line p-3">
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_CHARS}
                disabled={limitReached}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder={limitReached ? "Daily limit reached" : "Type your question…"}
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none focus:border-terracotta disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={busy || limitReached || !input.trim()}
                aria-label="Send"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-terracotta text-white transition hover:brightness-110 disabled:opacity-40 dark:text-background"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </>
        )}
      </section>
    </>
  );
}
