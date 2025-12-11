// Simple in-memory cache with TTL for API GET responses
// Keyed by endpoint + serialized params

export type CacheEntry<T> = {
  data: T
  expiresAt: number
}

class ApiCache {
  private store = new Map<string, CacheEntry<any>>()

  constructor(private defaultTtlMs = 30_000) {} // default 30s TTL

  private now() {
    return Date.now()
  }

  makeKey(endpoint: string, params?: Record<string, any>) {
    const normalizedParams = params ? JSON.stringify(params, Object.keys(params).sort()) : ''
    return `${endpoint}?${normalizedParams}`
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (entry.expiresAt < this.now()) {
      this.store.delete(key)
      return undefined
    }
    return entry.data as T
  }

  set<T>(key: string, data: T, ttlMs?: number) {
    const expiresAt = this.now() + (ttlMs ?? this.defaultTtlMs)
    this.store.set(key, { data, expiresAt })
  }

  // Invalidate by endpoint prefix (e.g., "/enclosures/")
  invalidateByPrefix(prefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key)
      }
    }
  }

  clear() {
    this.store.clear()
  }
}

export const apiCache = new ApiCache()

