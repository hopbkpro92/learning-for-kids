# «Bầu trời tí hon» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web app tĩnh PWA tiếng Việt cho bé mầm non — thế giới «Bầu trời tí hon» với 7 cửa chơi, giờ nghỉ chống bám màn hình, offline, deploy GitHub Pages + Vercel.

**Architecture:** React SPA xuất bản tĩnh, hash-based routing tự viết, âm thanh bằng WebAudio + SpeechSynthesis, tiến độ lưu localStorage/IndexedDB, PWA bằng vite-plugin-pwa. Không backend.

**Tech Stack:** Vite, React, TypeScript, Vitest + Testing Library (jsdom), vite-plugin-pwa. Không có drag-drop library — tự viết bằng Pointer Events.

**Spec:** docs/superpowers/specs/2026-10-13-bau-troi-ti-hon-design.md (đọc cùng; spec là thẩm quyền khi plan có mâu thuẫn)

## Global Constraints

- Hoàn toàn tiếng Việt trong UI; không chữ bắt buộc đọc để chơi.
- Nút cảm ứng ≥ 64px; phản hồi tức thì mỗi chạm.
- Không liên kết ra ngoài, không quảng cáo, không gửi dữ liệu đi đâu.
- Offline được sau lần tải đầu (PWA precache).
- Dữ liệu chỉ trên máy: localStorage cho tiến độ, IndexedDB cho tranh.
- Sau 15–20 phút chơi thực → bắt buộc giờ nghỉ ~3 phút, không qua được bằng mẹo.
- Độ khó nhích chậm: 3–6 mảnh; đếm 1–5 trước 1–10.
- Emoji chỉ trong dev/phác thảo; hình chính thức = SVG minh họa tự vẽ (nét dày, màu tươi).
- Commit conventional: `feat:`, `test:`, `chore:`…
- Mọi test chạy bằng `npx vitest run`.

## Review Focus

Các loại đầu vào mà test của từng task không phủ — mỗi dòng sẽ có test gắn vào task chủ.

1. **Chạm hỗn loạn:** bé bấn nhiều ngón liên tiếp, đè nút lâu — không nút nào dính dead-lock, không bắn đôi lệnh điều hướng khi chạm liên tục. → Test trong Task 4 (chạm đôi trong 100ms) và từng door.
2. **iOS Safari chưa mở audio:** âm thanh chỉ nở sau cử động người đầu; mọi phát trước gesture phải không văng exception. → Test Task 2 (guard `AudioContext` suspended ⇒ bỏ qua, không throw).
3. **localStorage không khả dụng (iOS private mode đầy):** app không được crash; degrad chạy tiếp nhưng không lưu. → Test Task 3.
4. **Đổi tab khi chơi:** nếu đếm theo đồng hồ hệ thống thì mời bé nghỉ khi bé chưa chơi gì. Chỉ đếm thời gian app đang hiển thị và bé thực chơi. → Test Task 8 (tab hidden ⇒ không cộng).
5. **Lần đầu chạy chậm mạng:** precache(SW) phải đủ để reload offline; kiểm bằng test đọc cấu hình build. → Kiểm Task 9.

---

### Task 1: Scaffold dự án + công cụ test + smoke test

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `public/manifest.webmanifest`, `public/icon.svg`
- Modify: `.gitignore` (thêm `.vercel/`)

**Interfaces:**
- Produces: `App` component (`src/App.tsx`) — các scene sau này render bên trong đây; script `npm run dev|build|test`.

- [ ] **Step 1: Scaffold tối thiểu** — `npm create vite@latest . -- --template react-ts` rồi thêm `vitest @testing-library/react jsdom @testing-library/user-event` (dev). `vite.config.ts` đặt `base: './'` (bắt buộc cho GitHub Pages).
- [ ] **Step 2: Viết smoke test**

```tsx
// src/App.test.tsx
import { render } from '@testing-library/react'
import App from './App'
it('renders app shell', () => {
  render(<App />)
  expect(document.querySelector('#root-viewport')).toBeTruthy()
})
```

