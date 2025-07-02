# 🔧 React OAuth Integration Demo — Linear & GitLab

## 🎯 Mục tiêu

- Website React có 2 nút:
  - Kết nối với **Linear**
  - Kết nối với **GitLab**
- Sau khi kết nối:
  - Hiển thị danh sách **issue (Linear)**
  - Hiển thị danh sách **merge requests (GitLab)**

## ✅ TODO List

### I. Backend Server (Node.js + Express)

#### .env
- `LINEAR_CLIENT_ID`
- `LINEAR_CLIENT_SECRET`
- `LINEAR_REDIRECT_URI`
- `GITLAB_CLIENT_ID`
- `GITLAB_CLIENT_SECRET`
- `GITLAB_REDIRECT_URI`
- `MONGO_URI`
- `PORT`

#### Thiết lập OAuth callback routes
- `/auth/linear/callback`: xử lý mã `code`, gửi POST để lấy `access_token`, lưu lại
- `/auth/gitlab/callback`: tương tự cho GitLab

#### Tạo các API sử dụng token đã cấp
- `GET /api/linear/issues`: gọi Linear GraphQL API để lấy task của user
- `GET /api/gitlab/merge-requests`: gọi GitLab REST API để lấy merge request
- Xử lý refresh token

#### Lưu access token nhận được vào mongoDB
- Mongo URI: `MONGO_URI`

### II. Frontend React App

- React
- Vite
- JavaScript
- Tailwind CSS v4
- React Router
- Axios

#### UI
- Giao diện đẹp hơn với Tailwind/UI lib
- Hai `Card`:
  - `Connect to Linear`
  - `Connect to GitLab`
  - Trạng thái "đã kết nối" hoặc "chưa kết nối"
- Trang `/dashboard` hiển thị kết quả


#### OAuth Flow
- Khi bấm nút, redirect tới OAuth URL tương ứng
- Sau khi user đồng ý, redirect về `/callback` để xử lý
- Xử lý refresh token

#### Hiển thị dữ liệu
- Gọi API backend để lấy danh sách:
  - Task từ Linear
  - MR từ GitLab
- Hiển thị danh sách trên giao diện

## 🧪 API Gợi ý để dùng

### Linear
- Endpoint: `https://api.linear.app/graphql`
- Authorization: Bearer `<token>`
- Query: lấy danh sách issue được assign

### GitLab
- Endpoint: `https://gitlab.com/api/v4/merge_requests?author_username=<username>`
- Authorization: Bearer `<token>`