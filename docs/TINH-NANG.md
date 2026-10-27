# Đặc tả chức năng — Toán 8 Song Ngữ

Người dùng: học sinh lớp 8 tự học (ở nhà, trên điện thoại hoặc máy tính; Wi-Fi có thể yếu). Không đăng nhập; tiến độ lưu trên máy.

## §1. Trang chủ `/`
Lời chào (tên gọi tuỳ chọn, chỉ lưu trên máy) · vòng mục tiêu ngày (50 XP) · thẻ "Học tiếp" (bài + bước kế tiếp) · số việc cần ôn · các thẻ bài của Chương III · câu tiếng Anh hôm nay có nút nghe.

## §2. Bản đồ học `/hoc`
10 chương Toán 8 (Kết nối tri thức), màu theo mạch (Số–Đại số / Hình học / Thống kê–Xác suất). Bài có nội dung: % hoàn thành + sao; bài khác: "Sắp có".

## §3. Một bài `/hoc/[bai]` — 5 bước
1. **Từ vựng**: thẻ lật (EN + IPA + nghe thường/chậm → nghĩa VI + câu ví dụ), tự đánh giá Chưa nhớ/Khó/Nhớ/Dễ (ôn lặp ngắt quãng) + trò chơi nhanh 4 câu.
2. **Hiểu bài**: từng phần: định nghĩa / định lí (khung màu, nghe được), danh sách, hình vẽ, **hình kéo thả** (tứ giác: tổng góc 360°; hình thang cân: góc kề đáy, cạnh bên, đường chéo; hình bình hành: cạnh, góc, đường chéo; hình chữ nhật: đường chéo bằng nhau; hình thoi: đường chéo vuông góc, kéo hai đường chéo bằng nhau → hình vuông), ví dụ giải từng bước (em nghĩ trước rồi mới mở), câu kiểm tra nhanh.
3. **Luyện tập**: 3 mức (Nhận biết / Thông hiểu / Vận dụng); câu soạn sẵn trước, hết thì máy sinh câu mới không giới hạn; gợi ý 3 tầng (Từ vựng → Cách làm → Lời giải); đúng 6 câu là xong bước.
4. **Luyện nói**: 5 câu Toán tiếng Anh; nghe mẫu → bấm micro → chấm từng từ (xanh / đỏ gạch sóng) và điểm 0–100; 3 câu ≥ 70 điểm là xong. Trình duyệt không hỗ trợ nhận giọng: tự xác nhận đã đọc.
5. **Kiểm tra**: 5 câu (1 từ vựng + mức 1 + 2 câu mức 2 + mức 3); 3/5 qua bài, 4/5 = 2 sao, 5/5 = 3 sao.

Kiểu câu hỏi: trắc nghiệm 4 ô (màu + hình), đúng/sai, nhập số (chấp nhận "6,5", "70°"; nút ± cho số âm), gõ thuật ngữ (cho sai chính tả nhẹ), **gõ biểu thức** (`src/lib/algebra/poly.ts`: gõ x^2, x2 hoặc x²; phím nhanh x y ² ³ ( ) + − ·; xem trước dạng đẹp; chấm theo giá trị + dạng yêu cầu: khai triển / thu gọn / dạng tích phân tích triệt để; sai dạng thì có lời nhắc). Mỗi câu gắn **mức** và **loại lỗi** (Toán / Ngôn ngữ).

## §4. Ôn tập thông minh `/on-tap`
- Thẻ từ đến hạn theo lịch SM-2 rút gọn.
- **Sổ lỗi sai**: mọi câu làm sai (trừ câu kiểm tra nhanh) vào sổ, tách lỗi Toán / Ngôn ngữ; làm lại đúng 2 lần liên tiếp thì rời sổ (tối đa 60 câu).

## §5. Góc công cụ `/cong-cu`
Tóm tắt kiến thức từng bài · từ điển thuật ngữ (tìm không cần dấu, có phát âm) · cách đọc kí hiệu Toán bằng tiếng Anh (∥, ⊥, ∠, ⇔…).

## §6. Của em `/cua-em`
Chỉ số (XP, chuỗi ngày, tỉ lệ đúng, từ đã thuộc) · biểu đồ XP 14 ngày · "Em hay sai ở đâu" (Toán vs Ngôn ngữ) + lời khuyên · 9 huy hiệu · chọn ngôn ngữ hiển thị (Song ngữ / EN / VI) · cài ứng dụng · tải / nhập tệp sao lưu · xoá tiến độ.

## §7. Điểm XP
Đúng +10 (dùng ≥ 2 gợi ý: +5) · xong một bước +20 (một lần) · ôn thẻ +2 · câu nói lần đầu ≥ 80 điểm +10 · mỗi sao mới ở bài kiểm tra +20.

## §8. Riêng tư & ngoại tuyến
Không tài khoản, không máy chủ, không gửi dữ liệu. Không lưu ghi âm (nhận giọng nói do trình duyệt xử lý). Service worker lưu sẵn trang để học khi mất mạng.