- [ ] **Step 3: Chạy fail** — `npx vitest run` → FAIL (App chưa có `#root-viewport`).
- [ ] **Step 4: Implement App + `#root-viewport` div; `npm run build` exit 0.**
- [ ] **Step 5: Chạy pass** — `npx vitest run` → PASS 1/1.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "chore: scaffold vite react-ts app with vitest"`

### Task 2: Âm thanh lõi — giọng nói, khen, nhạc synth

**Files:**
- Create: `src/audio/speak.ts`, `src/audio/speak.test.ts`, `src/audio/sfx.ts`, `src/audio/sfx.test.ts`, `src/audio/synth.ts`, `src/audio/synth.test.ts`
- Test: các file .test.ts trên

**Interfaces:**
- Produces (Task 4–13 dùng): `speak(text: string): void`; `cancelSpeak(): void`; `praise(): void` (chime + random câu khen tiếng Việt); `synth.playNote(note: string, beats: number, timbre: Timbre): void` với `type Timbre = 'piano' | 'bell' | 'drum' | 'horn'`

- [ ] **Step 1: Test speak** — mock `window.speechSynthesis` + `voiceChanged`:
  - gọi `speak('Chào bé')` ⇒ có `SpeechSynthesisUtterance` với `lang === 'vi-VN'`;
  - không có giọng `vi` ⇒ vẫn không throw, chọn voice khớp tiền tố `'vi'`;
  - gọi `speak` khi đang đọc ⇒ `cancel()` được gọi trước.
- [ ] **Step 2: Chạy fail** — `npx vitest run src/audio/speak.test.ts` → FAIL (mode undefined).
- [ ] **Step 3: Implement `speak.ts`** — chọn voice: ưu tiên `lang.startsWith('vi')`; `praise()` in `sfx.ts` là WebAudio 3-note chime (C5-E5-G5) + `speak` câu khen xoay vòng từ mảng `PRAISE_PHRASES` (ít nhất 5 câu, vd «Giỏi quá!», «Bé làm tốt lắm!»…) — WebAudio guarded: nếu `AudioContext` state `suspended` ⇒ bỏ qua KHÔNG throw (iOS chưa unlock).
- [ ] **Step 4: Test synth** — `playNote('C4', 1, 'drum')` có gọi `OscillatorNode.start()` 1 lần; timbre khác nhau ⇒ khác `waveSetType`.
- [ ] **Step 5: Chạy pass toàn bộ** — `npx vitest run src/audio/` → PASS.
- [ ] **Step 6 (spike thủ công — ghi nhận):** mở `npm run dev` qua mạng nội bộ trên điện thoại thật, dùng nút test gọi `speak('Xin chào bé')` trên Chrome Android và Safari iOS; ghi lại vào `docs/voice-spike.md` (giọng nào có, chất lượng thế nào, có cần thu file thay thế không). Bước thủ công, không test tự động.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: audio core - vi speak, praise chime, synth notes"` (gồm `docs/voice-spike.md`)

### Task 3: Tiến độ + đồng hồ chơi + router hash

**Files:**
- Create: `src/state/progress.ts`, `src/state/progress.test.ts`, `src/state/session.ts`, `src/state/session.test.ts`, `src/lib/router.tsx`, `src/lib/router.test.tsx`

**Interfaces:**
- Produces: `loadProgress(): Progress`; `saveProgress(p: Progress): void`; `addStars(n: number): void`; `registerPlay(seconds: number): void`; `restDue(): boolean`; `beginRest(): void`; `restLeft(): number`; `tickRest(seconds: number): void`; `useRoute(): string` + `navigate(path: string)`
- `type Progress = { stars: number; unlockedDoors: string[]; puzzleLevel: number }`
- Ứng xử: `progress.ts` bọc toàn bộ access vào try/catch (localStorage không khả dụng ⇒ vẫn chạy, trả `DEFAULT_PROGRESS`).
- `registerPlay` chỉ cộng khi `document.visibilityState === 'visible'`.

