// Tiện ích soạn nội dung: văn bản song ngữ, số ngẫu nhiên, hình mẫu, chấm câu trả lời
import { equal, factorCount, isExpanded, isFactored, isSimplified, parse, ParseError, polyOf, toPoly, type Node } from "@/lib/algebra/poly";
import type { Bi, FigureSpec, Question } from "@/lib/content/types";
import { norm, similarity } from "@/lib/speech/grading";

export const bi = (en: string, vi: string): Bi => ({ en, vi });

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32) — cùng hạt giống thì cùng đề */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Số nguyên ngẫu nhiên trong [lo, hi], bước `step` */
export const int = (r: () => number, lo: number, hi: number, step = 1) => lo + step * Math.floor(r() * (Math.floor((hi - lo) / step) + 1));

/** Hiển thị số kiểu Việt Nam: 7.5 → "7,5" */
export const vn = (n: number) => String(+n.toFixed(2)).replace(".", ",");

// ===== Hình mẫu (khung 300 × 200) =====
export const QUAD: FigureSpec["points"] = { A: [62, 42], B: [228, 28], C: [262, 168], D: [38, 158] };
export const PARA: FigureSpec["points"] = { A: [80, 40], B: [250, 40], C: [220, 165], D: [50, 165], O: [150, 102.5] };
/** Hình thang cân ABCD: đáy nhỏ AB ở trên, đáy lớn CD ở dưới */
export const TRAP: FigureSpec["points"] = { A: [100, 40], B: [200, 40], C: [262, 165], D: [38, 165], O: [150, 78.6] };
/** Hình thang vuông ABCD (vuông tại A và D) */
export const RIGHT_TRAP: FigureSpec["points"] = { A: [60, 40], B: [180, 40], C: [255, 165], D: [60, 165] };
/** Hình thoi ABCD: AC dọc, BD ngang, O là giao điểm */
export const RHOMB: FigureSpec["points"] = { A: [150, 15], B: [265, 100], C: [150, 185], D: [35, 100], O: [150, 100] };
export const SQUARE: FigureSpec["points"] = { A: [90, 40], B: [210, 40], C: [210, 160], D: [90, 160], O: [150, 100] };
export const RECT: FigureSpec["points"] = { A: [60, 40], B: [240, 40], C: [240, 160], D: [60, 160], O: [150, 100] };
/** Tam giác ABC cho Thalès: D ∈ AB, E ∈ AC với AD/AB = AE/AC = 0,4; M, N là trung điểm AB, AC */
export const THALES: FigureSpec["points"] = { A: [150, 18], B: [30, 182], C: [275, 182], D: [102, 83.6], E: [200, 83.6], M: [90, 100], N: [212.5, 100] };
/** Tam giác ABC có phân giác AD (D ∈ BC, DB/DC = AB/AC) */
export const BISECT: FigureSpec["points"] = { A: [110, 25], B: [30, 180], C: [280, 180], D: [138, 180] };
/** Tam giác ABC vuông tại A, M là trung điểm cạnh huyền BC */
export const RIGHT_TRI: FigureSpec["points"] = { A: [60, 165], B: [60, 35], C: [250, 165], M: [155, 100] };

export const ABCD = ["A", "B", "C", "D"];

/** Đọc số học sinh gõ: chấp nhận "7,5", "7.5 cm", "70°", "−6" */
export function parseNum(v: string): number | null {
  const m = v.replace(/\s/g, "").replace(/[−–]/g, "-").replace(",", ".").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

const unreadable = (e: unknown) => bi("The expression could not be read.", e instanceof ParseError ? e.message : "Biểu thức chưa đọc được.");

/** Chấm câu gõ biểu thức: đúng giá trị VÀ đúng dạng yêu cầu; sai dạng thì kèm lời nhắc */
export function checkExpr(q: Extract<Question, { type: "expr" }>, value: string): { ok: boolean; note?: Bi } {
  let node: Node;
  let same: boolean;
  try {
    node = parse(value);
    same = equal(toPoly(node), polyOf(q.answer));
  } catch (e) {
    return { ok: false, note: unreadable(e) };
  }
  if (!same) return { ok: false };
  const form = q.form ?? "any";
  if (form === "expanded" && !isExpanded(node)) return { ok: false, note: bi("Right value, but expand (remove) the brackets.", "Đúng giá trị nhưng em cần nhân phá ngoặc.") };
  if (form === "simplified" && !isSimplified(node)) return { ok: false, note: bi("Right value, but collect the like terms.", "Đúng giá trị nhưng em cần thu gọn (gộp các hạng tử đồng dạng).") };
  if (form === "factored") {
    if (!isFactored(node)) return { ok: false, note: bi("Right value, but write it as a product.", "Đúng giá trị nhưng em cần viết thành dạng tích.") };
    if (factorCount(node) < factorCount(parse(q.answer))) return { ok: false, note: bi("A product, but you can factorise further.", "Đã là tích nhưng còn phân tích tiếp được.") };
  }
  return { ok: true };
}

/** Chấm câu trả lời (value: số thứ tự phương án / "true"|"false" / chữ gõ / biểu thức) */
export function checkAnswer(q: Question, value: string): boolean {
  switch (q.type) {
    case "expr":
      return checkExpr(q, value).ok;
    case "mcq":
      return Number(value) === q.answer;
    case "tf":
      return value === String(q.answer);
    case "number": {
      const n = parseNum(value);
      return n != null && Math.abs(n - q.answer) < 1e-6;
    }
    case "term": {
      const v = norm(value);
      return v.length > 0 && q.accept.some((a) => {
        const b = norm(a);
        return v === b || similarity(v, b) >= 0.85;
      });
    }
  }
}

/** Đáp án đúng để hiển thị */
export function answerText(q: Question): Bi {
  switch (q.type) {
    case "mcq":
      return q.options[q.answer];
    case "tf":
      return q.answer ? bi("True", "Đúng") : bi("False", "Sai");
    case "number": {
      const t = `${vn(q.answer)}${q.unit ?? ""}`;
      return bi(t, t);
    }
    case "term":
      return bi(q.accept[0], q.accept[0]);
    case "expr":
      return bi(q.answer, q.answer);
  }
}

/** Xáo trộn (không đổi mảng gốc) */
export function shuffle<T>(arr: T[], r: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
