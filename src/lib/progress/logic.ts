// Tiến độ học của em — hàm thuần (nhận trạng thái cũ, trả trạng thái mới), có test trong tests/progress.test.ts.
// Mọi thứ chỉ lưu trên máy (localStorage): không đăng nhập, không gửi đi đâu.
import type { Question } from "@/lib/content/types";
import { review, type CardState, type Grade } from "@/lib/progress/srs";

export type StepId = "tu-vung" | "hieu-bai" | "luyen-tap" | "noi" | "kiem-tra";
export const STEPS: StepId[] = ["tu-vung", "hieu-bai", "luyen-tap", "noi", "kiem-tra"];

export type LangMode = "both" | "en" | "vi";

export interface LessonProg {
  steps: Partial<Record<StepId, boolean>>;
  /** Số câu luyện tập làm đúng */
  practiceCorrect: number;
  /** Điểm kiểm tra cao nhất (0–5) */
  quizBest: number;
}

/** Câu làm sai được ghi vào sổ; làm đúng 2 lần liên tiếp khi ôn thì rời sổ */
export interface Mistake {
  key: string;
  lessonId: string;
  q: Question;
  at: number;
  wrongs: number;
  rights: number;
}

export interface Progress {
  v: 1;
  name: string;
  lang: LangMode;
  xp: number;
  /** XP theo ngày, khoá "YYYYMMDD" */
  days: Record<string, number>;
  lessons: Record<string, LessonProg>;
  cards: Record<string, CardState>;
  mistakes: Mistake[];
  /** Điểm phát âm cao nhất mỗi câu, khoá "k8-12:0" */
  speak: Record<string, number>;
  stats: { answered: number; correct: number; mathWrong: number; langWrong: number; cardReviews: number; speakTries: number };
}

export const DAILY_GOAL = 50;
/** Số câu luyện tập đúng để hoàn thành bước Luyện tập */
export const PRACTICE_GOAL = 6;
/** Số câu nói đạt ≥ 70 điểm để hoàn thành bước Nói */
export const SPEAK_GOAL = 3;
export const SPEAK_PASS = 70;
export const QUIZ_SIZE = 5;

export const emptyProgress = (): Progress => ({
  v: 1,
  name: "",
  lang: "both",
  xp: 0,
  days: {},
  lessons: {},
  cards: {},
  mistakes: [],
  speak: {},
  stats: { answered: 0, correct: 0, mathWrong: 0, langWrong: 0, cardReviews: 0, speakTries: 0 },
});

const emptyLesson = (): LessonProg => ({ steps: {}, practiceCorrect: 0, quizBest: 0 });

