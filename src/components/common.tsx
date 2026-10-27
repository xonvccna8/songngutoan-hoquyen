"use client";

// Thành phần dùng chung: màn chờ, viên XP/chuỗi ngày, tiêu đề mục, vòng tiến độ, sao, nút nghe mẫu
import Link from "next/link";
import { ChevronLeft, Flame, Loader2, Star, Turtle, Volume2, Zap } from "lucide-react";
import { cn } from "cn";
import { Tam } from "@/components/brand/tam";
import { say } from "@/lib/speech/speech";

export function Loader({ label = "Đang tải…" }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <Tam mood="calm" className="size-16" />
      <p className="flex items-center gap-2 text-sm font-semibold text-ink-2">
        <Loader2 className="size-4 animate-spin" /> {label}
      </p>
    </div>
  );
}

export function StreakPill({ days }: { days: number }) {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-line bg-white px-3 font-display text-sm font-extrabold text-[#C2410C]" title={`${days} ngày liên tiếp`}>
      <Flame className="size-4 fill-[#FF922B] text-[#E8590C]" /> {days}
      <span className="sr-only">ngày liên tiếp</span>
    </span>
  );
}

export function XpPill({ xp }: { xp: number }) {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-line bg-white px-3 font-display text-sm font-extrabold text-blue-dk" title="Điểm kinh nghiệm (XP)">
      <Zap className="size-4 fill-blue text-blue" /> {xp.toLocaleString("vi-VN")}
      <span className="sr-only">điểm XP</span>
    </span>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-xl font-extrabold">{children}</h2>
      {action}
    </div>
  );
}

/** Nút quay lại (đầu trang con) */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-10 items-center gap-1 rounded-xl pr-3 text-sm font-bold text-ink-2 hover:text-ink">
      <ChevronLeft className="size-5" /> {children}
    </Link>
  );
}

/** Vòng tiến độ (0–1) */
export function Ring({ value, size = 64, stroke = 8, color = "var(--color-teal)", children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, value)))} className="transition-[stroke-dashoffset] duration-500" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${n}/3 sao`}>
      {[0, 1, 2].map((i) => (
        <Star key={i} className={cn("size-4", i < n ? "fill-sun text-sun-dk" : "text-line-2")} />
      ))}
    </span>
  );
}

/** Nghe mẫu tiếng Anh: thường và chậm */
export function SayButtons({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 gap-1", className)}>
      <button type="button" onClick={() => say(text, 0.9)} className="grid size-10 place-items-center rounded-xl bg-blue-soft text-blue-dk hover:bg-blue/20" aria-label={`Nghe: ${text}`} title="Nghe">
        <Volume2 className="size-5" />
      </button>
      <button type="button" onClick={() => say(text, 0.55)} className="grid size-10 place-items-center rounded-xl bg-paper text-ink-2 hover:bg-line" aria-label={`Nghe chậm: ${text}`} title="Nghe chậm">
        <Turtle className="size-5" />
      </button>
    </span>
  );
}
