# 🧱 Cấu trúc Landing Page cho SaaS

Landing page hiệu quả cần tối ưu cho **chuyển đổi**, **giá trị sản phẩm**, và **trải nghiệm người dùng**. Dưới đây là checklist chi tiết:

---

## 1. Hero Section – Khối đầu trang

- **Tiêu đề chính**: Nêu giá trị cốt lõi rõ ràng
- **Mô tả phụ**: Tóm tắt SaaS giúp gì cho người dùng
- **CTA chính**: [Dùng thử miễn phí] / [Đặt demo]
- **Hình minh họa**: Dashboard, UI mockup hoặc animation

---

## 2. Social Proof / Trusted Logos

- Logo các công ty đang sử dụng
- Đánh giá người dùng, số lượng active users
- G2 / Capterra / Trustpilot rating nếu có

---

## 3. Tính năng nổi bật (Key Features)

Hiển thị 3–6 tính năng chính:

- Icon / hình ảnh minh họa
- Tiêu đề ngắn gọn
- Mô tả lợi ích (not technical detail)

---

## 4. Lợi ích & Giá trị (Benefits)

- Nhấn mạnh kết quả mà người dùng nhận được:
  - Tiết kiệm thời gian
  - Cải thiện hiệu suất
  - Tăng doanh thu

---

## 5. Product Showcase / Demo Screenshot

- Dashboard screenshot / gif tương tác
- Video demo có play button
- Tooltip highlight các điểm nổi bật

---

## 6. Testimonials / Khách hàng nói gì

- Avatar, tên, chức vụ, công ty
- Quote chân thực, định hướng lợi ích

---

## 7. Bảng giá (Pricing)

- So sánh các gói Free / Pro / Enterprise
- Nút đăng ký rõ ràng
- Ghi chú về trial / hoàn tiền / không cần thẻ

---

## 8. Câu hỏi thường gặp (FAQ)

- Có cần thẻ để dùng thử không?
- Tôi có thể hủy bất kỳ lúc nào?
- Có hỗ trợ API / tích hợp?

---

## 9. CTA cuối trang

- Gợi nhắc lại giá trị
- Nút kêu gọi hành động lần nữa (dùng thử, đăng ký)

---

## 10. Footer

- Liên kết nhanh: Về chúng tôi, Blog, Chính sách
- Liên kết mạng xã hội
- © Bản quyền và thông tin pháp lý

---

## 🎨 11. Theme / Palette Switcher – Requirements

### 🎯 Mục tiêu:
- Tăng trải nghiệm người dùng bằng khả năng tùy chỉnh giao diện
- Hỗ trợ branding linh hoạt cho demo hoặc white-label
- Cho phép chuyển theme **real-time** và lưu trạng thái

---

### ✅ Thành phần kỹ thuật:
- 🎛️ Dropdown chọn theme: Light / Dark / Pastel / Vibrant...
- ⚡ Live switching bằng CSS Variables hoặc Tailwind class
- 💾 Lưu theme vào `localStorage`
- 🌐 Có tùy chọn "Auto (System theme detection)"
- 🖼️ Có preview màu sắc nhỏ trong menu chọn

---

### 🎨 Danh sách theme & palette gợi ý

| Theme ID       | Tên Theme           | Phong cách / Mô tả                                         |
|----------------|---------------------|-------------------------------------------------------------|
| `light`        | Light Classic        | Giao diện sáng, trung tính, dễ đọc                          |
| `dark`         | Dark Modern          | Giao diện tối, đậm chất công nghệ, giảm mỏi mắt            |
| `solarized`    | Solarized Light/Dark | Tông màu mềm, phổ biến với developer                       |
| `pastel`       | Soft Pastel          | Màu nhẹ nhàng, thân thiện, phù hợp ứng dụng hướng người dùng |
| `vibrant`      | Vibrant Color Pop    | Màu sắc đậm, thu hút, tăng điểm nhấn marketing             |
| `mono`         | Monochrome Minimal   | Tối giản, tập trung nội dung, dùng nhiều sắc xám           |
| `brand-a`      | Custom Brand A       | Chủ đề cá nhân hóa theo thương hiệu (tự định nghĩa)        |
| `auto`         | Hệ thống (Auto)      | Dựa vào `prefers-color-scheme` của hệ điều hành/trình duyệt |

---

### 🛠️ Gợi ý công nghệ triển khai:
- **Tailwind CSS**: dùng `darkMode: 'class'`, kết hợp `theme.extend.colors`
- **React/Vue**: lưu theme trong context hoặc reactive store
- **CSS Variables**: quản lý màu theo theme root class (`.theme-dark`, `.theme-pastel`)
- **LocalStorage**: lưu `themeId` để dùng lại khi load trang

---

## 🎨 11. Theme / Palette Switcher – Requirements

### 🎯 Mục tiêu:
- Tăng trải nghiệm người dùng bằng khả năng tùy chỉnh giao diện
- Hỗ trợ branding linh hoạt cho demo hoặc white-label
- Cho phép chuyển theme **real-time** và lưu trạng thái

---