- [ ] **Step 1: Test progress** — addStars cộng đúng; `localStorage.setItem` throw ⇒ loadProgress trả default, app chạy tiếp (spy console.error allowed).
- [ ] **Step 2: Test session** — registerPlay(600) ×2 khi visible ⇒ restDue() false (REST_AFTER_SECONDS = 1080); thêm registerPlay(600) khi `visibilityState==='hidden'` ⇒ không cộng; đến ngưỡng ⇒ restDue() true; `beginRest()` rồi `tickRest(180)` ⇒ `restLeft()===0`; trước đó restLeft() > 0.
- [ ] **Step 3: Test router** — `navigate('#/door/puzzle')` rồi `useRoute()` (hook render qua `renderHook`) trả `#/door/puzzle`; hash cũ không khớp pattern ⇒ trả về `#/home`.
- [ ] **Step 4: Chạy fail từng lô** — `npx vitest run src/state src/lib` → FAIL.
- [ ] **Step 5: Implement 3 module trên.** Không dùng thư viện router.
- [ ] **Step 6: Chạy pass** — `npx vitest run src/state src/lib` → PASS.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: progress, play-session timer, hash router"`

### Task 4: Màn nhà — thế giới + Bunny + cửa chơi

**Files:**
- Create: `src/scenes/HomeScene.tsx`, `src/scenes/HomeScene.test.tsx`, `src/components/Bunny.tsx`, `src/components/DoorButton.tsx`, `src/components/Bunny.tsx.test.tsx`
- Modify: `src/App.tsx` (dùng router + scene)

**Interfaces:**
- Consumes: Task 2 (`speak`, `praise`), Task 3 (`useRoute`, `navigate`)
- Produces: `<HomeScene />` render 3 `DoorButton` (`doorId: 'puzzle' | 'songs' | 'counting'` — Task 10–13 thêm 4 id: `'drawing' | 'instruments' | 'sorting' | 'whois'`); `<Bunny mood = 'happy' | 'wave' | 'sleepy' />` — Bunny vẽ SVG tự viết (thỏ nét dày), KHÔNG emoji; `suggestDoor(playedDoor: DoorId): DoorId` — chọn cửa khác để gợi ý đổi vị sau mỗi lượt chơi (spec mục 5/6).

- [ ] **Step 1: Test HomeScene** — có 3 DoorButton với `aria-label` tiếng Việt («Xếp hình», «Ca hát», «Đếm số»); mỗi nút `min-height: 64px` (computed style assert ≥64); click DoorButton 2 lần trong 100ms (thử chạm đôi) ⇒ `navigate` chỉ fire 1 lần; `suggestDoor('puzzle')` trả về một cửa khác 'puzzle'.
- [ ] **Step 2: Test Bunny** — đổi `mood` prop ⇒ class `bunny-happy|wave|sleepy` đổi; render có `<path>` đếm > 5 (đảm bảo SVG không rỗng; không có ký tự emoji trong markup).
- [ ] **Step 3: Chạy fail** — `npx vitest run src/scenes src/components` → FAIL.
- [ ] **Step 4: Implement** — HomeScene: nền CSS gradient trời xanh nhạt + dải cỏ SVG ở đáy; Bunny chào `speak('Chào bé, giờ thôi mình cùng chơi nhé!')` một lần mỗi phiên (module-level flag); Bunny mood `wave` lúc idle, `happy` khi hover/press.
- [ ] **Step 5: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: home scene with bunny mascot and three doors"`

### Task 5: Cửa «Xếp hình»

**Files:**
- Create: `src/activities/puzzle/PuzzleScene.tsx`, `PuzzleScene.test.tsx`, `src/activities/puzzle/shape.ts`, `shape.test.ts`, `src/components/DragPocket.tsx` (lock drag pointer-events tự viết, không library)

**Interfaces:**
- Consumes: Task 2 (`speak`, `praise`), Task 3 (`addStars`, `Progress.puzzleLevel`), Task 4 DoorButton (`doorId='puzzle'`)
- Produces: `type SceneImageId = 'bunny' | 'duck' | 'chicken'` + `<ShapeSprite id={SceneImageId} />` (SVG tự vẽ, nét dày) — các door sau (Task 7, 12, 13) thêm id riêng của mình vào cùng kiểu này, một nguồn duy nhất cho hình minh họa; `solveBoard(level: 1|2|3): {piecesPerRow: number; targets: PieceTarget[]}` với `type PieceTarget = { id: string; x: number; y: number; w: number; h: number; imageId: SceneImageId }`; hoàn thành ⟹ `praise()` + `addStars(1)`, level++ (tối đa 3 — 3 mảnh → 4 mảnh → 6 mảnh).

