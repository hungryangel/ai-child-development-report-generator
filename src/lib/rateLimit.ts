// src/lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

// v10+ 맞는 사용법: LRUCache 클래스를 사용합니다.
const limiter = new LRUCache<string, { count: number; ts: number }>({
  max: 5000, // 엔트리 최대 개수
  // ttl은 창구(window) 계산을 직접 하므로 쓰지 않습니다.
});

export function rateLimit(ip: string, limit = 6, windowMs = 60_000) {
  const now = Date.now();
  const key = `rl:${ip}`;
  const hit = limiter.get(key);

  if (!hit) {
    limiter.set(key, { count: 1, ts: now });
    return { ok: true, remaining: limit - 1 };
  }

  // 윈도우 경과 시 카운터 리셋
  if (now - hit.ts > windowMs) {
    limiter.set(key, { count: 1, ts: now });
    return { ok: true, remaining: limit - 1 };
  }

  if (hit.count >= limit) return { ok: false, remaining: 0 };

  hit.count += 1;
  limiter.set(key, hit);
  return { ok: true, remaining: limit - hit.count };
}
