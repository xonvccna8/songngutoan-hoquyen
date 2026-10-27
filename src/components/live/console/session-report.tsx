"use client";

// Báo cáo tiết học sau khi kết thúc: điểm, số câu đúng, tách Toán / Ngôn ngữ, phát âm, số lần rời trang
import { ArrowLeft, Trophy } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common";
import { Tam } from "@/components/brand/tam";
import type { LessonData } from "@/lib/live/hooks";
import type { ParticipantDoc, ResponseDoc, SessionDoc } from "@/lib/live/types";
import type { RosterEntry } from "@/components/live/tv-screen";

export function SessionReport({
  session,
  lesson,
  responses,
  participants,
  roster,
  onBack,
}: {
  session: SessionDoc;
  lesson: LessonData;
  responses: ResponseDoc[];
  participants: ParticipantDoc[];
  roster: Map<string, RosterEntry>;
  onBack: () => void;
}) {
  const questions = lesson.slides.filter((s) => s.question).length;
  const pByUid = new Map(participants.map((p) => [p.uid, p]));
  const rows = [...roster.entries()]
    .map(([uid, info]) => {
      const mine = responses.filter((r) => r.uid === uid);
      const q = mine.filter((r) => r.qtype !== "speak");
      const sp = mine.filter((r) => r.qtype === "speak");
      const pct = (skill: string) => {
        const a = q.filter((r) => r.skill === skill);
        return a.length ? Math.round((a.filter((r) => r.correct).length / a.length) * 100) : null;
      };
      return {
        uid,
        info,
        joined: pByUid.has(uid),
        points: mine.reduce((s, r) => s + (r.points ?? 0), 0),
        answered: q.length,
        correct: q.filter((r) => r.correct).length,
        math: pct("Toán"),
        lang: pct("Ngôn ngữ"),
        pron: sp.length ? Math.round(sp.reduce((s, r) => s + (r.score ?? 0), 0) / sp.length) : null,
        left: pByUid.get(uid)?.leftCount ?? 0,
      };
    })
    .sort((a, b) => b.points - a.points);
  const joined = rows.filter((r) => r.joined);
  const avg = joined.length ? Math.round(joined.reduce((s, r) => s + r.points, 0) / joined.length) : 0;
  const acc = (() => {
    const q = responses.filter((r) => r.qtype !== "speak");
    return q.length ? Math.round((q.filter((r) => r.correct).length / q.length) * 100) : 0;
  })();

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Tam mood="cheer" className="size-20" />
          <div>
            <h1 className="text-3xl font-extrabold">Báo cáo tiết học</h1>
            <p className="text-ink-2">
              {lesson.lesson.title.vi} · {joined.length}/{roster.size} học sinh tham gia
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft /> Về trang lớp
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Tham gia" value={`${joined.length}/${roster.size}`} />
        <Kpi label="Điểm trung bình" value={avg} />
        <Kpi label="Tỉ lệ đúng" value={`${acc}%`} />
        <Kpi label="Số câu hỏi" value={questions} />
      </div>

      <div className="card-lsn mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs font-bold text-ink-2">
              <th className="py-3 pl-4">#</th>
              <th className="py-3">Học sinh</th>
              <th className="py-3 text-right">Điểm</th>
              <th className="py-3 text-right">Đúng</th>
              <th className="py-3 text-right">Toán</th>
              <th className="py-3 text-right">Ngôn ngữ</th>
              <th className="py-3 text-right">Phát âm</th>
              <th className="py-3 pr-4 text-right">Rời trang</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.uid} className={cn("border-t border-line", !r.joined && "text-ink-2/60")}>
                <td className="py-2 pl-4 font-display font-bold">{i < 3 && r.points > 0 ? <Trophy className="size-4 text-sun-dk" /> : i + 1}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={r.info.name} team={r.info.team} className="size-8 text-[11px]" />
                    <span className="font-semibold">{r.info.name}</span>
                    {!r.joined && <span className="text-xs">(vắng)</span>}
                  </div>
                </td>
                <td className="py-2 text-right font-display font-extrabold">{r.points}</td>
                <td className="py-2 text-right tabular-nums">
                  {r.correct}/{questions}
                </td>
                <td className="py-2 text-right tabular-nums">{r.math == null ? "—" : `${r.math}%`}</td>
                <td className="py-2 text-right tabular-nums">{r.lang == null ? "—" : `${r.lang}%`}</td>
                <td className="py-2 text-right tabular-nums">{r.pron ?? "—"}</td>
                <td className={cn("py-2 pr-4 text-right tabular-nums", r.left > 2 && "font-bold text-coral-dk")}>{r.left}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink-2">
        Điểm phát âm GĐ này do điện thoại chấm (Web Speech) — chỉ mang tính tham khảo. Thống kê dài hạn của từng em có ở Giai đoạn 3.
      </p>
      {session.summary && <p className="sr-only">Tóm tắt: {session.summary.participants} em, điểm TB {session.summary.avgPoints}</p>}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="card-lsn p-4">
      <b className="block font-display text-3xl leading-none font-extrabold">{value}</b>
      <span className="text-xs font-semibold text-ink-2">{label}</span>
    </div>
  );
}
