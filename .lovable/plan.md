## Mục tiêu

1. Đưa code zip `lovabl.zip` (bản đang chạy) vào dự án làm nền.
2. Nâng cấp giao diện đẹp & chuyên nghiệp hơn. mà không làm hỏng tới cấu trúc trên cloud flare
3. Sửa lỗi click sản phẩm → mở modal chi tiết (ảnh lớn, mô tả, giá, nút đặt hàng/Zalo/gọi).
4. Thay 2 ảnh nem chua ở hero bằng 1 video AI (5–10s) chủ đề gia vị nem chua / giò chả.
5. Thêm ô nhập mã ở cuối trang — gõ `BINH2008` mở bảng admin quản lý mọi thứ.
6. Tất cả dữ liệu quản lý lưu `localStorage` (không bật Lovable Cloud theo yêu cầu).

## Các bước thực hiện

### 1. Nạp code nền từ zip

- Giải nén `lovabl.zip`, copy vào dự án (bỏ qua `.git`, `node_modules`, `bun.lock`).
- Giữ nguyên cấu trúc TanStack Start, route `src/routes/index.tsx`.

### 2. Refactor dữ liệu sang store có thể chỉnh

- Tạo `src/lib/site-store.ts`: hook `useSiteData()` đọc/ghi `localStorage` với khoá `giahung_site_v1`.
- Schema lưu:
  - `settings` (brand, hotline, working hours, zalo, messenger, hero title/desc/eyebrow, footer text)
  - `products[]` (id, slug, name, image, tag, price, weight, shortDesc, longDesc, gallery[])
  - `blog[]` (id, title, slug, cover, excerpt, content markdown, date)
  - `consultations[]` (yêu cầu tư vấn user gửi — lưu local để admin xem)
  - `heroVideoUrl` (mặc định trỏ tới video AI tạo ở bước 4)
- Khởi tạo seed từ `PRODUCTS`/`SETTINGS` hiện có. Có hàm `reset()` & `export/import JSON`.

### 3. Làm lại giao diện (đẹp, chuyên nghiệp hơn)

- Tinh chỉnh `src/styles.css`: bổ sung token gradient ấm (đỏ son + vàng đồng), shadow mềm, radius lớn.
- Header: thêm hiệu ứng kính mờ rõ rệt hơn, viền dưới khi scroll, logo có icon SVG.
- Hero: nền **video autoplay/muted/loop** thay ảnh `hero-poster.jpg`; overlay gradient sâu hơn; tiêu đề serif lớn; CTA có shimmer nhẹ.
- Features: card có icon gradient, hover nâng + đổi nền nhẹ.
- Products: lưới đẹp hơn (3 cột desktop), badge "Bán chạy/Mới/Đặc sản", **click cả card mở modal chi tiết**. Thêm thanh lọc theo tag.
- Modal chi tiết sản phẩm (`Dialog` shadcn): ảnh lớn, gallery thumbnail, mô tả dài, giá, trọng lượng, nút "Đặt qua Zalo", "Gọi ngay", "Yêu cầu tư vấn".
- Section Blog mới (hiển thị khi có bài): list card → modal đọc nội dung.
- Form tư vấn: validate Zod, lưu vào `consultations` (admin xem được).
- Footer: bố cục 3 cột (giới thiệu / liên hệ / fanpage), social icons, copyright.                                     thiết kế thêm đề phù hợp với điện thoại 

### 4. Video hero (AI)

- Dùng `videogen--generate_video` tạo MP4 5s, 1080p, 16:9, prompt mô tả sản phẩm gia vị nem chua/giò chả đẹp (close-up gia vị đỏ-vàng, lá chuối, giò chả xắt lát, ánh sáng ấm điện ảnh) — KHÔNG mô tả là "truyền thống" theo ý người dùng, nhấn mạnh hình ảnh sản phẩm cao cấp.
- Lưu `src/assets/hero-loop.mp4`, dùng `<video poster={heroPoster} autoplay muted loop playsInline>`.
- Cho phép admin thay URL video sau (input URL trong panel admin).

