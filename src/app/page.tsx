import Link from "next/link";
import { ArrowRight, BarChart3, BellRing, ChevronRight, Languages, MonitorPlay, Smartphone, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Tam } from "@/components/brand/tam";
import { FloatingShapes, SHAPE_COLORS, ShapeIcon, type ShapeKind } from "@/components/brand/shapes";
import { cn } from "cn";

const ANSWERS: { kind: ShapeKind; en: string }[] = [
  { kind: "triangle", en: "sides" },
  { kind: "diamond", en: "angles" },
  { kind: "circle", en: "vertices" },
  { kind: "square", en: "heights" },
];

const FEATURES = [
  {
    icon: MonitorPlay,
    color: "bg-blue",
    title: "Một nút Tiếp cho cả tiết",
    en: "One button runs the lesson",
    text: "Hiện từng bước, mở câu hỏi, khoá, công bố đáp án — bằng phím Space hay bút trình chiếu.",
  },
  {
    icon: Smartphone,
    color: "bg-coral",
    title: "Tivi · Laptop · Điện thoại",
    en: "Three screens in sync",
    text: "Điện thoại học sinh hiện đúng nội dung trên tivi, tự chuyển sang chế độ trả lời khi câu hỏi mở.",
  },
  {
    icon: Languages,
    color: "bg-teal",
    title: "Song ngữ có phát âm",
    en: "Bilingual, with pronunciation",
    text: "Bảng thuật ngữ, câu mẫu kèm nút nghe; giáo viên Toán không cần giỏi tiếng Anh vẫn dạy tự tin.",
  },
  {
    icon: BarChart3,
    color: "bg-sun",
    title: "Theo dõi từng em",
    en: "Every student, in real time",
    text: "Ai đang học, ai rời trang, đúng sai phần Toán hay phần Ngôn ngữ — thấy ngay trên laptop.",
  },
];

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden">
      {/* Thanh trên */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
            Giáo viên
          </Link>
          <Link href="/s/login" className={buttonVariants({ variant: "ink", size: "sm" })}>
            Vào lớp <ArrowRight />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <FloatingShapes />
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-6 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-2">
              <span className="size-2 rounded-full bg-teal" /> Toán THCS · Song ngữ Việt – Anh
            </span>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.2rem]">
              Mỗi tiết Toán,{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">thêm một</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded-full bg-sun/70 sm:h-5" />
              </span>{" "}
              tiết tiếng Anh.
            </h1>
            <p className="text-en mt-4 font-display text-xl font-semibold sm:text-2xl">Learn maths. Speak English.</p>
            <p className="mt-4 max-w-xl text-base text-ink-2 sm:text-lg">
              Lớp Song Ngữ giúp thầy cô dạy trực tiếp trên tivi, học sinh trả lời bằng điện thoại, và mọi kết quả được lưu
              lại để theo dõi tiến bộ của từng em.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/s/login" className={buttonVariants({ variant: "sun", size: "xl" })}>
                Em là học sinh — Vào lớp <ArrowRight />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "xl" })}>
                Thầy cô đăng nhập
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm font-semibold text-ink-2">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-teal" /> Không cần email cho học sinh
              </span>
              <span className="hidden items-center gap-1.5 sm:flex">
                <BellRing className="size-4 text-coral" /> Nhắc chú ý 1 chạm
              </span>
            </div>
          </div>

          {/* Mô phỏng tivi + điện thoại */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="rounded-[28px] bg-ink-tv p-3 shadow-[0_30px_60px_-20px_rgba(28,27,58,.55)] ring-1 ring-white/10">
              <div className="rounded-[20px] bg-gradient-to-b from-[#232259] to-ink-tv p-5 font-present sm:p-7">
                <div className="flex items-center justify-between text-white/70">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Câu 3 / 8</span>
                  <span className="flex items-center gap-2 text-xs font-semibold">
                    <span className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span key={i} className={cn("size-1.5 rounded-full", i < 7 ? "bg-sun" : "bg-white/20")} />
                      ))}
                    </span>
                    21/30
                  </span>
                </div>
                <p className="mt-5 text-xl leading-snug font-semibold text-white sm:text-2xl">
                  An isosceles triangle has two equal <span className="rounded-md bg-sun px-1.5 text-ink">____</span>.
                </p>
                <p className="mt-1.5 text-sm text-white/55 italic">Tam giác cân có hai ____ bằng nhau.</p>
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                  {ANSWERS.map((a) => {
                    const c = SHAPE_COLORS[a.kind];
                    return (
                      <div
                        key={a.kind}
                        className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3 font-semibold sm:py-4"
                        style={{ background: c.bg, color: c.text, boxShadow: `0 5px 0 ${c.dk}` }}
                      >
                        <ShapeIcon kind={a.kind} color={c.text} className="size-5 opacity-90" />
                        {a.en}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mx-auto h-4 w-28 rounded-b-xl bg-ink-tv/80" />

            {/* Điện thoại HS + thẻ laptop GV, nằm dưới tivi để không che nội dung */}
            <div className="relative z-10 -mt-10 flex items-end justify-between gap-4 px-2 sm:px-6">
              <div className="w-[160px] rotate-[-5deg] rounded-[30px] bg-ink p-2 shadow-2xl sm:w-[180px]">
                <div className="flex flex-col items-center rounded-[24px] bg-success-bg px-3 pt-4 pb-4 text-center">
                  <Tam mood="cheer" className="size-14" />
                  <p className="mt-1 font-display text-lg font-extrabold text-success-fg">Correct!</p>
                  <p className="text-vi text-xs">Chính xác!</p>
                  <p className="mt-2 rounded-full bg-white px-3 py-1 font-display text-sm font-extrabold text-ink shadow-[0_3px_0_#cfeee0]">
                    +142 XP
                  </p>
                </div>
              </div>

              <div className="hidden w-56 rotate-[3deg] rounded-2xl border-2 border-line bg-white p-3 shadow-xl sm:block">
                <p className="text-xs font-bold text-ink-2">Lớp 7A · đang học</p>
                <div className="mt-2 space-y-1.5 text-xs font-semibold">
                  <p className="flex items-center justify-between rounded-lg bg-teal-soft px-2 py-1 text-[#0A6F5F]">
                    Đang theo dõi <b>24</b>
                  </p>
                  <p className="flex items-center justify-between rounded-lg bg-blue-soft px-2 py-1 text-blue-dk">
                    Đã trả lời <b>21</b>
                  </p>
                  <p className="flex items-center justify-between rounded-lg bg-coral-soft px-2 py-1 text-[#A3301B]">
                    Rời trang <b>2</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tính năng */}
      <section className="relative border-t-2 border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Dạy song ngữ, nhẹ như một cú bấm</h2>
            <p className="text-en mt-2 font-display text-lg font-semibold">Built for real classrooms — TV, laptop and phones.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-lsn group p-5 transition-transform hover:-translate-y-1">
                <span className={cn("inline-flex size-12 items-center justify-center rounded-2xl text-white shadow-[inset_0_-4px_0_rgba(0,0,0,.18)]", f.color)}>
                  <f.icon className={cn("size-6", f.color === "bg-sun" && "text-ink")} />
                </span>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="text-en text-sm font-semibold">{f.en}</p>
                <p className="mt-2 text-sm text-ink-2">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kêu gọi */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-10 text-white sm:px-12">
          <FloatingShapes tone="dark" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <Tam mood="happy" className="hidden size-24 shrink-0 sm:block" />
              <div>
                <h2 className="text-2xl font-extrabold sm:text-3xl">Sẵn sàng cho tiết học đầu tiên?</h2>
                <p className="mt-1 text-white/70">Tạo lớp, dán danh sách từ Excel, in phiếu PIN — chưa tới 5 phút.</p>
              </div>
            </div>
            <Link href="/login" className={buttonVariants({ variant: "sun", size: "lg" })}>
              Bắt đầu ngay <ChevronRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-line py-6 text-center text-sm text-ink-2">
        © {new Date().getFullYear()} Lớp Song Ngữ · Dạy và học Toán song ngữ cho THCS
      </footer>
    </main>
  );
}
