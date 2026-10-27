"use client";

// Khung ứng dụng: đầu trang (logo, chuỗi ngày, XP, chọn ngôn ngữ) + thanh điều hướng
// (điện thoại: thanh dưới cùng · máy tính: menu trên đầu trang)
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, Home, Map, Repeat2, UserRound } from "lucide-react";
import { cn } from "cn";
import { Logo } from "@/components/brand/logo";
import { StreakPill, XpPill } from "@/components/common";
import { LangSwitch } from "@/components/lang";
import { streak } from "@/lib/progress/logic";
import { useNow, useProgress } from "@/lib/progress/store";

const NAV = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/hoc", label: "Học", icon: Map },
  { href: "/on-tap", label: "Ôn tập", icon: Repeat2 },
  { href: "/cong-cu", label: "Công cụ", icon: BookOpenCheck },
  { href: "/cua-em", label: "Của em", icon: UserRound },
];

const active = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const p = useProgress();
  const now = useNow();
  const days = now ? streak(p.days, now) : 0;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b-2 border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Logo sub={false} className="[&_span]:max-sm:hidden" />
          <nav className="ml-4 hidden gap-1 md:flex" aria-label="Điều hướng chính">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={cn("rounded-xl px-3 py-2 text-sm font-bold", active(path, n.href) ? "bg-ink text-white" : "text-ink-2 hover:bg-ink/5 hover:text-ink")}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <StreakPill days={days} />
            <XpPill xp={p.xp} />
            <LangSwitch className="max-[380px]:hidden" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-28 md:pb-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Điều hướng chính">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((n) => {
            const on = active(path, n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold", on ? "text-blue-dk" : "text-ink-2")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", on && "bg-blue-soft")}>
                  <n.icon className="size-5" />
                </span>
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
