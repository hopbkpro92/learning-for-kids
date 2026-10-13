# Bản thiết kế — «Bầu trời tí hon»

App web học tập – vui chơi cho bé mầm non (trọng tâm: bé gái 3 tuổi của gia đình).

## 1. Ý định và lý do

Xây một web application vui nhộn, bắt mắt để bé học tập và vui chơi. Người dùng chính là bé gái 3 tuổi; sau này mở rộng tự nhiên cho mầm non 3–5 tuổi. Bé thích xếp hình, hát các bài hát thiếu nhi, tập đếm; thỉnh thoảng đòi bật lại phim hoạt hình trên YouTube, chưa từng dùng ứng dụng học nào.

**Thiết bị:** chủ yếu trên điện thoại của mẹ (màn hình dọc, điều khiển bằng ngón tay), thỉnh thoảng máy tính bảng và laptop.

**Bối cảnh chơi:** phần lớn bố mẹ ngồi cạnh hướng dẫn, nhưng app phải an toàn tuyệt đối cho những lúc bé tự mò một mình — không chữ bắt buộc đọc, không nút thoát ra ngoài, không quảng cáo, không nội dung lạ.

## 2. Thành công và thất bại

**Sau khoảng 1 tháng dùng, thành công là:**
- Bé tập trung chơi lâu hơn — trong khung giờ chơi app cho phép, không phải «càng lâu càng tốt».
- Bé thuộc thêm nhiều bài hát.
- Bé chơi vui hơn, đòi bật lại app.
- Bé lượm được kiến thức trong khi chơi (kiến thức lồng sẵn vào từng cửa chơi).

**Thất bại là:**
- Bé bám màn hình quá lâu — app tự chặn bằng «giờ nghỉ», mẹ không phải làm cảnh sát màn hình.
- Bé chán nản, thoát ra ngoài và không muốn chơi nữa — chống bằng đổi hoạt động, phần thưởng nhanh, độ khó nhích chậm, kết lượt hé điều mới.

## 3. Mục tiêu / Không mục tiêu / Chống mục tiêu

**Mục tiêu:**
- Màn nhà là một «thế giới» — bầu trời ban ngày, thảm cỏ, nhân vật chú thỏ **Bunny** (tên tạm) chào bé bằng giọng tiếng Việt.
- 7 «cửa chơi» lớn, vừa ngón tay bé: Xếp hình, Ca hát, Đếm số, Vẽ tay tự do, Nhạc cụ bé gõ, Sắp vào giỏ, Ai là ai.
- Hoàn toàn tiếng Việt, hướng dẫn bằng giọng đọc + hình nét to, không phụ thuộc đọc chữ.
- Sau lần tải đầu, dùng tốt offline (PWA + service worker + cache tài nguyên).
- Lưu tiến độ trên máy (localStorage/IndexedDB): sao đã đạt, cửa chơi đã mở, tranh của bé. Không tài khoản, không đăng nhập.

**Không mục tiêu:** đa ngôn ngữ ngoài tiếng Việt; nhiều hồ sơ trẻ; phân tích dữ liệu người dùng; nhúng video YouTube; thu âm giọng gia đình; kiếm tiền bằng mọi hình thức.

**Chống mục tiêu:** quảng cáo hoặc liên kết thoát ra ngoài; lượt nối lượt không dừng, chạy dài vô tận không có điểm nghỉ; thông báo để kéo bé mở app.

## 4. Cảm xúc hình ảnh (đã chọn phương án C — «Bầu trời tí hon»)

