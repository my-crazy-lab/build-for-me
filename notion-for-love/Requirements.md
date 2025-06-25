# ❤️ Love Journey

A shared dashboard for couples to **record**, **plan**, and **grow together** throughout their relationship journey — from dating to marriage, raising a family, and growing old together.

---

## 🎯 Core Vision

> "Notion for Love" — A space to document meaningful milestones, plan dreams together, and nurture emotional connection throughout a lifetime.

---

## 📦 Core Features

### 📆 Milestone Timeline
- Visual timeline to record key moments: first meeting, first date, proposal, wedding, children, anniversaries, etc.
- Each milestone can include: date, photo, notes, location, and emotions.
- Option to add custom events (e.g. first fight, moved in together).

---

### 💬 Shared Goals & Notes
- Joint goal setting: life dreams, relationship commitments, or bucket list items.
- Examples: "Travel to Iceland before 40", "Save for a house", "Run a marathon together".
- Categorize goals: Travel, Finance, Health, Family, Learning...
- Editable notes or linked sub-tasks.

---

### 📸 Memory Vault
- Upload photos, videos, voice clips from different phases of your journey.
- Organize by themes, milestones, or years.
- Private, secure storage with encryption.
- Memory “Highlights” — monthly/yearly recaps or AI-curated love reels.

---

### 🧭 Couple Planning Board
- Kanban-style board (like Trello) tailored for couples.
- Columns like: "To Do Together", "Planning", "In Progress", "Done".
- Assign tasks to each partner.
- Tag by type (household, finances, romantic, family, etc.)

---

### ❤️ Emotion Tracker
- Daily/weekly mood check-ins via emojis, quick notes, or ratings.
- Reflect over time to see emotional trends or patterns.
- Useful for mental health awareness and deeper understanding.

---

### ⏳ Love Journey Map
- Interactive relationship map (timeline/roadmap view).
- Zoom into periods (e.g., Year 1, Newlywed phase, Parenthood).
- Combine milestones, photos, notes, and mood into a visual "map".

---

### 🕰️ Time Capsule
- Write a love letter to the future.
- Record voice/video for future anniversaries.
- Unlock capsules at set times (e.g., 5th anniversary, child's birth).
- Can create shared or individual capsules.

---

### 🧑‍🤝‍🧑 Relationship Health Check-ins
- Weekly or monthly prompts like:
  - "What made you smile this week?"
  - "How do you feel in the relationship right now?"
  - "What can we improve?"
- Sentiments saved privately or shared.
- Gamification: badges for consistency, honesty, empathy, etc.

---

### 📅 Love Calendar
- Shared calendar for important events: anniversaries, date nights, family events.
- Smart reminders with suggestions: gift ideas, celebration spots, love quotes.
- Sync with Google Calendar or Apple Calendar.

---

### 🔒 Private Vault / Legacy Box
- A secured place to keep:
  - Love letters
  - Shared passwords
  - Will or inheritance info
  - Final wishes
- Accessible with both partners' consent or upon future triggers.

---

### 🌓 Dark Mode Support
- Full support for Dark/Light mode toggle.
- Respects system preferences by default, with manual override.
- Enhances nighttime usability, reduces eye strain.
- Thoughtfully designed color palette to preserve emotion and intimacy in dark environments.

---

### ⚙️ Micro-interactions & Animation
- Subtle animations to create a polished, interactive experience.
- Examples include:
  - Submit button transitions on hover or click.
  - Soft shake effect on form validation errors.
  - Loading indicators with romantic/fluid motion (e.g., heartbeats, flowing lines).
- Adds delight and human touch, enhancing trust and emotional immersion.

---

### 🌱 Growth Tracker (Couple's Tree)
- A symbolic tree that grows with your relationship.
- Earn "leaves" or "flowers" for each milestone, act of love, or shared achievement.
- Visual motivation and a gamified way to nurture the relationship.

---

### 🧩 Modular & Customizable Layout
- Personalized dashboard layout with drag-and-drop blocks (Milestones, Goals, Calendar, Vault, etc.).
- Each couple can prioritize what matters most to them.
- Ability to hide unused modules or reorder sections.
- Optional themes or layout presets (e.g., Minimal, Timeline-focused, Memory-first).

---

### 🧭 Global Navigation & Search
- Clean sidebar or top navigation for quick access to core sections: Timeline, Vault, Goals, Calendar, Planning Board.
- Persistent global search bar:
  - Search by keyword, date, type (e.g. "Proposal", "Japan trip", "2022").
  - Search across all notes, goals, tasks, memories, and check-ins.
- Keyboard shortcuts (e.g. `/` to search, `cmd+K` to navigate).

---

## 🛡️ Notes on Privacy & Safety
- End-to-end encryption for personal memories and data.
- Optional biometric lock (FaceID / Fingerprint).
- Relationship failsafe: define what happens in the event of a breakup (archive or delete together).

---

# Implement

## Techstack

- Client: React.js + JavaScript  
- UI: Tailwind CSS + Framer Motion for animations
- Backend: Nodejs + Expressjs
- Database: MongoDB 
- Authentication: Just login with Google OAuth (don't allow register) and fake login mode with admin:123456 for demo/testing
- `.env` file: give me `.env.example` store key to run the project. **IMPORTANT**: don't fake data, must integration client/server.

### MongoDB Schema

#### Users

```json
{
  "_id": "ObjectId",
  "email": "String",
  "name": "String",
  "avatar": "String",
  "joinedAt": "Date",
  "relationshipId": "ObjectId",
  "role": "String" // "partner" | "admin"
}
```

#### Relationships

```json
{
  "_id": "ObjectId",
  "coupleName": "String",
  "createdAt": "Date",
  "status": "String", // "active" | "archived" | "ended"
  "partnerIds": ["ObjectId"],
  "preferences": {
    "theme": "String",
    "layout": "String"
  }
}
```

#### Milestones

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "date": "Date",
  "location": "String",
  "notes": "String",
  "emotions": ["String"],
  "media": ["String"],
  "tags": ["String"],
  "createdBy": "ObjectId"
}
```

#### Goals

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "category": "String",
  "description": "String",
  "status": "String",
  "createdAt": "Date",
  "createdBy": "ObjectId",
  "taskIds": ["ObjectId"]
}
```

#### Tasks

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "description": "String",
  "assignedTo": "ObjectId",
  "dueDate": "Date",
  "status": "String",
  "tags": ["String"],
  "goalId": "ObjectId"
}
```

#### Memories

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "description": "String",
  "type": "String",
  "url": "String",
  "tags": ["String"],
  "milestoneId": "ObjectId",
  "uploadedBy": "ObjectId",
  "createdAt": "Date"
}
```

