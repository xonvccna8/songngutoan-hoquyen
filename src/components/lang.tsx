"use client";

// Hiển thị song ngữ theo chế độ em chọn: Song ngữ / English / Tiếng Việt.
// Song ngữ: tiếng Anh chữ thẳng màu nhấn, tiếng Việt xám nghiêng (docs/GIAO-DIEN.md).
import { cn } from "cn";
import type { Bi } from "@/lib/curriculum/types";
import type { LangMode } from "@/lib/progress/logic";
import { update, useProgress } from "@/lib/progress/store";

export const useLang = () => useProgress().lang;

export function T({ v, className, block, strong }: { v: Bi; className?: string; block?: boolean; strong?: boolean }) {
  const lang = useLang();
  const Tag = block ? "div" : "span";
  if (lang === "en") return <Tag className={cn(strong && "font-semibold", className)} title={v.vi} lang="en">{v.en}</Tag>;
  if (lang === "vi") return <Tag className={cn(strong && "font-semibold", className)}>{v.vi}</Tag>;
  if (v.en === v.vi) return <Tag className={cn(strong && "font-semibold", className)}>{v.en}</Tag>;
  return (
    <Tag className={cn(block ? "flex flex-col gap-0.5" : "inline-flex flex-col", className)}>
      <span className={cn("text-en", strong && "font-semibold")} lang="en">{v.en}</span>
      <span className="text-vi text-[0.9em]">{v.vi}</span>
    </Tag>
  );
}

const MODES: { id: LangMode; label: string; full: string }[] = [
  { id: "both", label: "EN·VI", full: "Song ngữ" },
  { id: "en", label: "EN", full: "Chỉ tiếng Anh" },
  { id: "vi", label: "VI", full: "Chỉ tiếng Việt" },
];

export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  return (
    <div role="radiogroup" aria-label="Ngôn ngữ hiển thị" className={cn("inline-flex rounded-full border-2 border-line bg-white p-0.5", className)}>
      {MODES.map((m) => (
        <button
          key={m.id}
          role="radio"
          aria-checked={lang === m.id}
          title={m.full}
          onClick={() => update((s) => ({ ...s, lang: m.id }))}
          className={cn("h-8 rounded-full px-2.5 text-xs font-extrabold transition-colors", lang === m.id ? "bg-ink text-white" : "text-ink-2 hover:text-ink")}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