### ✅ Thành phần kỹ thuật:
- 🎛️ Dropdown chọn theme: Light / Dark / Pastel / Vibrant...
- ⚡ Live switching bằng CSS Variables hoặc Tailwind class
- 💾 Lưu theme vào `localStorage`
- 🌐 Có tùy chọn "Auto (System theme detection)"
- 🖼️ Có preview màu sắc nhỏ trong menu chọn

---

### 🎨 Danh sách theme & palette gợi ý

| Theme ID       | Tên Theme           | Phong cách / Mô tả                                         |
|----------------|---------------------|-------------------------------------------------------------|
| `light`        | Light Classic        | Giao diện sáng, trung tính, dễ đọc                          |
| `dark`         | Dark Modern          | Giao diện tối, đậm chất công nghệ, giảm mỏi mắt            |
| `solarized`    | Solarized Light/Dark | Tông màu mềm, phổ biến với developer                       |
| `pastel`       | Soft Pastel          | Màu nhẹ nhàng, thân thiện, phù hợp ứng dụng hướng người dùng |
| `vibrant`      | Vibrant Color Pop    | Màu sắc đậm, thu hút, tăng điểm nhấn marketing             |
| `mono`         | Monochrome Minimal   | Tối giản, tập trung nội dung, dùng nhiều sắc xám           |
| `brand-a`      | Custom Brand A       | Chủ đề cá nhân hóa theo thương hiệu (tự định nghĩa)        |
| `auto`         | Hệ thống (Auto)      | Dựa vào `prefers-color-scheme` của hệ điều hành/trình duyệt |

---

## 🌈 Palette Nâng Cao (2025 Trendy)

### 1. Earthy Neutrals (Tông màu đất)
- **Mã màu:**
  - `#A57B5B`, `#6A7B53`, `#E5D5C5`, `#D2BA8C`, `#8D6B4B`, `#C5B299`, `#F3EDE4`
- **Đặc điểm:** Tông trầm, tự nhiên, mang cảm giác thư giãn
- **Phù hợp cho:** Wellness, spa, lifestyle, nội thất
- **Hot vì:** Xu hướng “back to nature” và sống xanh 2025

---

### 2. Vibrant Pastels (Pastel rực rỡ)
- **Mã màu:**
  - `#B2E8C8`, `#F3D7FF`, `#FFD6B8`, `#CCCCFF`, `#AEC6CF`, `#D6AEDD`, `#FFB7B2`, `#FFD3A6`, `#C7CEEA`, `#FFF2E6`
- **Đặc điểm:** Nhẹ nhàng, tươi sáng, vui tươi
- **Phù hợp cho:** App nghệ thuật, trẻ em, giáo dục, giới trẻ
- **Hot vì:** Năng lượng tích cực, trải nghiệm dễ chịu

---

### 3. Burning Red Accent (Điểm nhấn đỏ)
- **Mã màu:** `#BF1922`, `#7E0000`, `#FF6347`
- **Đặc điểm:** Màu đỏ nổi bật, mạnh mẽ
- **Phù hợp cho:** Brand thể thao, quảng cáo, thời trang
- **Hot vì:** Tăng nhận diện, tạo cảm xúc mạnh

---

### 4. Butter Yellow (Vàng bơ)
- **Mã màu:** `#FCE38A`, `#F9D976`, `#FFD97D`
- **Đặc điểm:** Ấm áp, thân thiện
- **Phù hợp cho:** Thực phẩm, giáo dục, trải nghiệm khách hàng
- **Hot vì:** Mang lại cảm giác lạc quan, dễ kết hợp

---

### 5. Aura Indigo (Tím cosmic)
- **Mã màu:** `#5A4E7C`, `#8C7AA9`, `#3E2C66`
- **Đặc điểm:** Bí ẩn, aesthetic, futuristic
- **Phù hợp cho:** Công nghệ, thời trang, âm nhạc, nghệ thuật
- **Hot vì:** Gen Z yêu thích, chất sang trọng hiện đại

---

### 6. Dill Green (Xanh ngọc nhạt)
- **Mã màu:** `#91A57D`, `#B7C9A7`, `#7C8F5E`
- **Đặc điểm:** Tự nhiên, dễ chịu, thanh lịch
- **Phù hợp cho:** Organic, wellness, thiết kế nội thất
- **Hot vì:** “Pickle aesthetic” đang thịnh hành trên mạng xã hội

---

### 7. Alpine Oat (Neutral mới)
- **Mã màu:** `#F9F6F0`, `#DDD6CE`, `#C7BCB4`
- **Đặc điểm:** Trung tính, dễ phối
- **Phù hợp cho:** Website doanh nghiệp, tối giản
- **Hot vì:** Rất “clean” và hiện đại, phù hợp branding chuyên nghiệp

---

### 🛠️ Gợi ý công nghệ triển khai:
- **Tailwind CSS**: dùng `darkMode: 'class'`, kết hợp `theme.extend.colors`
- **React/Vue**: lưu theme trong context hoặc reactive store
- **CSS Variables**: quản lý màu theo theme root class (`.theme-dark`, `.theme-earthy`, ...)
- **LocalStorage**: lưu `themeId` để dùng lại khi load trang

---

**✅ Lưu ý khi triển khai:**
- Tối ưu responsive (mobile-first)
- Hiệu năng cao (ảnh nén, preload)
- Tương thích SEO (thẻ meta, OG, schema)