#### Emotions (Mood Tracker)

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "userId": "ObjectId",
  "date": "Date",
  "mood": "String",
  "note": "String"
}

```

#### Time Capsules

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "message": "String",
  "mediaUrl": "String",
  "unlockAt": "Date",
  "createdBy": "ObjectId",
  "shared": "Boolean"
}

```

#### Check-ins (Relationship Health)

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "userId": "ObjectId",
  "date": "Date",
  "prompt": "String",
  "response": "String",
  "badge": "String"
}

```

#### Events (Love Calendar)

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "description": "String",
  "date": "Date",
  "type": "String",
  "reminders": [
    {
      "method": "String",
      "offsetMinutes": "Number"
    }
  ],
  "createdBy": "ObjectId"
}

```

#### Private Vault / Legacy Box

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "title": "String",
  "type": "String",
  "content": "String",
  "attachments": ["String"],
  "accessRules": {
    "requireBothConsent": "Boolean",
    "unlockDate": "Date"
  },
  "createdBy": "ObjectId",
  "createdAt": "Date"
}

```

#### Growth Tracker (Couple's Tree)

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "leavesCount": "Number",
  "flowersCount": "Number",
  "lastUpdated": "Date",
  "milestonesEarned": ["ObjectId"]
}

```

#### Layout Preferences (Modular Dashboard)

```json
{
  "_id": "ObjectId",
  "relationshipId": "ObjectId",
  "layoutConfig": "Object",
  "updatedAt": "Date"
}

```

---

## User Flow & Navigation

### 1. Login / Authentication Flow

- Main login screen
  - Login with Google OAuth
  - Demo login mode (admin:123456)
- After successful login → redirect to the **Main Dashboard**

---

### 2. Main Dashboard (Landing Page)

- Overview of modules:
  - Milestone Timeline
  - Shared Goals
  - Memory Highlights
  - Couple Planning Board (Task Kanban)
  - Emotion Tracker
  - Love Calendar
  - Growth Tracker (Couple’s Tree)
- Features:
  - Drag & drop to arrange modules
  - Show/hide modules based on preference
  - Choose theme (Dark/Light)
  
---

### 3. Milestone Timeline

- View list of milestones in timeline format
- Add / edit milestones (title, date, location, notes, emotions, media)
- View milestone details (photos, notes, emotions)
- Connect related Memories to milestones

---

### 4. Shared Goals & Tasks

- List of Goals by category (Travel, Finance, Health, Family, Learning, ...)
- Add, edit, delete Goals
- Manage Goal statuses (active, completed, archived)
- Manage Tasks via Kanban board:
  - Status columns: To Do Together, Planning, In Progress, Done
  - Add, edit, assign tasks to each partner
  - Tag and categorize tasks (household, finances, romantic, family, ...)

---

### 5. Memory Vault

- Upload and store photos, videos, voice clips
- Categorize by themes, milestones, year
- View Memory Highlights (recaps, AI-curated reels)
- Manage privacy settings, data encryption

---

### 6. Emotion Tracker

- Enter mood (emoji, rating, note) daily or weekly
- View charts and analyze emotional trends
- Suggest actions based on emotional state

---

### 7. Time Capsule