- [ ] **Step 1: Test shape.ts** — `solveBoard(1)` trả 3 mục tiêu; `solveBoard(2)` trả 4; `solveBoard(3)` trả 6; tất cả target nằm trong biên bảng [0..1].
- [ ] **Step 2: Test drag logic (Pointer stubs)** — kéo piece về vị trí đúng (dispatch pointerdown/move/up vào element mock) ⇒ piece snap + `solvedCount + 1`; kéo về sai chỗ ⇒ piece trở về gốc, không cộng.
- [ ] **Step 3: Test flow** — hoàn thành hết piece ⇒ gọi `praise` + `navigate('#/home')` sau 1.2s (timer fake).
- [ ] **Step 4: Chạy fail** — `npx vitest run src/activities/puzzle` → FAIL.
- [ ] **Step 5: Implement** — mảnh ghép dùng hình SVG con vật (`ShapeSprite` dựng nội bộ; 3 hình đầu: thỏ, con vịt, con gà); vùng thả ≥ 72px; độ khó nhích chậm qua `puzzleLevel`.
- [ ] **Step 6: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: puzzle door with pointer drag and slow difficulty ramp"`

### Task 6: Cửa «Ca hát»

**Files:**
- Create: `src/data/songs.ts`, `songs.test.ts`, `src/activities/songs/SongsScene.tsx`, `SongsScene.test.tsx`, `src/audio/songPlayer.ts`, `songPlayer.ts.test.ts`

**Interfaces:**
- Consumes: Task 2 (`synth.playNote`), Task 4 DoorButton (`doorId='songs'`)
- Produces: `type Song = { id: string; title: string; tempo: number; lines: { lyric: string; notes: { note: string; beats: number }[] }[] }`; `SONGS: Song[]` tối thiểu 3 bài truyền thống: «Con vịt», «Cả nhà thương nhau», «Chi chí chành chành» (chuyển giai điệu chính từ phiên bản truyền thống sang chuỗi note C-major); `playSong(song, onLine: (lyric: string) => void): () => void` — trả hàm stop; đi kèm lời hiện theo từng câu.

- [ ] **Step 1: Test dữ liệu** — mọi note đều match `/^[A-G][#b]?[1-7]$/`; mỗi bài có ≥ 2 câu lời; `SONGS.length >= 3` và `id` unique.
- [ ] **Step 2: Test player** — fake timer: `playSong` schedule đúng chuỗi `playNote` (đếm tổng beats × tempo), gọi `onLine` theo câu; `stop()` ⇒ không schedule tiếp.
- [ ] **Step 3: Test scene** — mỗi bài là nút to ≥64px; chạm bài ⇒ `playSong` được gọi; lời hiện câu hiện thời (font lớn, có aria-label).
- [ ] **Step 4: Chạy fail** — `npx vitest run src/data src/activities/songs` → FAIL.
- [ ] **Step 5: Implement** — notes là nhạc điệu truyền thống chuyển tay sang dữ liệu (chấp nhận nhóm hợp lý); chơi bằng timbre `piano`, tempo 90–110.
- [ ] **Step 6: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: songs door with traditional melodies via synth"`

### Task 7: Cửa «Đếm số»

**Files:**
- Create: `src/activities/counting/CountingScene.tsx`, `CountingScene.test.tsx`, `src/activities/counting/gen.ts`, `gen.test.ts`

**Interfaces:**
- Consumes: Task 2 (`speak` đọc đề + số), Task 3 (`addStars`), Task 4 DoorButton (`doorId='counting'`)
- Produces: `genQuestion(maxCount: number): { items: number; sprite: SceneImageId; options: number[]; answer: number }` — `options` luôn 3 số, luôn chứa `answer`, không lặp giá trị; `maxCount` bắt đầu 5; đã đủ ổn则 (streak 10 câu đúng) → nâng lên 10.

