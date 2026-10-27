// Học liệu do GV thêm (lsn_resources): link GeoGebra, video, phiếu học tập, trang web — gắn với bài SGK.
// Chỉ lưu LINK (không tải file lên) để nhẹ và không vướng bản quyền. GV thêm → Chờ duyệt; quản trị duyệt.
// Hàm thuần (máy chủ + trình duyệt), có test trong tests/curriculum.test.ts
import type { Bi } from "@/lib/live/types";
import { curLesson, isCurLessonId } from "@/lib/curriculum";

export type ResourceKind = "geogebra" | "video" | "worksheet" | "web";
export type ResourceStatus = "pending" | "approved" | "draft";

export const RESOURCE_KINDS: Record<ResourceKind, { vi: string; en: string; hint: string }> = {
  geogebra: { vi: "Hình động GeoGebra", en: "GeoGebra applet", hint: "Link geogebra.org/m/… — chiếu được ngay trên trang" },
  video: { vi: "Video", en: "Video", hint: "Link YouTube — xem ngay trên trang (nên có phụ đề Anh/Việt)" },
  worksheet: { vi: "Phiếu học tập", en: "Worksheet", hint: "Link Google Drive / Docs (đặt quyền “Bất kì ai có đường liên kết”)" },
  web: { vi: "Trang web", en: "Web page", hint: "Trang tham khảo khác" },
};

export interface ResourceDoc {
  id: string;
  kind: ResourceKind;
  title: Bi;
  url: string;
  grade: number;
  /** Bài SGK (id khung chương trình) */
  curLessonId: string | null;
  note: string;
  status: ResourceStatus;
  createdBy: string;
  createdByName: string;
  schoolId: string | null;
  createdAt?: { toMillis(): number } | null;
}

export type ResourceInput = Pick<ResourceDoc, "kind" | "title" | "url" | "grade" | "curLessonId" | "note">;

const str = (x: unknown, max: number) => (typeof x === "string" ? x.trim().slice(0, max) : "");

/** Làm sạch dữ liệu GV gửi lên; trả chuỗi lỗi nếu không hợp lệ */
export function sanitizeResource(x: unknown): ResourceInput | string {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  const kind = o.kind as ResourceKind;
  if (!(kind in RESOURCE_KINDS)) return "Loại học liệu không hợp lệ.";
  const t = (o.title && typeof o.title === "object" ? o.title : {}) as Record<string, unknown>;
  const title = { vi: str(t.vi, 160), en: str(t.en, 160) };
  if (!title.vi) return "Cần nhập tên học liệu (tiếng Việt).";
  const url = str(o.url, 500);
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "Đường liên kết không hợp lệ.";
  }
  if (u.protocol !== "https:") return "Chỉ nhận đường liên kết bắt đầu bằng https://";
  if (kind === "geogebra" && !geogebraId(url)) return "Link GeoGebra cần có dạng https://www.geogebra.org/m/…";
  if (kind === "video" && !youtubeId(url)) return "Hiện chỉ nhận video YouTube (youtube.com/watch?v=… hoặc youtu.be/…).";
  const grade = Math.round(Number(o.grade));
  if (!(grade >= 6 && grade <= 9)) return "Khối lớp phải từ 6 đến 9.";
  const curLessonId = isCurLessonId(o.curLessonId) ? o.curLessonId : null;
  if (curLessonId && curLesson(curLessonId)!.grade !== grade) return "Bài SGK không thuộc khối đã chọn.";
  return { kind, title, url: u.toString(), grade, curLessonId, note: str(o.note, 500) };
}

/** Mã hình GeoGebra từ link geogebra.org/m/ID, /classic/ID, /material/show/id/ID */
export function geogebraId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!/(^|\.)geogebra\.org$/.test(u.hostname)) return null;
    const m = u.pathname.match(/^\/(?:m|classic|calculator|geometry|graphing|material\/show\/id|material\/iframe\/id)\/([A-Za-z0-9]{4,20})/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** Mã video YouTube */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
    return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Link nhúng (iframe) — null = chỉ mở trong tab mới */
export function embedUrl(r: Pick<ResourceDoc, "kind" | "url">): string | null {
  if (r.kind === "geogebra") {
    const id = geogebraId(r.url);
    return id ? `https://www.geogebra.org/material/iframe/id/${id}/width/800/height/500/border/888888/rc/false/ai/false/sdz/true/smb/false/stb/false/stbh/false/ld/false/sri/true` : null;
  }
  if (r.kind === "video") {
    const id = youtubeId(r.url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?cc_load_policy=1&rel=0` : null;
  }
  return null;
}
