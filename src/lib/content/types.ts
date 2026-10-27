// Mô hình nội dung bài học tự học (dữ liệu tĩnh trong mã nguồn — không cần máy chủ)
import type { Bi } from "@/lib/curriculum/types";

export type { Bi };

/** Thuật ngữ: tiếng Anh, phiên âm IPA, nghĩa tiếng Việt, câu ví dụ */
export interface Term {
  id: string;
  en: string;
  ipa: string;
  vi: string;
  example?: Bi;
}

/** Hình vẽ hình học: toạ độ trong khung 0..300 × 0..200 (trục y hướng xuống như SVG) */
export interface FigureSpec {
  points: Record<string, [number, number]>;
  /** Đa giác chính, theo thứ tự đỉnh */
  polygon: string[];
  /** Đoạn thẳng thêm (đường chéo, trung tuyến…) */
  segments?: [string, string][];
  /** Nhãn ghi giữa cạnh, ví dụ ["A","B","7 cm"] */
  sideLabels?: [string, string, string][];
  /** Nhãn góc ghi gần đỉnh, ví dụ ["A","70°"] */
  angleLabels?: [string, string][];
  /** Đỉnh có góc vuông (vẽ ô vuông nhỏ) */
  rightAngles?: string[];
  /** Kí hiệu cạnh bằng nhau: [đầu, cuối, số vạch] */
  ticks?: [string, string, number][];
  /** Điểm chỉ vẽ chấm + tên, không thuộc đa giác (ví dụ giao điểm O) */
  dots?: string[];
}

export interface QBase {
  id: string;
  /** 1 Nhận biết · 2 Thông hiểu · 3 Vận dụng */
  level: 1 | 2 | 3;
  /** Lỗi Toán hay lỗi Ngôn ngữ (để sổ lỗi sai phân loại) */
  skill: "math" | "lang";
  prompt: Bi;
  figure?: FigureSpec;
  /** Gợi ý 3 tầng: từ vựng → cách làm → lời giải */
  hints: [Bi, Bi, Bi];
  /** Giải thích hiện sau khi trả lời */
  explain: Bi;
}

/** Các kiểu câu hỏi tự chấm */
export type Question =
  | (QBase & { type: "mcq"; options: Bi[]; answer: number })
  | (QBase & { type: "tf"; answer: boolean })
  | (QBase & { type: "number"; answer: number; unit?: string })
  | (QBase & { type: "term"; accept: string[] })
  /** Gõ biểu thức đại số; chấm theo giá trị (lib/algebra/poly.ts) và theo dạng yêu cầu */
  | (QBase & { type: "expr"; answer: string; form?: ExprForm });

/** any: chỉ cần bằng nhau · expanded: đã phá ngoặc · simplified: thu gọn · factored: dạng tích, phân tích triệt để */
export type ExprForm = "any" | "expanded" | "simplified" | "factored";

/** Khối nội dung trong phần "Hiểu bài" */
export type Block =
  | { kind: "text"; text: Bi }
  | { kind: "key"; tag: Bi; text: Bi; tone?: "blue" | "teal" | "sun" | "coral" }
  | { kind: "list"; tag?: Bi; items: Bi[] }
  | { kind: "figure"; figure: FigureSpec; caption?: Bi }
  | { kind: "play"; mode: PlayMode }
  | { kind: "example"; problem: Bi; figure?: FigureSpec; steps: Bi[] }
  | { kind: "check"; question: Question };

export type PlayMode = "quad" | "trap" | "para" | "rect" | "rhomb";

export interface Section {
  id: string;
  title: Bi;
  blocks: Block[];
}

/** Câu luyện nói: đọc to câu tiếng Anh */
export interface SpeakItem {
  en: string;
  vi: string;
}

/** Bộ sinh câu hỏi ngẫu nhiên (luyện tập không giới hạn) */
export type Generator = (rand: () => number) => Question;

export interface LessonContent {
  /** Trùng id bài trong khung chương trình, ví dụ "k8-12" */
  id: string;
  /** Đường dẫn đẹp, ví dụ "hinh-binh-hanh" */
  slug: string;
  title: Bi;
  intro: Bi;
  goals: Bi[];
  terms: Term[];
  sections: Section[];
  practice: Question[];
  generators: { level: 1 | 2 | 3; make: Generator }[];
  speak: SpeakItem[];
  /** Tóm tắt tính chất / công thức (Góc công cụ) */
  summary: Bi[];
}
