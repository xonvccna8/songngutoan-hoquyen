// PWA: cài web như ứng dụng trên điện thoại / máy tính
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Toán 8 Song Ngữ — Bilingual Math Grade 8",
    short_name: "Toán 8",
    description: "Tự học Toán lớp 8 song ngữ Việt – Anh",
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
      { name: "Học tiếp", short_name: "Học", url: "/hoc", icons: [{ src: "/icons/192", sizes: "192x192" }] },
      { name: "Ôn tập", short_name: "Ôn tập", url: "/on-tap", icons: [{ src: "/icons/192", sizes: "192x192" }] },
    ],
  };
}
