import { describe, expect, it } from "vitest";
import { lessonBySlug } from "@/lib/content";
import {
  badges,
  completeStep,
  dayKey,
  emptyProgress,
  finishQuiz,
  lessonDone,
  nextStep,
  PRACTICE_GOAL,
  recordAnswer,
  recordSpeak,
  reviewCard,
  sanitize,
  starsOf,
  streak,
  todayXp,
} from "@/lib/progress/logic";
import { dueCards, review } from "@/lib/progress/srs";

const NOW = new Date(2026, 9, 27, 15, 0).getTime();
const DAY = 86_400_000;
const L = lessonBySlug("hinh-binh-hanh")!;
const Q = L.practice[1];

describe("tiến độ", () => {
  it("trả lời đúng cộng XP; dùng nhiều gợi ý được ít XP hơn", () => {
    const a = recordAnswer(emptyProgress(), { lessonId: L.id, q: Q, correct: true, hints: 0, source: "practice" }, NOW);
    expect(a.xp).toBe(10);
    const b = recordAnswer(emptyProgress(), { lessonId: L.id, q: Q, correct: true, hints: 2, source: "practice" }, NOW);
    expect(b.xp).toBe(5);
    expect(todayXp(a, NOW)).toBe(10);
  });

  it("đủ số câu đúng thì xong bước Luyện tập (+20 XP một lần)", () => {
    let s = emptyProgress();
    for (let i = 0; i < PRACTICE_GOAL; i++) s = recordAnswer(s, { lessonId: L.id, q: Q, correct: true, hints: 0, source: "practice" }, NOW);
    expect(s.lessons[L.id].steps["luyen-tap"]).toBe(true);
    expect(s.xp).toBe(PRACTICE_GOAL * 10 + 20);
  });

  it("làm sai thì vào sổ lỗi; ôn đúng 2 lần liên tiếp thì rời sổ", () => {
    let s = recordAnswer(emptyProgress(), { lessonId: L.id, q: Q, correct: false, hints: 0, source: "practice" }, NOW);
    expect(s.mistakes).toHaveLength(1);
    expect(s.stats.mathWrong).toBe(1);
    s = recordAnswer(s, { lessonId: L.id, q: Q, correct: true, hints: 0, source: "review" }, NOW);
    expect(s.mistakes[0].rights).toBe(1);
    s = recordAnswer(s, { lessonId: L.id, q: Q, correct: false, hints: 0, source: "review" }, NOW);
    expect(s.mistakes[0].rights).toBe(0);
    s = recordAnswer(s, { lessonId: L.id, q: Q, correct: true, hints: 0, source: "review" }, NOW);
    s = recordAnswer(s, { lessonId: L.id, q: Q, correct: true, hints: 0, source: "review" }, NOW);
    expect(s.mistakes).toHaveLength(0);
  });

  it("câu kiểm tra nhanh trong phần Hiểu bài không ghi vào sổ lỗi", () => {
    const s = recordAnswer(emptyProgress(), { lessonId: L.id, q: Q, correct: false, hints: 0, source: "check" }, NOW);
    expect(s.mistakes).toHaveLength(0);
  });

  it("sao theo điểm kiểm tra; chỉ thưởng khi có sao mới", () => {
    expect([2, 3, 4, 5].map(starsOf)).toEqual([0, 1, 2, 3]);
    let s = finishQuiz(emptyProgress(), L.id, 4, NOW);
    expect(s.lessons[L.id].quizBest).toBe(4);
    expect(s.lessons[L.id].steps["kiem-tra"]).toBe(true);
    const xp = s.xp;
    s = finishQuiz(s, L.id, 3, NOW);
    expect(s.xp).toBe(xp);
    expect(s.lessons[L.id].quizBest).toBe(4);
  });

  it("bước tiếp theo và tỉ lệ hoàn thành", () => {
    let s = completeStep(emptyProgress(), L.id, "tu-vung", NOW);
    s = completeStep(s, L.id, "tu-vung", NOW);
    expect(s.xp).toBe(20);
    expect(nextStep(s.lessons[L.id])).toBe("hieu-bai");
    expect(lessonDone(s.lessons[L.id])).toBeCloseTo(0.2);
  });

  it("đủ 3 câu nói đạt thì xong bước Nói", () => {
    let s = emptyProgress();
    s = recordSpeak(s, L.id, 0, 90, NOW);
    s = recordSpeak(s, L.id, 1, 60, NOW);
    s = recordSpeak(s, L.id, 2, 75, NOW);
    expect(s.lessons[L.id]?.steps.noi).toBeUndefined();
    s = recordSpeak(s, L.id, 1, 85, NOW);
    expect(s.lessons[L.id].steps.noi).toBe(true);
  });

  it("chuỗi ngày: hôm nay chưa học vẫn giữ chuỗi tới hôm qua", () => {
    const days = { [dayKey(NOW - DAY)]: 10, [dayKey(NOW - 2 * DAY)]: 5, [dayKey(NOW - 4 * DAY)]: 5 };
    expect(streak(days, NOW)).toBe(2);
    expect(streak({ ...days, [dayKey(NOW)]: 3 }, NOW)).toBe(3);
    expect(streak({}, NOW)).toBe(0);
  });

  it("ôn thẻ: nhớ thì giãn lịch, quên thì ôn lại sớm", () => {
    let s = reviewCard(emptyProgress(), "rectangle", "good", NOW);
    expect(s.cards.rectangle.interval).toBe(1);
    expect(dueCards(s.cards, NOW)).toHaveLength(0);
    expect(dueCards(s.cards, NOW + 2 * DAY)).toEqual(["rectangle"]);
    s = reviewCard(s, "rectangle", "again", NOW + 2 * DAY);
    expect(s.cards.rectangle.reps).toBe(0);
    expect(review(undefined, "easy", NOW).interval).toBe(3);
  });

  it("huy hiệu và tệp sao lưu", () => {
    const s = completeStep(emptyProgress(), L.id, "tu-vung", NOW);
    expect(badges(s, NOW).find((b) => b.id === "first")?.earned).toBe(true);
    expect(sanitize(JSON.parse(JSON.stringify(s)))?.xp).toBe(20);
    expect(sanitize({ v: 2 })).toBeNull();
    expect(sanitize("rác")).toBeNull();
  });
});
