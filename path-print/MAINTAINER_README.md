# Career Path Visualization - Maintainer Documentation

A comprehensive React TypeScript application for visualizing career progression, skills development, and future goals through interactive charts and timelines.

## 🚀 Features

- **Interactive Timeline View**: Visualize career milestones chronologically
- **Career Map**: Explore your journey through an interactive node-based map
- **Skills Radar Chart**: Track skill development across different categories
- **Progress Bars**: Monitor skill progression and goal completion
- **Goals & Planning**: Set and track future career objectives
- **Export & Sharing**: Generate PDFs and shareable links
- **Dark/Light Theme**: Automatic theme switching with manual override
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Data Format**: YAML/JSON
- **Icons**: Lucide React
- **Export**: jsPDF + html2canvas

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with ES2020+ support

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd path-print

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Configure Your Data

Edit the career data file at `src/data/career-data.yaml`:

```yaml
profile:
  name: "Your Name"
  title: "Your Title"
  bio: "Your professional bio"
  
milestones:
  - id: "milestone-1"
    type: "job"
    title: "Software Developer"
    organization: "Tech Company"
    dateRange:
      start: "2020-01-01"
      end: "2022-12-31"
    # ... more fields
```

### 3. Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 📁 Project Structure

```
path-print/
├── src/
│   ├── components/          # React components
│   │   ├── Layout/         # Layout components (Header, Navigation, etc.)
│   │   ├── Common/         # Shared components (LoadingSpinner, ErrorBoundary)
│   │   ├── Timeline/       # Timeline visualization components
│   │   ├── Map/           # Career map components
│   │   ├── Radar/         # Skills radar components
│   │   └── Progress/      # Progress bar components
│   ├── data/              # Data files and loaders
│   │   ├── career-data.yaml # Main career data file
│   │   └── loader.ts      # Data loading utilities
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts       # Main type definitions
│   │   └── validation.ts  # Validation schemas
│   ├── utils/             # Utility functions
│   │   └── validation.ts  # Data validation utilities
│   ├── App.tsx            # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── Requirements.md       # Project requirements
└── README.md            # This file
```

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript with proper type definitions
- **Imports**: Always use `import type { ... } from "types"` for type-only imports
- **Components**: Functional components with TypeScript interfaces for props
- **Documentation**: Comprehensive JSDoc comments for all functions and components
- **Error Handling**: Proper error boundaries and validation

### File Organization

- **Components**: One component per file with co-located types
- **Types**: Centralized in `src/types/` with detailed documentation
- **Utils**: Pure functions with comprehensive error handling
- **Data**: YAML/JSON files with validation schemas

### TypeScript Best Practices

```typescript
// ✅ Good: Type-only imports
import type { CareerData, Milestone } from '../types';

// ✅ Good: Proper interface definition
interface ComponentProps {
  data: CareerData;
  onUpdate?: (data: CareerData) => void;
}

// ✅ Good: Comprehensive JSDoc
/**
 * Validates career data structure
 * @param data - Raw career data to validate
 * @returns Validation result with errors and warnings
 */
export function validateCareerData(data: unknown): ValidationResult {
  // Implementation
}
```

## 📊 Data Structure

### Career Data Schema

The application uses a structured YAML/JSON format for career data:

```yaml
# Profile information
profile:
  name: string
  title: string
  bio: string
  avatar?: string
  contact?: ContactInfo

# Career milestones
milestones:
  - id: string (unique)
    type: "job" | "promotion" | "education" | "side_project"
    title: string
    organization: string
    dateRange:
      start: string (YYYY-MM-DD)
      end: string | null (YYYY-MM-DD or null for current)
    description: string
    highlights: string[]
    skills: Skill[]
    icon: string

# Skills with proficiency levels
skills:
  - id: string (unique)
    name: string
    level: 1-5 (Beginner to Master)
    category: string
    description?: string

# Future goals
goals:
  - id: string (unique)
    title: string
    description: string
    targetDate: string (YYYY-MM-DD)
    progress: number (0-100)
    priority: "low" | "medium" | "high" | "critical"
```

### Validation Rules

- All IDs must be unique across their respective arrays
- Dates must be in YYYY-MM-DD format
- Skill levels must be integers between 1-5
- Progress values must be between 0-100
- Required fields cannot be empty

## 🎨 Styling Guidelines

### Tailwind CSS Usage

- Use Tailwind utility classes for styling
- Custom CSS variables for theme colors
- Responsive design with mobile-first approach
- Dark mode support with `dark:` prefix

### Animation Guidelines

- Use Framer Motion for all animations
- Consistent animation durations and easing
- Respect user's motion preferences
- Performance-optimized animations

### Color Scheme

```css
/* Light theme */
--color-primary: #3B82F6;
--color-secondary: #10B981;
--color-accent: #F59E0B;

/* Dark theme */
--color-primary: #60A5FA;
--color-secondary: #34D399;
--color-accent: #FBBF24;
```

## 🧪 Testing

### Running Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Guidelines

- Test all data validation functions
- Test component rendering with different props
- Test error handling and edge cases
- Mock external dependencies

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_APP_TITLE=Career Path Visualization
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
```

### Static Hosting

The application builds to static files and can be hosted on:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

## 🔍 Troubleshooting

### Common Issues

1. **Data Loading Errors**
   - Check YAML/JSON syntax
   - Validate data structure against schema
   - Ensure all required fields are present

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all imports are correct

3. **Performance Issues**
   - Use React DevTools Profiler
   - Check for unnecessary re-renders
   - Optimize large datasets

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('debug', 'career-path:*');
```

## 📝 Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make changes with proper documentation
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit pull request with detailed description

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components have comprehensive documentation
- [ ] Error handling is implemented
- [ ] Tests cover new functionality
- [ ] Performance impact is considered
- [ ] Accessibility guidelines are followed

## 📞 Support

For questions or issues:

1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include error messages and reproduction steps

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Maintainer Notes:**
- Keep this documentation updated with any architectural changes
- Review and update dependencies regularly
- Monitor performance metrics in production
- Gather user feedback for future improvements
