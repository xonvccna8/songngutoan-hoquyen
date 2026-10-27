"use client";

// Giọng đọc mẫu (speechSynthesis) & chấm phát âm (Web Speech API).
// PronunciationScorer là interface để GĐ 6 thay bằng Azure Pronunciation Assessment (/api/speech/assess).
// Không lưu ghi âm: chỉ gửi điểm + câu nhận dạng được.
import { scoreSpeech, type SpeechResult } from "@/lib/live/grading";

export function say(text: string, rate = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  const voices = speechSynthesis.getVoices();
  const v = voices.find((x) => /en(-|_)US/i.test(x.lang)) ?? voices.find((x) => /^en/i.test(x.lang));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

export type SpeechError = "unsupported" | "not-allowed" | "network" | "no-speech" | "busy";

export interface PronunciationScorer {
  readonly supported: boolean;
  /** Bắt đầu nghe; trả về hàm dừng */
  start(target: string, done: (r: SpeechResult) => void, fail: (e: SpeechError) => void): () => void;
}

type SR = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start(): void;
  stop(): void;
};

export class WebSpeechScorer implements PronunciationScorer {
  private Ctor = typeof window !== "undefined"
    ? ((window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition)
    : undefined;

  get supported() {
    return !!this.Ctor;
  }

  start(target: string, done: (r: SpeechResult) => void, fail: (e: SpeechError) => void) {
    if (!this.Ctor) {
      fail("unsupported");
      return () => {};
    }
    const r = new this.Ctor();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 3;
    let finished = false;
    r.onresult = (e) => {
      if (finished) return;
      finished = true;
      const res = e.results[0];
      const alts = Array.from({ length: res.length }, (_, i) => ({ t: res[i].transcript, c: res[i].confidence }));
      const best = scoreSpeech(target, alts);
      if (best) done(best);
      else fail("no-speech");
    };
    r.onerror = (e) => {
      if (finished) return;
      finished = true;
      fail(e.error === "not-allowed" || e.error === "service-not-allowed" ? "not-allowed" : e.error === "network" ? "network" : "no-speech");
    };
    r.onend = () => {
      if (finished) return;
      finished = true;
      fail("no-speech");
    };
    try {
      r.start();
    } catch {
      finished = true;
      fail("busy");
    }
    return () => {
      try {
        r.stop();
      } catch {}
    };
  }
}

export const SPEECH_ERRORS: Record<SpeechError, string> = {
  unsupported: "Trình duyệt này chưa hỗ trợ nhận giọng nói. Hãy mở bằng Chrome (Android) hoặc Safari mới.",
  "not-allowed": "Em cần cho phép trang web dùng micro rồi bấm lại.",
  network: "Nhận giọng nói cần mạng Internet. Kiểm tra kết nối rồi thử lại.",
  "no-speech": "Máy chưa nghe rõ. Đưa điện thoại gần miệng và đọc to hơn nhé.",
  busy: "Micro đang bận, thử lại sau giây lát.",
};
