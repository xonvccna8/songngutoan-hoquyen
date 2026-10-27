// Khung chương trình Toán THCS (CT GDPT 2018) theo bộ sách Kết nối tri thức — xem docs/KE-HOACH-TRANG-GIAO-VIEN.md
/** Văn bản song ngữ */
export interface Bi {
  en: string;
  vi: string;
}

/** 3 mạch nội dung CT 2018 */
export type Strand = "sd" | "hh" | "tk";

export const STRANDS: Record<Strand, Bi & { color: string }> = {
  sd: { vi: "Số và Đại số", en: "Numbers and Algebra", color: "#2F5BEA" },
  hh: { vi: "Hình học và Đo lường", en: "Geometry and Measurement", color: "#0E9F8A" },
  tk: { vi: "Thống kê và Xác suất", en: "Statistics and Probability", color: "#E8492E" },
};

/** Yêu cầu cần đạt (YCCĐ) — id dạng "k8-15-1" */
export interface Outcome extends Bi {
  id: string;
}

/** Bài trong SGK — id dạng "k8-15" (k = Kết nối tri thức, lớp 8, bài 15) */
export interface CurLesson extends Bi {
  id: string;
  no: number;
  grade: number;
  chapterId: string;
  outcomes: Outcome[];
}

export interface Chapter extends Bi {
  id: string;
  no: number;
  grade: number;
  strand: Strand;
  lessons: CurLesson[];
}
