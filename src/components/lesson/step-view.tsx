"use client";

// Khung chung của một bước học: đầu trang (bài, bước, các chấm bước) + nội dung bước
import Link from "next/link";
import { cn } from "cn";
import { BackLink, Loader } from "@/components/common";
import { LearnStep } from "@/components/lesson/learn";
import { PracticeStep } from "@/components/lesson/practice";
import { QuizStep } from "@/components/lesson/quiz";
import { SpeakStep } from "@/components/lesson/speak";
import { VocabStep } from "@/components/lesson/vocab";
import { lessonBySlug } from "@/lib/content";
import type { LessonContent } from "@/lib/content/types";
import { STEPS, type StepId } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";
import { useHydrated, useProgress } from "@/lib/progress/store";

export function StepView({ slug, step }: { slug: string; step: StepId }) {
  const l = lessonBySlug(slug)!;
  const hydrated = useHydrated();
  const prog = useProgress().lessons[l.id];
  const info = STEP_INFO[step];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <BackLink href={`/hoc/${l.slug}`}>{l.title.vi}</BackLink>
        <nav className="flex gap-1.5" aria-label="Các bước của bài">
          {STEPS.map((s, i) => (
            <Link
              key={s}
              href={`/hoc/${l.slug}/${s}`}
              title={STEP_INFO[s].label.vi}
              aria-current={s === step ? "step" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-xl border-2 font-display text-sm font-extrabold",
                s === step ? "border-ink bg-ink text-white" : prog?.steps[s] ? "border-teal bg-teal-soft text-teal-dk" : "border-line bg-white text-ink-2",
              )}
            >
              {i + 1}
            </Link>
          ))}
        </nav>
      </div>
      <header className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ background: info.bg, color: info.fg }}>
          <info.icon className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl leading-tight font-extrabold">{info.label.vi}</h1>
          <p className="text-en font-semibold">{info.label.en}</p>
        </div>
      </header>
      {/* Câu hỏi ngẫu nhiên chỉ tạo trên trình duyệt (sau khi đọc tiến độ) để không lệch với bản dựng sẵn */}
      {!hydrated ? <Loader /> : <Body key={`${l.id}-${step}`} lesson={l} step={step} />}
    </div>
  );
}

function Body({ lesson, step }: { lesson: LessonContent; step: StepId }) {
  switch (step) {
    case "tu-vung":
      return <VocabStep lesson={lesson} />;
    case "hieu-bai":
      return <LearnStep lesson={lesson} />;
    case "luyen-tap":
      return <PracticeStep lesson={lesson} />;
    case "noi":
      return <SpeakStep lesson={lesson} />;
    case "kiem-tra":
      return <QuizStep lesson={lesson} />;
  }
}
