"use client";

// Thẻ bài học: tên song ngữ, tiến độ 5 bước, sao thành thạo
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Stars } from "@/components/common";
import type { LessonContent } from "@/lib/content/types";
import { lessonDone, starsOf, STEPS, type LessonProg } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";

const COLORS = ["#E8492E", "#2F5BEA", "#0E9F8A", "#C9951A"];

export function LessonCard({ lesson, index, prog }: { lesson: LessonContent; index: number; prog?: LessonProg }) {
  const done = lessonDone(prog);
  return (
    <Link href={`/hoc/${lesson.slug}`} className="card-lsn group flex flex-col gap-3 p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl font-display text-lg font-extrabold text-white" style={{ background: COLORS[index % 4], boxShadow: "inset 0 -3px 0 rgba(0,0,0,.18)" }}>
          {done === 1 ? <Check className="size-6" /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-tight font-extrabold">{lesson.title.vi}</div>
          <div className="text-en text-sm font-semibold">{lesson.title.en}</div>
        </div>
        <Stars n={starsOf(prog?.quizBest ?? 0)} />
      </div>
      <div className="flex gap-1.5" aria-label={`Đã xong ${Math.round(done * 5)}/5 bước`}>
        {STEPS.map((s) => (
          <span key={s} title={STEP_INFO[s].label.vi} className={cn("h-2 flex-1 rounded-full", prog?.steps[s] ? "bg-teal" : "bg-line")} />
        ))}
      </div>
    </Link>
  );
}
