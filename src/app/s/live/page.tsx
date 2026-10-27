"use client";

// Điện thoại HS trong tiết: hiện đúng nội dung tivi; câu hỏi mở → chuyển sang chế độ trả lời.
// Vào muộn / mất mạng vào lại: nghe trạng thái hiện tại từ Firestore nên tự về đúng chỗ.
import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Hand, Home, Smartphone, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Tam } from "@/components/brand/tam";
import { RequireRole } from "@/components/require-role";
import { FullScreenLoader } from "@/components/common";
import { BOARD_VARS, SlideView } from "@/components/live/slide-view";
import { AnswerInput, QuestionCard, RevealView } from "@/components/live/phone/answer-views";
import { SpeakView } from "@/components/live/phone/speak-view";
import { GamePhoneById } from "@/components/games/phone";
import { api, errorMessage } from "@/lib/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { useMyStudentProfile } from "@/lib/hooks/use-firestore";
import { fmtClock, useCountdown, useLesson, useLiveSessionForClass, useMyResponses, useSession } from "@/lib/live/hooks";
import { isInteractive } from "@/lib/live/grading";
import { say } from "@/lib/live/speech";
import { usePresence } from "@/lib/live/use-presence";
import { InboxProvider } from "@/components/messages/student-inbox";
import type { Lang, SessionDoc } from "@/lib/live/types";
import { shortName } from "@/lib/class-utils";

export default function StudentLivePage() {
  return (
    <RequireRole roles={["student"]} loginPath="/s/login">
      <Live />
    </RequireRole>
  );
}

function Live() {
  const { user, claims } = useAuth();
  const classId = claims.classIds?.[0];
  const live = useLiveSessionForClass(classId);
  // Nhớ phiên vừa học để vẫn hiện tổng kết khi GV bấm "Kết thúc"
  const [lastId, setLastId] = useState<string | null>(null);
  if (live.data && live.data.id !== lastId) setLastId(live.data.id);
  const ended = useSession(!live.data && lastId ? lastId : undefined);
  const { data: me } = useMyStudentProfile(classId, user?.uid);

  if (live.loading) return <FullScreenLoader label="Đang tìm tiết học…" />;
  const session = live.data ?? ended.data;
  // Tin nhắn của thầy cô (Chú ý / Nhắc nhở / Khen) bật lên ngay cả khi đang trong tiết
  return (
    <InboxProvider uid={user!.uid}>
      {session ? (
        <InSession key={session.id} session={session} receivedAt={live.data ? live.receivedAt : ended.receivedAt} uid={user!.uid} name={me?.fullName ?? ""} />
      ) : (
        <Waiting name={me?.fullName} />
      )}
    </InboxProvider>
  );
}

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("flex min-h-dvh flex-1 justify-center bg-ink-tv font-sans text-[var(--chalk)]", className)}
      style={{ ...BOARD_VARS, backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "18px 18px" }}
    >
      <div className="flex w-full max-w-md flex-col">{children}</div>
    </div>
  );
}

function Waiting({ name }: { name?: string }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <Tam mood="sleepy" className="size-28" />
        <h1 className="text-2xl font-extrabold">Chưa có tiết học nào</h1>
        <p className="text-[var(--chalk-dim)]">{name ? `${shortName(name)} ơi, ` : ""}khi thầy cô bắt đầu tiết, màn hình này sẽ tự chuyển vào lớp.</p>
        <Link href="/s" className="mt-4 inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-white/20 px-5 font-bold hover:bg-white/10">
          <Home className="size-5" /> Về trang chủ
        </Link>
      </div>
    </Shell>
  );
}

