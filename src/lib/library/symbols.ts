// CÁCH ĐỌC KÍ HIỆU TOÁN bằng tiếng Anh (có nút nghe) — giúp GV và HS đọc đúng khi dạy/học song ngữ.
// "say" = câu máy đọc mẫu; ghi chú "note" chỉ ra chỗ khác nhau giữa cách viết Việt Nam và quốc tế.
export type SymbolTopic = "number" | "algebra" | "set" | "geometry" | "measure" | "stats";

export const SYMBOL_TOPICS: Record<SymbolTopic, { vi: string; en: string }> = {
  number: { vi: "Số và phép tính", en: "Numbers and operations" },
  algebra: { vi: "Đại số", en: "Algebra" },
  set: { vi: "Tập hợp", en: "Sets" },
  geometry: { vi: "Hình học", en: "Geometry" },
  measure: { vi: "Đo lường, đơn vị", en: "Measurement and units" },
  stats: { vi: "Thống kê, xác suất", en: "Statistics and probability" },
};

export interface MathSymbol {
  id: string;
  topic: SymbolTopic;
  /** Cách viết */
  sym: string;
  /** Đọc bằng tiếng Anh (cũng là câu máy đọc) */
  en: string;
  /** Đọc bằng tiếng Việt */
  vi: string;
  /** Lớp học lần đầu */
  grade: number;
  note?: string;
}

type Row = [sym: string, en: string, vi: string, grade: number, note?: string];

