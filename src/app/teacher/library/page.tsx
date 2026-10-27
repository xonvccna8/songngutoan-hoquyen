"use client";

// GĐ 4 — Học liệu số: khung chương trình (KNTT, YCCĐ song ngữ) · khung câu · câu lệnh lớp học · kí hiệu toán · học liệu (link)
// Mọi câu tiếng Anh đều có nút nghe / nghe chậm để GV chưa vững tiếng Anh vẫn dùng được.
import { useState } from "react";
import { BookMarked, Hash, Library, Link2, MessageSquareQuote, Plus, Search, Sigma } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { INPUT } from "@/components/lessons/fields";
import { CurriculumPanel, FramesPanel, PhrasesPanel, ResourcesPanel, SymbolsPanel } from "@/components/library/panels";
import { ResourceDialog } from "@/components/library/resource-dialog";
import { useAuth } from "@/lib/auth/auth-context";
import { useAllResources } from "@/lib/library/hooks";
import { BOOK, GRADES } from "@/lib/curriculum";
import { FRAMES, PHRASES, SYMBOLS } from "@/lib/library";

const TABS = [
  { key: "curriculum", label: "Khung chương trình", icon: BookMarked },
  { key: "frames", label: `Khung câu (${FRAMES.length})`, icon: MessageSquareQuote },
  { key: "phrases", label: `Câu lệnh lớp học (${PHRASES.length})`, icon: Hash },
  { key: "symbols", label: `Đọc kí hiệu (${SYMBOLS.length})`, icon: Sigma },
  { key: "resources", label: "Học liệu (link)", icon: Link2 },
] as const;
type Tab = (typeof TABS)[number]["key"];

export default function LibraryPage() {
  const { user, role } = useAuth();
  const admin = role === "admin";
  const { data: resources } = useAllResources();
  const [tab, setTab] = useState<Tab>("curriculum");
  const [grade, setGrade] = useState(8);
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState<{ grade: number; curLessonId: string | null } | null>(null);
  const pending = resources.filter((r) => r.status !== "approved").length;
  const showGrade = tab === "curriculum" || tab === "resources" || tab === "symbols";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold sm:text-4xl">
            <Library className="size-8 text-blue" /> Học liệu số
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-2">
            Khung chương trình Toán 6–9 ({BOOK.vi}), khung câu cho học sinh, câu lệnh lớp học và cách đọc kí hiệu. Mọi câu tiếng Anh có nút nghe 🔊 và nghe chậm 🐢.
          </p>
        </div>
        <Button size="lg" onClick={() => setAdding({ grade, curLessonId: null })}>
          <Plus /> Thêm học liệu
        </Button>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b-2 border-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn("relative flex h-12 items-center gap-2 px-4 text-sm font-bold whitespace-nowrap", tab === t.key ? "text-ink" : "text-ink-2 hover:text-ink")}
          >
            <t.icon className="size-4" /> {t.label}
            {t.key === "resources" && admin && pending > 0 && <span className="rounded-full bg-coral px-1.5 text-[11px] text-white">{pending}</span>}
            {tab === t.key && <span className="absolute inset-x-2 -bottom-0.5 h-1 rounded-full bg-blue" />}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiếng Việt hoặc tiếng Anh, có dấu hay không dấu đều được…" className={`${INPUT} h-11 pl-9`} />
        </label>
        {showGrade && (
          <div className="inline-flex rounded-2xl bg-white p-1 ring-2 ring-line" role="tablist" aria-label="Khối">
            {GRADES.map((g) => (
              <button key={g} role="tab" aria-selected={grade === g} onClick={() => setGrade(g)} className={cn("h-9 rounded-xl px-4 text-sm font-bold", grade === g ? "bg-ink text-white" : "text-ink-2")}>
                Lớp {g}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {tab === "curriculum" && <CurriculumPanel grade={grade} q={q} resources={resources} onAddResource={(l) => setAdding({ grade: l.grade, curLessonId: l.id })} />}
        {tab === "frames" && <FramesPanel q={q} />}
        {tab === "phrases" && <PhrasesPanel q={q} />}
        {tab === "symbols" && <SymbolsPanel q={q} grade={grade} />}
        {tab === "resources" && <ResourcesPanel q={q} grade={grade} data={resources} uid={user?.uid} admin={admin} />}
      </div>

      {adding && <ResourceDialog key={`${adding.grade}-${adding.curLessonId}`} open onOpenChange={(o) => !o && setAdding(null)} preset={adding} />}
    </div>
  );
}
