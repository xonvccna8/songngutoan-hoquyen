"use client";

// Góc công cụ: bảng tóm tắt tính chất · từ điển thuật ngữ có phát âm · cách đọc kí hiệu Toán bằng tiếng Anh
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "cn";
import { SayButtons } from "@/components/common";
import { T } from "@/components/lang";
import { ALL_TERMS, LESSONS, lessonById, SYMBOLS } from "@/lib/content";
import { norm } from "@/lib/speech/grading";

const TABS = [
  { id: "tom-tat", label: "Tóm tắt", en: "Summary" },
  { id: "tu-dien", label: "Từ điển", en: "Glossary" },
  { id: "ki-hieu", label: "Đọc kí hiệu", en: "Symbols" },
] as const;

/** Bỏ dấu tiếng Việt để tìm kiếm không cần gõ dấu */
const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();

export default function ToolsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("tom-tat");
  const [q, setQ] = useState("");
  const terms = ALL_TERMS.filter((t) => !q.trim() || norm(t.en).includes(norm(q)) || plain(t.vi).includes(plain(q)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold">Góc công cụ</h1>
        <p className="mt-1 text-ink-2">Tra nhanh khi làm bài: tóm tắt kiến thức, từ điển thuật ngữ, cách đọc kí hiệu.</p>
      </div>
      <div role="tablist" className="grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("flex h-14 flex-col items-center justify-center rounded-2xl border-2 text-sm font-extrabold", tab === t.id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-2")}
          >
            {t.label}
            <span className={cn("text-[11px] font-semibold", tab === t.id ? "text-white/70" : "text-blue-dk")}>{t.en}</span>
          </button>
        ))}
      </div>

      {tab === "tom-tat" && (
        <div className="grid gap-4 md:grid-cols-3">
          {LESSONS.map((l) => (
            <section key={l.id} className="card-lsn p-5">
              <h2 className="text-xl font-extrabold">{l.title.vi}</h2>
              <p className="text-en mb-3 font-semibold">{l.title.en}</p>
              <ul className="space-y-2.5 text-sm">
                {l.summary.map((s, i) => (
                  <li key={i} className="rounded-xl bg-paper p-3">
                    <T v={s} block />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "tu-dien" && (
        <div className="space-y-3">
          <label className="flex h-12 items-center gap-2 rounded-2xl border-2 border-line-2 bg-white px-4 focus-within:border-blue">
            <Search className="size-5 text-ink-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiếng Anh hoặc tiếng Việt (không cần dấu)…" className="h-full flex-1 bg-transparent outline-none" aria-label="Tìm thuật ngữ" />
          </label>
          <ul className="grid gap-2 md:grid-cols-2">
            {terms.map((t) => (
              <li key={t.id} className="card-lsn flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-en font-display text-lg font-extrabold" lang="en">
                      {t.en}
                    </span>
                    <span className="font-mono text-sm text-ink-2">{t.ipa}</span>
                  </div>
                  <div className="font-semibold">{t.vi}</div>
                  <div className="text-xs text-ink-2">{lessonById(t.lessonId)?.title.vi}</div>
                </div>
                <SayButtons text={t.en.replace(/\s*\(.*\)/, "")} />
              </li>
            ))}
          </ul>
          {!terms.length && <p className="text-center text-ink-2">Không tìm thấy từ nào.</p>}
        </div>
      )}

      {tab === "ki-hieu" && (
        <ul className="grid gap-2 md:grid-cols-2">
          {SYMBOLS.map((s) => (
            <li key={s.sym} className="card-lsn flex items-center gap-3 p-3">
              <span className="w-32 shrink-0 font-display text-lg font-extrabold">{s.sym}</span>
              <div className="min-w-0 flex-1 text-sm">
                <div className="text-en font-semibold" lang="en">
                  {s.read.en}
                </div>
                <div className="text-vi">{s.read.vi}</div>
              </div>
              <SayButtons text={s.read.en} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
