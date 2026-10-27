# Toán 8 Song Ngữ

Web tự học **Toán lớp 8 song ngữ Việt – Anh** (sách Kết nối tri thức) cho học sinh. Không đăng nhập, không máy chủ: tiến độ lưu ngay trên máy, học được cả khi mất mạng.

Nội dung hiện có: **Chương I Đa thức** (bài 1–5: đơn thức, đa thức, cộng trừ, nhân, chia) và **Chương III Tứ giác** (bài 10–14). Câu Đại số cho gõ biểu thức (ví dụ `x^2 - 4`), máy chấm theo giá trị và theo dạng (đã phá ngoặc, đã thu gọn, dạng tích). Mỗi bài 5 bước: Từ vựng → Hiểu bài (có hình kéo thả) → Luyện tập 3 mức (câu tự sinh không giới hạn, gợi ý 3 tầng) → Luyện nói (chấm phát âm) → Kiểm tra 5 câu. Thêm: Ôn tập thông minh (thẻ từ lặp ngắt quãng + sổ lỗi sai Toán/Ngôn ngữ), Góc công cụ, trang Của em (XP, chuỗi ngày, huy hiệu, biểu đồ).

Chi tiết: `docs/TINH-NANG.md` · hướng dẫn dùng: `HUONG_DAN_HOC_SINH.md` · kế hoạch & cách thêm bài: `docs/GIAI-DOAN.md`.

## Chạy trên máy
Cần Node.js 24.

```bash
npm install
npm run dev
```

Mở http://localhost:3000. Không cần tệp `.env.local` hay khóa bí mật nào.

## Kiểm tra trước khi đưa lên mạng
```bash
npm test
npx eslint src tests
npm run build
```

## Đưa lên mạng (Vercel)
1. Đưa thư mục lên GitHub (kho riêng tư cũng được).
2. Vào vercel.com → **Add New… → Project** → chọn kho → **Deploy** (không cần điền biến môi trường).
3. Mỗi lần đẩy mã mới lên GitHub, Vercel tự cập nhật.

## Bản cũ có phần giáo viên
Đã lưu trong git, nhãn `ban-co-giao-vien` (`git checkout ban-co-giao-vien` để xem).
