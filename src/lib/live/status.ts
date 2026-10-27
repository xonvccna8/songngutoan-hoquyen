// Trạng thái học trong tiết (docs/DU-LIEU.md): luôn = màu + biểu tượng + chữ
import type { ParticipantDoc } from "@/lib/live/types";

export type LiveStatus = "absent" | "watching" | "answered" | "pending" | "away" | "offline";

export const STATUS_META: Record<LiveStatus, { label: string; bg: string; fg: string }> = {
  watching: { label: "Đang theo dõi", bg: "#DDF7EE", fg: "#0A6F5F" },
  answered: { label: "Đã trả lời", bg: "#E7ECFF", fg: "#1E3FB8" },
  pending: { label: "Chưa trả lời", bg: "#FFF1D2", fg: "#8A5A00" },
  away: { label: "Rời trang", bg: "#FFE3DD", fg: "#A3301B" },
  offline: { label: "Mất kết nối", bg: "#ECEAF4", fg: "#4A4870" },
  absent: { label: "Chưa vào", bg: "#F3F2F8", fg: "#55537A" },
};

/** Ngưỡng mất kết nối: điện thoại gửi nhịp 25 giây/lần */
export const OFFLINE_MS = 60_000;
/** Câu hỏi mở quá 30 giây mà chưa trả lời */
export const PENDING_MS = 30_000;

/**
 * Mất kết nối: nhịp của em cũ hơn nhịp mới nhất của cả lớp > 60 giây (so giờ máy chủ với nhau nên không lệch),
 * hoặc cũ hơn giờ máy GV quá nhiều (phòng khi cả lớp cùng mất mạng; cho phép lệch giờ 2 phút).
 */
export function isStale(lastSeen: number | undefined, newest: number, now: number): boolean {
  if (!lastSeen) return false;
  return newest - lastSeen > OFFLINE_MS || now - lastSeen > OFFLINE_MS + 120_000;
}

export function liveStatus(opts: {
  p: ParticipantDoc | undefined;
  stale: boolean;
  questionOpen: boolean;
  /** Câu hỏi đã mở được bao lâu (ms) */
  openElapsed: number | null;
  answered: boolean;
}): LiveStatus {
  const { p, stale, questionOpen, openElapsed, answered } = opts;
  if (!p) return "absent";
  if (stale) return "offline";
  if (p.visible === false) return "away";
  if (questionOpen && answered) return "answered";
  if (questionOpen && openElapsed != null && openElapsed > PENDING_MS) return "pending";
  return "watching";
}
