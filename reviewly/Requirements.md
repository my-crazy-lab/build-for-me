# Reviewly - Self Review for Performance Review

## Problem

- Many employees don’t know how to self-evaluate properly: reluctant to write, afraid to sound boastful, or unsure which data to select as evidence.
- HR spends excessive time reading and consolidating self-reviews that vary greatly in format, quality, and completeness.
- Managers struggle to benchmark salaries effectively against market standards due to lack of standardized data and clear, concise summaries.

---

## (Completed)Phase 1: Basic Features

### Objectives
- Standardize the self-evaluation and review consolidation workflow for employees and HR.
- Provide tools to support ongoing competency management and gather peer feedback efficiently.

### Key Features

- **Self-review form divided into structured sections:** task description, results achieved, skills applied/developed, received feedback.  
  _(Each section should guide users to input clear, concise, and relevant information.)_

- **Template question prompts:** examples include “Describe your most important task this period,” “Did you acquire any new skills?”, “What achievement are you most proud of?”  
  _(Questions should be customizable per company or department.)_

- **Multi-language support and customizable templates** tailored to company/industry specifics to ensure cultural and contextual relevance.

- **Automatic data import from external tools:**  
  - Integrate with GitHub, Jira, Notion (via APIs/OAuth) to import commit messages, issue tickets, Notion pages as verifiable proof of accomplishments.  
  - Include strict permission handling and security measures (OAuth scopes, token management).

- **Basic auto-summary:** automatically group and summarize imported and self-entered information by categories (tasks, results, skills) to reduce manual effort.

- **Anonymous peer review:** simple, short feedback forms sent to colleagues to provide candid input without fear of identification.

- **Personal career matrix and progress tracking:**  
  - Visualize competency development and skill acquisition over multiple review periods.

- **Employee dashboard overview:**  
  - Display review history across periods.  
  - Show visual trends highlighting strengths and areas for improvement.  
  - Support multiple companies/accounts to allow employees to track development across job changes.  
  - **Interactive charts and visualizations** for skill growth, review scores, peer feedback trends.  
  - **Dark mode / light mode toggle** for accessibility and user comfort.  
  - **Notifications and reminders** for review deadlines, new feedback submissions, and milestones.  
  - **Fully responsive design** optimized for desktop and mobile devices.

- **Advanced HR/Manager View:**  
  - Aggregate reviews by team or department.  
  - Filter and highlight key data points (e.g., skill gaps, high performers).  
  - Visual analytics dashboards showing team performance and progress metrics.

- **Light gamification:**  
  - Award skill badges and provide personalized goal suggestions to motivate users.

- **Export polished reports:** generate well-formatted PDF/Word files for sharing with HR or management.

- **Manual salary benchmark:** HR can input market salary data for comparison with internal evaluations.

---

## Phase 2: Advanced AI Features

### Objectives
- Minimize manual writing and review consolidation workload for employees and HR.  
- Improve accuracy, fairness, and transparency in salary increase recommendations.

### Main AI Features

- **AI-driven interactive Q&A & auto-fill review content:**  
  - Chatbot interface guides users through answering review questions naturally.  
  - Generate draft answers based on personal data and template prompts.

- **Advanced auto-summary and review writing using frameworks:**  
  - Support STAR, OKR, or company-specific review frameworks.  
  - Output clear, structured evaluations broken down by skills demonstrated and business impact.

- **AI emotion and tone analysis:**  
  - Analyze text for sentiment and tone, suggest edits to make reviews balanced, professional, and constructive.

- **AI salary benchmark recommendation:**  
  - Compare employee competencies and current salary with market data from platforms like Levels.fyi, Glassdoor, RemoteOK.  
  - Automatically propose fair and transparent salary raise suggestions.

---

## Techstack

- Client: React.js + TypeScript  
- UI: Earthy Neutrals and Dark Mode + Neon Accent (as per design decision)  
- Database: MongoDB  
- Authentication: Google OAuth + fake login mode with admin:123456 for demo/testing

---

## Notes for Code Generation

- ✅ Optimize SEO  
  - Use semantic HTML5 structure  
  - Set correct `<title>`, `meta description`, and Open Graph tags  
  - All images must include `alt` attributes  
  - Generate and link to `sitemap.xml` and `robots.txt`  
  - Use clean, readable URLs (no `?id=123`)  
  - Ensure responsive design and fast loading speed (Core Web Vitals)  
  - Apply structured data (Schema.org) where applicable  
  - Avoid duplicate content and broken links  

- 🔐 Advance Security  
  - Enforce HTTPS and use secure SSL/TLS settings  
  - Set security headers: `Content-Security-Policy`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, etc.  
  - Validate and sanitize all inputs on both client and (eventual) backend  
  - Use proper file permission and avoid exposing sensitive `.env`/config files  
  - Prepare for CSRF/XSS protection in future backend integration  
  - Include `TODO security` notes at sensitive logic areas for later audit  
  - Implement basic rate limiting or CAPTCHA where forms exist (even mock ones)  

- Separate interfaces and enums into two distinct TypeScript files.  
  - Always use `import type` when importing interfaces.  
  - When importing, keep enums and interfaces in separate import blocks for clarity.

- Include clear and thorough code comments, plus a standard header comment at the top of every file covering purpose, details, creation date, and version.  
- Focus heavily on delivering a visually stunning UI with smooth animations and excellent UX.  
- No backend implementation required initially; use mocked/fake data on the client side with clear `TODO backend` comments for future integration.  
- Deployment is out of scope.