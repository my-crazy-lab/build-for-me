# Career Path Visualization - Quick Setup Guide

## 🚨 Important: Node.js Version Requirement

This project requires **Node.js 18.0.0 or higher**. The current system has Node.js v14.21.3, which is too old.

### Upgrade Node.js

#### Option 1: Using Node Version Manager (nvm) - Recommended

```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18

# Verify the version
node --version  # Should show v18.x.x
```

#### Option 2: Download from Official Website

1. Go to [nodejs.org](https://nodejs.org/)
2. Download Node.js 18 LTS or higher
3. Install and restart your terminal
4. Verify with `node --version`

## 🚀 Quick Start

Once you have Node.js 18+:

```bash
# Navigate to the project directory
cd path-print

# Install dependencies
npm install

# Start the development server
npm run dev

# Open your browser to http://localhost:5173
```

## 📦 Dependencies Installation

The project uses these main dependencies:

```bash
# Core dependencies (will be installed with npm install)
npm install react react-dom
npm install framer-motion recharts
npm install js-yaml react-router-dom
npm install jspdf html2canvas
npm install lucide-react

# Development dependencies
npm install -D tailwindcss autoprefixer postcss
npm install -D @types/js-yaml
```

## 🔧 Current Status

### ✅ Completed
- Project structure and configuration
- TypeScript type definitions
- Core React components (Layout, Navigation, Header)
- Data loading utilities
- Sample career data (JSON format)
- Styling setup with Tailwind CSS
- Error handling and validation

### 🚧 To Be Implemented
- Timeline visualization component
- Career map visualization
- Skills radar chart
- Goals and planning interface
- Export functionality
- Animation polish

## 🐛 Known Issues & Fixes

### Issue 1: Node.js Version
**Problem**: `Unexpected token '||='` error
**Solution**: Upgrade to Node.js 18+ (see above)

### Issue 2: Missing Dependencies
**Problem**: Import errors for packages like `js-yaml`, `framer-motion`, etc.
**Solution**: Run `npm install` after upgrading Node.js

### Issue 3: YAML Loading
**Problem**: YAML files not loading
**Current Status**: Using JSON format temporarily
**Solution**: After `npm install`, YAML support will work automatically

## 📁 File Structure

```
path-print/
├── src/
│   ├── components/
│   │   ├── Layout/           # ✅ Complete
│   │   ├── Common/           # ✅ Complete
│   │   └── [Visualizations]  # 🚧 To be implemented
│   ├── data/
│   │   ├── career-data.json  # ✅ Sample data
│   │   └── loader.ts         # ✅ Data loading utilities
│   ├── types/                # ✅ Complete TypeScript definitions
│   ├── utils/                # ✅ Validation utilities
│   └── App.tsx               # ✅ Main application
├── public/                   # Static assets
└── [Config files]            # ✅ Complete
```

## 🎯 Next Steps for Development

1. **Install Dependencies**: Run `npm install` with Node.js 18+
2. **Start Development**: Run `npm run dev`
3. **Implement Visualizations**: Add timeline, map, and radar components
4. **Test with Your Data**: Replace sample data with your career information
5. **Customize Styling**: Modify colors and themes in Tailwind config

## 📝 Customizing Your Data

Edit `src/data/career-data.json` with your information:

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio..."
  },
  "milestones": [
    {
      "id": "unique-id",
      "type": "job|education|promotion|side_project",
      "title": "Position Title",
      "organization": "Company Name",
      "dateRange": {
        "start": "YYYY-MM-DD",
        "end": "YYYY-MM-DD" // or null for current
      },
      // ... more fields
    }
  ]
  // ... skills, goals, etc.
}
```

## 🆘 Getting Help

If you encounter issues:

1. **Check Node.js version**: `node --version` (must be 18+)
2. **Clear cache**: `rm -rf node_modules package-lock.json && npm install`
3. **Check console**: Look for error messages in browser dev tools
4. **Refer to documentation**: See `MAINTAINER_README.md` and `DEVELOPMENT.md`

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ `npm run dev` starts without errors
- ✅ Browser opens to `http://localhost:5173`
- ✅ You see the Career Path application with sample data
- ✅ Navigation menu works and theme toggle functions
- ✅ No TypeScript errors in the console

---

**Note**: This is a foundational implementation. The visualization components (timeline, map, radar) will be implemented in subsequent development phases.
