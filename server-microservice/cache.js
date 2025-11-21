// server/cache.js
const cache = new Map(); // key: token, value: { data, exp }

export function getCache(k) {
  const v = cache.get(k);
  if (!v) return null;
  if (Date.now() > v.exp) { cache.delete(k); return null; }
  return v.data;
}

export function setCache(k, data, ttlMs = 120000) {
  cache.set(k, { data, exp: Date.now() + ttlMs });
}