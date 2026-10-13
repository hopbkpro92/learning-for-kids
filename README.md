# Bầu trời tí hon 🌈

Web app học tập – vui chơi cho bé mầm non (3–5 tuổi), hoàn toàn tiếng Việt, dùng được offline, deploy miễn phí trên GitHub Pages và Vercel.

Xây theo bản thiết kế tại [`docs/superpowers/specs/2026-10-13-bau-troi-ti-hon-design.md`](docs/superpowers/specs/2026-10-13-bau-troi-ti-hon-design.md).

## Đối với bé

- **Màn nhà:** bầu trời ban ngày, thảm cỏ, chú thỏ **Bunny** chào bé bằng giọng tiếng Việt.
- **7 cửa chơi** (nút to vừa ngón tay, không cần đọc chữ):
  | Cửa chơi | Bé làm gì | Kiến thức gắn |
  |---|---|---|
  | 🧩 Xếp hình | kéo thả mảnh ghép vào chỗ | hình dạng, con vật |
  | 🎵 Ca hát | chạm bài hát để nghe, lời hiện chữ to | ngôn ngữ, giai điệu |
  | 🔢 Đếm số | đếm tranh, chạm con số đúng | đếm 1–5 rồi 1–10 |
  | 🎨 Vẽ tay | ngón tay chấm màu vẽ, lưu «tác phẩm» | màu sắc, sáng tạo |
  | 🥁 Nhạc cụ | gõ trống/chuông/kèn, gõ theo nhịp | nhịp, âm sắc |
  | 🧺 Sắp vào giỏ | kéo đồ vào giỏ đúng loại | phân loại |
  | 🐄 Ai là ai? | nghe tiếng kêu, chạm con vật đúng | từ vựng tiếng Việt |
- **Giờ nghỉ chống bám màn hình:** sau ~18 phút chơi thật, Bunny mời nghỉ — màn hình sang đêm, nhạc ru êm, không bấm qua được, hết nghỉ tự về nhà.
- **An toàn:** không quảng cáo, không liên kết thoát, không thu dữ liệu; cổng «Chế độ bố mẹ» mở bằng cách giữ 3 giây ở góc màn nhà, bên đó có nút xoá dữ liệu (xác nhận 2 lần).

## Đối với bố mẹ

- Tiến độ của bé (sao, tranh vẽ) lưu **ngay trên máy**, không tài khoản.
- Tải app lên màn hình chính điện thoại (Add to Home Screen) — chạy offline sau lần đầu.
- Chi tiết triển khai: [`docs/deploy.md`](docs/deploy.md).

## Công nghệ

- React 19 + TypeScript + Vite, xuất bản tĩnh (PWA — service worker precache)
- Âm thanh: WebAudio (synth tự tạo giai điệu, nhạc cụ) + SpeechSynthesis giọng `vi-VN`
- Dữ liệu: localStorage (tiến độ) + IndexedDB (tranh vẽ) — không backend
- Test: Vitest + Testing Library (82 test)
- Không dùng thư viện drag-drop/router bên ngoài — tự viết bằng Pointer Events

## Chạy trên máy

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # chạy toàn bộ test
npm run build    # xuất bản tĩnh vào dist/ (kèm sw.js precache)
```

## Triển khai

| Đích | Cách |
|---|---|
| **GitHub Pages** | push nhánh `main` — workflow `.github/workflows/deploy-pages.yml` tự build + deploy |
| **Vercel** | import repo, chọn framework Vite — zero config |

App dùng URL tương đối (`base: './'`) nên cả hai đích chạy cùng một bản.

## Ghi chú

- Icon PWA hiện là SVG placeholder — nên bổ sung PNG các kích thước chuẩn trước khi phát hành rộng.
- Giọng máy tiếng Việt nên nghe thử trên điện thoại thật: xem `docs/voice-spike.md`.
- Bài hát dùng nhạc điệu truyền thống thuộc công cộng, tự dàn bằng synth — không sao chép âm thanh có bản quyền.
