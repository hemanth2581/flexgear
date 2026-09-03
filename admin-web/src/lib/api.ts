// admin-web/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const memoryCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TTL = 30000; // 30 seconds

export async function adminApiClient(
  endpoint: string,
  options: RequestInit & { token?: string; skipCache?: boolean; cacheTtlMs?: number } = {}
) {
  const { token, skipCache = false, cacheTtlMs = DEFAULT_CACHE_TTL, ...customConfig } = options;
  const isGet = !customConfig.method || customConfig.method.toUpperCase() === 'GET';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cacheKey = `${cleanEndpoint}:${token || 'anon'}`;

  // Instant SWR Cache Hit
  if (isGet && !skipCache && typeof window !== 'undefined') {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customConfig.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...customConfig,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || `API error (${response.status})`);
    }

    const result = data.data !== undefined ? data.data : data;

    if (isGet) {
      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    } else {
      memoryCache.clear();
    }

    return result;
  } catch (error) {
    const cached = memoryCache.get(cacheKey);
    if (isGet && cached) {
      return cached.data;
    }
    throw error;
  }
}