const RAW: Record<SymbolTopic, Row[]> = {
  number: [
    ["a + b", "a plus b", "a cộng b", 6],
    ["a − b", "a minus b", "a trừ b", 6],
    ["a × b  (a · b)", "a times b; a multiplied by b", "a nhân b", 6],
    ["a : b", "a divided by b", "a chia b", 6, "Quốc tế thường viết a ÷ b hoặc a/b"],
    ["a = b", "a equals b; a is equal to b", "a bằng b", 6],
    ["a ≠ b", "a is not equal to b", "a khác b", 6],
    ["a < b", "a is less than b", "a nhỏ hơn b", 6],
    ["a > b", "a is greater than b", "a lớn hơn b", 6],
    ["a ≤ b", "a is less than or equal to b", "a nhỏ hơn hoặc bằng b", 6],
    ["a ≥ b", "a is greater than or equal to b", "a lớn hơn hoặc bằng b", 6],
    ["a ≈ b", "a is approximately equal to b", "a xấp xỉ b", 6],
    ["−5", "negative five; minus five", "âm năm", 6],
    ["1/2", "one half", "một phần hai", 6],
    ["3/4", "three quarters; three over four", "ba phần tư", 6],
    ["2/5", "two fifths", "hai phần năm", 6],
    ["0,25", "zero point two five", "không phẩy hai lăm", 6, "Quốc tế dùng dấu chấm: 0.25"],
    ["25%", "twenty-five percent", "hai mươi lăm phần trăm", 6],
    ["2⁵", "two to the power of five; two to the fifth", "hai mũ năm", 6],
    ["|x|", "the absolute value of x", "giá trị tuyệt đối của x", 7],
    ["√9", "the square root of nine", "căn bậc hai của chín", 7],
    ["∛8", "the cube root of eight", "căn bậc ba của tám", 9],
    ["0,(3)", "zero point three recurring", "không phẩy ba, chu kì ba", 7, "Quốc tế viết 0.3 có dấu chấm trên số 3"],
  ],
  algebra: [
    ["x²", "x squared", "x bình phương", 7],
    ["x³", "x cubed", "x lập phương", 7],
    ["xⁿ", "x to the power of n", "x mũ n", 7],
    ["2x + 3", "two x plus three", "hai x cộng ba", 7],
    ["3xy²", "three x y squared", "ba x y bình phương", 8],
    ["(a + b)²", "a plus b, all squared", "bình phương của tổng a cộng b", 8],
    ["a² − b²", "a squared minus b squared", "a bình phương trừ b bình phương", 8],
    ["(a − b)³", "a minus b, all cubed", "lập phương của hiệu a trừ b", 8],
    ["A/B", "A over B", "phân thức A trên B", 8],
    ["x = 2", "x equals two", "x bằng hai", 7],
    ["f(x)", "f of x", "f của x", 8],
    ["y = ax + b", "y equals a x plus b", "y bằng a x cộng b", 8],
    ["a ≠ 0", "a is not equal to zero", "a khác không", 8],
    ["A(2; 3)", "point A with coordinates two and three", "điểm A có toạ độ hai, ba", 8, "Quốc tế viết A(2, 3)"],
    ["x₁, x₂", "x one, x two; x sub one, x sub two", "x một, x hai", 9],
    ["Δ = b² − 4ac", "delta equals b squared minus four a c", "đen-ta bằng b bình phương trừ bốn a c", 9],
  ],
  set: [
    ["{1; 2; 3}", "the set of one, two and three", "tập hợp gồm một, hai, ba", 6, "Quốc tế viết {1, 2, 3}"],
    ["a ∈ A", "a is an element of A; a belongs to A", "a thuộc A", 6],
    ["a ∉ A", "a is not an element of A", "a không thuộc A", 6],
    ["ℕ", "the set of natural numbers", "tập hợp số tự nhiên", 6],
    ["ℤ", "the set of integers", "tập hợp số nguyên", 6],
    ["ℚ", "the set of rational numbers", "tập hợp số hữu tỉ", 7],
    ["ℝ", "the set of real numbers", "tập hợp số thực", 7],
    ["∅", "the empty set", "tập hợp rỗng", 6],
  ],
  geometry: [
    ["AB", "line segment A B", "đoạn thẳng AB", 6],
    ["∠ABC  (ABC^)", "angle A B C", "góc ABC", 6],
    ["60°", "sixty degrees", "sáu mươi độ", 6],
    ["AB ∥ CD", "A B is parallel to C D", "AB song song với CD", 7],
    ["AB ⊥ CD", "A B is perpendicular to C D", "AB vuông góc với CD", 7],
    ["△ABC", "triangle A B C", "tam giác ABC", 7],
    ["△ABC = △DEF", "triangle A B C is congruent to triangle D E F", "tam giác ABC bằng tam giác DEF", 7, "Quốc tế viết △ABC ≅ △DEF"],
    ["△ABC ∽ △DEF", "triangle A B C is similar to triangle D E F", "tam giác ABC đồng dạng với tam giác DEF", 8],
    ["AM/MB = AN/NC", "A M over M B equals A N over N C", "AM trên MB bằng AN trên NC", 8],
    ["(O; R)", "the circle with centre O and radius R", "đường tròn tâm O bán kính R", 9],
    ["sin α", "sine alpha", "sin an-pha", 9],
    ["cos α", "cosine alpha", "cos an-pha", 9],
    ["tan α", "tangent alpha", "tang an-pha", 9],
    ["π", "pi", "pi", 6],
  ],
  measure: [
    ["cm", "centimetre", "xăng-ti-mét", 6],
    ["cm²", "square centimetres", "xăng-ti-mét vuông", 6],
    ["cm³", "cubic centimetres", "xăng-ti-mét khối", 7],
    ["km/h", "kilometres per hour", "ki-lô-mét trên giờ", 6],
    ["S = a · b", "S equals a times b", "diện tích bằng a nhân b", 6],
    ["V = ⅓ · S · h", "V equals one third times S times h", "thể tích bằng một phần ba nhân S nhân h", 8],
  ],
  stats: [
    ["P(A)", "the probability of A", "xác suất của biến cố A", 8],
    ["P(A) = 1/6", "the probability of A is one sixth", "xác suất của A bằng một phần sáu", 8],
    ["n = 30", "the sample size is thirty", "cỡ mẫu bằng ba mươi", 9],
    ["f = 0,2", "the relative frequency is zero point two", "tần số tương đối bằng không phẩy hai", 9],
  ],
};

export const SYMBOLS: MathSymbol[] = (Object.keys(RAW) as SymbolTopic[]).flatMap((topic) =>
  RAW[topic].map(([sym, en, vi, grade, note], i) => ({ id: `${topic}-${i + 1}`, topic, sym, en, vi, grade, ...(note ? { note } : {}) }))
);

/** Câu máy đọc: phần trước dấu ";" (cách đọc chính) */
export const sayOf = (s: MathSymbol) => s.en.split(";")[0].trim();