### 5. Bảng quản lý admin (ẩn sau mã)

- Cuối footer: input nhỏ "Mã nhân viên" + nút "Mở". Gõ `BINH2008` → set `localStorage.giahung_admin=1` và mở route `/admin` (cũng có thể mở dialog full-screen).
- Tạo route `src/routes/admin.tsx`:
  - Bảo vệ: nếu không có `giahung_admin=1` → redirect về `/`.
  - Sidebar tabs: **Sản phẩm**, **Blog**, **Thông tin web**, **Hero video**, **Yêu cầu tư vấn**, **Sao lưu**.
  - **Sản phẩm**: bảng + form tạo/sửa/xoá; upload ảnh (đọc thành Data URL lưu local), sắp xếp kéo-thả đơn giản (mũi tên lên/xuống).
  - **Blog**: tạo/sửa/xoá bài (markdown), ảnh bìa, ngày đăng.
  - **Thông tin web**: brand, hotline, zalo, messenger, working hours, hero copy, footer text.
  - **Hero video**: dán URL hoặc dùng video mặc định AI; preview.
  - **Yêu cầu tư vấn**: bảng tên/SĐT/nội dung/ngày, nút đánh dấu đã liên hệ, xoá.
  - **Sao lưu**: Export JSON, Import JSON, Reset về mặc định.
  - Nút "Đăng xuất admin" xoá flag.
- Mọi thay đổi reflect ngay trên trang chính (cùng store).

### 6. Bảo trì & polish

- SEO: cập nhật `head()` index, thêm route `/admin` không index (meta `robots: noindex`).
- Đảm bảo responsive trên mobile (header, modal, admin sidebar dùng `Sheet`).
- Toast cho mọi thao tác admin.

## Kỹ thuật

- Stack: TanStack Start (đã có), Tailwind v4, shadcn/ui (`Dialog`, `Sheet`, `Tabs`, `Table`, `Input`, `Textarea`, `Button`).
- State: hook `useSiteData()` + `useSyncExternalStore` để các tab cùng đồng bộ khi `storage` event.
- Zod validate form admin và form tư vấn.
- Không bật Lovable Cloud. Toàn bộ persist = `localStorage` (cảnh báo user trong UI admin: dữ liệu chỉ lưu trên thiết bị này; có Export/Import để chuyển sang máy khác).

## Lưu ý bảo mật

Mã `BINH2008` ở client chỉ là lớp ẩn UI — bất kỳ ai xem source code đều thấy. Vì bạn chọn phương án đơn giản, mình sẽ làm đúng yêu cầu nhưng note rõ trong UI admin. Nếu sau này muốn an toàn thật, bật Lovable Cloud để có auth + database thật.

## Files dự kiến

- `src/routes/index.tsx` (refactor lớn, tách component)
- `src/routes/admin.tsx` (mới)
- `src/routes/__root.tsx` (giữ nguyên hoặc thêm font link)
- `src/lib/site-store.ts` (mới)
- `src/lib/types.ts` (mới)
- `src/components/site/*` — `Header.tsx`, `Hero.tsx`, `Features.tsx`, `Products.tsx`, `ProductDialog.tsx`, `Blog.tsx`, `Consultation.tsx`, `Footer.tsx`, `AdminGate.tsx`
- `src/components/admin/*` — `AdminLayout.tsx`, `ProductsPanel.tsx`, `BlogPanel.tsx`, `SettingsPanel.tsx`, `HeroVideoPanel.tsx`, `ConsultationsPanel.tsx`, `BackupPanel.tsx`
- `src/assets/hero-loop.mp4` (video AI mới)
- `src/styles.css` (bổ sung token)

Sau khi bạn duyệt, mình sẽ build từng bước. cuối cùng xuất file zip râ giúp tôi 