- Bầu trời xanh nhạt gradient, mây, mặt trời nhỏ; thảm cỏ dưới; nhân vật nhỏ trong thế giới ngoài trời rộng rãi.
- Font chữ tròn thân thiện hỗ trợ đầy đủ dấu tiếng Việt (hướng font như **Baloo 2**); người xây chốt font cuối.
- Khối to, bo tròn, màu kẹo; nút cảm ứng tối thiểu ~64dp chiều cao.
- Bunny xuất hiện khắp app: chào, dẫn, khen, nhắc nghỉ — một nhân vật duy nhất cho sự quen thuộc.
- **Hình minh họa sinh động là yêu cầu của bố mẹ:** con vật, đồ vật, khung cảnh dùng tranh vẽ/bộ hình minh họa tròn trịa nhiều chi tiết vui — không dùng emoji làm hình chính thức trong app (emoji chỉ là chỗ dựa trong bản phác thảo). Mỗi cửa chơi và mỗi nhân vật đều có tranh riêng.

## 5. Bảy cửa chơi

Mỗi cửa chơi ngắn (mục tiêu 2–3 phút/lượt), xong có khen ồn ào (âm thanh, sao, hiệu ứng). Một lượt chơi xoay vòng qua các cửa cho đổi vị, không cho lặp một cửa liên tục.

1. **Xếp hình (🧩)** — kéo thả mảnh ghép vào chỗ. Kiến thức gắn: hình dạng, con vật quen thuộc. Độ khó nhích rất chậm: 2–3 mảnh lên 4–6 mảnh.
2. **Ca hát (🎵)** — thư viện bài hát mầm non, bé chạm để nghe; lời hát hiển thị chữ to để bố mẹ đọc cùng nếu muốn. Kiến thức gắn: ngôn ngữ, giai điệu, thói quen sinh hoạt trong lời hát.
3. **Đếm số (🔢)** — chạm chọn con số đúng theo câu hỏi có tranh («có mấy con vịt?»). Kiến thức gắn: đếm 1–5 rồi 1–10, có giọng đọc số.
4. **Vẽ tay tự do (🎨)** — ngón tay chấm màu vẽ, Bunny khen từng nét; «tác phẩm» lưu trên máy. Kiến thức gắn: màu sắc + sáng tạo thuần.
5. **Nhạc cụ bé gõ (🥁)** — chạm trống/chuông/kèn phát âm thanh thật; chế độ gõ theo nhịp đi kèm bài hát. Kiến thức gắn: nhịp, âm sắc.
6. **Sắp vào giỏ (🧺)** — kéo thả vào giỏ đúng (màu / hình dạng / loại đồ). Kiến thức gắn: phân loại, bước nền tư duy.
7. **Ai là ai? (🐄)** — Bunny hỏi («Con gì kêu meo meo?»), bé chạm đúng, nghe tên gọi + tiếng kêu. Kiến thức gắn: từ vựng tiếng Việt.

## 6. Luồng chơi và «giờ nghỉ»

- Mở app → màn nhà với Bunny; chậm rãi, không bắt bấm gì ngay.
- Chọn cửa chơi → chơi 2–3 phút → khen → về nhà hoặc qua cửa khác (app gợi ý cửa khác để đổi vị).
- **Giờ nghỉ:** sau tổng ~15–20 phút chơi, Bunny ngừng trò, mời nghỉ: màn hình sang đêm, nhạc ru êm, đồng hồ cát đếm nghỉ (~2–5 phút). Lúc nghỉ không bấm qua được; hết nghỉ app tự về màn nhà.
- **Kết lượt hé điều mới:** mỗi lần nghỉ (hoặc mẹ chủ động dừng), app hé một điều cụ thể hôm sau (bài hát mới / cảnh mới / vật mới) — như tập tiếp theo của bộ phim.

## 7. Thứ tự xây (một thiết kế, hai đợt bàn giao)

- **Đợt 1 — bản dùng được sớm:** khung thế giới + màn nhà + Bunny + 3 cửa đầu (Xếp hình, Ca hát, Đếm số) + luồng khen + giờ nghỉ + lưu tiến độ + offline + triển khai (GitHub Pages & Vercel).
- **Đợt 2 — lãnh thổ mới:** Vẽ tay, Nhạc cụ, Sắp vào giỏ, Ai là ai; cùng cơ chế «hé điều mới» theo tiến độ.

