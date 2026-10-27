"use client";

// GĐ 6 — Ngân hàng thuật ngữ: tìm, thêm, sửa; quản trị duyệt. Thuật ngữ đã duyệt dùng cho thẻ từ vựng của học sinh.
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, PencilLine, Plus, Search, Trash2, Undo2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";
import { useConfirm } from "@/components/confirm-dialog";
import { INPUT, StatusBadge } from "@/components/lessons/fields";
import { TermFormDialog } from "@/components/lessons/term-dialogs";
import { api, errorMessage } from "@/lib/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { useTermBank } from "@/lib/lessons/hooks";
import { say } from "@/lib/live/speech";
import type { TermDoc } from "@/lib/study/types";

export default function TermBankPage() {
  const { user, role } = useAuth();
  const admin = role === "admin";
  const { data, loading } = useTermBank();
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState(0);
  const [status, setStatus] = useState<"all" | "pending">("all");
  const [editing, setEditing] = useState<TermDoc | "new" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmEl, confirm] = useConfirm();

  const s = q.trim().toLowerCase();
  const list = data.filter(
    (t) =>
      (!grade || t.grade === grade) &&
      (status === "all" || t.status !== "approved") &&
      (!s || t.en.toLowerCase().includes(s) || t.vi.toLowerCase().includes(s)) &&
      // GV thấy thuật ngữ đã duyệt + của mình; quản trị thấy tất cả
      (admin || t.status === "approved" || t.createdBy === user?.uid)
  );
  const pending = data.filter((t) => t.status !== "approved").length;
  const canEdit = (t: TermDoc) => admin || (t.createdBy === user?.uid && t.status !== "approved");

  async function act(t: TermDoc, fn: () => Promise<unknown>, msg: string) {
    setBusy(t.id);
    try {
      await fn();
      toast.success(msg);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <Link href="/teacher/lessons" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-2 hover:text-blue">
        <ArrowLeft className="size-4" /> Bài giảng
      </Link>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Ngân hàng thuật ngữ</h1>
          <p className="mt-1 text-sm text-ink-2">Thuật ngữ Toán song ngữ: phiên âm, nghĩa, câu ví dụ, cách đọc kí hiệu. Không dịch máy — giáo viên nhập, quản trị duyệt.</p>
        </div>
        <Button size="lg" onClick={() => setEditing("new")}>
          <Plus /> Thêm thuật ngữ
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiếng Anh hoặc tiếng Việt…" className={`${INPUT} h-11 pl-9`} />
        </label>
        <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={`${INPUT} h-11 sm:w-36`} aria-label="Lọc theo khối">
          <option value={0}>Mọi khối</option>
          {[6, 7, 8, 9].map((g) => (
            <option key={g} value={g}>
              Lớp {g}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as "all" | "pending")} className={`${INPUT} h-11 sm:w-48`} aria-label="Lọc theo trạng thái">
          <option value="all">Tất cả</option>
          <option value="pending">Chưa duyệt ({pending})</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-ink-2">
            <Loader2 className="size-4 animate-spin" /> Đang tải…
          </p>
        ) : list.length === 0 ? (
          <EmptyState title="Chưa có thuật ngữ phù hợp">Bấm “Thêm thuật ngữ” để bổ sung vào ngân hàng.</EmptyState>
        ) : (
          <div className="card-lsn divide-y divide-line overflow-hidden">
            {list.map((t) => (
              <div key={t.id} className={cn("flex flex-col gap-2 p-4 sm:flex-row sm:items-center", busy === t.id && "opacity-60")}>
                <button type="button" onClick={() => say(t.en)} className="hidden size-10 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue-dk sm:grid" aria-label={`Nghe ${t.en}`}>
                  <Volume2 className="size-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <b className="text-en text-lg">{t.en}</b>
                    <span className="text-sm text-ink-2">{t.ipa}</span>
                    <span className="rounded-md bg-paper px-1.5 py-0.5 text-[11px] font-bold text-ink-2">Lớp {t.grade}</span>
                    <StatusBadge status={t.status} />
                  </p>
                  <p className="text-vi">{t.vi}</p>
                  {t.readAs && <p className="text-xs text-ink-2">Cách đọc: {t.readAs}</p>}
                  {t.example?.en && (
                    <p className="text-xs">
                      <span className="text-en">{t.example.en}</span> <span className="text-vi">— {t.example.vi}</span>
                    </p>
                  )}
                  {t.createdByName && <p className="text-[11px] text-ink-2">Thêm bởi {t.createdByName}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {admin && t.status !== "approved" && (
                    <Button size="sm" variant="teal" disabled={!!busy} onClick={() => act(t, () => api(`/api/terms/${t.id}`, { method: "PUT", body: { status: "approved" } }), "Đã duyệt thuật ngữ.")}>
                      <Check /> Duyệt
                    </Button>
                  )}
                  {admin && t.status === "approved" && (
                    <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => act(t, () => api(`/api/terms/${t.id}`, { method: "PUT", body: { status: "draft" } }), "Đã gỡ duyệt.")} title="Gỡ duyệt (học sinh sẽ không thấy)">
                      <Undo2 />
                    </Button>
                  )}
                  {canEdit(t) && (
                    <Button size="sm" variant="outline" disabled={!!busy} onClick={() => setEditing(t)}>
                      <PencilLine /> Sửa
                    </Button>
                  )}
                  {canEdit(t) && (
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      disabled={!!busy}
                      aria-label="Xoá"
                      onClick={async () =>
                        (await confirm({ title: `Xoá “${t.en}”?`, confirmText: "Xoá", danger: true })) && act(t, () => api(`/api/terms/${t.id}`, { method: "DELETE" }), "Đã xoá.")
                      }
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TermFormDialog open={editing != null} onOpenChange={(o) => !o && setEditing(null)} term={editing && editing !== "new" ? editing : undefined} />
      {confirmEl}
    </div>
  );
}
