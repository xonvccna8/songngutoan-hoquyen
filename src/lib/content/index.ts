// Danh mục bài học đã có nội dung + cách lấy câu hỏi luyện tập / kiểm tra
import { bi, shuffle } from "@/lib/content/helpers";
import { CHIA_DA_THUC } from "@/lib/content/lessons/chia-da-thuc";
import { CONG_TRU_DA_THUC } from "@/lib/content/lessons/cong-tru-da-thuc";
import { DA_THUC } from "@/lib/content/lessons/da-thuc";
import { DINH_LI_THALES } from "@/lib/content/lessons/dinh-li-thales";
import { DON_THUC } from "@/lib/content/lessons/don-thuc";
import { DUONG_TRUNG_BINH } from "@/lib/content/lessons/duong-trung-binh";
import { HINH_BINH_HANH } from "@/lib/content/lessons/hinh-binh-hanh";
import { HINH_CHU_NHAT } from "@/lib/content/lessons/hinh-chu-nhat";
import { HINH_THANG_CAN } from "@/lib/content/lessons/hinh-thang-can";
import { BIEU_DO } from "@/lib/content/lessons/bieu-do";
import { BINH_PHUONG } from "@/lib/content/lessons/binh-phuong";
import { HINH_THOI_HINH_VUONG } from "@/lib/content/lessons/hinh-thoi-hinh-vuong";
import { LAP_PHUONG } from "@/lib/content/lessons/lap-phuong";
import { NHAN_DA_THUC } from "@/lib/content/lessons/nhan-da-thuc";
import { PHAN_GIAC } from "@/lib/content/lessons/phan-giac";
import { PHAN_TICH_DU_LIEU } from "@/lib/content/lessons/phan-tich-du-lieu";
import { PHAN_TICH_NHAN_TU } from "@/lib/content/lessons/phan-tich-nhan-tu";
import { THU_THAP_DU_LIEU } from "@/lib/content/lessons/thu-thap-du-lieu";
import { TONG_HIEU_LAP_PHUONG } from "@/lib/content/lessons/tong-hieu-lap-phuong";
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
  // Chương II. Hằng đẳng thức đáng nhớ và ứng dụng
  BINH_PHUONG,
  LAP_PHUONG,
  TONG_HIEU_LAP_PHUONG,
  PHAN_TICH_NHAN_TU,
  // Chương III. Tứ giác
  TU_GIAC,
  HINH_THANG_CAN,
  HINH_BINH_HANH,
  HINH_CHU_NHAT,
  HINH_THOI_HINH_VUONG,
  // Chương IV. Định lí Thalès
  DINH_LI_THALES,
  DUONG_TRUNG_BINH,
  PHAN_GIAC,
  // Chương V. Dữ liệu và biểu đồ
  THU_THAP_DU_LIEU,
  BIEU_DO,
  PHAN_TICH_DU_LIEU,
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

/** Bảy hằng đẳng thức đáng nhớ (Góc công cụ) — `read`: cách đọc tiếng Anh */
export const IDENTITIES: { no: number; name: Bi; formula: string; read: string }[] = [
  { no: 1, name: bi("Square of a sum", "Bình phương của một tổng"), formula: "(A + B)² = A² + 2AB + B²", read: "A plus B, all squared, equals A squared plus two A B plus B squared" },
  { no: 2, name: bi("Square of a difference", "Bình phương của một hiệu"), formula: "(A − B)² = A² − 2AB + B²", read: "A minus B, all squared, equals A squared minus two A B plus B squared" },
  { no: 3, name: bi("Difference of two squares", "Hiệu hai bình phương"), formula: "A² − B² = (A + B)(A − B)", read: "A squared minus B squared equals A plus B times A minus B" },
  { no: 4, name: bi("Cube of a sum", "Lập phương của một tổng"), formula: "(A + B)³ = A³ + 3A²B + 3AB² + B³", read: "A plus B, all cubed, equals A cubed plus three A squared B plus three A B squared plus B cubed" },
  { no: 5, name: bi("Cube of a difference", "Lập phương của một hiệu"), formula: "(A − B)³ = A³ − 3A²B + 3AB² − B³", read: "A minus B, all cubed, equals A cubed minus three A squared B plus three A B squared minus B cubed" },
  { no: 6, name: bi("Sum of two cubes", "Tổng hai lập phương"), formula: "A³ + B³ = (A + B)(A² − AB + B²)", read: "A cubed plus B cubed equals A plus B times A squared minus A B plus B squared" },
  { no: 7, name: bi("Difference of two cubes", "Hiệu hai lập phương"), formula: "A³ − B³ = (A − B)(A² + AB + B²)", read: "A cubed minus B cubed equals A minus B times A squared plus A B plus B squared" },
];

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
  { sym: "a³", read: bi("a cubed", "a lập phương") },
  { sym: "(a + b)²", read: bi("a plus b, all squared", "bình phương của tổng a cộng b") },
  { sym: "xⁿ", read: bi("x to the power of n", "x mũ n") },
  { sym: "3x²y", read: bi("three x squared y", "ba x bình phương y") },
  { sym: "8 cm²", read: bi("8 square centimetres", "8 xăng-ti-mét vuông") },
  { sym: "⇔", read: bi("if and only if", "khi và chỉ khi") },
  { sym: "⇒", read: bi("implies / so", "suy ra") },
];
