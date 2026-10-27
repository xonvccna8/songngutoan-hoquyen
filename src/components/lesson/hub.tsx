"use client";

// Trang tổng quan một bài: 5 bước học theo thứ tự, mục tiêu, yêu cầu cần đạt (CT 2018)
import Link from "next/link";
import { ArrowRight, Check, Target } from "lucide-react";
import { cn } from "cn";
import { BackLink, Ring, Stars } from "@/components/common";
import { T } from "@/components/lang";
import { lessonBySlug } from "@/lib/content";
import { curLesson } from "@/lib/curriculum";
import { lessonDone, nextStep, starsOf, STEPS } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";
import { useProgress } from "@/lib/progress/store";

export function LessonHub({ slug }: { slug: string }) {
  const l = lessonBySlug(slug)!;
  const p = useProgress();
  const prog = p.lessons[l.id];
  const next = nextStep(prog);
  const cur = curLesson(l.id);

  return (
    <div className="space-y-6">
      <BackLink href="/hoc">Bản đồ học</BackLink>
      <section className="card-lsn flex flex-wrap items-center gap-5 p-5 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-2">Bài {cur?.no} · Chương III Tứ giác</p>
          <h1 className="mt-1 text-3xl font-extrabold">{l.title.vi}</h1>
          <p className="text-en text-lg font-semibold">{l.title.en}</p>
          <T v={l.intro} block className="mt-3" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Ring value={lessonDone(prog)} size={84} stroke={10}>
            <span className="font-display text-lg font-extrabold">{Math.round(lessonDone(prog) * 100)}%</span>
          </Ring>
          <Stars n={starsOf(prog?.quizBest ?? 0)} />
        </div>
      </section>

      <section className="grid gap-3">
        {STEPS.map((s, i) => {
          const info = STEP_INFO[s];
          const done = !!prog?.steps[s];
          const isNext = s === next && !done;
          return (
            <Link
              key={s}
              href={`/hoc/${l.slug}/${s}`}
              className={cn("card-lsn flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5", isNext && "border-blue shadow-[0_4px_0_var(--color-blue-dk)]")}
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ background: info.bg, color: info.fg }}>
                {done ? <Check className="size-6" /> : <info.icon className="size-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-lg font-extrabold">
                    {i + 1}. {info.label.vi}
                  </span>
                  <span className="text-en text-sm font-semibold">{info.label.en}</span>
                </div>
                <p className="text-sm text-ink-2">{info.desc}</p>
              </div>
              {s === "luyen-tap" && !done && prog?.practiceCorrect ? <span className="text-sm font-bold text-teal-dk">{prog.practiceCorrect}/6</span> : null}
              {done ? <span className="text-sm font-bold text-success-fg">Xong</span> : <ArrowRight className={cn("size-5", isNext ? "text-blue" : "text-ink-2")} />}
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-lsn p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
            <Target className="size-5 text-coral" /> Mục tiêu · Goals
          </h2>
          <ul className="space-y-2">
            {l.goals.map((g, i) => (
              <li key={i} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                <T v={g} />
              </li>
            ))}
          </ul>
        </div>
        {cur && cur.outcomes.length > 0 && (
          <div className="card-lsn p-5">
            <h2 className="mb-3 text-lg font-extrabold">Yêu cầu cần đạt (CT 2018)</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-sm">
              {cur.outcomes.map((o) => (
                <li key={o.id}>
                  <T v={o} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
