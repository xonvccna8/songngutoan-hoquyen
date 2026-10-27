"use client";

// Ôn tập thông minh: (1) thẻ từ đến hạn theo lịch lặp ngắt quãng · (2) Sổ lỗi sai — làm lại, đúng 2 lần liên tiếp thì rời sổ
import { useState } from "react";
import Link from "next/link";
import { BookX, Languages, Sigma } from "lucide-react";
import { cn } from "cn";
import { Tam } from "@/components/brand/tam";
import { Loader, SectionTitle } from "@/components/common";
import { Flashcard } from "@/components/flashcard";
import { QuestionCard } from "@/components/question-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { lessonById, termById } from "@/lib/content";
import { recordAnswer, reviewCard, type Mistake } from "@/lib/progress/logic";
import { dueCards } from "@/lib/progress/srs";
import { getProgress, update, useHydrated, useNow, useProgress } from "@/lib/progress/store";

type Mode = null | "cards" | "mistakes";

export default function ReviewPage() {
  const p = useProgress();
  const hydrated = useHydrated();
  const [mode, setMode] = useState<Mode>(null);
  const now = useNow();
  if (!hydrated) return <Loader />;

  const due = dueCards(p.cards, now);
  const math = p.mistakes.filter((m) => m.q.skill === "math").length;
  const lang = p.mistakes.length - math;

  if (mode === "cards") return <CardsSession onExit={() => setMode(null)} />;
  if (mode === "mistakes") return <MistakeSession onExit={() => setMode(null)} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Ôn tập thông minh</h1>
        <p className="mt-1 text-ink-2">Máy nhắc em ôn đúng lúc sắp quên, và cho làm lại đúng những câu em từng sai.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-lsn flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-sun-soft text-[#8A5A00]">
              <Languages className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">Thẻ từ đến hạn</h2>
              <p className="text-sm text-ink-2">{Object.keys(p.cards).length} thẻ đã học</p>
            </div>
            <span className="ml-auto font-display text-3xl font-extrabold">{due.length}</span>
          </div>
          <Button size="lg" variant="sun" disabled={!due.length} onClick={() => setMode("cards")}>
            {due.length ? "Ôn thẻ ngay" : "Chưa có thẻ đến hạn"}
          </Button>
        </div>

        <div className="card-lsn flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-coral-soft text-coral-dk">
              <BookX className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">Sổ lỗi sai</h2>
              <p className="text-sm text-ink-2">Làm đúng 2 lần liên tiếp thì câu rời sổ</p>
            </div>
            <span className="ml-auto font-display text-3xl font-extrabold">{p.mistakes.length}</span>
          </div>
          <div className="flex gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-soft px-2.5 py-1 text-teal-dk">
              <Sigma className="size-3.5" /> Lỗi Toán: {math}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sun-soft px-2.5 py-1 text-[#8A5A00]">
              <Languages className="size-3.5" /> Lỗi Ngôn ngữ: {lang}
            </span>
          </div>
          <Button size="lg" variant="coral" disabled={!p.mistakes.length} onClick={() => setMode("mistakes")}>
            {p.mistakes.length ? "Làm lại câu sai" : "Sổ đang trống"}
          </Button>
        </div>
      </div>

      {p.mistakes.length > 0 && (
        <section>
          <SectionTitle>Các câu trong sổ</SectionTitle>
          <ul className="space-y-2">
            {p.mistakes.map((m) => (
              <li key={m.key} className="card-lsn flex items-center gap-3 px-4 py-3 text-sm">
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", m.q.skill === "math" ? "bg-teal-soft text-teal-dk" : "bg-sun-soft text-[#8A5A00]")}>{m.q.skill === "math" ? "Toán" : "Ngôn ngữ"}</span>
                <span className="min-w-0 flex-1 truncate">{m.q.prompt.vi}</span>
                <span className="shrink-0 text-xs text-ink-2">{lessonById(m.lessonId)?.title.vi}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!p.mistakes.length && !Object.keys(p.cards).length && (
        <div className="card-lsn flex flex-col items-center gap-3 p-8 text-center">
          <Tam mood="sleepy" className="size-20" />
          <p className="text-ink-2">Chưa có gì để ôn. Học bước Từ vựng và Luyện tập trước nhé!</p>
          <Link href="/hoc" className={buttonVariants()}>
            Đi học
          </Link>
        </div>
      )}
    </div>
  );
}

function CardsSession({ onExit }: { onExit: () => void }) {
  // Chụp danh sách thẻ lúc bắt đầu, để thẻ vừa "Chưa nhớ" (hẹn 10 phút) không hiện lại ngay
  const [queue] = useState(() => dueCards(getProgress().cards, Date.now()));
  const [i, setI] = useState(0);
  const term = termById(queue[i] ?? "");
  if (!term) return <Finished onExit={onExit} text={`Em đã ôn ${i} thẻ. Hẹn gặp lại theo lịch ôn!`} />;
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Ôn thẻ từ</h1>
        <span className="text-sm font-bold text-ink-2">
          {i + 1}/{queue.length}
        </span>
      </div>
      <Flashcard
        key={term.id}
        term={term}
        onGrade={(g) => {
          update((s, now) => reviewCard(s, term.id, g, now));
          setI(i + 1);
        }}
      />
      <Button variant="ghost" onClick={onExit}>
        Dừng ôn
      </Button>
    </div>
  );
}

function MistakeSession({ onExit }: { onExit: () => void }) {
  const [list] = useState<Mistake[]>(() => getProgress().mistakes.slice(0, 10));
  const [i, setI] = useState(0);
  const m = list[i];
  if (!m) return <Finished onExit={onExit} text={`Em đã làm lại ${list.length} câu. Câu nào đúng 2 lần liên tiếp sẽ rời sổ.`} />;
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Làm lại câu sai</h1>
        <span className="text-sm font-bold text-ink-2">
          {i + 1}/{list.length} · {lessonById(m.lessonId)?.title.vi}
        </span>
      </div>
      <QuestionCard
        key={m.key + i}
        q={m.q}
        onAnswer={(ok, hints) => update((s, now) => recordAnswer(s, { lessonId: m.lessonId, q: m.q, correct: ok, hints, source: "review" }, now))}
        onNext={() => setI(i + 1)}
      />
      <Button variant="ghost" onClick={onExit}>
        Dừng ôn
      </Button>
    </div>
  );
}

function Finished({ text, onExit }: { text: string; onExit: () => void }) {
  return (
    <div className="card-lsn mx-auto flex max-w-xl flex-col items-center gap-3 bg-success-bg p-8 text-center">
      <Tam mood="cheer" className="size-20" />
      <h2 className="text-2xl font-extrabold text-success-fg">Xong lượt ôn!</h2>
      <p className="text-ink-2">{text}</p>
      <Button onClick={onExit}>Về trang Ôn tập</Button>
    </div>
  );
}
