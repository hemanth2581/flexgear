// frontend/src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiOptions extends RequestInit {
  token?: string | null;
  cacheTtlMs?: number;
  skipCache?: boolean;
}

// Ultra-fast in-memory cache for zero perceived navigation lag
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TTL = 30000; // 30 seconds

export async function apiClient<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, cacheTtlMs = DEFAULT_CACHE_TTL, skipCache = false, ...customConfig } = options;
  const isGet = !customConfig.method || customConfig.method.toUpperCase() === 'GET';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cacheKey = `${cleanEndpoint}:${token || 'anon'}`;

  // Instant SWR: If cached and valid, return immediately
  if (isGet && !skipCache && typeof window !== 'undefined') {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data;
    }
  }

  const authHeader: Record<string, string> = {};
  if (token) {
    authHeader['Authorization'] = `Bearer ${token}`;
  } else if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem('flexgear_token');
    if (savedToken) {
      authHeader['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  const config: RequestInit = {
    method: customConfig.body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE}${cleanEndpoint}`, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText };
      }
      throw new Error(errorData.error || errorData.message || 'API request failed');
    }

    const resJson = await response.json();
    const result = resJson.data !== undefined ? resJson.data : resJson;

    // Cache successful GET responses
    if (isGet) {
      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    } else {
      // Invalidate cache on mutations
      memoryCache.clear();
    }

    return result;
  } catch (error) {
    // If offline/error but cache exists, return stale cache instead of failing
    const cached = memoryCache.get(cacheKey);
    if (isGet && cached) {
      return cached.data;
    }
    // Return empty array / object during SSR build if backend offline
    if (typeof window === 'undefined' && isGet) {
      return [] as any;
    }
    throw error;
  }
}
