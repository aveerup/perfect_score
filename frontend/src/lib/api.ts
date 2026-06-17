"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

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

export function useApiData<T>(path: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await api.get<T>(path));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    const timer = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  return { data, setData, loading, error, reload };
}
