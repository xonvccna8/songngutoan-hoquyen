"use client";

// Thẻ từ lật được: mặt trước tiếng Anh + IPA + nghe mẫu; mặt sau nghĩa tiếng Việt + câu ví dụ.
// Em tự đánh giá Chưa nhớ / Khó / Nhớ / Dễ → lịch ôn lặp ngắt quãng.
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "cn";
import { SayButtons } from "@/components/common";
import type { Term } from "@/lib/content/types";
import { GRADE_LABEL, type Grade } from "@/lib/progress/srs";

const GRADES: { g: Grade; cls: string }[] = [
  { g: "again", cls: "bg-coral-soft text-coral-dk border-coral/30" },
  { g: "hard", cls: "bg-sun-soft text-[#8A5A00] border-sun/50" },
  { g: "good", cls: "bg-teal-soft text-teal-dk border-teal/30" },
  { g: "easy", cls: "bg-blue-soft text-blue-dk border-blue/30" },
];

export function Flashcard({ term, onGrade }: { term: Term; onGrade: (g: Grade) => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), setFlipped((f) => !f))}
        aria-label={flipped ? "Lật lại mặt trước" : "Lật thẻ để xem nghĩa"}
        className={cn("card-lsn relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center transition-colors", flipped && "bg-blue-soft/40")}
      >
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-bold text-ink-2">
          <RotateCw className="size-3.5" /> Chạm để lật
        </span>
        <div className="font-display text-4xl font-extrabold text-blue-dk" lang="en">
          {term.en}
        </div>
        <div className="font-mono text-lg text-ink-2">{term.ipa}</div>
        <span onClick={(e) => e.stopPropagation()}>
          <SayButtons text={term.en.replace(/\s*\(.*\)/, "")} />
        </span>
        {flipped && (
          <div className="mt-2 space-y-2 border-t-2 border-line pt-4">
            <div className="font-display text-2xl font-extrabold">{term.vi}</div>
            {term.example && (
              <div className="text-sm">
                <div className="text-en font-semibold" lang="en">
                  “{term.example.en}”
                </div>
                <div className="text-vi">{term.example.vi}</div>
              </div>
            )}
          </div>
        )}
      </div>
      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map(({ g, cls }) => (
            <button key={g} onClick={() => onGrade(g)} className={cn("flex h-14 flex-col items-center justify-center rounded-2xl border-2 text-sm font-extrabold", cls)}>
              {GRADE_LABEL[g].vi}
              <span className="text-[11px] font-semibold opacity-75">{GRADE_LABEL[g].en}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-ink-2">Đọc to từ tiếng Anh, đoán nghĩa, rồi chạm vào thẻ để kiểm tra.</p>
      )}
    </div>
  );
}
