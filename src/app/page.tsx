"use client";

// Trang chủ: lời chào, mục tiêu ngày, "Học tiếp", số việc cần ôn, lộ trình chủ đề, câu tiếng Anh hôm nay
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pencil, Repeat2, Sparkles } from "lucide-react";
import { Tam } from "@/components/brand/tam";
import { Loader, Ring, SayButtons, SectionTitle } from "@/components/common";
import { LessonCard } from "@/components/lesson-card";
import { T } from "@/components/lang";
import { buttonVariants } from "@/components/ui/button";
import { LESSONS } from "@/lib/content";
import { DAILY_GOAL, lessonDone, nextStep, todayXp } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";
import { dueCards } from "@/lib/progress/srs";
import { update, useHydrated, useNow, useProgress } from "@/lib/progress/store";

export default function Home() {
  const p = useProgress();
  const hydrated = useHydrated();
  const [editName, setEditName] = useState(false);
  const now = useNow();
  if (!hydrated) return <Loader />;

  const today = todayXp(p, now);
  const next = LESSONS.find((l) => lessonDone(p.lessons[l.id]) < 1) ?? LESSONS[LESSONS.length - 1];
  const step = nextStep(p.lessons[next.id]);
  const toReview = dueCards(p.cards, now).length + p.mistakes.length;
  const allSpeak = LESSONS.flatMap((l) => l.speak);
  const daily = allSpeak[Math.floor(now / 86_400_000) % allSpeak.length];
  const started = Object.keys(p.lessons).length > 0;

  return (
    <div className="space-y-8">
      {/* Lời chào + mục tiêu ngày */}
      <section className="card-lsn relative overflow-hidden bg-ink p-5 text-white sm:p-7">
        <div className="relative z-10 flex flex-wrap items-center gap-5">
          <Tam mood={today >= DAILY_GOAL ? "cheer" : "happy"} className="size-20 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white/70">Toán 8 · Bilingual Math</p>
            {editName ? (
              <form
                className="mt-1 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = String(new FormData(e.currentTarget).get("name") ?? "").trim().slice(0, 30);
                  update((s) => ({ ...s, name: v }));
                  setEditName(false);
                }}
              >
                <input name="name" defaultValue={p.name} autoFocus maxLength={30} placeholder="Tên gọi của em" aria-label="Tên gọi" className="h-11 min-w-0 flex-1 rounded-xl bg-white/10 px-3 font-bold text-white outline-none placeholder:text-white/50 focus:bg-white/20" />
                <button className="h-11 rounded-xl bg-sun px-4 font-bold text-ink">Lưu</button>
              </form>
            ) : (
              <h1 className="mt-1 flex items-center gap-2 text-3xl font-extrabold">
                Chào {p.name || "em"}!
                <button onClick={() => setEditName(true)} className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white" aria-label="Đổi tên gọi" title="Đổi tên gọi (chỉ lưu trên máy này)">
                  <Pencil className="size-4" />
                </button>
              </h1>
            )}
            <p className="mt-1 text-white/80">{started ? "Hôm nay mình học tiếp nhé." : "Bắt đầu với bài Tứ giác nhé — chỉ 10 phút mỗi ngày."}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <Ring value={today / DAILY_GOAL} color="var(--color-sun)" size={68}>
              <span className="font-display text-sm font-extrabold">{Math.min(100, Math.round((today / DAILY_GOAL) * 100))}%</span>
            </Ring>
            <div className="text-sm">
              <div className="font-bold">Mục tiêu ngày</div>
              <div className="text-white/70">
                {today}/{DAILY_GOAL} XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Học tiếp + Ôn tập */}
      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Link href={`/hoc/${next.slug}/${step}`} className="card-lsn group flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl" style={{ background: STEP_INFO[step].bg, color: STEP_INFO[step].fg }}>
            {(() => {
              const I = STEP_INFO[step].icon;
              return <I className="size-7" />;
            })()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold tracking-wide text-ink-2 uppercase">Học tiếp</div>
            <div className="truncate font-display text-xl font-extrabold">{next.title.vi}</div>
            <div className="text-sm text-ink-2">
              Bước: {STEP_INFO[step].label.vi} · <span className="text-en">{STEP_INFO[step].label.en}</span>
            </div>
          </div>
          <span className={buttonVariants({ size: "icon-lg" })}>
            <ArrowRight />
          </span>
        </Link>
        <Link href="/on-tap" className="card-lsn flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sun-soft text-[#8A5A00]">
            <Repeat2 className="size-7" />
          </span>
          <div className="flex-1">
            <div className="text-xs font-extrabold tracking-wide text-ink-2 uppercase">Ôn tập thông minh</div>
            <div className="font-display text-xl font-extrabold">{toReview ? `${toReview} việc cần ôn` : "Chưa có gì cần ôn"}</div>
            <div className="text-sm text-ink-2">Thẻ từ đến hạn + sổ lỗi sai</div>
          </div>
        </Link>
      </section>

      {/* Lộ trình chủ đề */}
      <section>
        <SectionTitle
          action={
            <Link href="/hoc" className="text-sm font-bold text-blue hover:underline">
              Xem cả chương trình
            </Link>
          }
        >
          Chủ đề: Tứ giác · Quadrilaterals
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-3">
          {LESSONS.map((l, i) => (
            <LessonCard key={l.id} lesson={l} index={i} prog={p.lessons[l.id]} />
          ))}
        </div>
      </section>

      {/* Câu tiếng Anh hôm nay */}
      <section className="card-lsn flex flex-wrap items-center gap-4 p-5">
        <Sparkles className="size-6 shrink-0 text-sun-dk" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-extrabold tracking-wide text-ink-2 uppercase">Câu tiếng Anh hôm nay</div>
          <T v={{ en: daily.en, vi: daily.vi }} block strong className="text-lg" />
        </div>
        <SayButtons text={daily.en} />
      </section>
    </div>
  );
}