- Create love letters or record audio/video messages for the future
- Set unlock date (5th anniversary, child's birth, ...)
- Manage personal capsules or shared capsules
- View and open capsules that have reached their unlock date

---

### 8. Relationship Health Check-ins

- Answer periodic questions (weekly/monthly)
- View check-in history and analysis
- Earn gamification badges (consistency, honesty, empathy...)

---

### 9. Love Calendar

- View and add shared events (anniversaries, date nights, family events)
- Set smart reminders (gift ideas, quotes, locations)
- Sync with Google Calendar or Apple Calendar

---

### 10. Private Vault / Legacy Box

- Store love letters, passwords, wills, final wishes
- Manage access permissions (requires consent from both partners)
- Set unlock triggers (breakup, future date...)

---

### 11. Global Navigation

- Fixed sidebar or top bar:
  - Dashboard
  - Timeline
  - Goals & Tasks
  - Memory Vault
  - Planning Board
  - Emotion Tracker
  - Calendar
  - Time Capsule
  - Private Vault
  - Settings (Profile, Theme, Preferences)
- Persistent search bar:
  - Search by keyword, date, type (Proposal, Japan trip, ...)
  - Search across all content: notes, goals, tasks, memories, check-ins
- Keyboard shortcuts (e.g., `/` for search, `cmd+K` to switch pages)

---

### 12. Settings & Preferences

- Manage personal profile
- Change theme (Dark/Light)
- Configure dashboard layout
- Security & privacy settings (biometric lock, failsafe)

---

### 13. Animation & UX Detailed Requirements

- **Smooth and subtle animations:**
  - Hover and click effects for buttons, inputs, cards (e.g., slight press, color change, shadow)
  - Romantic-themed loading indicators (e.g., beating heart, gentle flow)
  - Transitions for page changes and popups (fade, slide, subtle scaling)
  
- **Clear user feedback:**
  - Validation error effects: slight shake on form or red input border
  - Success feedback: checkmark animation, gentle toast message
  - Confirmation dialogs with smooth open/close animations

- **Micro-interactions:**
  - Highlight timeline milestones on hover and selection
  - Smooth drag & drop of modules and tasks with dragging shadow
  - Badge animations when achievements/gamification earned
  
- **Optimize mobile experience:**
  - Touch gesture support (swipe, long press)
  - Optimize speed and battery usage

- **Dark Mode support:**
  - Appropriate color and lighting shifts, maintaining warmth and intimacy
  - Gentle animations avoiding harsh brightness at night

---

### 14. Search & Filter Detailed

- **Search scope:**
  - Entire app content: Milestones, Goals, Tasks, Memories, Check-ins, Calendar events, Capsules
  - Support search by keyword, name, description, tag, emotion, date

- **Advanced filters:**
  - By entity type (Milestone, Goal, Task, Memory, ...)
  - By time (Day, Month, Year, custom range)
  - By status (completed, in-progress, archived, ...)
  - By tag/category (Travel, Finance, Romantic, Family, ...)
  - By creator / assigned partner
  - By emotion level (Emotion Tracker)

- **Search interface:**
  - Always visible global search bar (sidebar/topbar)
  - Results grouped by entity type, each group with title and keyword highlights
  - Allow quick actions directly in results (e.g., open detail, edit, change status)

- **Additional features:**
  - Search history and suggestions based on previous activity
  - Keyboard shortcut for search (type `/` or `cmd+K`)
  - Fast search with autocomplete, tag and date suggestions

- **Performance:**
  - Backend optimized for fast queries, paginate or infinite scroll results
  - Cache popular search results

## 🔧 Additional Technical Details & Project Management

### 1. Detailed Data Model Enhancements

- **Emotion types:**  
  Define a set of common emotions (e.g., happy, sad, excited, frustrated, loved, anxious) to standardize emotion tagging.  
  Allow adding custom emotions if needed.

- **Tags:**  
  Standardize tag lists per module (milestones, goals, tasks, memories, etc.) for consistent categorization, e.g., Travel, Finance, Romantic, Family, Health, Learning.  
  Support nested tags if required.

- **Media storage:**  
  Clarify backend media storage (photos, videos, voice clips):  
  - Use cloud storage (AWS S3, Firebase Storage, etc.)  
  - Store media URLs in the database  
  - Define max file size and allowed formats.

---

### 2. Preliminary API Specification (per module)

- CRUD endpoints for all entities (milestones, goals, tasks, memories, emotions, capsules, events, vault, growth tracker)  
- Pagination, filtering, sorting for list APIs  
- Global search API and module-specific search (with advanced filters)  
- Media upload API supporting multipart/form-data or pre-signed URLs

---

### 3. Performance & Caching

- MongoDB indexes on frequently searched fields:  
  - relationshipId, userId, date, status, tags  
- Cache popular search results using Redis or similar  
- Use pagination or infinite scroll on APIs returning large lists  
- Optimize backend queries to avoid full collection scans

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

- Include clear and thorough code comments, plus a standard header comment at the top of every file covering purpose, details, creation date, and version.  
- Focus heavily on delivering a visually stunning UI with smooth animations and excellent UX.  
- Deployment is out of scope.
