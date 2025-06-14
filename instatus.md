# 🧠 Mục Tiêu (Chi Tiết)

## 🎯 Mục tiêu tổng quan

Xây dựng một nền tảng SaaS clone theo chức năng chính của [Instatus](https://instatus.com), phục vụ:

- **Tổ chức, cá nhân, startup** cần thông báo trạng thái hệ thống khi có sự cố
- **Developer / DevOps team** cần công cụ dễ tích hợp để giám sát và hiển thị uptime
- **Khách hàng / người dùng cuối** theo dõi tình trạng dịch vụ theo thời gian thực

---

## 📌 Vấn đề Instatus giải quyết

- Việc quản lý và thông báo trạng thái hệ thống thủ công gây ra thiếu minh bạch và phản hồi chậm
- Các doanh nghiệp nhỏ thiếu công cụ đơn giản, dễ dùng để xây dựng status page
- Người dùng cuối thiếu kênh chính thống để theo dõi tình trạng dịch vụ
- Khó khăn trong việc cập nhật trạng thái realtime và đa kênh thông báo

---

## 🎯 Đối tượng người dùng

| Người dùng          | Nhu cầu chính                                   | Yêu cầu đặc biệt                         |
|---------------------|------------------------------------------------|-----------------------------------------|
| Startup / SME       | Tạo trang status đơn giản, nhanh chóng          | Tùy chỉnh giao diện, domain riêng       |
| Developer / DevOps  | Giám sát uptime, tích hợp API, real-time update | REST API, webhook, Slack integration    |
| Enterprise          | Quản lý nhiều dự án, phân quyền, bảo mật cao   | SSO, Private page, audit log             |
| Khách hàng cuối     | Xem trạng thái dịch vụ, nhận thông báo         | Đăng ký nhận email/SMS, mobile-friendly |

---

## 🎯 Tính năng then chốt cần hướng tới

- Tạo và quản lý nhiều status page với các thành phần hệ thống (components)
- Theo dõi trạng thái uptime tự động qua monitoring
- Quản lý sự cố (incidents) với cập nhật timeline chi tiết
- Gửi thông báo đa kênh tới người đăng ký (email, SMS, Slack, webhook)
- Cho phép tùy chỉnh giao diện, tên miền và branding
- Hỗ trợ realtime cập nhật trạng thái và phân quyền truy cập
- Cung cấp API để tích hợp và mở rộng

---

## 📝 Kết luận

Việc xây dựng hệ thống cần tập trung vào:

- **Tính đơn giản, dễ sử dụng** cho người mới bắt đầu
- **Khả năng mở rộng** cho doanh nghiệp lớn
- **Đảm bảo thông tin realtime, minh bạch** tới người dùng cuối
- **Tích hợp đa dạng kênh thông báo** để tăng khả năng tiếp cận

---

# 🛠 Công Nghệ Đề Xuất (Chi Tiết)

## 💻 Frontend

- **Next.js**
  - Framework React mạnh mẽ, hỗ trợ SSR (Server Side Rendering) giúp SEO tốt và tốc độ tải trang nhanh.
  - Hỗ trợ API routes tích hợp backend nhẹ.
  - Phù hợp để xây dựng Dashboard và Public Status Page với khả năng tái sử dụng component cao.
- **Tailwind CSS**
  - Framework CSS tiện lợi, giúp thiết kế giao diện nhanh, responsive và dễ tùy chỉnh.
  - Tối ưu hiệu suất CSS nhờ PurgeCSS, giảm dung lượng tải.

---

## ⚙ Backend

- **Node.js + Express**
  - Nền tảng nhẹ, phổ biến, dễ phát triển API RESTful.
  - Hệ sinh thái npm đa dạng, dễ tích hợp thư viện gửi email, SMS, queue,...
  - Tích hợp tốt với Socket.IO cho realtime update.
- (Tùy chọn nâng cao) **NestJS**
  - Framework Node.js mạnh mẽ, có cấu trúc module rõ ràng, hỗ trợ Typescript tối ưu.
  - Phù hợp dự án quy mô lớn, dễ mở rộng.

---

## 🗄 Database

- **PostgreSQL**
  - Quan hệ, mạnh mẽ, hỗ trợ nhiều tính năng mở rộng như JSONB.
  - Hỗ trợ transaction tốt, phù hợp với hệ thống cần đảm bảo dữ liệu chính xác.
  - Có thể kết hợp với ORM như Prisma hoặc TypeORM để tăng tốc độ phát triển.

---

## 🔐 Authentication

- **JWT (JSON Web Token)**
  - Phổ biến cho các API stateless.
  - Dễ dàng tích hợp với frontend SPA, quản lý session hiệu quả.
- **OAuth2 (Google login)**
  - Hỗ trợ đăng nhập nhanh bằng tài khoản Google.
  - Nâng cao trải nghiệm người dùng và bảo mật.

---

## 🔄 Realtime

- **Socket.IO**
  - Giải pháp realtime phổ biến cho Node.js.
  - Hỗ trợ kết nối WebSocket và fallback long-polling.
  - Phù hợp để cập nhật trạng thái sự cố và dashboard realtime.

---

## 📧 Email & SMS

- **SendGrid**
  - Dịch vụ gửi email đáng tin cậy, dễ tích hợp API.
  - Hỗ trợ gửi email marketing và transactional email.
- **Twilio**
  - Hệ thống gửi SMS toàn cầu.
  - Hỗ trợ đa dạng API, có thể gửi SMS, voice, WhatsApp.

---

## ⏰ Monitoring

- **Node Cron + Axios**
  - Thiết lập cron job định kỳ để ping các URL cần giám sát.
  - Axios dùng để thực hiện các request HTTP, lấy trạng thái server.

---

## 🔔 Notifications

- **Bull + Redis**
  - Hệ thống queue quản lý việc gửi thông báo không đồng bộ.
  - Redis dùng làm message broker, lưu trạng thái job, retry khi thất bại.
- **Webhook**
  - Gửi thông báo tới các hệ thống bên thứ ba, như Slack, Discord, Microsoft Teams.

---

## 🚀 Triển khai

- **Docker**
  - Container hóa ứng dụng, dễ dàng triển khai trên các môi trường khác nhau.
  - Hỗ trợ scale và quản lý tài nguyên tốt.
- **Vercel / Netlify**
  - Triển khai frontend Next.js nhanh, tối ưu CDN.
- **Render / Railway / VPS**
  - Hosting backend Node.js với khả năng scale tự động.

---

## 🔐 SSL & Domain

- **Cloudflare API**
  - Tự động thêm, quản lý tên miền và chứng chỉ SSL.
  - Tăng tốc, bảo mật DNS và chống DDoS.
- **Let's Encrypt**
  - Cấp SSL miễn phí, dễ tích hợp tự động gia hạn.

---

## 💡 Tóm tắt lựa chọn công nghệ

| Thành phần       | Công nghệ đề xuất          | Lý do lựa chọn                         |
|------------------|---------------------------|---------------------------------------|
| Frontend         | Next.js + Tailwind CSS    | SSR, hiệu năng cao, dễ thiết kế UI    |
| Backend          | Node.js + Express/NestJS  | Linh hoạt, phổ biến, dễ mở rộng       |
| Database         | PostgreSQL                | Ổn định, quan hệ, hỗ trợ JSON         |
| Auth             | JWT + OAuth2 Google       | Bảo mật, tiện lợi cho người dùng      |
| Realtime         | Socket.IO                 | Dễ triển khai realtime updates        |
| Email/SMS        | SendGrid + Twilio         | Đáng tin cậy, API phong phú            |
| Monitoring       | Node Cron + Axios         | Đơn giản, dễ custom                   |
| Notification     | Bull + Redis + Webhook    | Queue xử lý gửi thông báo hiệu quả    |
| Deploy           | Docker + Vercel/Render    | Dễ quản lý, scalable                   |
| SSL & Domain     | Cloudflare API + Let's Encrypt | Tự động, bảo mật cao               |

---

# 🧱 Thiết kế CSDL (Chi Tiết)

## 🗂 Các bảng chính và mối quan hệ

### 1. Users
- `id`: UUID, khóa chính
- `email`: unique, dùng để đăng nhập
- `password_hash`: mật khẩu đã được hash
- `name`: tên người dùng
- `created_at`, `updated_at`: timestamps
- `role`: quyền hạn (admin, user)

### 2. Projects
- `id`: UUID, khóa chính
- `user_id`: foreign key tham chiếu tới Users (chủ sở hữu dự án)
- `name`: tên dự án
- `slug`: chuỗi dùng làm URL truy cập
- `is_private`: boolean, status page có private hay không
- `custom_domain`: tên miền riêng (nếu có)
- `branding`: JSON chứa cấu hình giao diện (logo, màu sắc, v.v)
- `created_at`, `updated_at`

### 3. Components
- `id`: UUID, khóa chính
- `project_id`: foreign key tới Projects
- `name`: tên thành phần (API, Web Server, DB, v.v)
- `status`: trạng thái hiện tại (operational, degraded, down, etc.)
- `created_at`, `updated_at`

### 4. Incidents
- `id`: UUID, khóa chính
- `project_id`: foreign key tới Projects
- `title`: tiêu đề sự cố
- `content`: mô tả chi tiết
- `status`: trạng thái sự cố (investigating, identified, monitoring, resolved)
- `start_time`: thời gian bắt đầu sự cố
- `end_time`: thời gian kết thúc (nếu đã giải quyết)
- `created_at`, `updated_at`

### 5. Subscribers
- `id`: UUID, khóa chính
- `project_id`: foreign key tới Projects
- `email`: email đăng ký nhận thông báo (nullable nếu đăng ký SMS)
- `phone`: số điện thoại đăng ký SMS (nullable nếu đăng ký email)
- `notify_by`: enum [email, sms, slack, webhook]
- `created_at`, `updated_at`

### 6. Notifications
- `id`: UUID, khóa chính
- `incident_id`: foreign key tới Incidents
- `channel`: phương thức gửi (email, sms, slack, webhook)
- `status`: trạng thái gửi (pending, sent, failed)
- `sent_at`: timestamp khi gửi
- `retry_count`: số lần thử gửi lại (nếu thất bại)
- `created_at`, `updated_at`

### 7. UptimeChecks
- `id`: UUID, khóa chính
- `project_id`: foreign key tới Projects
- `url`: endpoint cần theo dõi
- `interval`: khoảng thời gian kiểm tra (giây hoặc phút)
- `last_status`: trạng thái lần kiểm tra cuối (up, down)
- `created_at`, `updated_at`

### 8. UptimeLogs (option)
- `id`: UUID, khóa chính
- `uptime_check_id`: foreign key tới UptimeChecks
- `status`: trạng thái tại thời điểm ping
- `response_time_ms`: thời gian phản hồi
- `checked_at`: timestamp kiểm tra

---

## 🔗 Mối quan hệ (ERD tóm tắt)

- Một **User** có nhiều **Projects**.
- Một **Project** có nhiều **Components**, **Incidents**, **Subscribers**, **UptimeChecks**.
- Một **Incident** có nhiều **Notifications**.
- Một **UptimeCheck** có nhiều **UptimeLogs**.

---

## 🔐 Ràng buộc và Index

- Email trong Users và Subscribers phải unique (đối với người đăng ký email).
- Slug trong Projects phải unique để tạo URL truy cập.
- Foreign keys phải đảm bảo ràng buộc dữ liệu (cascade delete hoặc restrict).
- Index các cột thường xuyên query như `project_id`, `status`, `start_time` để tối ưu hiệu suất.

---

## ⚙ Migration và Seed Data

- Tạo migration để xây dựng cấu trúc bảng theo trên.
- Seed dữ liệu demo gồm:
  - User admin
  - Một vài project mẫu, components, incidents
  - Subscribers mẫu cho testing email/SMS
- Tạo script để reset database nhanh khi dev.

---

## 💡 Lời khuyên

- Dùng UUID làm khóa chính để tăng tính bảo mật, dễ đồng bộ dữ liệu phân tán.
- Lưu trạng thái và log rõ ràng để dễ audit, debug.
- Xem xét phân vùng dữ liệu hoặc sharding khi hệ thống lớn.

---

# 🔐 Authentication (Chi Tiết)

## 🎯 Mục tiêu

- Bảo mật hệ thống, đảm bảo chỉ người dùng hợp lệ truy cập
- Hỗ trợ đa phương thức đăng nhập (email/password, OAuth2)
- Quản lý session hoặc token hiệu quả cho frontend và backend
- Phân quyền truy cập theo dự án hoặc vai trò người dùng

---

## 1. Đăng ký và đăng nhập bằng Email + Mật khẩu

- Người dùng nhập email và mật khẩu khi đăng ký
- Mật khẩu được hash (bcrypt hoặc argon2) trước khi lưu vào DB
- Khi đăng nhập, kiểm tra email tồn tại và so sánh mật khẩu hash
- Hỗ trợ gửi email xác thực tài khoản (email verification) (tùy chọn)
- Hỗ trợ quên mật khẩu và reset qua email

---

## 2. OAuth2 - Đăng nhập bằng Google

- Tích hợp OAuth2 với Google để đăng nhập nhanh
- Người dùng có thể dùng tài khoản Google liên kết với tài khoản hệ thống
- Nếu lần đầu đăng nhập, tạo user mới tự động dựa trên email Google trả về
- Xác thực token OAuth và lấy thông tin người dùng an toàn

---

## 3. Quản lý phiên làm việc (Session/Token)

- Sử dụng **JWT** (JSON Web Token) làm token truy cập (access token)
- Access token có thời hạn ngắn (~15 phút đến 1 giờ)
- Kèm theo **Refresh Token** để làm mới access token khi hết hạn
- Refresh token lưu ở HTTP-only cookie hoặc DB để bảo mật
- Kiểm tra token trong middleware khi gọi API bảo vệ

---

## 4. Phân quyền người dùng (Authorization)

- Vai trò cơ bản: Admin, Project Owner, Collaborator, Subscriber
- Quyền hạn admin quản lý toàn bộ hệ thống
- Chủ sở hữu dự án (Project Owner) có quyền tạo, sửa, xóa project và components
- Collaborator được mời vào dự án, có quyền thao tác giới hạn (tùy thiết kế)
- Subscriber chỉ nhận thông báo, không có quyền chỉnh sửa
- Middleware kiểm tra quyền trước khi thực hiện hành động API

---

## 5. Bảo mật nâng cao

- Giới hạn số lần đăng nhập thất bại (rate limiting)
- CAPTCHA khi đăng ký hoặc đăng nhập để tránh bot
- Ghi log đăng nhập (địa chỉ IP, thời gian, user agent)
- Hỗ trợ xác thực hai yếu tố (2FA) (có thể mở rộng sau)

---

## 6. UX/UI cho Authentication

- Form đăng ký, đăng nhập đơn giản, dễ dùng trên desktop và mobile
- Thông báo lỗi rõ ràng (email không hợp lệ, mật khẩu yếu, tài khoản không tồn tại)
- Trang reset mật khẩu gửi link token có thời hạn
- Cho phép người dùng đăng xuất và quản lý phiên đăng nhập

---

## 7. Các thư viện gợi ý

| Nền tảng       | Thư viện / Công cụ           | Mô tả                                    |
|----------------|-----------------------------|-----------------------------------------|
| Backend Node.js| bcrypt, jsonwebtoken, passport.js | Hash password, JWT, OAuth2 integration  |
| OAuth2         | passport-google-oauth20      | Đăng nhập Google OAuth2                  |
| Rate Limiting  | express-rate-limit           | Giới hạn request, bảo vệ brute-force    |
| 2FA (tùy chọn) | speakeasy, otplib            | Tích hợp xác thực hai yếu tố             |

---

## 8. Quy trình tổng quan

1. Người dùng đăng ký hoặc đăng nhập
2. Backend xác thực thông tin, tạo access & refresh token
3. Frontend lưu token, gọi API kèm token xác thực
4. Backend kiểm tra token và quyền hạn trong middleware
5. Người dùng có thể đăng xuất hoặc refresh token khi hết hạn

---

# 🖥 Dashboard Nội Bộ (Chi Tiết)

## 🎯 Mục tiêu

- Cung cấp giao diện quản lý dễ sử dụng cho người sở hữu dự án và cộng tác viên
- Cho phép tạo, cập nhật, xóa các thành phần chính: Projects, Components, Incidents, Subscribers
- Cấu hình tuỳ chỉnh giao diện và tên miền cho từng project
- Theo dõi biểu đồ uptime và trạng thái hệ thống trực quan
- Quản lý phân quyền và người dùng liên quan đến project

---

## 1. Quản lý Projects

- Danh sách các dự án hiện có với thông tin cơ bản (tên, slug, trạng thái private/public)
- Tạo mới project với tên, slug, tuỳ chọn private, custom domain
- Chỉnh sửa thông tin project (branding, domain, trạng thái)
- Xóa project (với cảnh báo và xác nhận)
- Phân quyền quản lý cho người dùng khác (Collaborators)

---

## 2. Quản lý Components (Thành phần hệ thống)

- Hiển thị danh sách components thuộc project
- Thêm mới component (ví dụ: API, Database, Website)
- Cập nhật tên, trạng thái (operational, degraded, down, etc.)
- Xóa component không còn dùng

---

## 3. Quản lý Incidents (Sự cố)

- Tạo mới sự cố với tiêu đề, mô tả, trạng thái (investigating, identified, monitoring, resolved)
- Cập nhật chi tiết sự cố, thêm ghi chú hoặc hình ảnh minh hoạ
- Đóng sự cố khi đã giải quyết
- Lịch sử sự cố theo thời gian, lọc theo trạng thái hoặc component
- Giao diện tạo sự cố nhanh (quick incident report)

---

## 4. Quản lý Subscribers

- Danh sách người đăng ký nhận thông báo email/SMS
- Thêm/xóa subscriber, chỉnh sửa kênh nhận thông báo
- Tích hợp xác thực email (double opt-in) để đảm bảo đăng ký hợp lệ
- Thống kê số lượng subscriber theo từng kênh

---

## 5. Cấu hình Branding & Domain

- Tải logo riêng cho project
- Chọn màu sắc chủ đạo, font chữ, và các tuỳ chỉnh giao diện cơ bản
- Thiết lập tên miền tuỳ chỉnh (custom domain) với hướng dẫn cấu hình DNS (CNAME)
- Quản lý SSL (kết nối với Let’s Encrypt hoặc Cloudflare API)

---

## 6. Biểu đồ Uptime và Trạng thái

- Dashboard thể hiện trạng thái tổng quan của hệ thống theo thời gian
- Biểu đồ uptime (thời gian hoạt động) theo ngày/tuần/tháng
- Trạng thái realtime từng component (online/offline/degraded)
- Thống kê số sự cố theo loại trạng thái

---

## 7. UI/UX

- Thiết kế giao diện đơn giản, trực quan, responsive (desktop & mobile)
- Sử dụng component UI library (ví dụ: Chakra UI, Tailwind UI) hoặc tự custom
- Cập nhật trạng thái realtime qua WebSocket/Sockets (Socket.IO)
- Các form nhập liệu có validate và thông báo lỗi rõ ràng

---

## 8. Bảo mật

- Kiểm tra quyền truy cập trước khi cho phép thao tác trên các resource (Project, Component, Incident)
- Xác thực user ở mọi request
- Log hoạt động quan trọng (tạo sự cố, thay đổi trạng thái, xóa dự án...)

---

## 9. Gợi ý công nghệ

| Thành phần             | Công nghệ / Thư viện đề xuất       |
|-----------------------|----------------------------------|
| Frontend              | Next.js + React Query / SWR      |
| UI Components         | Tailwind CSS + Headless UI / Chakra UI |
| State management      | React Context / Redux (nếu phức tạp) |
| Realtime update       | Socket.IO client                 |
| Charts/Graphs         | Chart.js, Recharts, hoặc ApexCharts |

---

## 10. Quy trình hoạt động

1. Người dùng đăng nhập, chọn dự án cần quản lý
2. Truy cập dashboard tổng quan, xem trạng thái và biểu đồ uptime
3. Quản lý các component, tạo sự cố mới khi phát hiện lỗi
4. Cập nhật thông tin dự án, cấu hình branding và domain
5. Quản lý danh sách subscriber để gửi thông báo

---

# 🌐 Public Status Page (Chi Tiết)

## 🎯 Mục tiêu

- Cung cấp trang trạng thái công khai cho khách hàng, người dùng cuối
- Hiển thị rõ ràng trạng thái hệ thống, các thành phần và lịch sử sự cố
- Cho phép người dùng đăng ký nhận thông báo qua email hoặc SMS
- Hỗ trợ custom domain cho từng trang trạng thái
- Cập nhật realtime khi có sự cố mới mà không cần reload trang

---

## 1. URL truy cập

- Mặc định: /status/:slug (ví dụ: /status/myproject)
- Hỗ trợ custom domain riêng cho từng project (ví dụ: status.myproject.com)
- Cấu hình SSL cho custom domain để đảm bảo bảo mật

---

## 2. Thành phần hiển thị chính

- **Header:**
  - Tên dự án, logo (tuỳ chỉnh)
  - Link đến trang chủ hoặc các thông tin liên hệ

- **Status Overview:**
  - Danh sách các thành phần (components) với trạng thái hiện tại (operational, degraded, down)
  - Biểu tượng màu sắc dễ nhận biết (xanh, vàng, đỏ)

- **Lịch sử sự cố (Incident History):**
  - Danh sách các sự cố đã xảy ra, hiển thị tiêu đề, trạng thái và thời gian
  - Link chi tiết từng sự cố nếu cần

- **Biểu đồ Uptime:**
  - Hiển thị thời gian hoạt động của hệ thống theo ngày/tuần/tháng
  - Dễ hiểu, trực quan

- **Form đăng ký nhận thông báo:**
  - Thu thập email hoặc số điện thoại
  - Gửi yêu cầu đăng ký lên backend
  - Hiển thị thông báo thành công hoặc lỗi

---

## 3. Tính năng realtime

- Sử dụng WebSocket (Socket.IO hoặc Pusher) để cập nhật trạng thái component và sự cố mới
- Khi có incident mới hoặc component thay đổi trạng thái → update UI ngay lập tức
- Giảm tải cho server bằng cách gửi sự kiện chỉ khi có thay đổi

---

## 4. Responsive và tối ưu UX

- Thiết kế responsive, thân thiện với cả mobile và desktop
- Tốc độ tải trang nhanh, sử dụng kỹ thuật SSR (Server Side Rendering) hoặc SSG (Static Site Generation) nếu có thể
- Tránh gây phiền cho người dùng, tối ưu form đăng ký dễ dùng

---

## 5. Bảo mật và quyền riêng tư

- Không tiết lộ thông tin nhạy cảm trong trang công khai
- Có thể đặt trang trạng thái ở chế độ private, yêu cầu token hoặc đăng nhập để xem (tuỳ chọn)
- Hạn chế spam đăng ký nhận thông báo bằng CAPTCHA hoặc giới hạn tần suất

---

## 6. Gợi ý công nghệ

| Thành phần          | Công nghệ / Thư viện đề xuất       |
|--------------------|----------------------------------|
| Frontend           | Next.js (SSR/SSG) + React        |
| Realtime           | Socket.IO hoặc Pusher             |
| UI Components      | Tailwind CSS + Headless UI        |
| Form validation    | React Hook Form hoặc Formik       |
| Charts             | Chart.js hoặc Recharts            |

---

## 7. Quy trình hiển thị trang trạng thái

1. Truy cập URL trạng thái của project (slug hoặc domain tùy chỉnh)
2. Frontend gọi API lấy dữ liệu trạng thái, incidents, components, uptime
3. Hiển thị giao diện trực quan, biểu đồ uptime, danh sách sự cố
4. Người dùng có thể đăng ký nhận thông báo qua form
5. Khi có sự cố mới hoặc trạng thái thay đổi, frontend nhận event realtime để cập nhật UI

---

# 🔍 Monitoring (Chi Tiết)

## 🎯 Mục tiêu

- Theo dõi liên tục trạng thái của các endpoint, dịch vụ của người dùng
- Phát hiện sự cố nhanh chóng và chính xác
- Tự động tạo Incident khi phát hiện lỗi
- Lưu log trạng thái để phân tích và báo cáo uptime
- Hỗ trợ tích hợp với dịch vụ bên thứ ba

---

## 1. Thiết lập monitoring

- Người dùng thêm URL hoặc endpoint cần giám sát (ví dụ: API, website)
- Cấu hình tần suất kiểm tra (interval): 1 phút, 5 phút, 15 phút, tùy chọn
- Hỗ trợ nhiều loại check: HTTP status code, response time, nội dung trả về (keyword check)
- Lưu thông tin cấu hình monitoring vào CSDL (UptimeChecks table)

---

## 2. Thực hiện kiểm tra định kỳ (Cron Job)

- Dùng công cụ lập lịch (Node Cron, Agenda, hoặc dịch vụ bên ngoài)
- Mỗi khoảng thời gian định sẵn, gửi request tới endpoint
- Ghi lại kết quả: status code, thời gian phản hồi, trạng thái thành công/thất bại
- Nếu có lỗi (ví dụ: status code >= 400 hoặc timeout), đánh dấu check thất bại

---

## 3. Phát hiện sự cố và tạo Incident tự động

- Thiết lập ngưỡng lỗi (ví dụ: lỗi 3 lần liên tiếp mới tạo Incident)
- Khi phát hiện lỗi vượt ngưỡng:
  - Tự động tạo Incident với trạng thái "investigating"
  - Gửi thông báo cho admin/project owner
- Khi endpoint trở lại trạng thái bình thường:
  - Tự động đóng Incident (resolved)
  - Gửi thông báo cập nhật trạng thái

---

## 4. Lưu trữ và phân tích log

- Lưu trữ các kết quả kiểm tra (log) để tạo báo cáo uptime
- Thống kê tỷ lệ uptime theo ngày/tuần/tháng
- Dùng dữ liệu log để vẽ biểu đồ uptime trên dashboard và status page

---

## 5. Tích hợp với dịch vụ bên thứ ba (tuỳ chọn)

- Cho phép người dùng tích hợp với các dịch vụ monitoring nổi tiếng như:
  - UptimeRobot
  - Pingdom
  - Datadog
- Đồng bộ dữ liệu và sự cố từ dịch vụ bên ngoài vào hệ thống

---

## 6. Cảnh báo và thông báo

- Khi phát hiện sự cố hoặc phục hồi, gửi thông báo qua hệ thống Notification (email, SMS, Slack...)
- Hệ thống queue xử lý gửi thông báo đảm bảo không trễ hoặc quá tải

---

## 7. Gợi ý công nghệ

| Thành phần          | Công nghệ / Thư viện đề xuất         |
|--------------------|------------------------------------|
| Cron Job            | node-cron, Agenda.js, Bull (cho queue) |
| HTTP request        | Axios hoặc native fetch             |
| Log & Storage       | PostgreSQL hoặc TimescaleDB (thời gian) |
| Notification Queue  | Bull + Redis                       |

---

## 8. Quy trình tổng quan

1. Người dùng tạo check URL và cấu hình tần suất
2. Hệ thống thực hiện cron job theo interval đã chọn
3. Gửi request đến endpoint và nhận kết quả
4. Nếu lỗi vượt ngưỡng, tạo incident tự động và gửi cảnh báo
5. Lưu log kiểm tra và cập nhật báo cáo uptime

---

# 📣 Notification System (Chi Tiết)

## 🎯 Mục tiêu

- Gửi thông báo kịp thời khi có sự cố hoặc thay đổi trạng thái
- Hỗ trợ đa kênh: Email, SMS, Slack, Webhook, Discord...
- Đảm bảo độ tin cậy cao, quản lý trạng thái gửi thông báo
- Xử lý hàng đợi để tránh quá tải và retry khi gửi thất bại

---

## 1. Các kênh gửi thông báo

- **Email:** Sử dụng dịch vụ như SendGrid, Amazon SES, Mailgun
- **SMS:** Twilio, Nexmo hoặc các nhà cung cấp SMS khác
- **Slack:** Webhook API của Slack để gửi tin nhắn vào channel
- **Webhook:** Gửi POST request tới endpoint tuỳ chỉnh của người dùng
- **Discord:** Webhook tương tự Slack

---

## 2. Quy trình gửi thông báo

- Khi có sự kiện cần thông báo (ví dụ: tạo incident mới, cập nhật trạng thái)
- Thêm task gửi thông báo vào hàng đợi (Queue) để xử lý tuần tự
- Worker lấy task từ queue, thực hiện gửi qua kênh tương ứng
- Theo dõi trạng thái gửi: thành công, thất bại, retry

---

## 3. Hệ thống hàng đợi (Queue)

- Sử dụng Bull + Redis để quản lý queue gửi thông báo
- Hỗ trợ retry nhiều lần nếu gửi thất bại (với khoảng cách tăng dần)
- Log chi tiết trạng thái gửi, thời gian, lỗi nếu có
- Có thể scale worker để xử lý nhiều thông báo cùng lúc

---

## 4. Quản lý người nhận (Subscribers)

- Lưu thông tin người nhận (email, phone, kênh ưa thích)
- Hỗ trợ đăng ký / hủy đăng ký thông báo
- Tuỳ chỉnh nhận thông báo theo loại sự cố hoặc mức độ ưu tiên

---

## 5. Bảo mật và chống spam

- Giới hạn số lượng thông báo gửi trong một khoảng thời gian
- Xác thực webhook để tránh gửi nhầm hoặc bị giả mạo
- Mã hoá thông tin nhạy cảm khi lưu trữ (ví dụ: token webhook)

---

## 6. Gợi ý công nghệ

| Thành phần          | Công nghệ / Thư viện đề xuất       |
|--------------------|----------------------------------|
| Queue system       | Bull + Redis                      |
| Email service      | SendGrid, Amazon SES, Mailgun     |
| SMS service        | Twilio, Nexmo                    |
| Realtime notify    | Socket.IO (cho dashboard nội bộ)  |
| Logging            | Winston hoặc Pino (log chi tiết)  |

---

## 7. Quy trình hoạt động

1. Sự cố mới hoặc cập nhật được tạo
2. Backend thêm task gửi thông báo vào queue
3. Worker lấy task, gửi thông báo qua kênh tương ứng
4. Cập nhật trạng thái gửi và log kết quả
5. Nếu gửi thất bại, tự động retry theo quy tắc

---

# 🎨 Tuỳ chỉnh & Tên miền (Chi Tiết)

## 🎯 Mục tiêu

- Cho phép người dùng tùy biến giao diện trang trạng thái theo thương hiệu riêng
- Hỗ trợ thiết lập tên miền riêng (custom domain) cho từng project
- Cung cấp SSL miễn phí để đảm bảo bảo mật khi dùng custom domain
- Đảm bảo quá trình cấu hình dễ dàng, hướng dẫn rõ ràng

---

## 1. Tuỳ chỉnh giao diện

- **Logo:** Cho phép upload logo riêng cho project (định dạng PNG/JPG, giới hạn kích thước)
- **Màu sắc chủ đạo:** Chọn màu nền, màu chữ, màu trạng thái phù hợp với thương hiệu
- **Font chữ:** Hỗ trợ chọn font hoặc dùng font hệ thống
- **Văn bản tuỳ chỉnh:** Tiêu đề, mô tả, thông điệp hiển thị trên trang trạng thái
- **Bố cục:** Tuỳ chọn các thành phần hiển thị (biểu đồ uptime, lịch sử sự cố, form đăng ký...)

---

## 2. Thiết lập tên miền riêng (Custom Domain)

- Người dùng nhập tên miền muốn gán (vd: status.mycompany.com)
- Hệ thống tạo bản ghi CNAME hoặc A record để người dùng cấu hình DNS
- Hướng dẫn chi tiết từng bước cấu hình DNS cho người dùng
- Kiểm tra trạng thái DNS và xác nhận khi cấu hình thành công

---

## 3. SSL cho Custom Domain

- Tích hợp Let's Encrypt để tự động cấp và gia hạn SSL miễn phí
- Hoặc sử dụng API của Cloudflare để cấp SSL nếu dùng dịch vụ DNS Cloudflare
- Quản lý chứng chỉ SSL, tự động renew, cảnh báo khi hết hạn
- Đảm bảo trang trạng thái luôn dùng HTTPS khi có custom domain

---

## 4. Quản lý trạng thái trang

- Chế độ public hoặc private (bảo mật bằng token hoặc đăng nhập)
- Tuỳ chọn bật/tắt form đăng ký nhận thông báo
- Tùy chỉnh các thông tin liên hệ, footer, logo hiển thị trên trang công khai

---

## 5. Gợi ý công nghệ

| Thành phần          | Công nghệ / Thư viện đề xuất      |
|--------------------|---------------------------------|
| Upload file        | AWS S3, Cloudinary hoặc local storage |
| DNS check          | DNS lookup thư viện (node-dns, dig) |
| SSL management     | Certbot (Let's Encrypt), Cloudflare API |
| Frontend config UI | React + Tailwind CSS             |

---

## 6. Quy trình tổng quan

1. Người dùng upload logo và chọn màu sắc cho project
2. Nhập tên miền muốn dùng, nhận hướng dẫn cấu hình DNS
3. Hệ thống kiểm tra DNS và tự động cấp SSL
4. Người dùng xem trước giao diện tuỳ chỉnh
5. Kích hoạt trang trạng thái với tên miền riêng và tuỳ chỉnh giao diện

---

# ⚡ Realtime Update (Chi Tiết)

## 🎯 Mục tiêu

- Cập nhật trạng thái hệ thống, sự cố và các thay đổi ngay lập tức trên dashboard và trang trạng thái công khai
- Tăng trải nghiệm người dùng bằng cách tránh phải reload trang
- Giúp admin và khách truy cập luôn nhận thông tin mới nhất

---

## 1. Công nghệ realtime

- Sử dụng WebSocket thông qua thư viện như **Socket.IO** hoặc dịch vụ như **Pusher**
- Hỗ trợ kết nối hai chiều giữa client và server
- Cho phép server đẩy sự kiện (event) tới client ngay khi có thay đổi

---

## 2. Các sự kiện realtime cần xử lý

- Tạo mới incident
- Cập nhật trạng thái component (component status change)
- Cập nhật trạng thái incident (đang điều tra, đã giải quyết,...)
- Người dùng mới đăng ký nhận thông báo
- Các thay đổi trong dashboard (thêm/sửa/xóa components, projects...)

---

## 3. Kiến trúc hệ thống realtime

- Server:
  - Quản lý các kết nối WebSocket
  - Đẩy sự kiện đến client khi có thay đổi dữ liệu trong DB hoặc từ các service backend
- Client:
  - Lắng nghe các event realtime
  - Cập nhật giao diện (UI) tương ứng mà không cần reload trang

---

## 4. Bảo mật kết nối realtime

- Xác thực kết nối WebSocket bằng token hoặc session
- Giới hạn quyền truy cập dựa trên dự án hoặc vai trò người dùng
- Mã hóa dữ liệu nếu cần thiết

---

## 5. Giải pháp mở rộng

- Scale server WebSocket bằng Redis Pub/Sub để đồng bộ event giữa nhiều instance
- Sử dụng dịch vụ bên ngoài như Pusher hoặc Ably nếu không muốn tự triển khai

---

## 6. Gợi ý công nghệ

| Thành phần          | Công nghệ / Thư viện đề xuất    |
|--------------------|--------------------------------|
| WebSocket server   | Socket.IO                      |
| Pub/Sub scaling    | Redis                         |
| Client-side libs   | Socket.IO client, React hooks  |

---

## 7. Quy trình hoạt động

1. Client mở kết nối WebSocket khi load dashboard hoặc trang trạng thái
2. Server xác thực và giữ kết nối
3. Khi có sự kiện thay đổi (incident, component status), backend gửi event tới client
4. Client nhận event, cập nhật UI tương ứng ngay lập tức

---

# 🔗 API Design (RESTful) (Chi Tiết)

## 🎯 Mục tiêu

- Cung cấp API chuẩn REST để frontend và các dịch vụ khác tương tác với backend  
- Đảm bảo API rõ ràng, dễ sử dụng và mở rộng  
- Bảo mật API với xác thực và phân quyền phù hợp  
- Hỗ trợ các thao tác CRUD cho các entity chính  

---

## 1. Nguyên tắc thiết kế API

- Tuân thủ RESTful: URL đại diện tài nguyên, dùng HTTP methods đúng (GET, POST, PUT, DELETE)  
- Sử dụng JSON làm định dạng dữ liệu chính  
- Trả về mã trạng thái HTTP chính xác (200, 201, 400, 401, 404, 500...)  
- Hỗ trợ phân trang, lọc, và sắp xếp khi cần thiết  
- Xác thực bằng JWT hoặc OAuth2 token  

---

## 2. Các endpoint chính

| Phương thức | Endpoint                  | Mô tả                         | Yêu cầu Auth | Tham số chính                    |  
|-------------|---------------------------|-------------------------------|--------------|---------------------------------|  
| GET         | /api/status/:slug         | Lấy dữ liệu status page        | Không        | slug: định danh project          |  
| POST        | /api/incidents            | Tạo sự cố mới                  | Có           | project_id, title, content, ...  |  
| GET         | /api/incidents            | Danh sách sự cố của project    | Có           | project_id, trạng thái, phân trang|  
| PUT         | /api/incidents/:id        | Cập nhật sự cố                 | Có           | id (incident), trạng thái, nội dung|  
| POST        | /api/components           | Tạo component mới              | Có           | project_id, tên, trạng thái      |  
| GET         | /api/components/:project_id | Lấy danh sách component       | Có           | project_id                      |  
| POST        | /api/subscribe            | Đăng ký nhận thông báo         | Không        | project_id, email/phone, channel |  
| POST        | /api/monitor/ping         | Nhận ping từ monitoring system| Có           | url, status, response_time       |  
| POST        | /api/notify               | Gửi thông báo (từ backend)     | Có           | incident_id, channel, message    |  
| POST        | /api/auth/register        | Đăng ký người dùng             | Không        | email, password, name            |  
| POST        | /api/auth/login           | Đăng nhập                     | Không        | email, password                  |  
| POST        | /api/auth/logout          | Đăng xuất                     | Có           | token                           |  

---

## 3. Mẫu request/response

### Lấy status page theo slug

Request:  
GET /api/status/my-project

Response:  
{  
  "project": {  
    "id": "123",  
    "name": "My Project",  
    "slug": "my-project",  
    "components": [  
      {  
        "id": "comp1",  
        "name": "API Server",  
        "status": "operational"  
      },  
      ...  
    ],  
    "incidents": [  
      {  
        "id": "inc1",  
        "title": "Database downtime",  
        "status": "resolved",  
        "start_time": "...",  
        "end_time": "..."  
      },  
      ...  
    ],  
    "uptime": 99.9  
  }  
}  

---

## 4. Bảo mật API

- Sử dụng JWT Bearer token trong header Authorization  
- Kiểm tra phân quyền người dùng với dự án  
- Throttle request để tránh spam và tấn công DDoS  

---

## 5. Gợi ý công cụ hỗ trợ

- Swagger / OpenAPI cho tài liệu API  
- Postman hoặc Insomnia để test API  
- Joi hoặc Yup để validate request dữ liệu  

---

## 6. Quy trình tổng quan

1. Frontend gọi API với token hợp lệ  
2. Backend kiểm tra quyền và xử lý logic nghiệp vụ  
3. Trả về dữ liệu hoặc lỗi tương ứng  
4. Frontend cập nhật UI dựa trên dữ liệu nhận được  

---

# 🚀 Triển khai (Deployment) (Chi Tiết)

## 🎯 Mục tiêu

- Đưa hệ thống từ môi trường phát triển lên môi trường thực tế  
- Đảm bảo hệ thống hoạt động ổn định, sẵn sàng mở rộng và bảo mật  
- Tối ưu hóa quy trình deploy để dễ dàng cập nhật và bảo trì  

---

## 1. Môi trường deploy đề xuất

- Frontend:  
  - Vercel hoặc Netlify (tối ưu cho Next.js, hỗ trợ CDN tự động)  
- Backend:  
  - Render, Railway, hoặc tự host qua Docker trên VPS (DigitalOcean, AWS EC2, Linode…)  
- Database:  
  - Managed PostgreSQL như Supabase, ElephantSQL hoặc Amazon RDS  

---

## 2. Cấu hình môi trường

- Biến môi trường (Environment Variables) cho:  
  - API keys (SendGrid, Twilio, OAuth)  
  - Cấu hình DB connection  
  - JWT secret  
  - URL service monitoring  
- Không commit các file chứa config nhạy cảm vào git  

---

## 3. Container hóa (Docker)

- Viết Dockerfile cho frontend và backend  
- Docker Compose để quản lý multi-container (app + database + redis)  
- Tạo image, đẩy lên Docker Hub hoặc registry riêng  

---

## 4. CI/CD (Continuous Integration / Continuous Deployment)

- Sử dụng GitHub Actions hoặc GitLab CI để tự động build, test, deploy  
- Các bước chính:  
  - Build frontend, chạy test  
  - Build backend, chạy test  
  - Đẩy image Docker hoặc deploy code lên server  
- Tự động deploy khi push lên nhánh chính (main/master) hoặc tag  

---

## 5. Domain và SSL

- Cấu hình DNS trỏ tới hosting frontend và backend  
- Sử dụng Cloudflare hoặc Let’s Encrypt để cấp SSL miễn phí  
- Hỗ trợ HTTPS toàn hệ thống  

---

## 6. Giám sát và logging

- Thiết lập monitoring cho server và ứng dụng (Prometheus, Grafana, hoặc các dịch vụ cloud)  
- Thu thập log backend (winston, pino) và frontend (Sentry)  
- Cảnh báo khi hệ thống gặp sự cố  

---

## 7. Mở rộng và backup

- Thiết kế hệ thống có thể scale dễ dàng (load balancer, horizontal scaling)  
- Định kỳ backup database và cấu hình lưu trữ an toàn  
- Tối ưu hiệu năng, cache CDN, database indexing  

---

## 8. Lưu ý bảo mật

- Hạn chế quyền truy cập server  
- Cập nhật phần mềm thường xuyên  
- Sử dụng firewall, VPN, bảo vệ API bằng rate limiting  

---

## 9. Tổng kết

- Triển khai đúng quy trình giúp giảm thiểu downtime và lỗi  
- Tự động hóa deploy giúp đẩy nhanh tiến độ phát triển  
- Luôn có kế hoạch backup và recovery khi cần thiết  

---
# 🔐 Các Chế Độ Truy Cập (Chi Tiết)

## 🎯 Mục tiêu

- Đảm bảo an toàn dữ liệu và quyền truy cập phù hợp với từng loại người dùng và dự án  
- Hỗ trợ đa dạng chế độ truy cập để phù hợp với nhiều mô hình sử dụng khác nhau  

---

## 1. Chế độ Public

- **Mô tả:**  
  Trang trạng thái (Status Page) công khai, ai cũng có thể truy cập mà không cần đăng nhập hay token  
- **Ứng dụng:**  
  - Dùng cho các dự án muốn minh bạch trạng thái hệ thống với khách hàng  
- **Cách triển khai:**  
  - Không yêu cầu xác thực trên endpoint public  
  - Dữ liệu chỉ bao gồm thông tin cho phép công khai (không nhạy cảm)  

---

## 2. Chế độ Private

- **Mô tả:**  
  Trang trạng thái chỉ hiển thị khi người dùng đã đăng nhập hoặc cung cấp token hợp lệ  
- **Ứng dụng:**  
  - Dành cho các hệ thống nội bộ, khách hàng VIP, hoặc dự án yêu cầu bảo mật cao  
- **Cách triển khai:**  
  - Kiểm tra token JWT hoặc session cookie trước khi trả dữ liệu  
  - Có thể sử dụng OAuth hoặc SSO để quản lý quyền truy cập  
- **Lưu ý:**  
  - Cần xử lý giao diện đăng nhập và phân quyền chi tiết  

---

## 3. Chế độ Selective (Chọn lọc)

- **Mô tả:**  
  Chỉ nhóm người dùng hoặc đối tác xác định mới được truy cập trang trạng thái  
- **Ứng dụng:**  
  - Doanh nghiệp lớn, khách hàng có hợp đồng riêng biệt  
- **Cách triển khai:**  
  - Phân quyền chi tiết dựa trên user roles hoặc nhóm  
  - Quản lý danh sách whitelist/blacklist hoặc phân quyền theo dự án  
  - Có thể tích hợp với SSO (Google Workspace, SAML)  

---

## 4. Quản lý quyền người dùng (RBAC)

- Phân loại quyền: Admin, Editor, Viewer  
- Admin có quyền quản lý toàn bộ dự án và cấu hình  
- Editor có thể tạo/sửa incident, quản lý components  
- Viewer chỉ xem thông tin, không được chỉnh sửa  
- Cơ chế phân quyền áp dụng cho dashboard nội bộ và API  

---

## 5. Bảo vệ API

- Kiểm tra quyền truy cập trên mỗi endpoint API  
- Sử dụng middleware xác thực và phân quyền trên backend  
- Áp dụng rate limiting và throttle request  

---

## 6. Giao diện UX cho truy cập

- Giao diện đăng nhập/đăng ký rõ ràng  
- Thông báo trạng thái quyền truy cập (ví dụ: “Bạn không có quyền xem trang này”)  
- Tùy chỉnh giao diện status page theo chế độ (ví dụ, ẩn thông tin nhạy cảm với user không đủ quyền)  

---

## 7. Tổng kết

- Lựa chọn chế độ truy cập phù hợp với mục tiêu sử dụng và đối tượng khách hàng  
- Thiết kế bảo mật từ đầu giúp tránh rủi ro dữ liệu bị lộ hoặc bị tấn công  
- Hỗ trợ linh hoạt để mở rộng và tùy biến trong tương lai  
# ✅ Tính Năng Nâng Cao (Optional)

## 🎯 Mục tiêu

- Mở rộng chức năng cho dự án, tăng tính chuyên nghiệp và đáp ứng nhu cầu doanh nghiệp  
- Cung cấp trải nghiệm tốt hơn cho người dùng và quản trị viên  

---

## 1. SSO (Single Sign-On)

- Hỗ trợ đăng nhập qua các hệ thống như Google Workspace, SAML  
- Giúp doanh nghiệp quản lý người dùng tập trung  
- Tiết kiệm thời gian đăng nhập và tăng bảo mật  

---

## 2. Post-mortem (Ghi chú sau sự cố)

- Ghi lại phân tích, nguyên nhân và cách khắc phục sau mỗi sự cố  
- Cho phép quản trị viên và khách hàng xem lại lịch sử xử lý sự cố  
- Cải thiện quy trình xử lý và minh bạch thông tin  

---

## 3. Lưu trữ lịch sử uptime dài hạn

- Theo dõi và lưu trữ dữ liệu uptime trong 30, 90 ngày hoặc lâu hơn  
- Hiển thị biểu đồ chi tiết để phân tích xu hướng hoạt động hệ thống  
- Hỗ trợ báo cáo định kỳ và kiểm tra SLA  

---

## 4. Export dữ liệu và báo cáo PDF

- Cho phép xuất dữ liệu sự cố, uptime, subscriber ra file CSV hoặc PDF  
- Hỗ trợ chia sẻ báo cáo với khách hàng hoặc các bên liên quan  
- Tùy chỉnh mẫu báo cáo theo nhu cầu  

---

## 5. Giao diện đa ngôn ngữ (i18n)

- Hỗ trợ nhiều ngôn ngữ cho cả dashboard và status page  
- Tăng khả năng tiếp cận khách hàng quốc tế  
- Quản lý bản dịch dễ dàng, cập nhật linh hoạt  

---

## 6. Public API cho developer

- Cung cấp API để truy cập dữ liệu status page, incidents, subscribers...  
- Cho phép tích hợp với các hệ thống bên ngoài hoặc tự động hóa  
- Quản lý key API và phân quyền truy cập API  

---

## 7. Tổng kết

- Các tính năng nâng cao giúp sản phẩm chuyên nghiệp hơn, phù hợp với doanh nghiệp và thị trường lớn  
- Ưu tiên phát triển từng tính năng theo nhu cầu thực tế và phản hồi người dùng  
- Luôn đảm bảo bảo mật và hiệu suất khi mở rộng chức năng  
# 📁 Cấu Trúc Thư Mục Gợi Ý

## 🎯 Mục tiêu

- Tổ chức codebase rõ ràng, dễ quản lý và mở rộng  
- Phân chia các module theo chức năng, đảm bảo tách biệt và tái sử dụng được  

---

## Cấu trúc thư mục chính

/instatus-clone  
├── frontend/              # Ứng dụng frontend (Next.js, Tailwind CSS)  
├── backend/               # Backend API (NestJS hoặc Express)  
├── monitoring/            # Các cron jobs và logic kiểm tra trạng thái hệ thống  
├── notifications/         # Hệ thống gửi thông báo (email, SMS, Slack, webhook)  
├── database/              # Schema, migrations, seed dữ liệu cho database  

---

## Chi tiết từng thư mục

- **frontend/**  
  - Components, pages, styles, hooks  
  - Quản lý UI/UX, trạng thái realtime, tương tác người dùng  

- **backend/**  
  - Controllers, services, models, middleware  
  - Xử lý xác thực, API, business logic, phân quyền  

- **monitoring/**  
  - Cron jobs kiểm tra uptime, log kết quả  
  - Logic tạo sự cố khi phát hiện lỗi liên tục  

- **notifications/**  
  - Queue xử lý gửi thông báo, retry, logging  
  - Tích hợp các kênh như SendGrid, Twilio, Slack  

- **database/**  
  - File schema, migration scripts  
  - Seed dữ liệu mẫu và script backup  

---

## Lưu ý khi tổ chức

- Mỗi module nên có README riêng để mô tả chức năng và cách chạy  
- Dùng Docker hoặc Docker Compose để dễ dàng triển khai và phát triển đồng thời  
- Sử dụng Git với nhánh và commit rõ ràng, đặt convention commit message  

---

## Tổng kết

- Tổ chức dự án theo mô hình modular giúp dễ bảo trì và mở rộng  
- Giúp nhiều thành viên làm việc cùng nhau hiệu quả hơn  
- Chuẩn bị tốt cho CI/CD và các môi trường deploy khác nhau  
