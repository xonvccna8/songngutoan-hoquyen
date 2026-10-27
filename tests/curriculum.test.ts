import { describe, expect, it } from "vitest";
import { CHAPTERS, chapterOf, chaptersOf, curLesson, fold, isOutcomeId, outcomesOf, starCounts, starsOf } from "@/lib/curriculum";
import { FRAMES, PHRASES, SYMBOLS, matches, sayOf, searchFrames, searchSymbols } from "@/lib/library";
import { embedUrl, geogebraId, sanitizeResource, youtubeId } from "@/lib/library/resources";
import { sanitizeLesson } from "@/lib/lessons/editor";
import { computeLevel, requirements, type Facts } from "@/lib/progress/levels";
import { masteryByUid } from "@/lib/progress/xp";

describe("khung chương trình KNTT", () => {
  it("đủ số bài mỗi lớp (đối chiếu mục lục SGK)", () => {
    const n = (g: number) => chaptersOf(g).reduce((s, c) => s + c.lessons.length, 0);
    expect([n(6), n(7), n(8), n(9)]).toEqual([43, 37, 39, 32]);
    expect(chaptersOf(8)).toHaveLength(10);
  });
  it("bài đánh số liên tục, id duy nhất", () => {
    for (const g of [6, 7, 8, 9]) {
      const nos = chaptersOf(g).flatMap((c) => c.lessons.map((l) => l.no));
      expect(nos).toEqual(nos.map((_, i) => i + 1));
    }
    const ids = CHAPTERS.flatMap((c) => c.lessons.map((l) => l.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("lớp 8: bài nào cũng có YCCĐ song ngữ", () => {
    chaptersOf(8).forEach((c) => c.lessons.forEach((l) => {
      expect(l.outcomes.length).toBeGreaterThan(0);
      l.outcomes.forEach((o) => expect(o.vi && o.en).toBeTruthy());
    }));
    expect(outcomesOf(8).length).toBeGreaterThan(50);
  });
  it("tra cứu bài, chương, YCCĐ", () => {
    expect(curLesson("k8-15")).toMatchObject({ vi: "Định lí Thalès trong tam giác", grade: 8, chapterId: "k8-c4" });
    expect(chapterOf("k7-16")?.vi).toBe("Tam giác bằng nhau");
    expect(isOutcomeId("k8-15-2")).toBe(true);
    expect(isOutcomeId("k8-15-9")).toBe(false);
    expect(curLesson("k8-99")).toBeUndefined();
  });
  it("tìm không dấu", () => {
    expect(fold("Định lí Thalès")).toBe("dinh li thales");
    expect(matches("dinh li", "Định lí Pythagore")).toBe(true);
  });
});

describe("Sao thành thạo", () => {
  it("cần đủ số câu và tỉ lệ đúng", () => {
    expect(starsOf(undefined)).toBe(0);
    expect(starsOf({ a: 1, c: 1 })).toBe(0); // 1 câu chưa kết luận được
    expect(starsOf({ a: 2, c: 1 })).toBe(1);
    expect(starsOf({ a: 4, c: 3 })).toBe(2);
    expect(starsOf({ a: 6, c: 6 })).toBe(3);
    expect(starsOf({ a: 10, c: 4 })).toBe(0);
  });
  it("đếm số YCCĐ theo Sao", () => expect(starCounts({ x: { a: 6, c: 6 }, y: { a: 2, c: 1 }, z: { a: 1, c: 0 } })).toEqual({ seen: 3, s1: 2, s2: 1, s3: 1 }));
  it("gom câu trả lời trong tiết theo YCCĐ (luyện nói đạt từ 80)", () => {
    const m = masteryByUid(
      [
        { uid: "a", slideId: "s1", qtype: "mcq", correct: true },
        { uid: "a", slideId: "s2", qtype: "speak", score: 85 },
        { uid: "b", slideId: "s1", qtype: "mcq", correct: false },
        { uid: "b", slideId: "s9", qtype: "mcq", correct: true },
      ],
      (sid) => ({ s1: ["k8-1-1"], s2: ["k8-1-1", "k8-1-2"] })[sid]
    );
    expect(m).toEqual({ a: { "k8-1-1": { a: 2, c: 2 }, "k8-1-2": { a: 1, c: 1 } }, b: { "k8-1-1": { a: 1, c: 0 } } });
  });
  it("điều kiện Sao chỉ xét khi em đã gặp YCCĐ, và không đòi quá 80% số đã gặp", () => {
    const f = (o: Partial<Facts>): Facts => ({ termsLearned: 99, termsAvailable: 0, speakGood: 99, bestStreak: 99, ...o });
    expect(requirements(2, f({})).some((r) => r.vi.includes("1⭐"))).toBe(false);
    const r = requirements(2, f({ outcomesSeen: 3, stars1: 1 })).find((x) => x.vi.includes("1⭐"))!;
    expect(r.goal).toBe(3);
    expect(computeLevel(900, f({ outcomesSeen: 3, stars1: 1 }))).toBe(5); // kẹt ở Tập sự III
    expect(computeLevel(900, f({ outcomesSeen: 3, stars1: 3 }))).toBe(6); // Khám phá I
  });
});

describe("thư viện học liệu dựng sẵn", () => {
  it("đủ số lượng, id duy nhất, đủ 2 thứ tiếng", () => {
    expect(FRAMES).toHaveLength(60);
    expect(PHRASES).toHaveLength(150);
    expect(SYMBOLS.length).toBeGreaterThanOrEqual(60);
    for (const list of [FRAMES.map((f) => f.id), PHRASES.map((p) => p.id), SYMBOLS.map((s) => s.id)]) expect(new Set(list).size).toBe(list.length);
    FRAMES.forEach((f) => [f.e1, f.e2, f.e3].forEach((t) => expect(t.en && t.vi).toBeTruthy()));
  });
  it("tìm khung câu và kí hiệu", () => {
    expect(searchFrames("disagree").length).toBeGreaterThan(0);
    expect(searchSymbols("song song")[0].sym).toBe("AB ∥ CD");
    expect(sayOf(SYMBOLS.find((s) => s.sym === "x²")!)).toBe("x squared");
  });
});

describe("học liệu (link)", () => {
  const ok = { kind: "geogebra", title: { vi: "Thalès", en: "" }, url: "https://www.geogebra.org/m/abc123XY", grade: 8, curLessonId: "k8-15", note: "" };
  it("nhận link GeoGebra / YouTube và tạo link nhúng", () => {
    expect(geogebraId("https://www.geogebra.org/m/abc123XY")).toBe("abc123XY");
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe("dQw4w9WgXcQ");
    expect(embedUrl({ kind: "video", url: "https://youtu.be/dQw4w9WgXcQ" })).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(embedUrl({ kind: "worksheet", url: "https://docs.google.com/x" })).toBeNull();
  });
  it("kiểm tra dữ liệu GV nhập", () => {
    expect(typeof sanitizeResource(ok)).toBe("object");
    expect(sanitizeResource({ ...ok, url: "http://www.geogebra.org/m/abc123XY" })).toMatch(/https/);
    expect(sanitizeResource({ ...ok, url: "https://evil.com/m/abc" })).toMatch(/GeoGebra/);
    expect(sanitizeResource({ ...ok, kind: "video", url: "https://vimeo.com/1" })).toMatch(/YouTube/);
    expect(sanitizeResource({ ...ok, curLessonId: "k7-16" })).toMatch(/khối/);
    expect(sanitizeResource({ ...ok, title: { vi: "" } })).toMatch(/tên/);
  });
});

describe("soạn bài gắn khung chương trình", () => {
  const slide = (extra: object) => ({ id: "s1", type: "mcq", title: { en: "Q", vi: "Q" }, blocks: [], question: { type: "mcq", prompt: { en: "?", vi: "?" }, options: [{ en: "a" }, { en: "b" }] }, key: { answer: 0 }, ...extra });
  it("chỉ nhận bài SGK và YCCĐ có thật", () => {
    const r = sanitizeLesson({ meta: { title: { en: "x", vi: "x" }, grade: 8, curLessonId: "k8-15" }, slides: [slide({ outcomeIds: ["k8-15-1", "bogus", "k8-15-1"] })] });
    expect(r.meta.curLessonId).toBe("k8-15");
    expect(r.slides[0].outcomeIds).toEqual(["k8-15-1"]);
    const bad = sanitizeLesson({ meta: { title: { en: "x", vi: "x" }, curLessonId: "k9-99" }, slides: [slide({})] });
    expect(bad.meta.curLessonId).toBeNull();
    expect(bad.slides[0].outcomeIds).toBeUndefined();
  });
});
