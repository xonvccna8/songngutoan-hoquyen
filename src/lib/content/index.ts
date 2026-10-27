// Danh mục bài học đã có nội dung + cách lấy câu hỏi luyện tập / kiểm tra
import { bi, shuffle } from "@/lib/content/helpers";
import { CHIA_DA_THUC } from "@/lib/content/lessons/chia-da-thuc";
import { CONG_TRU_DA_THUC } from "@/lib/content/lessons/cong-tru-da-thuc";
import { DA_THUC } from "@/lib/content/lessons/da-thuc";
import { DON_THUC } from "@/lib/content/lessons/don-thuc";
import { HINH_BINH_HANH } from "@/lib/content/lessons/hinh-binh-hanh";
import { HINH_CHU_NHAT } from "@/lib/content/lessons/hinh-chu-nhat";
import { HINH_THANG_CAN } from "@/lib/content/lessons/hinh-thang-can";
import { HINH_THOI_HINH_VUONG } from "@/lib/content/lessons/hinh-thoi-hinh-vuong";
import { NHAN_DA_THUC } from "@/lib/content/lessons/nhan-da-thuc";
import { TU_GIAC } from "@/lib/content/lessons/tu-giac";
import type { Bi, LessonContent, Question, Term } from "@/lib/content/types";

export * from "@/lib/content/types";

/** Thứ tự học gợi ý. Thêm bài mới: tạo file trong lessons/ rồi thêm vào đây. */
export const LESSONS: LessonContent[] = [
  // Chương I. Đa thức
  DON_THUC,
  DA_THUC,
  CONG_TRU_DA_THUC,
  NHAN_DA_THUC,
  CHIA_DA_THUC,
  // Chương III. Tứ giác
  TU_GIAC,
  HINH_THANG_CAN,
  HINH_BINH_HANH,
  HINH_CHU_NHAT,
  HINH_THOI_HINH_VUONG,
];

export const lessonBySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);

/** Mọi thuật ngữ (kèm bài chứa nó) — cho thẻ từ, từ điển */
export const ALL_TERMS: (Term & { lessonId: string })[] = LESSONS.flatMap((l) => l.terms.map((t) => ({ ...t, lessonId: l.id })));
export const termById = (id: string) => ALL_TERMS.find((t) => t.id === id);

/**
 * Câu luyện tập tiếp theo ở một mức: ưu tiên câu soạn sẵn chưa làm, hết thì sinh câu mới.
 * `seen` = id các câu đã làm trong lượt này (để không lặp lại).
 */
export function nextPractice(l: LessonContent, level: 1 | 2 | 3, seen: Set<string>, rand: () => number = Math.random): Question {
  const fresh = l.practice.filter((q) => q.level === level && !seen.has(q.id));
  if (fresh.length) return fresh[0];
  const gens = l.generators.filter((g) => g.level === level);
  const pool = gens.length ? gens : l.generators;
  // Thử vài lần để tránh trùng câu vừa làm
  let q = pool[Math.floor(rand() * pool.length)].make(rand);
  for (let i = 0; i < 6 && seen.has(q.id); i++) q = pool[Math.floor(rand() * pool.length)].make(rand);
  return q;
}

/** Đề kiểm tra 5 câu: 1 câu từ vựng, 1 câu mức 1, 2 câu mức 2, 1 câu mức 3 */
export function buildQuiz(l: LessonContent, rand: () => number = Math.random): Question[] {
  const seen = new Set<string>();
  const take = (level: 1 | 2 | 3) => {
    const gens = l.generators.filter((g) => g.level === level);
    let q = gens[Math.floor(rand() * gens.length)].make(rand);
    for (let i = 0; i < 8 && seen.has(q.id); i++) q = gens[Math.floor(rand() * gens.length)].make(rand);
    seen.add(q.id);
    return q;
  };
  return [termQuestion(l, rand), take(1), take(2), take(2), take(3)];
}

/** Câu hỏi từ vựng: nghe/đọc nghĩa tiếng Việt → chọn thuật ngữ tiếng Anh */
export function termQuestion(l: LessonContent, rand: () => number = Math.random, term?: Term): Question {
  const t = term ?? l.terms[Math.floor(rand() * l.terms.length)];
  const others = shuffle(l.terms.filter((x) => x.id !== t.id), rand).slice(0, 3);
  const opts = shuffle([t, ...others], rand);
  return {
    id: `t-${t.id}`,
    type: "mcq",
    level: 1,
    skill: "lang",
    answer: opts.indexOf(t),
    // Phương án chỉ ghi tiếng Anh (nếu kèm nghĩa tiếng Việt thì lộ đáp án)
    options: opts.map((o) => bi(o.en, o.en)),
    prompt: bi(`Which term means “${t.vi}”?`, `Thuật ngữ nào nghĩa là “${t.vi}”?`),
    hints: [
      bi(t.example?.en ?? "Look at the word list.", t.example?.vi ?? "Xem lại bảng từ vựng."),
      bi(`It starts with “${t.en.slice(0, 2)}…”.`, `Từ bắt đầu bằng “${t.en.slice(0, 2)}…”.`),
      bi(`${t.en} ${t.ipa}`, `${t.en} ${t.ipa}`),
    ],
    explain: bi(`${t.en} ${t.ipa} = ${t.vi}`, `${t.en} ${t.ipa} = ${t.vi}`),
  };
}

/** Cách đọc kí hiệu Toán bằng tiếng Anh (Góc công cụ) */
export const SYMBOLS: { sym: string; read: Bi }[] = [
  { sym: "ABCD", read: bi("quadrilateral A B C D", "tứ giác ABCD") },
  { sym: "AB ∥ CD", read: bi("A B is parallel to C D", "AB song song với CD") },
  { sym: "AB ⊥ AD", read: bi("A B is perpendicular to A D", "AB vuông góc với AD") },
  { sym: "AC ⊥ BD", read: bi("A C is perpendicular to B D", "AC vuông góc với BD") },
  { sym: "AB = BC = CD = DA", read: bi("all four sides are equal", "bốn cạnh bằng nhau") },
  { sym: "AB = CD", read: bi("A B equals C D", "AB bằng CD") },
  { sym: "∠A = 90°", read: bi("angle A equals 90 degrees", "góc A bằng 90 độ") },
  { sym: "∠A + ∠B = 180°", read: bi("angle A plus angle B equals 180 degrees", "góc A cộng góc B bằng 180 độ") },
  { sym: "ΔABC", read: bi("triangle A B C", "tam giác ABC") },
  { sym: "O ∈ AC", read: bi("O lies on A C", "O thuộc AC") },
  { sym: "AM = BC : 2", read: bi("A M equals B C divided by 2 (half of B C)", "AM bằng BC chia 2 (nửa BC)") },
  { sym: "S = a × b", read: bi("S equals a times b", "S bằng a nhân b") },
  { sym: "S = AC × BD : 2", read: bi("S equals A C times B D divided by 2", "S bằng AC nhân BD chia 2") },
  { sym: "a²", read: bi("a squared", "a bình phương") },
  { sym: "8 cm²", read: bi("8 square centimetres", "8 xăng-ti-mét vuông") },
  { sym: "⇔", read: bi("if and only if", "khi và chỉ khi") },
  { sym: "⇒", read: bi("implies / so", "suy ra") },
];
