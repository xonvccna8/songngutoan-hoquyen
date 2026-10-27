// GĐ 7 — PWA: cài web như ứng dụng (bắt buộc trên iPhone để nhận thông báo khi tắt màn hình)
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Lớp Song Ngữ — Toán song ngữ THCS",
    short_name: "Lớp Song Ngữ",
    description: "Dạy và học Toán song ngữ Việt – Anh cho THCS",
    lang: "vi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#F6F4FF",
    theme_color: "#1C1B3A",
    categories: ["education"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Học sinh vào lớp", short_name: "Vào lớp", url: "/s", icons: [{ src: "/icons/192", sizes: "192x192" }] },
      { name: "Giáo viên", short_name: "Giáo viên", url: "/teacher", icons: [{ src: "/icons/192", sizes: "192x192" }] },
    ],
  };
}