function InSession({ session, receivedAt, uid, name }: { session: SessionDoc; receivedAt: number; uid: string; name: string }) {
  const { data: lesson } = useLesson(session.lessonId, false);
  const mine = useMyResponses(session.id, uid);
  const { hand, setHand, toggleHand } = usePresence(session.status === "live" ? session.id : undefined, uid);
  const [lang, setLang] = useState<Lang>("bi");
  const [vocab, setVocab] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Record<string, string | number>>({});
  const st = session.state;
  const left = useCountdown(st.timerMs, receivedAt);
  const total = useMemo(() => mine.reduce((s, r) => s + (r.points ?? 0), 0), [mine]);

  // GV đã gọi em → tự hạ tay
  const called = st.called?.uid === uid;
  if (called && hand) setHand(false);

  // Thầy cô mở trò chơi → điện thoại tự chuyển vào trận; chơi xong tự về đúng trang bài học
  if (session.status === "live" && session.gameId) {
    return (
      <Shell>
        <GamePhoneById key={session.gameId} gameId={session.gameId} uid={uid} />
      </Shell>
    );
  }

  if (!lesson) return <FullScreenLoader label="Đang tải bài học…" />;
  const slide = lesson.slides[st.slideIndex];
  if (!slide) return null;
  const my = mine.find((r) => r.slideId === slide.id);

  if (session.status === "ended") {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <Tam mood="cheer" className="size-28" />
          <h1 className="text-2xl font-extrabold">Tiết học đã kết thúc!</h1>
          <p className="text-[var(--chalk-dim)]">Great work today, {shortName(name)}!</p>
          <div className="mt-2 rounded-3xl border-2 border-sun px-8 py-4">
            <p className="text-sm text-[var(--chalk-dim)]">Điểm của em hôm nay</p>
            <p className="font-display text-5xl font-extrabold text-sun">{total}</p>
          </div>
          <Link href="/s" className="mt-4 inline-flex h-12 items-center gap-2 rounded-2xl bg-sun px-6 font-bold text-ink shadow-[0_5px_0_var(--color-sun-dk)]">
            <Home className="size-5" /> Về trang chủ
          </Link>
        </div>
      </Shell>
    );
  }

  async function send(body: Record<string, unknown>, slideId: string, value?: string | number) {
    setBusy(true);
    if (value !== undefined) setPending((p) => ({ ...p, [slideId]: value }));
    try {
      await api("/api/live/answer", { body: { sessionId: session.id, slideId, ...body } });
      if (navigator.vibrate) navigator.vibrate(30);
    } catch (e) {
      if (value !== undefined)
        setPending((p) => {
          const n = { ...p };
          delete n[slideId];
          return n;
        });
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const q = slide.question;
  const answering = isInteractive(slide) && st.phase !== "idle" && !slide.phonesDown;
  const totalMs = (q?.time ?? slide.speak?.time ?? 30) * 1000;
  const terms = lesson.lesson.terms.filter((t) => t.at <= st.slideIndex);

  let body: React.ReactNode;
  if (vocab) {
    body = (
      <div className="flex flex-col gap-2">
        <p className="font-present text-lg font-semibold">Vocabulary · Từ vựng của tiết</p>
        {terms.map((t) => (
          <button key={t.en} onClick={() => say(t.en)} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left active:bg-white/10">
            <span className="block font-present text-lg font-medium">{t.en}</span>
            <span className="block text-sm text-[var(--hi)]">{t.ipa}</span>
            <span className="block text-sm text-[var(--chalk-dim)] italic">{t.vi}</span>
          </button>
        ))}
        <p className="text-xs text-[var(--chalk-dim)]">Bấm vào từ để nghe phát âm (dùng tai nghe trên lớp).</p>
      </div>
    );
  } else if (slide.phonesDown) {
    body = (
      <>
        <SlideView slide={slide} step={st.step} lang={lang} variant="phone" />
        <Notice icon={<Smartphone className="size-5 rotate-90" />} hot>
          Úp điện thoại xuống và làm việc nhóm nhé. <b>Phones down.</b>
        </Notice>
      </>
    );
  } else if (slide.type === "final") {
    body = (
      <>
        <SlideView slide={slide} step={st.step} lang={lang} variant="phone" />
        <div className="rounded-3xl border-2 border-sun p-4 text-center">
          <p className="text-sm text-[var(--chalk-dim)]">Điểm của em</p>
          <p className="font-display text-4xl font-extrabold text-sun">{total}</p>
          <p className="text-xs text-[var(--chalk-dim)]">Bảng vàng top 5 đang hiện trên tivi</p>
        </div>
      </>
    );
  } else if (!answering) {
    body = (
      <>
        <SlideView slide={slide} step={st.step} lang={lang} variant="phone" />
        {isInteractive(slide) && <Notice icon={<Clock className="size-5" />}>Chờ thầy cô mở câu hỏi…</Notice>}
      </>
    );
  } else if (slide.speak) {
    body = <SpeakView key={slide.id} target={slide.speak.target} phase={st.phase} mine={my} onScore={(r) => send({ score: r.score, transcript: r.transcript, wrongWords: slide.speak!.target.split(" ").filter((_, i) => !r.ok[i]) }, slide.id)} />;
  } else if (q && st.phase === "reveal" && st.reveal?.slideId === slide.id) {
    body = (
      <>
        <QuestionCard q={q} lang={lang} />
        <RevealView state={st} q={q} mine={my} lang={lang} total={total} />
      </>
    );
  } else if (q) {
    const sent = my || pending[slide.id] !== undefined;
    body = (
      <>
        {/* Thanh thời gian vàng */}
        {left != null && (
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-sun transition-[width] duration-300 ease-linear" style={{ width: `${(left / totalMs) * 100}%` }} />
          </div>
        )}
        <QuestionCard q={q} lang={lang} />
        <AnswerInput key={slide.id} q={q} lang={lang} mine={my} pendingValue={pending[slide.id]} open={st.phase === "open"} busy={busy} onSend={(v) => send({ value: v }, slide.id, v)} />
        {st.phase === "open" && sent && <Notice>Đã gửi! Chờ thầy cô công bố đáp án.</Notice>}
        {st.phase === "locked" && <Notice icon={<Clock className="size-5" />}>Hết giờ. {sent ? "Chờ công bố đáp án." : "Em chưa kịp trả lời câu này."}</Notice>}
      </>
    );
  }

  return (
    <Shell>
      {/* Đầu */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-ink-tv/90 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 backdrop-blur">
        <div className="min-w-0 text-xs text-[var(--chalk-dim)]">
          <b className="block truncate text-sm text-[var(--chalk)]">{shortName(name) || "Em"}</b>
          Trang {st.slideIndex + 1}/{lesson.slides.length}
          {left != null && <span className={cn("ml-2 font-bold tabular-nums", left <= 10_000 ? "text-sun" : "text-[var(--chalk)]")}>⏱ {fmtClock(left)}</span>}
        </div>
        <div className="inline-flex overflow-hidden rounded-xl border border-white/20 text-xs" role="group" aria-label="Ngôn ngữ trên điện thoại">
          {(["en", "bi"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("px-3 py-2 font-bold", lang === l ? "bg-sun text-ink" : "text-[var(--chalk-dim)]")}>
              {l === "en" ? "EN" : "EN+VI"}
            </button>
          ))}
        </div>
      </header>

      {/* GV gọi tên em */}
      {called && (
        <div className="animate-in fade-in mx-4 mt-3 rounded-2xl bg-sun p-3 text-center font-bold text-ink">Thầy cô mời em trả lời! 🎤</div>
      )}

      <main className="flex flex-1 flex-col gap-4 px-4 py-4">{body}</main>

      {/* Chân */}
      <footer className="sticky bottom-0 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-white/10 bg-ink-tv/95 px-4 pt-2.5 pb-[max(env(safe-area-inset-bottom),10px)] backdrop-blur">
        <button onClick={() => setVocab(!vocab)} className="flex h-11 items-center gap-1.5 justify-self-start rounded-xl border border-white/20 px-3 text-sm font-semibold">
          {vocab ? <X className="size-4" /> : <BookOpen className="size-4" />} {vocab ? "Quay lại" : "Từ vựng"}
        </button>
        <button
          onClick={toggleHand}
          aria-pressed={hand}
          className={cn(
            "flex h-12 items-center gap-2 rounded-2xl px-4 font-bold transition-all",
            hand ? "bg-sun text-ink shadow-[0_4px_0_var(--color-sun-dk)]" : "border-2 border-white/25 text-[var(--chalk)]"
          )}
        >
          <Hand className={cn("size-5", hand && "animate-bounce")} /> {hand ? "Đang giơ tay" : "Giơ tay"}
        </button>
        <span className="justify-self-end text-right text-xs text-[var(--chalk-dim)]">
          Điểm
          <b className="block font-display text-lg leading-none text-sun tabular-nums">{total}</b>
        </span>
      </footer>
    </Shell>
  );
}

function Notice({ children, icon, hot }: { children: React.ReactNode; icon?: React.ReactNode; hot?: boolean }) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-2xl border p-3 text-sm", hot ? "border-sun text-[var(--chalk)]" : "border-dashed border-white/20 text-[var(--chalk-dim)]")}>
      {icon}
      <span>{children}</span>
    </div>
  );
}
