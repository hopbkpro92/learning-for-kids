# Voice spike — giọng đọc tiếng Việt trên máy thật

Mục đích: xác nhận giọng máy tiếng Việt (SpeechSynthesis) phát tốt trên điện thoại của mẹ, trước khi quyết phần âm thanh nói (spec mục 8).

## Cách thực hiện (thủ công, 5 phút)

1. Trên máy tính: `npm run dev` — lấy địa chỉ LAN (vd `http://192.168.1.x:5173`).
2. Điện thoại (cùng wifi) mở Chrome Android và Safari iOS truy cập địa chỉ đó.
3. Chạm màn hình một lần (mở khoá audio trên iOS), rồi kiểm tra phần «Chào bé» khi vào màn nhà (màn nhà xuất hiện ở Task 4).

## Cần ghi lại

| Trình duyệt / máy | Có giọng tiếng Việt không | Chất lượng (nghe tự nhiên không) | Chú thích |
|---|---|---|---|
| Chrome Android — điện thoại của mẹ | ? | ? | |
| Safari iOS — iPhone của mẹ | ? | ? | |

## Phương án nếu giọng không đạt

- Thu sẵn các cụm dùng lại nhiều (khen, hướng dẫn, đọc số 1–10) thành file âm thanh và đóng gói vào app (spec mục 8, phương án đã có sẵn).
- Câu sinh động mới dùng giọng máy như hiện tại.

## Trạng thái hiện tại

- [x] Code giọng nói hoạt động ở môi trường test (mock).
- [ ] Xác nhận trên điện thoại thật — **chờ phần test cố boa (bảng trên) sau khi phần HomeScene chạy được**.
