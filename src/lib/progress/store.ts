"use client";

// Kho tiến độ trên máy: đọc/ghi localStorage + hook React (useSyncExternalStore).
// Trình duyệt chặn bộ nhớ (chế độ ẩn danh…) thì vẫn học được, chỉ là không nhớ sau khi tải lại.
import { useSyncExternalStore } from "react";
import { emptyProgress, sanitize, type Progress } from "@/lib/progress/logic";

const KEY = "t8sn:v1";
const SERVER = emptyProgress();
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return (raw && sanitize(JSON.parse(raw))) || emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function getProgress(): Progress {
  if (!cache) cache = load();
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

/** Cập nhật tiến độ bằng một hàm thuần (xem lib/progress/logic.ts) */
export function update(fn: (s: Progress, now: number) => Progress) {
  cache = fn(getProgress(), Date.now());
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  // Mở web ở 2 tab: tab này cập nhật theo tab kia
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = load();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getProgress, () => SERVER);
}

/** true sau khi đã đọc tiến độ thật trên máy (tránh nháy "0 XP" lúc mới mở) */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Tải tệp sao lưu tiến độ (để chuyển sang máy khác) */
export function exportProgress() {
  const blob = new Blob([JSON.stringify(getProgress(), null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tien-do-toan8-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Nhập tệp sao lưu; trả về false nếu tệp không hợp lệ */
export async function importProgress(file: File): Promise<boolean> {
  try {
    const p = sanitize(JSON.parse(await file.text()));
    if (!p) return false;
    update(() => p);
    return true;
  } catch {
    return false;
  }
}

export function resetProgress() {
  update(() => emptyProgress());
}

// Giờ hiện tại dùng khi hiển thị (cập nhật mỗi phút). Máy chủ trả 0 → các con số ngày/giờ chỉ tính trên trình duyệt.
let nowCache = 0;
const readNow = () => (nowCache ||= Date.now());
function subscribeNow(cb: () => void) {
  const t = setInterval(() => {
    nowCache = Date.now();
    cb();
  }, 60_000);
  return () => clearInterval(t);
}

export function useNow(): number {
  return useSyncExternalStore(subscribeNow, readNow, () => 0);
}
