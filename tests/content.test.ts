import { describe, expect, it } from "vitest";
import { buildQuiz, LESSONS, lessonBySlug, nextPractice, termQuestion } from "@/lib/content";
import { answerText, checkAnswer, parseNum, seeded } from "@/lib/content/helpers";
import type { Question } from "@/lib/content/types";
import { curLesson } from "@/lib/curriculum";

/** Giá trị trả lời đúng của một câu (dạng chuỗi như ô nhập gửi lên) */
const correctValue = (q: Question) => (q.type === "mcq" ? String(q.answer) : q.type === "tf" ? String(q.answer) : q.type === "number" ? String(q.answer).replace(".", ",") : q.accept[0]);

function validate(q: Question) {
  expect(q.id).toBeTruthy();
  expect(q.prompt.en && q.prompt.vi).toBeTruthy();
  expect(q.hints).toHaveLength(3);
  if (q.type === "mcq") {
    expect(q.answer).toBeGreaterThanOrEqual(0);
    expect(q.answer).toBeLessThan(q.options.length);
    expect(new Set(q.options.map((o) => o.en)).size).toBe(q.options.length);
  }
  if (q.type === "number") {
    expect(Number.isFinite(q.answer)).toBe(true);
    expect(q.answer).toBeGreaterThan(0);
  }
  expect(checkAnswer(q, correctValue(q))).toBe(true);
  expect(answerText(q).en).toBeTruthy();
}

describe("nội dung bài học", () => {
  it("mỗi bài khớp với khung chương trình lớp 8 và đủ thành phần", () => {
    for (const l of LESSONS) {
      expect(curLesson(l.id)?.grade).toBe(8);
      expect(l.terms.length).toBeGreaterThanOrEqual(8);
      expect(l.speak.length).toBeGreaterThanOrEqual(3);
      expect([1, 2, 3].every((lv) => l.generators.some((g) => g.level === lv))).toBe(true);
      expect(new Set(l.terms.map((t) => t.id)).size).toBe(l.terms.length);
    }
  });

  it("câu soạn sẵn và câu kiểm tra nhanh trong bài đều chấm đúng", () => {
    for (const l of LESSONS) {
      l.practice.forEach(validate);
      l.sections.flatMap((s) => s.blocks).forEach((b) => b.kind === "check" && validate(b.question));
    }
  });

  it("câu tự sinh luôn hợp lệ (thử 300 lần mỗi bộ sinh)", () => {
    const r = seeded(42);
    for (const l of LESSONS) for (const g of l.generators) for (let i = 0; i < 300; i++) validate(g.make(r));
  });

  it("góc trong câu tự sinh của bài Tứ giác có tổng 360°", () => {
    const r = seeded(7);
    const g = lessonBySlug("tu-giac")!.generators[0];
    for (let i = 0; i < 200; i++) {
      const q = g.make(r);
      const nums = [...q.prompt.en.matchAll(/(\d+)°/g)].map((m) => +m[1]);
      expect(nums.reduce((a, b) => a + b, 0) + (q as { answer: number }).answer).toBe(360);
    }
  });

  it("đủ 5 bài Chương III theo thứ tự SGK, thuật ngữ không trùng mã giữa các bài", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(["k8-10", "k8-11", "k8-12", "k8-13", "k8-14"]);
    const ids = LESSONS.flatMap((l) => l.terms.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("góc kề đáy hình thang cân và góc trong hình thoi luôn hợp lí (0° < góc < 180°)", () => {
    const r = seeded(11);
    for (const slug of ["hinh-thang-can", "hinh-thoi-hinh-vuong"])
      for (const g of lessonBySlug(slug)!.generators)
        for (let i = 0; i < 200; i++) {
          const q = g.make(r);
          if (q.type === "number" && q.unit === "°") {
            expect(q.answer).toBeGreaterThan(0);
            expect(q.answer).toBeLessThan(180);
          }
        }
  });

  it("đề kiểm tra có 5 câu, không trùng", () => {
    for (const l of LESSONS) {
      const quiz = buildQuiz(l, seeded(3));
      expect(quiz).toHaveLength(5);
      quiz.forEach(validate);
    }
  });

  it("luyện tập: dùng hết câu soạn sẵn rồi mới sinh câu mới", () => {
    const l = lessonBySlug("hinh-binh-hanh")!;
    const seen = new Set<string>();
    const first = nextPractice(l, 1, seen);
    expect(l.practice.some((q) => q.id === first.id)).toBe(true);
    l.practice.forEach((q) => seen.add(q.id));
    expect(nextPractice(l, 1, seen).id.startsWith("g-")).toBe(true);
  });

  it("câu thuật ngữ có đúng 1 đáp án", () => {
    const l = lessonBySlug("hinh-chu-nhat")!;
    for (const t of l.terms) {
      const q = termQuestion(l, seeded(1), t);
      validate(q);
      // Phương án không kèm nghĩa tiếng Việt (tránh lộ đáp án)
      if (q.type === "mcq") q.options.forEach((o) => expect(o.vi).toBe(o.en));
    }
  });
});

describe("chấm câu trả lời", () => {
  it("đọc số kiểu Việt Nam", () => {
    expect(parseNum("6,5")).toBe(6.5);
    expect(parseNum("70°")).toBe(70);
    expect(parseNum(" 12 cm ")).toBe(12);
    expect(parseNum("abc")).toBeNull();
  });
  it("gõ thuật ngữ cho phép sai chính tả nhẹ", () => {
    const q = lessonBySlug("hinh-binh-hanh")!.practice[0];
    expect(checkAnswer(q, "Parallelogram")).toBe(true);
    expect(checkAnswer(q, "paralelogram")).toBe(true);
    expect(checkAnswer(q, "rectangle")).toBe(false);
    expect(checkAnswer(q, "")).toBe(false);
  });
});
