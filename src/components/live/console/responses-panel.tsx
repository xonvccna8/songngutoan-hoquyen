"use client";

// Câu trả lời của trang hiện tại: thống kê, bảng chi tiết, nút "Chiếu" câu gõ lên tivi
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { fmtAnswer, isInteractive } from "@/lib/live/grading";
import type { ParticipantDoc, ResponseDoc, SessionDoc, Slide } from "@/lib/live/types";
import type { RosterEntry } from "@/components/live/tv-screen";

const PHASE: Record<string, string> = { idle: "Chưa mở", open: "Đang nhận câu trả lời", locked: "Đã khoá", reveal: "Đã công bố" };

export function ResponsesPanel({
  session,
  slide,
  responses,
  participants,
  roster,
  actions,
}: {
  session: SessionDoc;
  slide: Slide;
  responses: ResponseDoc[];
  participants: ParticipantDoc[];
  roster: Map<string, RosterEntry>;
  actions: { open: () => void; lock: () => void; reveal: () => void; pin: (slideId: string, uid: string) => void };
}) {
  const st = session.state;
  const R = responses.filter((r) => r.slideId === slide.id).sort((a, b) => a.answeredAt - b.answeredAt);
  const N = participants.length || roster.size;
  const name = (uid: string) => roster.get(uid)?.name ?? "Học sinh";

  if (slide.type === "final") {
    const totals = new Map<string, number>();
    responses.forEach((r) => totals.set(r.uid, (totals.get(r.uid) ?? 0) + (r.points ?? 0)));
    const lb = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    return (
      <Panel title="Bảng điểm cả tiết">
        <Table head={["#", "Học sinh", "Điểm"]} rows={lb.map(([uid, p], i) => [i + 1, name(uid), <b key="p">{p}</b>])} />
      </Panel>
    );
  }
  if (!isInteractive(slide)) {
    return (
      <Panel title="Kết quả">
        <p className="text-sm text-ink-2">Trang này không có câu hỏi. Học sinh đang xem nội dung giống tivi trên điện thoại.</p>
      </Panel>
    );
  }

  const ctrl = (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      <Button size="xs" variant="outline" onClick={actions.open} disabled={st.phase === "open"}>
        Mở
      </Button>
      <Button size="xs" variant="outline" onClick={actions.lock} disabled={st.phase !== "open"}>
        Khoá
      </Button>
      <Button size="xs" variant="outline" onClick={actions.reveal} disabled={st.phase === "reveal" || st.phase === "idle"}>
        Công bố
      </Button>
      <span className="text-xs font-semibold text-ink-2">· {PHASE[st.phase]}</span>
    </div>
  );

  if (slide.speak) {
    const avg = R.length ? Math.round(R.reduce((s, r) => s + (r.score ?? 0), 0) / R.length) : 0;
    const weak = R.filter((r) => (r.score ?? 0) < 60).length;
    const sorted = [...R].sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
    return (
      <Panel title="Luyện nói · máy chấm">
        {ctrl}
        <Stats items={[[`${R.length}/${N}`, "đã nói"], [avg, "điểm TB"], [weak, "dưới 60"]]} />
        <Table
          head={["Học sinh", "Điểm", "Lần"]}
          rows={sorted.map((r) => [name(r.uid), <b key="s" className={cn((r.score ?? 0) < 60 && "text-coral-dk")}>{r.score}</b>, r.attempts])}
        />
        <p className="mt-2 text-xs text-ink-2">Xếp từ thấp đến cao để biết em nào cần hỗ trợ.</p>
      </Panel>
    );
  }

  const q = slide.question!;
  const ok = R.filter((r) => r.correct).length;
  const pins = st.pinned[slide.id] ?? [];
  const fmt = (r: ResponseDoc) => fmtAnswer(q, r.value);
  return (
    <Panel title={`Câu trả lời · Kĩ năng: ${q.skill}`}>
      {ctrl}
      <Stats items={[[`${R.length}/${N}`, "đã trả lời"], [`${R.length ? Math.round((ok / R.length) * 100) : 0}%`, "đúng"], [Math.max(0, N - R.length), "chưa trả lời"]]} />
      <Table
        head={q.type === "text" ? ["Học sinh", "Trả lời", "Kết quả", ""] : ["Học sinh", "Trả lời", "Kết quả"]}
        rows={R.map((r) => {
          const row: React.ReactNode[] = [
            name(r.uid),
            fmt(r),
            <span key="c" className={cn("font-bold", r.correct ? "text-success-fg" : "text-coral-dk")}>
              {r.correct ? "Đúng" : "Sai"}
            </span>,
          ];
          if (q.type === "text")
            row.push(
              <Button key="p" size="xs" variant={pins.includes(r.uid) ? "default" : "outline"} onClick={() => actions.pin(slide.id, r.uid)}>
                {pins.includes(r.uid) ? "Đang chiếu" : "Chiếu"}
              </Button>
            );
          return row;
        })}
      />
    </Panel>
  );
}

export function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("card-lsn min-w-0 p-4", className)}>
      <h3 className="mb-2 text-xs font-bold tracking-wider text-ink-2 uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Stats({ items }: { items: [React.ReactNode, string][] }) {
  return (
    <div className="mb-2 flex flex-wrap gap-5">
      {items.map(([v, l], i) => (
        <div key={i}>
          <b className="block font-display text-2xl leading-none tabular-nums">{v}</b>
          <span className="text-xs text-ink-2">{l}</span>
        </div>
      ))}
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="max-h-64 overflow-auto border-t border-line">
      <table className="w-full text-[13px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="sticky top-0 bg-white py-1.5 pr-2 text-left text-[11px] font-bold text-ink-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className="py-1.5 pr-2 align-middle">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="py-4 text-center text-xs text-ink-2">Chưa có câu trả lời.</p>}
    </div>
  );
}
