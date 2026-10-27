"use client";

// Bản đồ học: 10 chương Toán 8 (Kết nối tri thức). Bài đã có nội dung thì vào học được, bài khác "Sắp có".
import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "cn";
import { Stars } from "@/components/common";
import { T } from "@/components/lang";
import { lessonById } from "@/lib/content";
import { chaptersOf, STRANDS } from "@/lib/curriculum";
import { lessonDone, starsOf } from "@/lib/progress/logic";
import { useProgress } from "@/lib/progress/store";

export default function MapPage() {
  const p = useProgress();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Bản đồ học Toán 8</h1>
        <p className="mt-1 text-ink-2">Sách Kết nối tri thức · 10 chương. Hiện đã có chủ đề <b>Tứ giác – Hình bình hành – Hình chữ nhật</b>; các bài khác sẽ được thêm dần.</p>
      </div>
      <div className="space-y-4">
        {chaptersOf(8).map((ch) => {
          const strand = STRANDS[ch.strand];
          const ready = ch.lessons.some((l) => lessonById(l.id));
          return (
            <section key={ch.id} className={cn("card-lsn overflow-hidden", !ready && "opacity-75")}>
              <header className="flex items-center gap-3 border-b-2 border-line px-4 py-3" style={{ borderLeft: `6px solid ${strand.color}` }}>
                <span className="font-display text-sm font-extrabold text-ink-2">Chương {ch.no}</span>
                <T v={ch} strong className="flex-1" />
                <span className="hidden rounded-full px-2.5 py-1 text-xs font-bold text-white sm:inline" style={{ background: strand.color }}>
                  {strand.vi}
                </span>
              </header>
              <ul className="divide-y-2 divide-line">
                {ch.lessons.map((l) => {
                  const content = lessonById(l.id);
                  const prog = p.lessons[l.id];
                  const inner = (
                    <>
                      <span className="w-14 shrink-0 font-display text-sm font-bold text-ink-2">Bài {l.no}</span>
                      <T v={l} className="flex-1 text-sm" />
                      {content ? (
                        <span className="flex items-center gap-2">
                          <span className="hidden text-xs font-bold text-teal-dk sm:inline">{Math.round(lessonDone(prog) * 100)}%</span>
                          <Stars n={starsOf(prog?.quizBest ?? 0)} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-2">
                          <Lock className="size-3.5" /> Sắp có
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={l.id}>
                      {content ? (
                        <Link href={`/hoc/${content.slug}`} className="flex min-h-12 items-center gap-3 px-4 py-2.5 hover:bg-blue-soft/50">
                          {inner}
                        </Link>
                      ) : (
                        <div className="flex min-h-12 items-center gap-3 px-4 py-2.5">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
