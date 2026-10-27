// Ôn lặp ngắt quãng (SM-2 rút gọn) — hàm thuần, có test trong tests/progress.test.ts
// Nhớ tốt → giãn khoảng ôn (1 → 4 → 10 → 25 ngày…); quên → ôn lại sau 10 phút và giảm hệ số dễ.

export interface CardState {
  ease: number;
  /** Khoảng ôn (ngày) */
  interval: number;
  reps: number;
  lapses: number;
  /** Thời điểm đến hạn ôn (ms) */
  due: number;
  first: number;
  last: number;
}

export type Grade = "again" | "hard" | "good" | "easy";

const DAY = 86_400_000;
export const MAX_INTERVAL = 180;

/** 0:00 (giờ trên máy) của ngày chứa thời điểm ms */
export function dayStart(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function review(prev: CardState | undefined, g: Grade, now: number): CardState {
  const s: CardState = prev ?? { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now, first: now, last: 0 };
  if (g === "again") {
    return { ...s, ease: Math.max(1.3, +(s.ease - 0.2).toFixed(2)), interval: 0, reps: 0, lapses: s.lapses + (s.reps > 0 ? 1 : 0), due: now + 10 * 60_000, last: now };
  }
  const ease = Math.min(3, Math.max(1.3, +(s.ease + (g === "hard" ? -0.15 : g === "easy" ? 0.15 : 0)).toFixed(2)));
  let interval: number;
  if (s.reps === 0) interval = g === "easy" ? 3 : 1;
  else if (s.reps === 1) interval = g === "hard" ? 2 : g === "easy" ? 6 : 4;
  else interval = Math.round(s.interval * (g === "hard" ? 1.2 : g === "easy" ? ease * 1.3 : ease));
  interval = Math.min(MAX_INTERVAL, Math.max(1, interval));
  // Đến hạn từ 0:00 của ngày ôn (để buổi sáng hôm đó đã thấy thẻ)
  return { ...s, ease, interval, reps: s.reps + 1, due: dayStart(now) + interval * DAY, last: now };
}

/** Thẻ đến hạn ôn (đã học ít nhất 1 lần, tới hạn) — cũ trước */
export const dueCards = (cards: Record<string, CardState>, now: number) =>
  Object.keys(cards)
    .filter((id) => cards[id].due <= now)
    .sort((a, b) => cards[a].due - cards[b].due);

/** Thẻ đã "thuộc" (khoảng ôn ≥ 21 ngày) */
export const isMastered = (c: CardState | undefined) => !!c && c.interval >= 21;

export const GRADE_LABEL: Record<Grade, { vi: string; en: string }> = {
  again: { vi: "Chưa nhớ", en: "Again" },
  hard: { vi: "Khó", en: "Hard" },
  good: { vi: "Nhớ", en: "Good" },
  easy: { vi: "Dễ", en: "Easy" },
};
