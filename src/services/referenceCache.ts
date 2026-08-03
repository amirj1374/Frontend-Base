import type { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Per-session in-memory cache for **static reference / master data** GET requests
 * (head branches, plan types, loan-contract lists, statuses, …).
 *
 * Many filter components refetch the exact same lookups in their `onMounted`
 * (e.g. `fetchBranches` is called from 13 filters). Those lists do not change
 * during a session, so this dedupes them to a single request keyed by the
 * **canonical request URL** — cutting redundant network round-trips, JSON parsing
 * and the allocation of N identical arrays.
 *
 * Guarantees:
 *  - The cache stores the **Promise**, set before the request resolves, so
 *    components mounting simultaneously share one in-flight HTTP request rather
 *    than firing duplicates.
 *  - The key is produced by `axiosInstance.getUri({ url, params })`, i.e. the exact
 *    URL axios will request — baseURL + path, slash-normalized, **including the
 *    query string** (whether embedded in `url` or supplied via `params`, both are
 *    serialized here exactly as in the real request). So `/status?page=1` and
 *    `/status?page=2` never share an entry, and two calls collide iff axios would
 *    issue the identical request.
 *  - Entries expire after a configurable TTL (default 5 minutes). The first
 *    access past expiry transparently refetches — no logout required.
 *  - A failed or cancelled request is **never** left cached: it is evicted as
 *    soon as it rejects, so the next caller retries normally.
 *  - Expired entries are removed on access; the key space is the fixed, small set
 *    of reference URLs, so the map is bounded and cannot leak.
 *
 * Safety: callers only read `response.data` (verified — no call site mutates the
 * returned arrays), so sharing one resolved response is behaviour-preserving.
 * Only true reference/master endpoints use this; user/parametrised, dashboard and
 * financial-rate endpoints are intentionally excluded.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  promise: Promise<AxiosResponse>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

// Dev-only HIT/MISS diagnostics. Everything below is guarded by
// `import.meta.env.DEV`, which Vite statically replaces with `false` in production
// builds — so the counter and the logging are dead-code-eliminated (tree-shaken)
// and never ship to production.
const stats = import.meta.env.DEV ? { hits: 0, misses: 0 } : null;

function logAccess(kind: 'HIT' | 'MISS', fullUrl: string): void {
  if (import.meta.env.DEV && stats) {
    if (kind === 'HIT') stats.hits++;
    else stats.misses++;
    const total = stats.hits + stats.misses;
    const rate = total ? Math.round((stats.hits / total) * 100) : 0;
    // eslint-disable-next-line no-console
    console.debug(`[referenceCache] ${kind}  ${fullUrl}  (hits=${stats.hits}, misses=${stats.misses}, hitRate=${rate}%)`);
  }
}

export function cachedGet(
  axiosInstance: AxiosInstance,
  url: string,
  ttlMs: number = DEFAULT_TTL_MS,
  params?: Record<string, unknown>
): Promise<AxiosResponse> {
  // Canonical key = the exact URL axios will request, produced by axios' own
  // resolution (baseURL + path, leading-slash normalized, query string serialized
  // from both any embedded `?…` in `url` and `params`). The same `params` is then
  // forwarded to `get`, so the key is guaranteed identical to the issued request —
  // `/status?page=1` and `/status?page=2` (or their `{ params }` equivalents) get
  // distinct entries, with no manual string juggling that could drift from axios.
  const key = axiosInstance.getUri({ url, params });

  const now = Date.now();
  const existing = cache.get(key);

  if (existing && existing.expiresAt > now) {
    // Fresh: share the cached promise (in-flight or already resolved).
    logAccess('HIT', key);
    return existing.promise;
  }

  // Expired (or absent): drop any stale entry on access, then refetch.
  if (existing) cache.delete(key);
  logAccess('MISS', key);

  const promise = axiosInstance.get(url, params === undefined ? undefined : { params });
  const entry: CacheEntry = { promise, expiresAt: now + ttlMs };
  cache.set(key, entry);

  // Never keep a failed/cancelled request cached. Guard against deleting a newer
  // entry that may have replaced this one in the meantime.
  promise.catch(() => {
    if (cache.get(key) === entry) cache.delete(key);
  });

  return promise;
}

/** Clear all cached reference data (e.g. on logout / auth reset). */
export function clearReferenceCache(): void {
  cache.clear();
}