Cùng một bản thiết kế; thứ tự chỉ để app dùng sớm được, không chờ cả 7 cửa.

## 8. Âm thanh và tiếng Việt

- **Giọng máy tiếng Việt (rủi ro cần thử sớm):** lời dẫn dùng giọng đọc máy tiếng Việt. Trình duyệt có SpeechSynthesis nhưng chất lượng và danh sách giọng tuỳ máy. Chiến lược: (a) thử sớm trên máy của mẹ để nghe chất lượng thực tế; (b) với cụm dùng lại nhiều (khen, hướng dẫn, đọc số 1–10), ghi âm sẵn từ giọng TTS chất lượng tốt rồi đóng gói vào app — giọng máy thời gian thực chỉ phát các câu sinh động mới. Rủi ro được nhìn nhận ngay từ đầu và có phương án.
- **Thư viện bài hát:** các bài mầm non quen thuộc 3–5 tuổi có nhạc điệu thuộc công cộng (thiếu nhi truyền thống, ví dụ «Con vịt», «Cả nhà thương nhau»...), tự dàn hòa âm thu vào app — không sao chép âm thanh có bản quyền của bên khác. Danh sách bài cụ thể do người xây đề xuất, mẹ nghe duyệt.
- Không nhạc nền chạy liên tục; âm thanh chỉ theo hành động và giờ nghỉ.

## 9. Lưu trữ tiến độ

- localStorage (hoặc IndexedDB nếu cần chỗ cho tranh vẽ): sao, cửa đã mở, tranh của bé, thời gian nghỉ.
- Xoá dữ liệu nằm trong mục «cho bố mẹ» (đằng sau cổng phụ huynh đơn giản).
- Không server dữ liệu cá nhân — app tĩnh, dữ liệu nằm trên máy.

## 10. Công nghệ và triển khai

- Stack khuyến nghị: **Vite + React + TypeScript**, xuất bản tĩnh, PWA (manifest + service worker), không backend.
- Các thư viện chỉ dùng khi cần: WebAudio cho nhạc cụ, canvas cho vẽ, drag-and-drop nhẹ.
- **Triển khai — hai đích cùng một bản xuất tĩnh:**
  - **GitHub Pages:** base path tương đối để chạy dưới đường dẫn con.
  - **Vercel:** triển khai zero-config cho static build.
  - App dùng URL tương đối để không phân biệt đích; cả hai đích cập nhật khi push.
- Trình duyệt mục tiêu: Chrome Android, Safari iOS, trình duyệt máy tính bảng/laptop phổ biến.

## 11. An toàn cho bé (ràng buộc cứng)

- Không liên kết thoát, không quảng cáo, không thu dữ liệu, không mua sắm.
- Mọi nút cảm ứng ~64dp trở lên; phản hồi tức thì mỗi lần chạm.
- Chặn cử động vô nghĩa: phóng to pinch, scroll trôi, xoay ngang gây vỡ layout.
- Nhớ trạng thái: bé dở dang giữa cửa chơi thì quay lại chỗ cũ.
- Giờ nghỉ không bị qua được bằng mẹo (đổi tab v.v.): đếm theo hành động chơi thực, không chỉ theo đồng hồ hệ thống.

## 12. Điều còn lại cho người xây

- Danh sách bài hát cụ thể + cách thu/dàn âm (theo mục 8).
- Nguồn hình minh họa: chọn bộ tranh/gói SVG hình con vật, đồ vật dùng miễn phí (giấy phép cho phép), hoặc vẽ SVG đơn giản nội bộ — chốt khi dựng, ưu tiên hình nét dày, màu tươi, phong cách giống Bunny.
- Chốt font cuối, hệ màu chính xác, cách vẽ nhân vật Bunny.
- Cấu trúc component chi tiết, chọn thư viện drag-and-drop, cách sinh nội dung lượt chơi (mẫu dữ liệu nhân biến thể).
- Cách hiển thị lời hát (chữ to đơn giản hay kiểu karaoke tô màu theo câu).
