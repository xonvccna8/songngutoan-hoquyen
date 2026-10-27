"use client";

// Gọi API route kèm ID token của người đang đăng nhập
import { auth } from "@/lib/firebase/client";

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) {
    const token = await auth().currentUser?.getIdToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(path, {
      method: opts.method ?? (opts.body ? "POST" : "GET"),
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new Error("Mất kết nối mạng, thử lại nhé.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Có lỗi xảy ra.");
  return data as T;
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Có lỗi xảy ra.");
