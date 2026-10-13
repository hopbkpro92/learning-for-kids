# Triển khai — GitHub Pages và Vercel

App xuất bản tĩnh từ `npm run build` → `dist/`; cùng một bản dùng cho cả hai đích.

## GitHub Pages

1. Push repo lên GitHub (nhánh `main`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Workflow `.github/workflows/deploy-pages.yml` tự chạy: test → build → deploy.
   URL dạng `https://<user>.github.io/<repo>/` — mọi URL trong app tương đối (`base: './'`) nên chạy dưới thư mục con không cần chỉnh gì.

## Vercel

1. Truy cập vercel.com → **Add New Project** → import repo GitHub.
2. Framework Preset: **Vite** (Vercel nhận tự động), không cần cấu hình thêm.
3. Deploy — mỗi lần push là Vercel cập nhật bản mới.

Lưu ý: nếu dùng cả hai đích, URL tương đối đảm bảo không xung đột; không cần file cấu hình riêng cho Vercel.
