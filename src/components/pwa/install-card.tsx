"use client";

// Thẻ "Cài ứng dụng". Android/Chrome: nút cài ngay. iPhone: hướng dẫn "Thêm vào MH chính"
// (mở nhanh, học được cả khi mất mạng). Đã cài hoặc đã ẩn thì không hiện.
import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const HIDE_KEY = "lsn:installHide";
const noop = () => () => {};
const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const wasHidden = () => {
  try {
    return localStorage.getItem(HIDE_KEY) === "1";
  } catch {
    return false;
  }
};

export function InstallCard() {
  // Đọc môi trường trình duyệt (máy chủ luôn coi như "không hiện" để tránh lệch khi hiển thị)
  const env = useSyncExternalStore(noop, () => (isStandalone() || wasHidden() ? "off" : isIos() ? "ios" : "other"), () => "off");
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const done = () => setClosed(true);
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", done);
    return () => {
      window.removeEventListener("beforeinstallprompt", h);
      window.removeEventListener("appinstalled", done);
    };
  }, []);

  const hide = () => {
    try {
      localStorage.setItem(HIDE_KEY, "1");
    } catch {}
    setClosed(true);
  };

  if (closed || env === "off" || (env === "other" && !evt)) return null;

  return (
    <section className="px-5 pt-5">
      <div className="card-lsn relative flex items-start gap-3 p-4">
        <LogoMark className="size-11 shrink-0" />
        <div className="min-w-0 flex-1 text-sm">
          <b className="block text-base">Cài “Toán 8 Song Ngữ” lên điện thoại</b>
          {env === "ios" ? (
            <ol className="mt-1 space-y-1 text-ink-2">
              <li className="flex items-center gap-1.5">
                1. Mở trang này bằng <b>Safari</b>, bấm nút <Share className="inline size-4 text-blue" /> Chia sẻ
              </li>
              <li className="flex items-center gap-1.5">
                2. Chọn <SquarePlus className="inline size-4 text-blue" /> <b>Thêm vào MH chính</b>
              </li>
              <li>3. Mở ứng dụng từ biểu tượng mới để nhận chuông khi thầy cô nhắn tin.</li>
            </ol>
          ) : (
            <>
              <p className="mt-0.5 text-ink-2">Mở nhanh như ứng dụng, học được cả khi mất mạng.</p>
              <button
                onClick={async () => {
                  await evt!.prompt();
                  const r = await evt!.userChoice;
                  if (r.outcome === "accepted") setClosed(true);
                  setEvt(null);
                }}
                className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-blue px-4 font-bold text-white shadow-[0_4px_0_var(--color-blue-dk)] active:translate-y-[3px] active:shadow-none"
              >
                <Download className="size-4" /> Cài ứng dụng
              </button>
            </>
          )}
        </div>
        <button onClick={hide} className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-2 hover:bg-paper" aria-label="Ẩn hướng dẫn cài đặt">
          <X className="size-4" />
        </button>
      </div>
    </section>
  );
}
