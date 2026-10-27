"use client";

// Hộp thêm/sửa thuật ngữ (ngân hàng) và hộp chọn thuật ngữ để chèn vào tiết
import { useMemo, useState } from "react";
import { Loader2, Plus, Search, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BiField, FieldLabel, INPUT, SELECT, TextField } from "@/components/lessons/fields";
import { api, errorMessage } from "@/lib/api-client";
import { useAuth } from "@/lib/auth/auth-context";
import { useTermBank } from "@/lib/lessons/hooks";
import { emptyBi } from "@/lib/lessons/editor";
import { termId } from "@/lib/lessons/terms";
import { say } from "@/lib/live/speech";
import type { TermDoc } from "@/lib/study/types";

type Draft = { en: string; ipa: string; vi: string; readAs: string; imageUrl: string; grade: number; example: { en: string; vi: string } };

const toDraft = (t?: Partial<TermDoc>, grade = 7): Draft => ({
  en: t?.en ?? "",
  ipa: t?.ipa ?? "",
  vi: t?.vi ?? "",
  readAs: t?.readAs ?? "",
  imageUrl: t?.imageUrl ?? "",
  grade: t?.grade ?? grade,
  example: t?.example ?? emptyBi(),
});

/** Thêm mới (term = undefined) hoặc sửa thuật ngữ. onSaved trả về thuật ngữ đã lưu. */
export function TermFormDialog({ open, onOpenChange, term, grade, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; term?: TermDoc; grade?: number; onSaved?: (t: Draft & { id: string }) => void }) {
  const [d, setD] = useState<Draft>(() => toDraft(term, grade));
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState<string | null>(null);
  // Mở lại hộp với thuật ngữ khác → nạp lại dữ liệu
  const k = open ? (term?.id ?? "new") : null;
  if (k !== key) {
    setKey(k);
    if (k) setD(toDraft(term, grade));
  }
  const set = (p: Partial<Draft>) => setD({ ...d, ...p });

  async function save() {
    setBusy(true);
    try {
      if (term) await api(`/api/terms/${term.id}`, { method: "PUT", body: d });
      else await api("/api/terms", { body: d });
      toast.success(term ? "Đã lưu thuật ngữ." : "Đã thêm vào ngân hàng thuật ngữ.");
      onSaved?.({ ...d, id: term?.id ?? termId(d.en) });
      onOpenChange(false);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl p-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">{term ? "Sửa thuật ngữ" : "Thuật ngữ mới"}</DialogTitle>
          <DialogDescription>Nhập tay cả tiếng Anh và tiếng Việt (không dịch máy). Thuật ngữ của giáo viên cần quản trị duyệt trước khi học sinh thấy.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <FieldLabel>Tiếng Anh</FieldLabel>
              <div className="flex gap-2">
                <input value={d.en} onChange={(e) => set({ en: e.target.value })} disabled={!!term} placeholder="isosceles triangle" maxLength={80} className={`${INPUT} font-semibold text-blue-dk`} />
                <Button variant="outline" size="icon" onClick={() => d.en && say(d.en)} aria-label="Nghe">
                  <Volume2 />
                </Button>
              </div>
            </label>
            <TextField label="Phiên âm IPA" value={d.ipa} onChange={(ipa) => set({ ipa })} placeholder="/aɪˈsɒsəliːz/" maxLength={80} />
          </div>
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <TextField label="Tiếng Việt" value={d.vi} onChange={(vi) => set({ vi })} placeholder="tam giác cân" maxLength={120} />
            <label>
              <FieldLabel>Khối</FieldLabel>
              <select value={d.grade} onChange={(e) => set({ grade: Number(e.target.value) })} className={SELECT}>
                {[6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>
                    Lớp {g}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <TextField label="Cách đọc kí hiệu" hint="nếu có" value={d.readAs} onChange={(readAs) => set({ readAs })} placeholder="∠B đọc là “angle B”" maxLength={120} />
          <BiField label="Câu ví dụ" value={d.example} onChange={(example) => set({ example })} placeholder={{ en: "AB and AC are the legs.", vi: "AB và AC là các cạnh bên." }} />
          <TextField label="Hình minh hoạ" hint="đường dẫn https:// (không bắt buộc)" value={d.imageUrl} onChange={(imageUrl) => set({ imageUrl })} placeholder="https://…" maxLength={500} />
        </div>
        <Button onClick={save} disabled={busy || !d.en.trim() || !d.vi.trim()} className="mt-2 w-full">
          {busy && <Loader2 className="animate-spin" />} {term ? "Lưu" : "Thêm vào ngân hàng"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

/** Chọn thuật ngữ đã có (đã duyệt, hoặc mình thêm) để chèn vào tiết */
export function TermPickerDialog({ open, onOpenChange, grade, onPick }: { open: boolean; onOpenChange: (v: boolean) => void; grade: number; onPick: (t: { en: string; ipa: string; vi: string }) => void }) {
  const { user } = useAuth();
  const { data, loading } = useTermBank();
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data
      .filter((t) => t.status === "approved" || t.createdBy === user?.uid)
      .filter((t) => !s || t.en.toLowerCase().includes(s) || t.vi.toLowerCase().includes(s))
      .sort((a, b) => Number(b.grade === grade) - Number(a.grade === grade));
  }, [data, q, grade, user?.uid]);

  return (
    <>
      <Dialog open={open && !creating} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl p-6 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">Chèn thuật ngữ</DialogTitle>
            <DialogDescription>Thuật ngữ được thêm vào Bảng từ trên tivi (từ trang đang soạn) và vào khối phiên âm của trang.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <label className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tiếng Anh hoặc tiếng Việt…" className={`${INPUT} pl-9`} autoFocus />
            </label>
            <Button variant="outline" onClick={() => setCreating(true)}>
              <Plus /> Mới
            </Button>
          </div>
          {loading ? (
            <p className="flex items-center gap-2 py-4 text-sm text-ink-2">
              <Loader2 className="size-4 animate-spin" /> Đang tải…
            </p>
          ) : list.length === 0 ? (
            <p className="py-4 text-sm text-ink-2">Không có thuật ngữ phù hợp. Bấm “Mới” để thêm.</p>
          ) : (
            <ul className="divide-y divide-line">
              {list.slice(0, 80).map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick({ en: t.en, ipa: t.ipa, vi: t.vi });
                      onOpenChange(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-paper"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="text-en block font-semibold">
                        {t.en} <span className="font-normal text-ink-2">{t.ipa}</span>
                      </span>
                      <span className="text-vi block text-sm">{t.vi}</span>
                    </span>
                    <span className="text-xs text-ink-2">Lớp {t.grade}</span>
                    {t.status !== "approved" && <span className="rounded-full bg-sun-soft px-2 py-0.5 text-[10px] font-bold text-[#8A5A00]">Chờ duyệt</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
      <TermFormDialog
        open={creating}
        onOpenChange={setCreating}
        grade={grade}
        onSaved={(t) => {
          onPick({ en: t.en.trim(), ipa: t.ipa.trim(), vi: t.vi.trim() });
          onOpenChange(false);
        }}
      />
    </>
  );
}