- [ ] **Step 1: Test gen** — chạy 50 lần: `answer === items` luôn; `options` có đúng 3 giá trị unique; `items ≤ maxCount`; khi `maxCount=5` không bao giờ xuất hiện 10.
- [ ] **Step 2: Test scene** — tap đáp án đúng ⇒ `speak('Đúng rồi, có 3 con vịt')` + `addStars(1)` + sang câu kế (sau 1.5s fake timer); tap sai ⇒ `speak('Chưa phải bạn ơi, thử lại nhé')`, KHÔNG cộng sao, không đổi câu.
- [ ] **Step 3: Chạy fail** — `npx vitest run src/activities/counting` → FAIL.
- [ ] **Step 4: Implement** — ban đầu dùng đếm 1–5; sau streak 10 câu đúng liên tiếp (lưu counting streak trong progress) ⟹ `maxCount=10`.
- [ ] **Step 5: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat: counting door with voice-read questions"`

### Task 8: Giờ nghỉ + «hé điều mới»

**Files:**
- Create: `src/scenes/RestScene.tsx`, `RestScene.test.tsx`, `src/state/teaser.ts`, `teaser.test.ts`
- Modify: `src/App.tsx` (route `#/rest` khoá navigation, registerPlay gắn vào các door)

**Interfaces:**
- Consumes: Task 3 session API (`restDue`, `beginRest`, `restLeft`, `tickRest`), Task 6 (`SONGS` cho nhạc ru), Task 2 (`speak`)
- Produces: `makeTeaser(p: Progress): { kind: 'song' | 'scene' | 'animal'; text }` — dữ liệu tĩnh, không gọi mạng; `App` khi `restDue()` bắt buộc đi `#/rest` dù hash khác.

- [ ] **Step 1: Test teaser** — text không rỗng; chạy 5 lần liên tiếp không hai teaser liền nhau trùng cả kind+text.
- [ ] **Step 2: Test gate** — render App với session đã quá ngưỡng ⇒ luôn vào `#/rest` bất kể hash `#/door/songs`; trong `#/rest`: `navigate` bị ignore (bấm bất cứ đâu không đổi route); `restLeft()===0` sau 180 giây fake ⇒ tự về `#/home` và `beginRest()` reset bộ đếm chơi.
- [ ] **Step 3: Test hidden-tab** — `document.hidden=true` rồi dispatch `visibilitychange` ⇒ tickRest timer bảng chỉ chạy khi visible (check qua spy).
- [ ] **Step 4: Chạy fail** — `npx vitest run src/scenes src/state/teaser.test.ts src/App.test.tsx` → FAIL.
- [ ] **Step 5: Implement** — RestScene: nền đêm (background CSS tối), Bunny `mood='sleepy'`, nhạc ru là giai điệu chậm bằng timbre `bell`; thanh đồng hồ cát; gọi `tickRest` mỗi giây với visibilityState guard.
- [ ] **Step 6: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: enforced rest gate with sleepy bunny and teaser"`

### Task 9: PWA offline + deploy GitHub Pages + Vercel

**Files:**
- Create: `vite-plugin-pwa` config trong `vite.config.ts`, `.github/workflows/deploy-pages.yml`, `docs/deploy.md`
- Modify: `public/manifest.webmanifest` (name «Bầu trời tí hon», theme_color `#8ED6FF`, display standalone), `package.json` scripts

**Interfaces:**
- Produces: chạy `npm run build` ⇒ `dist/` có service worker precache; GitHub Actions workflow tự deploy Pages; Vercel zero-config.

- [ ] **Step 1: Test manifest + SW** — test đọc FS: sau `npm run build`, `dist/` tồn `sw.js`, `manifest.webmanifest` chứa tên tiếng Việt đúng và `start_url` tương đối `'./'`.
- [ ] **Step 2: Chạy** — `npm run build && npx vitest run` → PASS (test đọc dist qua fs).
- [ ] **Step 3: Deploy config** — `deploy-pages.yml` (on push main: build + upload `dist/` + Pages deploy); `docs/deploy.md` ghi 3 bước Vercel (import repo, framework=Vite, không cần config).
- [ ] **Step 4: Commit** — `git add -A && git commit -m "chore: pwa offline caching and pages/vercel deploy"`

