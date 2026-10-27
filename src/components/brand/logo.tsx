import Link from "next/link";
import { cn } from "cn";

/** Biểu trưng: 4 hình học xếp thành ô vuông + chữ "Lớp Song Ngữ" */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <rect width="40" height="40" rx="12" fill="#1C1B3A" />
      <path d="M12 7.5 L17.5 17 H6.5 Z" fill="#E8492E" stroke="#E8492E" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M28 6.5 L33 12 L28 17.5 L23 12 Z" fill="#2F5BEA" />
      <circle cx="12" cy="28" r="5.2" fill="#FFC93C" />
      <rect x="23" y="23" width="10" height="10" rx="2" fill="#0E9F8A" />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  tone = "dark",
  sub = true,
}: {
  className?: string;
  href?: string;
  tone?: "dark" | "light";
  sub?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-extrabold", tone === "light" ? "text-white" : "text-ink")}>
          Lớp Song Ngữ
        </span>
        {sub && (
          <span className={cn("mt-0.5 text-[11px] font-semibold tracking-wide", tone === "light" ? "text-white/60" : "text-ink-2")}>
            Bilingual Math · THCS
          </span>
        )}
      </span>
    </Link>
  );
}
