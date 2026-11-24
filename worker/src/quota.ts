import { DurableObject } from "cloudflare:workers";

/*
 * Daily question allowance per visitor.
 *
 * One Durable Object instance per (hashed visitor IP, UTC day). Durable Objects are
 * strongly consistent, so parallel requests cannot slip past the limit, and they need no
 * manual setup: the class is created by the migration in wrangler.toml on deploy.
 * Each instance deletes its own data a day after its first question.
 */
export class DailyQuota extends DurableObject {
  /** Uses one question if any are left. */
  async consume(limit: number): Promise<{ allowed: boolean; remaining: number }> {
    const used = (await this.ctx.storage.get<number>("used")) ?? 0;
    if (used >= limit) return { allowed: false, remaining: 0 };
    await this.ctx.storage.put("used", used + 1);
    if (used === 0) await this.ctx.storage.setAlarm(Date.now() + 26 * 60 * 60 * 1000);
    return { allowed: true, remaining: limit - used - 1 };
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }
}

/** Stable, non-reversible key for a visitor on a given day (raw IPs are never stored). */
export async function quotaKey(ip: string, now = new Date()): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ip}:${day}`));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
