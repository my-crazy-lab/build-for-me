# Technical Specification

---

## Tech Stack

- **Client:** React.js + JavaScript  
- **UI:** Tailwind CSS + Framer Motion (animations)  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:**  
  - Google OAuth (login only, no registration)  
  - Demo mode: fake login with username `admin` and password `123456`  
- **Environment Variables:** Provide `.env.example` with all necessary keys for running the project.  
  **Note:** No fake data in `.env.example`. Must integrate client and server authentically.

---

## Code Generation Guidelines

### SEO Optimization

- Use semantic HTML5 structure.  
- Set meaningful `<title>`, `meta description`, and Open Graph tags.  
- All images must include descriptive `alt` attributes.  
- Generate and link `sitemap.xml` and `robots.txt`.  
- Use clean, human-readable URLs (no query parameters like `?id=123`).  
- Ensure responsive design and fast loading times (meet Core Web Vitals).  
- Implement structured data (Schema.org) where applicable.  
- Avoid duplicate content and broken links.

### Security Best Practices

- Enforce HTTPS with secure SSL/TLS settings.  
- Set security headers: `Content-Security-Policy`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, etc.  
- Validate and sanitize all inputs on client and backend.  
- Protect sensitive files (`.env`, configs) and use proper file permissions.  
- Prepare for CSRF and XSS protections in backend.  
- Add `TODO security` comments near sensitive logic for later audit.  
- Implement basic rate limiting or CAPTCHA on forms (even mock ones).

### Development Practices

- Include clear, thorough code comments.  
- Add a standard header comment on every file with purpose, details, creation date, and version.  
- Focus on polished UI with smooth animations and excellent UX.  
- Initially, no real backend implementation—use mocked/fake data with clear `TODO backend` comments for future integration.  
- Deployment is out of scope.

---

## Backend Technical Specification

### 1. Authentication & Authorization

- **Authentication:**  
  - Only Google OAuth 2.0 login supported.  
  - After OAuth success, backend issues JWT access token to client.  
  - Token expiration: 1 hour (configurable).  
  - Optionally support refresh tokens for renewing JWT.

- **Authorization:**  
  - Users can only access their own students’ data by default.  
  - Sharing a student with another user grants read-only access to that user.  
  - Backend verifies JWT and ACL on every request.  
  - Unauthorized access returns HTTP 403 Forbidden.

- **Session:**  
  - Stateless JWT authentication.  
  - Optional token revocation/blacklist support.

- **Security:**  
  - Validate and sanitize OAuth payload and all inputs.  
  - Enforce HTTPS in production.

### 2. Error Handling & Security

- **Error Responses:** Use consistent JSON format:  
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Descriptive error message"
    }
  }
  ```

- Handle standard HTTP errors:  
  - 400 Bad Request (validation errors)  
  - 401 Unauthorized (invalid or missing token)  
  - 403 Forbidden (permission denied)  
  - 404 Not Found (resource not found)  
  - 500 Internal Server Error (unexpected errors)

- **Input Validation:**  
  - Use libraries like Joi or express-validator.  
  - Sanitize inputs to prevent NoSQL injection, XSS.

- **Security Measures:**  
  - Use Helmet middleware for security headers.  
  - Implement rate limiting on APIs.  
  - Protect against CSRF and XSS.  
  - Log security events and errors with sensitive data masked.

### 3. Backend Development Setup

- **Prerequisites:**  
  - Node.js v22  
  - MongoDB (local or cloud)  
  - npm or yarn

- **Setup:**  
  1. Clone repository.  
  2. Copy `.env.example` to `.env` and fill environment variables.  
  3. Run `npm install` or `yarn` to install dependencies.

- **Running:**  
  - Development (with auto-reload): `npm run dev` or `yarn dev`  
  - Production: `npm start` or `yarn start`

- **Testing:**  
  - Run tests: `npm test` or `yarn test`  
  - Tests cover API, authentication, and database interactions.

- **Debugging & Logging:**  
  - Use Winston, Morgan, or similar for logs.  
  - Configure log level via environment variable (e.g., `LOG_LEVEL`).

- **Code Quality:**  
  - Use ESLint and Prettier for linting and formatting.

---

## Non-functional Requirements

### Performance
- The backend API should respond to requests within 200ms under normal load.  
- Support concurrent access by multiple users with minimal latency.  
- Implement efficient database queries with proper indexing to optimize performance.

### Scalability
- Design the backend to be horizontally scalable, allowing multiple instances behind a load balancer.  
- Database schema and API should support data growth for multiple users and students over years.

### Reliability & Availability
- Backend services should have uptime of 99.9%.  
- Implement proper error handling and fallback mechanisms to prevent crashes.  
- Use retries and graceful degradation where applicable.

### Security
- Ensure data privacy and protection according to best practices (e.g., GDPR if applicable).  
- Protect sensitive information in transit (HTTPS) and at rest (encrypted fields if needed).  
- Regularly audit and update dependencies to mitigate vulnerabilities.

### Maintainability
- Codebase should follow clean code principles with modular, reusable components.  
- Provide comprehensive documentation and comments.  
- Implement automated tests to support refactoring and future development.

### Usability
- Provide clear and consistent API responses and error messages for easier client integration.  
- Ensure backward compatibility when releasing API updates (versioning strategy).

### Portability
- Backend should be deployable on multiple environments (local, staging, production).  
- Configuration via environment variables to adapt to different deployment setups.

### Logging & Monitoring
- Implement structured logging for requests, errors, and security events.  
- Integrate with monitoring tools to track health, performance, and usage metrics.

---
