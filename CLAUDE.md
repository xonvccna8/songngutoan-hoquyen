# Toán 8 Song Ngữ — hướng dẫn cho Claude Code

Web giúp **học sinh lớp 8 tự học Toán song ngữ Việt–Anh** (sách Kết nối tri thức). Không có phần giáo viên / quản trị. Người dùng là học sinh lớp 8, không phải lập trình viên: giải thích ngắn, thân thiện, bằng tiếng Việt, hướng dẫn từng bước khi cần thao tác (Vercel, cài đặt…).

## Công nghệ (cố định)
Next.js App Router + TypeScript + Tailwind + shadcn/ui + lucide-react + Recharts · **Không máy chủ, không đăng nhập, không Firebase**: tiến độ lưu `localStorage` trên máy (có xuất/nhập tệp JSON để chuyển máy) · PWA học được khi mất mạng · Deploy Vercel. Bản cũ có phần giáo viên + Firebase nằm ở tag git `ban-co-giao-vien`.

## Tài liệu (CHỈ đọc file cần cho việc đang làm)
- `docs/GIAI-DOAN.md` — các giai đoạn, việc tiếp theo, cách thêm bài mới
- `docs/TINH-NANG.md` — đặc tả chức năng
- `docs/GIAO-DIEN.md` — màu, phông, thành phần giao diện

## Cấu trúc chính
- `src/lib/content/` — nội dung bài (`lessons/*.ts`), kiểu dữ liệu, bộ sinh câu hỏi, chấm điểm
- `src/lib/progress/` — tiến độ: hàm thuần (`logic.ts`, `srs.ts`) + kho localStorage (`store.ts`)
- `src/lib/curriculum/` — mục lục + yêu cầu cần đạt Toán 6–9 (lớp 8 đầy đủ)
- `src/lib/algebra/poly.ts` — bộ máy đa thức: đọc biểu thức em gõ, rút gọn, so sánh, kiểm tra dạng (đáp án Đại số luôn tính bằng bộ máy này qua `src/lib/content/alg.ts`)
- `src/lib/speech/` — đọc mẫu & chấm phát âm (Web Speech API, không lưu ghi âm)
- `src/app/` — `/` · `/hoc` · `/hoc/[bai]` · `/hoc/[bai]/[buoc]` · `/on-tap` · `/cong-cu` · `/cua-em`
- `tests/` — vitest (nội dung + tiến độ)

## Quy tắc làm việc
1. Mỗi lần làm MỘT việc / một giai đoạn. Đầu việc lớn: nêu kế hoạch ngắn (≤15 dòng), chờ đồng ý rồi mới code.
2. Không đọc file không liên quan; không quét toàn bộ dự án khi không cần.
3. Cuối việc: chạy `npm test`, `npx eslint src tests`, `npm run build`; báo cáo ≤10 dòng: đã làm gì, cách thử, việc người dùng cần làm.
4. Nội dung Toán phải đúng SGK và có test kiểm đáp án (mọi câu tự sinh chạy qua `tests/content.test.ts`).
5. Giao diện tiếng Việt; nội dung bài song ngữ (tiếng Anh màu nhấn chữ thẳng, tiếng Việt xám nghiêng). Câu hỏi từ vựng: phương án chỉ ghi tiếng Anh (tránh lộ đáp án).
6. Riêng tư (người dùng dưới 18 tuổi): không thu thập gì; chỉ lưu trên máy tên gọi tuỳ chọn + tiến độ; không lưu ghi âm; không gửi dữ liệu đi đâu.
7. Mã chia module nhỏ; chú thích tiếng Việt ở chỗ quan trọng.

## Compact instructions
Khi compact, giữ lại: việc đang làm, quyết định kiến trúc, cấu trúc thư mục, lỗi chưa sửa. Bỏ nội dung file đã đọc.