### Task 10: Cửa «Vẽ tay tự do»

**Files:**
- Create: `src/activities/drawing/DrawingScene.tsx`, `DrawingScene.test.tsx`, `src/state/idb.ts`, `idb.test.ts`

**Interfaces:**
- Consumes: Task 2 (`praise`, `speak`), Task 4 DoorButton (`doorId='drawing'`)
- Produces: `idbPut(art: Artwork): void`; `idbList(): Promise<Artwork[]>`; `idbAllDelete(): void`; `type Artwork = { id: string; createdAt: number; strokes: Stroke[] }` với `type Stroke = { color: string; points: { x: number; y: number }[] }` — IndexedDB helper tự viết ~60 dòng, không dùng library.

- [ ] **Step 1: Test idb** — dùng fake-indexeddb (dev dep): `idbPut` ×2 ⇒ `idbList()` trả 2 theo createdAt giảm dần; throw nếu strokes rỗng.
- [ ] **Step 2: Test canvas** — pointerdown + 3 pointermove trên canvas (fixed-size 320×320) ⇒ strokes có phần tử mới, point count khớp; hàng chấm màu để chọn giữa 5 màu cố định (`#FF6B6B`, `#4ECDC4`, `#FFD93D`, `#845EC2`, `#2D2D2D`) — tap đổi active màu.
- [ ] **Step 3: Test lưu** — tap «✨ Xong rồi!» ⇒ `praise()` + `idbPut` gọi đúng 1 lần.
- [ ] **Step 4: Chạy fail** — `npx vitest run src/state/idb.test.ts src/activities/drawing` → FAIL.
- [ ] **Step 5: Implement** — canvas 2D, nét liền (line-cap tròn, stroke width 12px), màu hiện tại highlight.
- [ ] **Step 6: Chạy pass** — `npx vitest run` → PASS.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: finger-drawing door with saved artworks in idb"`

### Task 11: Cửa «Nhạc cụ bé gõ»

**Files:**
- Create: `src/activities/instruments/InstrumentsScene.tsx`, `InstrumentsScene.test.tsx`

**Interfaces:**
- Consumes: Task 2 (`synth.playNote` — các timbre `'bell' | 'drum' | 'horn'` đã có từ Task 2), Task 4 DoorButton (`doorId='instruments'`)
- Produces: 4 pad nhạc cụ: Trống (C2, drum), Chuông (G5, bell), Kèn (E4, horn), Đàn (quãng A3-C4-E4, piano) — chạm ⇒ phát ngay, nút active 120ms; chế độ «Gõ theo nhịp» chạy bài «Con vịt» (Task 6) với highlight ô nhịp theo nhịp đang đánh; `praise()` khi đủ 8 nhịp được gõ (gõ sót/sai không làm fail, chỉ không khen).

- [ ] **Step 1: Test pads** — tap từng pad ⇒ `playNote` đúng note+timbre; 2 tap trong 60ms ⇒ 2 lần phát (tap liền phát lại được — re-trigger).
- [ ] **Step 2: Test play-along** — fake timer: beat hiển thị theo nhịp; 8/8 nhịp được tap đúng khung beat ⇒ `praise()`; bỏ sót 2 nhịp ⇒ không praise, không báo lỗi.
- [ ] **Step 3: Chạy fail → implement → pass → commit** — `npx vitest run src/activities/instruments` → PASS; commit `feat: instruments door with play-along tempo game`.

### Task 12: Cửa «Sắp vào giỏ»

**Files:**
- Create: `src/activities/sorting/SortingScene.tsx`, `SortingScene.test.tsx`, `src/activities/sorting/gen.ts`, `gen.test.ts`

**Interfaces:**
- Consumes: Task 5 `DragPocket` (tái dùng pointer drag), Task 2/3 (`speak`, `addStars`), Task 4 DoorButton (`doorId='sorting'`)
- Produces: `genSet(level: 1|2|3): SetSpec`; `type SetSpec = { rule: 'color' | 'shape' | 'kind'; baskets: { id: string; sprite: SceneImageId }[]; items: { id: string; targetBasketId: string; sprite: SceneImageId }[] }` — level 1: 2 giỏ + 4 món; level 2: 3 giỏ + 6 món; level 3: 3 giỏ + 6 món rule khó hơn.

