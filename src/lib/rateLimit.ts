import LRU from "lru-cache";
const cache = new LRU<string, { n: number; t: number }>({ max: 5000 });
export function rateLimit(ip: string, limit = 6, windowMs = 60_000){
const now = Date.now();
const k = `rl:${ip}`; const v = cache.get(k);
if (!v) { cache.set(k, { n:1, t: now }); return { ok: true }; }
if (now - v.t > windowMs) { cache.set(k, { n:1, t: now }); return { ok:true }; }
if (v.n >= limit) return { ok:false };
v.n++; cache.set(k, v); return { ok:true };
}