export function dayKey(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function addXp(s: Progress, n: number, now: number): Progress {
  if (n <= 0) return s;
  const k = dayKey(now);
  return { ...s, xp: s.xp + n, days: { ...s.days, [k]: (s.days[k] ?? 0) + n } };
}

const lesson = (s: Progress, id: string) => s.lessons[id] ?? emptyLesson();
const withLesson = (s: Progress, id: string, lp: LessonProg): Progress => ({ ...s, lessons: { ...s.lessons, [id]: lp } });

/** Đánh dấu xong một bước (lần đầu +20 XP) */
export function completeStep(s: Progress, lessonId: string, step: StepId, now: number): Progress {
  const lp = lesson(s, lessonId);
  if (lp.steps[step]) return s;
  return addXp(withLesson(s, lessonId, { ...lp, steps: { ...lp.steps, [step]: true } }), 20, now);
}

export type AnswerSource = "practice" | "vocab" | "quiz" | "check" | "review";

/**
 * Ghi một lần trả lời. Đúng: +10 XP (dùng từ 2 gợi ý trở lên: +5).
 * Sai: ghi vào sổ lỗi sai. Ôn sổ lỗi: đúng 2 lần liên tiếp thì xoá khỏi sổ.
 */
export function recordAnswer(
  s: Progress,
  a: { lessonId: string; q: Question; correct: boolean; hints: number; source: AnswerSource },
  now: number,
): Progress {
  const stats = {
    ...s.stats,
    answered: s.stats.answered + 1,
    correct: s.stats.correct + (a.correct ? 1 : 0),
    mathWrong: s.stats.mathWrong + (!a.correct && a.q.skill === "math" ? 1 : 0),
    langWrong: s.stats.langWrong + (!a.correct && a.q.skill === "lang" ? 1 : 0),
  };
  let next: Progress = { ...s, stats };
  const key = `${a.lessonId}:${a.q.id}`;
  const i = next.mistakes.findIndex((m) => m.key === key);

  if (a.correct) {
    next = addXp(next, a.hints >= 2 ? 5 : 10, now);
    if (i >= 0 && a.source === "review") {
      const m = next.mistakes[i];
      const rights = m.rights + 1;
      next = { ...next, mistakes: rights >= 2 ? next.mistakes.filter((_, j) => j !== i) : next.mistakes.map((x, j) => (j === i ? { ...x, rights } : x)) };
    }
    if (a.source === "practice") {
      const lp = lesson(next, a.lessonId);
      const practiceCorrect = lp.practiceCorrect + 1;
      next = withLesson(next, a.lessonId, { ...lp, practiceCorrect });
      if (practiceCorrect >= PRACTICE_GOAL) next = completeStep(next, a.lessonId, "luyen-tap", now);
    }
  } else if (a.source !== "check") {
    const m: Mistake = i >= 0 ? { ...next.mistakes[i], at: now, wrongs: next.mistakes[i].wrongs + 1, rights: 0 } : { key, lessonId: a.lessonId, q: a.q, at: now, wrongs: 1, rights: 0 };
    // Sổ giữ tối đa 60 câu gần nhất
    next = { ...next, mistakes: [m, ...next.mistakes.filter((x) => x.key !== key)].slice(0, 60) };
  }
  return next;
}

/** Sao thành thạo theo điểm kiểm tra: 3/5 → 1 sao · 4/5 → 2 sao · 5/5 → 3 sao */
export const starsOf = (quizBest: number) => (quizBest >= 5 ? 3 : quizBest >= 4 ? 2 : quizBest >= 3 ? 1 : 0);

/** Kết thúc bài kiểm tra: lưu điểm cao nhất; được thêm sao thì +20 XP mỗi sao mới */
export function finishQuiz(s: Progress, lessonId: string, score: number, now: number): Progress {
  const lp = lesson(s, lessonId);
  const gained = Math.max(0, starsOf(score) - starsOf(lp.quizBest));
  let next = withLesson(s, lessonId, { ...lp, quizBest: Math.max(lp.quizBest, score) });
  next = addXp(next, gained * 20, now);
  if (score >= 3) next = completeStep(next, lessonId, "kiem-tra", now);
  return next;
}

/** Ôn một thẻ từ vựng (+2 XP) */
export function reviewCard(s: Progress, termId: string, g: Grade, now: number): Progress {
  const next = { ...s, cards: { ...s.cards, [termId]: review(s.cards[termId], g, now) }, stats: { ...s.stats, cardReviews: s.stats.cardReviews + 1 } };
  return addXp(next, 2, now);
}

/** Ghi điểm phát âm; lần đầu đạt ≥ 80 ở câu đó +10 XP; đủ SPEAK_GOAL câu đạt thì xong bước Nói */
export function recordSpeak(s: Progress, lessonId: string, index: number, score: number, now: number): Progress {
  const key = `${lessonId}:${index}`;
  const prev = s.speak[key] ?? 0;
  let next: Progress = { ...s, speak: { ...s.speak, [key]: Math.max(prev, score) }, stats: { ...s.stats, speakTries: s.stats.speakTries + 1 } };
  if (score >= 80 && prev < 80) next = addXp(next, 10, now);
  const passed = Object.entries(next.speak).filter(([k, v]) => k.startsWith(`${lessonId}:`) && v >= SPEAK_PASS).length;
  if (passed >= SPEAK_GOAL) next = completeStep(next, lessonId, "noi", now);
  return next;
}

/** Chuỗi ngày học liên tiếp tính tới hôm nay (hôm nay chưa học thì tính tới hôm qua) */
export function streak(days: Record<string, number>, now: number): number {
  const DAY = 86_400_000;
  let t = now;
  if (!days[dayKey(t)]) t -= DAY;
  let n = 0;
  while (days[dayKey(t)]) {
    n++;
    t -= DAY;
  }
  return n;
}

export const todayXp = (s: Progress, now: number) => s.days[dayKey(now)] ?? 0;

/** Tỉ lệ hoàn thành bài (0–1) theo 5 bước */
export const lessonDone = (lp: LessonProg | undefined) => (lp ? STEPS.filter((x) => lp.steps[x]).length / STEPS.length : 0);

/** Bước nên học tiếp theo của một bài */
export const nextStep = (lp: LessonProg | undefined): StepId => STEPS.find((x) => !lp?.steps[x]) ?? "kiem-tra";

export interface Badge {
  id: string;
  icon: "rocket" | "flame" | "star" | "cards" | "mic" | "zap" | "target" | "book";
  title: { vi: string; en: string };
  desc: string;
  have: number;
  goal: number;
  earned: boolean;
}

/** Huy hiệu tính từ tiến độ */
export function badges(s: Progress, now: number): Badge[] {
  const longest = longestStreak(s.days);
  const threeStars = Object.values(s.lessons).filter((l) => starsOf(l.quizBest) === 3).length;
  const lessonsDone = Object.values(s.lessons).filter((l) => lessonDone(l) === 1).length;
  const goodSpeak = Object.values(s.speak).filter((v) => v >= 80).length;
  const defs: Omit<Badge, "earned">[] = [
    { id: "first", icon: "rocket", title: { vi: "Bước đầu tiên", en: "First step" }, desc: "Có ngày học đầu tiên", have: Object.keys(s.days).length ? 1 : 0, goal: 1 },
    { id: "streak3", icon: "flame", title: { vi: "Chuỗi 3 ngày", en: "3-day streak" }, desc: "Học 3 ngày liên tiếp", have: longest, goal: 3 },
    { id: "streak7", icon: "flame", title: { vi: "Chuỗi 7 ngày", en: "7-day streak" }, desc: "Học 7 ngày liên tiếp", have: longest, goal: 7 },
    { id: "lesson1", icon: "book", title: { vi: "Xong một bài", en: "Lesson complete" }, desc: "Hoàn thành đủ 5 bước của một bài", have: lessonsDone, goal: 1 },
    { id: "star3", icon: "star", title: { vi: "Ba sao", en: "Three stars" }, desc: "Đạt 5/5 bài kiểm tra của 3 bài", have: threeStars, goal: 3 },
    { id: "cards50", icon: "cards", title: { vi: "Nhà từ vựng", en: "Word collector" }, desc: "50 lượt ôn thẻ từ", have: s.stats.cardReviews, goal: 50 },
    { id: "speaker", icon: "mic", title: { vi: "Giọng chuẩn", en: "Clear speaker" }, desc: "10 câu nói đạt từ 80 điểm", have: goodSpeak, goal: 10 },
    { id: "goal", icon: "target", title: { vi: "Đạt mục tiêu ngày", en: "Daily goal" }, desc: `Đạt ${DAILY_GOAL} XP trong một ngày`, have: Math.max(0, ...Object.values(s.days), todayXp(s, now)), goal: DAILY_GOAL },
    { id: "xp1000", icon: "zap", title: { vi: "1000 XP", en: "1,000 XP" }, desc: "Đạt tổng 1000 XP", have: s.xp, goal: 1000 },
  ];
  return defs.map((d) => ({ ...d, have: Math.min(d.have, d.goal), earned: d.have >= d.goal }));
}

/** Chuỗi ngày dài nhất từ trước tới nay */
export function longestStreak(days: Record<string, number>): number {
  const toMs = (k: string) => Date.UTC(+k.slice(0, 4), +k.slice(4, 6) - 1, +k.slice(6, 8));
  const list = Object.keys(days).filter((k) => days[k] > 0).map(toMs).sort((a, b) => a - b);
  let best = 0,
    cur = 0;
  list.forEach((ms, i) => {
    cur = i > 0 && ms - list[i - 1] === 86_400_000 ? cur + 1 : 1;
    best = Math.max(best, cur);
  });
  return best;
}

/** Kiểm tra & làm sạch dữ liệu nhập từ tệp sao lưu (tránh tệp hỏng làm hỏng tiến độ) */
export function sanitize(raw: unknown): Progress | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Progress>;
  if (r.v !== 1) return null;
  const base = emptyProgress();
  const obj = (x: unknown) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});
  return {
    ...base,
    name: typeof r.name === "string" ? r.name.slice(0, 40) : "",
    lang: r.lang === "en" || r.lang === "vi" ? r.lang : "both",
    xp: Number.isFinite(r.xp) ? Number(r.xp) : 0,
    days: obj(r.days) as Progress["days"],
    lessons: obj(r.lessons) as Progress["lessons"],
    cards: obj(r.cards) as Progress["cards"],
    mistakes: Array.isArray(r.mistakes) ? r.mistakes.slice(0, 60) : [],
    speak: obj(r.speak) as Progress["speak"],
    stats: { ...base.stats, ...obj(r.stats) },
  };
}
