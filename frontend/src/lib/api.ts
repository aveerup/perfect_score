"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const DEFAULT_STALE_TIME_MS = 60_000;

type CacheEntry = {
  data: unknown;
  updatedAt: number;
};

const apiDataCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<unknown>>();

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refresh.ok) {
      return request<T>(path, init, false);
    }
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.detail ?? "Request failed");
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
};

async function cachedGet<T>(path: string, force = false): Promise<T> {
  const cached = apiDataCache.get(path);
  const isFresh = cached && Date.now() - cached.updatedAt < DEFAULT_STALE_TIME_MS;

  if (!force && isFresh) {
    return cached.data as T;
  }

  const pending = pendingRequests.get(path);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = api.get<T>(path).then((data) => {
    apiDataCache.set(path, { data, updatedAt: Date.now() });
    return data;
  });

  pendingRequests.set(path, promise);

  try {
    return await promise;
  } finally {
    pendingRequests.delete(path);
  }
}

export function invalidateApiCache(path?: string) {
  if (path) {
    apiDataCache.delete(path);
    return;
  }

  apiDataCache.clear();
}

export function useApiData<T>(path: string, initialValue: T) {
  const initialValueRef = useRef(initialValue);
  const cached = apiDataCache.get(path);
  const [data, setData] = useState<T>((cached?.data as T | undefined) ?? initialValue);
  const [loading, setLoading] = useState(!cached);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");

  const setCachedData: Dispatch<SetStateAction<T>> = useCallback((value) => {
    setData((currentData) => {
      const nextData =
        typeof value === "function"
          ? (value as (current: T) => T)(currentData)
          : value;

      apiDataCache.set(path, { data: nextData, updatedAt: Date.now() });
      return nextData;
    });
  }, [path]);

  const reload = useCallback(async (options?: { force?: boolean; silent?: boolean }) => {
    const hasCachedData = apiDataCache.has(path);
    const silent = options?.silent ?? hasCachedData;

    if (silent) {
      setValidating(true);
    } else {
      setLoading(true);
      setError("");
    }

    try {
      const nextData = await cachedGet<T>(path, options?.force ?? true);
      setData(nextData);
      setError("");
    } catch (requestError) {
      if (!apiDataCache.has(path)) {
        setError(requestError instanceof Error ? requestError.message : "Request failed");
      }
    } finally {
      setLoading(false);
      setValidating(false);
    }
  }, [path]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const cachedEntry = apiDataCache.get(path);

      if (cachedEntry) {
        setData(cachedEntry.data as T);
        setLoading(false);
        setError("");

        const isStale = Date.now() - cachedEntry.updatedAt >= DEFAULT_STALE_TIME_MS;
        if (isStale) {
          void reload({ force: true, silent: true });
        }
        return;
      }

      setData(initialValueRef.current);
      setLoading(true);
      void reload({ force: true, silent: false });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [path, reload]);

  return { data, setData: setCachedData, loading, validating, error, reload };
}
