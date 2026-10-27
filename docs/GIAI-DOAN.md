# Các giai đoạn

| GĐ | Làm gì | Trạng thái |
|---|---|---|
| A | Bỏ phần giáo viên / quản trị / Firebase; khung web học sinh lưu trên máy; 5 bước học; ôn tập; công cụ; trang Của em; PWA ngoại tuyến | Xong (27/10/2026) |
| B | Nội dung chủ đề **Tứ giác – Hình bình hành – Hình chữ nhật** (bài 10, 12, 13) | Xong (27/10/2026) |
| C | Hoàn thiện Chương III: Hình thang cân (bài 11), Hình thoi và hình vuông (bài 14) + hình kéo thả tương ứng | Xong (27/10/2026) |
| D1 | Bộ máy đa thức (đọc, rút gọn, chấm dạng) + câu gõ biểu thức + Chương I Đa thức (bài 1–5) | Xong (28/10/2026) |
| D2 | Chương II Hằng đẳng thức (bài 6–9) + mô hình diện tích + bảng 7 hằng đẳng thức | Xong (28/10/2026) |
| E1 | Chương IV Định lí Thalès (bài 15–17) + Chương V Dữ liệu và biểu đồ (bài 18–20); biểu đồ cột/quạt/đoạn thẳng trong câu hỏi; hình kéo thả Thalès | Xong (28/10/2026) |
| E2 | Chương VI Phân thức đại số (bài 21–24): mở rộng bộ máy để chấm phân thức | Tiếp theo |
| E3 | Chương VII Phương trình bậc nhất và hàm số bậc nhất (bài 25–29) + đồ thị kéo thả | Sau |
| E4 | Chương VIII Xác suất, IX Tam giác đồng dạng, X Hình khối (bài 30–39) | Sau |
| E5 | Đề ôn giữa kì / cuối kì tự sinh, có đồng hồ | Sau |
| F | Deploy Vercel, thử trên điện thoại thật, README hoàn chỉnh | Khi sẵn sàng |

## Cách thêm một bài mới
1. Tạo `src/lib/content/lessons/<ten-bai>.ts` theo mẫu `hinh-binh-hanh.ts`: `id` trùng mã bài trong `src/lib/curriculum/kntt.ts` (ví dụ `k8-11`), `slug`, thuật ngữ (≥ 8, có IPA), các phần lý thuyết, câu soạn sẵn, **bộ sinh câu cho đủ 3 mức**, 5 câu luyện nói, tóm tắt.
2. Thêm bài vào mảng `LESSONS` trong `src/lib/content/index.ts`.
3. Chạy `npm test` — test tự kiểm mọi câu tự sinh (300 lần mỗi bộ) có đáp án hợp lệ.
4. Hình kéo thả mới: thêm chế độ trong `src/components/geo/playground.tsx`.
