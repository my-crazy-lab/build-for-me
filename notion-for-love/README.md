# 💕 Love Journey

> *A beautiful, comprehensive relationship tracking application for couples to document, celebrate, and nurture their journey together.*

Love Journey is a modern, feature-rich web application designed specifically for couples who want to track their relationship milestones, set shared goals, preserve precious memories, and strengthen their bond through intentional relationship practices.

## ✨ Features

### 🏠 **Dashboard**
- Personalized welcome with relationship stats
- Quick access to recent milestones and memories
- Shared goals progress tracking
- Upcoming events and reminders
- Beautiful, customizable widgets

### 📅 **Timeline & Milestones**
- Interactive timeline of your relationship journey
- Rich milestone creation with photos, videos, and emotions
- Beautiful timeline and grid view modes
- Advanced filtering and search capabilities
- Favorite and highlight special moments

### 🎯 **Shared Goals**
- Kanban-style goal management
- Progress tracking with visual indicators
- Milestone breakdown for complex goals
- Category organization (financial, travel, learning, etc.)
- Collaborative goal setting and achievement

### 📸 **Memory Vault**
- Secure photo and video storage
- Advanced organization with tags and categories
- Beautiful masonry and grid layouts
- Lightbox viewing experience
- Memory reactions and comments

### 🔐 **Authentication & Security**
- Secure user registration and login
- Multi-step onboarding process
- Relationship linking and invitations
- Protected routes and data privacy

### 🎨 **Theming & Customization**
- Multiple color schemes (Earthy Neutrals, Romantic Pink, Ocean Blue, etc.)
- Dark/Light/System theme modes
- Responsive design for all devices
- Beautiful animations and transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/love-journey.git
   cd love-journey
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   # From the client directory
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

### Demo Access

You can try the application immediately with these demo credentials:
- **Email**: `admin@lovejourney.com`
- **Password**: `123456`

## 🏗️ Project Structure

```
notion-for-love/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API service functions
│   │   └── styles/         # Global styles and themes
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── controllers/        # Route controllers
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   └── package.json
├── .env.example           # Environment variables template
└── package.json           # Root package.json
```

## 🎯 Core Features

- **📆 Milestone Timeline** - Record key relationship moments
- **💬 Shared Goals & Notes** - Plan dreams together
- **📸 Memory Vault** - Store photos, videos, and memories
- **🧭 Couple Planning Board** - Kanban-style task management
- **❤️ Emotion Tracker** - Daily mood check-ins
- **⏳ Love Journey Map** - Interactive relationship timeline
- **🕰️ Time Capsule** - Messages for the future
- **🧑‍🤝‍🧑 Health Check-ins** - Relationship wellness prompts
- **📅 Love Calendar** - Shared events and reminders
- **🔒 Private Vault** - Secure storage for sensitive information
- **🌱 Growth Tracker** - Symbolic relationship tree
- **🌓 Dark Mode** - Beautiful dark/light theme support

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **Clsx** - Conditional className utility

### Development Tools
- **Create React App** - Development environment
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

### Design System
- **Earthy Neutrals** color palette by default
- **Inter** font for UI text
- **Playfair Display** for headings
- Responsive design principles
- Accessibility-first approach

## 🎨 Design Philosophy

Love Journey embraces a warm, romantic, and user-friendly design philosophy:

- **Earthy & Natural**: Warm terracotta, olive green, and cream beige colors
- **Clean & Modern**: Minimalist interface with purposeful design
- **Emotional**: Thoughtful use of animations and micro-interactions
- **Accessible**: WCAG compliant with keyboard navigation support
- **Responsive**: Beautiful on all devices from mobile to desktop

## 📱 Key Pages & Features

### Dashboard (`/dashboard`)
- Relationship statistics and progress
- Recent milestones timeline widget
- Shared goals progress widget
- Memory highlights gallery
- Quick action buttons

### Timeline (`/timeline`)
- Chronological view of relationship milestones
- Rich milestone details with media
- Filtering by category, emotion, and date
- Search functionality
- Grid and timeline view modes

### Goals (`/goals`)
- Kanban board for goal management
- Progress tracking and milestones
- Category-based organization
- Collaborative features
- Achievement celebrations

### Memory Vault (`/memories`)
- Photo and video gallery
- Advanced filtering and search
- Lightbox viewing experience
- Memory reactions and comments
- Masonry and grid layouts

### Authentication
- Beautiful login and registration forms
- Multi-step onboarding process
- Relationship setup and partner invitation
- Secure session management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Maintain the existing file structure

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@lovejourney.com
- 💬 GitHub Issues: [Create an issue](https://github.com/yourusername/love-journey/issues)
- 📖 Documentation: [View docs](https://docs.lovejourney.com)

---

**Made with 💕 for couples who want to celebrate their journey together.**

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Google OAuth + Demo mode
- **Media Storage:** Cloudinary
- **Animations:** Framer Motion

## 📱 Features

- Fully responsive design
- Progressive Web App (PWA) capabilities
- Real-time updates
- Secure authentication
- End-to-end encryption for sensitive data
- Beautiful animations and micro-interactions

## 🔐 Security

- JWT-based authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Encrypted sensitive data storage

## 🎨 Design

- Earthy Neutrals color palette
- Clean, professional UI
- Smooth animations and transitions
- Mobile-first responsive design
- Dark/Light mode support

## 📄 License

MIT License - see LICENSE file for details.
