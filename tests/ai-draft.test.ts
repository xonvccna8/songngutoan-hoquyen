import { describe, expect, it } from "vitest";
import { AI_DRAFT_SCHEMA, draftToLesson, type AiDraft, type AiSlide } from "@/lib/lessons/ai-draft";
import { kindOf, problemsOf } from "@/lib/lessons/editor";

const B = (en: string, vi: string) => ({ en, vi });
const E = B("", "");
const slide = (p: Partial<AiSlide>): AiSlide => ({
  activity: 2,
  kind: "content",
  title: B("Title", "Tiêu đề"),
  points: [],
  prompt: E,
  options: [],
  answer_index: 0,
  answer_number: null,
  unit: "",
  accept: [],
  targets: [],
  speak_target: "",
  explain: E,
  notes: [],
  skill: "Toán",
  ...p,
});

const DRAFT: AiDraft = {
  title: B("Isosceles triangles", "Tam giác cân"),
  subtitle: "Toán 7",
  equipment: "Tivi",
  objectives: { content: B("a", "b"), communication: B("c", "d"), cognition: B("e", "f"), culture: B("g", "h") },
  activities: [
    { goal: "g1", product: "p1" },
    { goal: "g2", product: "p2" },
  ],
  terms: [
    { en: "base", ipa: "/beɪs/", vi: "cạnh đáy", slide: 1 },
    { en: "Base", ipa: "", vi: "trùng", slide: 0 },
  ],
  slides: [
    slide({ activity: 4, kind: "final", title: B("Summary", "Tổng kết"), points: [B("Two equal sides", "Hai cạnh bằng nhau")] }),
    slide({ activity: 2, kind: "content", points: [B("A", "a"), B("B", "b")], notes: [B("Look at the board.", "Nhìn lên bảng.")] }),
    slide({ activity: 1, kind: "tf", prompt: B("Is it true?", "Đúng không?"), answer_index: 1 }),
    slide({ activity: 3, kind: "mcq", prompt: B("Pick", "Chọn"), options: [B("x", "x")], answer_index: 7 }),
    slide({ activity: 3, kind: "number", prompt: B("Angle?", "Góc?"), answer_number: 65, unit: "°" }),
    slide({ activity: 3, kind: "label", prompt: B("Label", "Gắn nhãn"), options: [B("legs", "cạnh bên"), B("base", "cạnh đáy")], targets: [{ en: "AB, AC", vi: "AB, AC", label_index: 0 }, { en: "BC", vi: "BC", label_index: 5 }] }),
    slide({ activity: 2, kind: "speak", speak_target: "An isosceles triangle has two equal sides." }),
    slide({ activity: 3, kind: "text", prompt: B("Write", "Viết"), accept: [" BC is the base. ", ""], skill: "Ngôn ngữ" }),
  ],
};

describe("khuôn JSON cho AI (strict)", () => {
  it("mọi object: đủ required, không thêm trường", () => {
    const walk = (s: Record<string, unknown>) => {
      if (s.type === "object") {
        expect(s.additionalProperties).toBe(false);
        expect(new Set(s.required as string[])).toEqual(new Set(Object.keys(s.properties as object)));
        Object.values(s.properties as object).forEach((x) => walk(x as Record<string, unknown>));
      }
      if (s.type === "array") walk(s.items as Record<string, unknown>);
    };
    walk(AI_DRAFT_SCHEMA as unknown as Record<string, unknown>);
  });
});

describe("kết quả AI → tiết nháp", () => {
  const { meta, slides } = draftToLesson(DRAFT, 7);

  it("sắp theo hoạt động 1 → 4, trang tổng kết ở cuối", () => {
    expect(slides.map((s) => s.activity)).toEqual([1, 2, 2, 3, 3, 3, 3, 4]);
    expect(slides.at(-1)!.type).toBe("final");
  });
  it("đúng/sai lưu như trắc nghiệm True/False", () => {
    expect(kindOf(slides[0])).toBe("tf");
    expect(slides[0].key.answer).toBe(1);
  });
  it("trang nội dung: mỗi ý một bước, giữ ghi chú GV", () => {
    expect(slides[1].blocks).toEqual([
      { kind: "text", step: 0, text: B("A", "a") },
      { kind: "text", step: 1, text: B("B", "b") },
    ]);
    expect(slides[1].key.notes).toEqual([B("Look at the board.", "Nhìn lên bảng.")]);
  });
  it("trắc nghiệm thiếu phương án → thêm ô trống, đáp án trong phạm vi", () => {
    const mcq = slides.find((s) => s.type === "mcq" && kindOf(s) === "mcq")!;
    expect(mcq.question!.options).toHaveLength(2);
    expect(mcq.key.answer).toBe(1);
  });
  it("nhập số giữ đáp số + đơn vị", () => {
    const n = slides.find((s) => s.type === "number")!;
    expect(n.key.answer).toBe(65);
    expect(n.question!.unit).toBe("°");
  });
  it("kéo nhãn: chỉ số sai → -1 (GV phải chọn lại)", () => expect(slides.find((s) => s.type === "label")!.key.order).toEqual([0, -1]));
  it("gõ chữ: bỏ câu trống", () => expect(slides.find((s) => s.type === "text")!.key.accept).toEqual(["BC is the base."]));
  it("thuật ngữ: bỏ trùng, trỏ đúng trang sau khi sắp", () => expect(meta.terms).toEqual([{ en: "base", ipa: "/beɪs/", vi: "cạnh đáy", at: 1 }]));
  it("đủ 4 hoạt động trong giáo án", () => {
    expect(meta.activities).toHaveLength(4);
    expect(meta.activities[0]).toEqual({ goal: "g1", product: "p1" });
    expect(meta.grade).toBe(7);
  });
  it("bộ kiểm tra chỉ ra chỗ AI làm thiếu", () => {
    const msgs = problemsOf(meta, slides).map((p) => p.msg);
    expect(msgs).toContain("Có phương án còn trống.");
    expect(msgs).toContain("Chưa chọn nhãn đúng cho mọi ô.");
  });
  it("AI không trả trang nào → báo lỗi dễ hiểu", () => expect(() => draftToLesson({ ...DRAFT, slides: [] }, 7)).toThrow(/chưa đề xuất/));
});
