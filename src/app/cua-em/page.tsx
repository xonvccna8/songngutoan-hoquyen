"use client";

// Trang "Của em": chỉ số, biểu đồ XP 14 ngày, huy hiệu, lỗi Toán/Ngôn ngữ, sao lưu – chuyển máy – xoá tiến độ
import { useRef } from "react";
import { BookOpen, Download, Flame, Mic, Rocket, Star, Target, Trash2, Upload, Zap, Layers } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { cn } from "cn";
import { Loader, SectionTitle } from "@/components/common";
import { LangSwitch } from "@/components/lang";
import { InstallCard } from "@/components/pwa/install-card";
import { Button } from "@/components/ui/button";
import { badges, dayKey, longestStreak, streak, type Badge } from "@/lib/progress/logic";
import { isMastered } from "@/lib/progress/srs";
import { exportProgress, importProgress, resetProgress, useHydrated, useNow, useProgress } from "@/lib/progress/store";

const BADGE_ICON: Record<Badge["icon"], typeof Star> = { rocket: Rocket, flame: Flame, star: Star, cards: Layers, mic: Mic, zap: Zap, target: Target, book: BookOpen };

export default function MePage() {
  const p = useProgress();
  const hydrated = useHydrated();
  const file = useRef<HTMLInputElement>(null);
  const now = useNow();
  if (!hydrated) return <Loader />;

  const days = Array.from({ length: 14 }, (_, i) => {
    const t = now - (13 - i) * 86_400_000;
    const d = new Date(t);
    return { day: `${d.getDate()}/${d.getMonth() + 1}`, xp: p.days[dayKey(t)] ?? 0 };
  });
  const acc = p.stats.answered ? Math.round((p.stats.correct / p.stats.answered) * 100) : 0;
  const mastered = Object.values(p.cards).filter(isMastered).length;
  const wrong = p.stats.mathWrong + p.stats.langWrong;
  const list = badges(p, now);

  const tiles = [
    { label: "Tổng XP", value: p.xp.toLocaleString("vi-VN"), sub: "Total XP" },
    { label: "Chuỗi ngày", value: streak(p.days, now), sub: `Dài nhất ${longestStreak(p.days)} ngày` },
    { label: "Tỉ lệ đúng", value: `${acc}%`, sub: `${p.stats.correct}/${p.stats.answered} câu` },
    { label: "Từ đã thuộc", value: mastered, sub: `${Object.keys(p.cards).length} thẻ đã học` },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Của em{p.name ? ` · ${p.name}` : ""}</h1>
          <p className="mt-1 text-ink-2">Tiến độ chỉ lưu trên máy này — không ai khác xem được.</p>
        </div>
        <LangSwitch />
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="card-lsn p-4">
            <div className="text-sm font-bold text-ink-2">{t.label}</div>
            <div className="font-display text-3xl font-extrabold">{t.value}</div>
            <div className="text-xs text-ink-2">{t.sub}</div>
          </div>
        ))}
      </section>

      <section className="card-lsn p-5">
        <SectionTitle>XP 14 ngày gần đây</SectionTitle>
        <div className="h-56" role="img" aria-label={`Biểu đồ XP theo ngày: ${days.map((d) => `${d.day} ${d.xp} XP`).join(", ")}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barCategoryGap={3}>
              <CartesianGrid vertical={false} stroke="#E6E2F6" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#55537A" }} interval="preserveStartEnd" />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#55537A" }} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#EFECFB" }} formatter={(v) => [`${v} XP`, "Điểm"]} contentStyle={{ borderRadius: 12, border: "2px solid #E6E2F6", fontWeight: 700 }} />
              <Bar dataKey="xp" fill="#2F5BEA" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {wrong > 0 && (
        <section className="card-lsn p-5">
          <SectionTitle>Em hay sai ở đâu?</SectionTitle>
          <div className="flex h-4 overflow-hidden rounded-full bg-line" aria-hidden>
            <div className="bg-teal" style={{ width: `${(p.stats.mathWrong / wrong) * 100}%` }} />
            <div className="ml-0.5 flex-1 bg-sun" />
          </div>
          <div className="mt-2 flex justify-between text-sm font-semibold">
            <span>Lỗi Toán: {p.stats.mathWrong}</span>
            <span>Lỗi Ngôn ngữ: {p.stats.langWrong}</span>
          </div>
          <p className="mt-2 text-sm text-ink-2">
            {p.stats.langWrong > p.stats.mathWrong
              ? "Em hiểu Toán nhưng hay vướng từ tiếng Anh → ôn thẻ từ mỗi ngày nhé."
              : "Lỗi Toán nhiều hơn → xem lại phần Hiểu bài và làm lại Sổ lỗi sai."}
          </p>
        </section>
      )}

      <section>
        <SectionTitle>Huy hiệu</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((b) => {
            const I = BADGE_ICON[b.icon];
            return (
              <div key={b.id} className={cn("card-lsn flex flex-col items-center gap-2 p-4 text-center", !b.earned && "opacity-70")}>
                <span className={cn("grid size-14 place-items-center rounded-2xl", b.earned ? "bg-sun text-ink shadow-[0_4px_0_var(--color-sun-dk)]" : "bg-line text-ink-2")}>
                  <I className="size-7" />
                </span>
                <div className="font-display leading-tight font-extrabold">{b.title.vi}</div>
                <div className="text-xs text-ink-2">{b.desc}</div>
                {!b.earned && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${(b.have / b.goal) * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <InstallCard />

      <section className="card-lsn space-y-3 p-5">
        <SectionTitle>Sao lưu &amp; chuyển máy</SectionTitle>
        <p className="text-sm text-ink-2">Tiến độ nằm trong trình duyệt của máy này. Muốn học tiếp ở máy khác: tải tệp sao lưu ở đây, rồi mở web trên máy kia và bấm “Nhập tệp”.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportProgress}>
            <Download /> Tải tệp sao lưu
          </Button>
          <Button variant="outline" onClick={() => file.current?.click()}>
            <Upload /> Nhập tệp
          </Button>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (!window.confirm("Nhập tệp sẽ thay toàn bộ tiến độ hiện tại trên máy này. Tiếp tục?")) return;
              if (await importProgress(f)) toast.success("Đã nhập tiến độ!");
              else toast.error("Tệp không đúng định dạng sao lưu của Toán 8 Song Ngữ.");
            }}
          />
          <Button
            variant="destructive"
            className="ml-auto"
            onClick={() => {
              if (window.confirm("Xoá toàn bộ tiến độ học trên máy này? Không thể hoàn tác.")) {
                resetProgress();
                toast("Đã xoá tiến độ.");
              }
            }}
          >
            <Trash2 /> Xoá tiến độ
          </Button>
        </div>
      </section>
    </div>
  );
}
