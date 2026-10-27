# Các giai đoạn

| GĐ | Làm gì | Trạng thái |
|---|---|---|
| A | Bỏ phần giáo viên / quản trị / Firebase; khung web học sinh lưu trên máy; 5 bước học; ôn tập; công cụ; trang Của em; PWA ngoại tuyến | Xong (27/10/2026) |
| B | Nội dung chủ đề **Tứ giác – Hình bình hành – Hình chữ nhật** (bài 10, 12, 13) | Xong (27/10/2026) |
| C | Hoàn thiện Chương III: Hình thang cân (bài 11), Hình thoi và hình vuông (bài 14) + hình kéo thả tương ứng | Tiếp theo |
| D | Chương I–II: Đa thức, Hằng đẳng thức (nhiều bộ sinh câu Đại số) | Sau |
| E | Các chương còn lại; đề ôn giữa kì / cuối kì tổng hợp nhiều bài | Sau |
| F | Deploy Vercel, thử trên điện thoại thật, README hoàn chỉnh | Khi sẵn sàng |

## Cách thêm một bài mới
1. Tạo `src/lib/content/lessons/<ten-bai>.ts` theo mẫu `hinh-binh-hanh.ts`: `id` trùng mã bài trong `src/lib/curriculum/kntt.ts` (ví dụ `k8-11`), `slug`, thuật ngữ (≥ 8, có IPA), các phần lý thuyết, câu soạn sẵn, **bộ sinh câu cho đủ 3 mức**, 5 câu luyện nói, tóm tắt.
2. Thêm bài vào mảng `LESSONS` trong `src/lib/content/index.ts`.
3. Chạy `npm test` — test tự kiểm mọi câu tự sinh (300 lần mỗi bộ) có đáp án hợp lệ.
4. Hình kéo thả mới: thêm chế độ trong `src/components/geo/playground.tsx`.
