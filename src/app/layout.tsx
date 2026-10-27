import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, Lexend } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SwRegister } from "@/components/pwa/sw-register";
import { AuthProvider } from "@/lib/auth/auth-context";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Lớp Song Ngữ", template: "%s · Lớp Song Ngữ" },
  description: "Dạy và học Toán song ngữ Việt – Anh cho THCS",
  applicationName: "Lớp Song Ngữ",
  // iPhone: "Thêm vào màn hình chính" → mở như ứng dụng, nhận được thông báo đẩy
  appleWebApp: { capable: true, title: "Lớp Song Ngữ", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/apple", icon: [{ url: "/icons/192", sizes: "192x192", type: "image/png" }] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#1C1B3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${bricolage.variable} ${beVietnam.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
        <SwRegister />
      </body>
    </html>
  );
}