- [ ] **Step 1: Test gen** — chạy 30 lần: mỗi món có `targetBasketId` khớp một trong các giỏ; level 1 luôn 2 giỏ 4 món; sprite không trùng trong một set.
- [ ] **Step 2: Test scene** — kéo món về giỏ đúng ⇒ món mất khỏi bàn, giỏ nhận vào; kéo sai ⇒ món trở về + `speak('Thử lại bạn ơi')`, không cộng sao; đủ tất cả ⇒ `praise()` + `addStars(1)`.
- [ ] **Step 3: Chạy fail → implement → pass → commit** — `npx vitest run src/activities/sorting` → PASS; commit `feat: sorting door - color shape kind baskets`.

### Task 13: Cửa «Ai là ai?»

**Files:**
- Create: `src/activities/whois/WhoIsScene.tsx`, `WhoIsScene.test.tsx`, `src/activities/whois/animals.ts`, `animals.test.ts`

**Interfaces:**
- Consumes: Task 2 (`speak` + thêm `playSoundEffect(animalKey)` trong `sfx.ts` cho tiếng kêu tổng hợp), Task 4 DoorButton (`doorId='whois'`)
- Produces: `ANIMALS: { key: string; vietnameseName: string; cryText: string; cryKind: 'meo' | 'gau' | 'uu' | 'quac' | 'trit' }[]` tối thiểu 6 con (mèo, chó, gà, vịt, bò, ếch); `genRound(): { cry: string; options: string[]; answer: string }`.

- [ ] **Step 1: Test data** — ≥ 6 loài; key unique; cryText non-empty.
- [ ] **Step 2: Test round/scene** — 20 lần: `options` luôn chứa `answer`, 3 items unique; tap đúng ⇒ `speak(name + ' kêu ' + cry)` + praise + sao +1, hình kế; tap sai ⇒ nhắc, không tăng sao.
- [ ] **Step 3: Chạy fail → implement → pass → commit** — `npx vitest run src/activities/whois` → PASS; commit `feat: who-is door - animals vocabulary rounds`.

### Task 14: Cổng phụ huynh + xoá dữ liệu

**Files:**
- Create: `src/scenes/ParentsScene.tsx`, `ParentsScene.test.tsx`
- Modify: `src/scenes/HomeScene.tsx` (thêm nút ẩn), `src/App.tsx` (route `#/parents`)

**Interfaces:**
- Consumes: Task 10 `idbAllDelete`, Task 3 progress reset, Task 4 router
- Produces: nút `#parent-gate` nhỏ ở góc HomeScene — phải **giữ 3 giây liên tiếp** mới được vào `#/parents`; trong ParentsScene có nút «Xoá dữ liệu» ⇒ phải xác nhận 2 lần, sau đó `idbAllDelete()` + xoá progress + về `#/home`; có nút «Đóng» trở lại nhà.

- [ ] **Step 1: Test gate** — tap thường (không giữ) trên `#parent-gate` ⇒ route không đổi; giữ 3 giây (fake timer + pointerdown không pointerup) ⇒ vào `#/parents`.
- [ ] **Step 2: Test xoá** — với 2 Artwork + progress có sao: bấm «Xoá dữ liệu» 1 lần ⇒ chưa xoá; xác nhận 2 lần ⇒ `idbAllDelete` gọi, `loadProgress()` = default, route về `#/home`.
- [ ] **Step 3: Chạy fail → implement → pass → commit** — `npx vitest run src/scenes/ParentsScene.test.tsx` → PASS; commit `feat: 3s-hold parent gate with data reset`.

## Phases (đánh dấu bàn giao)

- **Đợt 1 = Task 1–9** — app dùng được, deploy được, có 3 cửa đầu + giờ nghỉ.
- **Đợt 2 = Task 10–14** — bốn cửa «lãnh thổ mới» (Vẽ tay, Nhạc cụ, Sắp vào giỏ, Ai là ai) + cổng phụ huynh.
