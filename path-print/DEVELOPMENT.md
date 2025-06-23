# Career Path Visualization - Development Guide

This guide provides detailed instructions for developers working on the Career Path Visualization application.

## 🏗️ Architecture Overview

### Application Structure

The application follows a modular architecture with clear separation of concerns:

```
src/
├── components/          # React components organized by feature
├── types/              # TypeScript type definitions
├── data/               # Data loading and management
├── utils/              # Utility functions and helpers
├── hooks/              # Custom React hooks (future)
└── styles/             # Global styles and themes
```

### Key Design Principles

1. **Type Safety**: Strict TypeScript usage with comprehensive type definitions
2. **Component Composition**: Reusable, composable React components
3. **Data Validation**: Runtime validation of all external data
4. **Error Handling**: Graceful error handling with user-friendly messages
5. **Performance**: Optimized rendering and data loading
6. **Accessibility**: WCAG 2.1 AA compliance

## 🔧 Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd path-print

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### Environment Configuration

Create a `.env.local` file for local development:

```env
# Development settings
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug

# API settings (if needed in future)
VITE_API_BASE_URL=http://localhost:3001

# Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_TOOLS=true
```

## 📝 Coding Standards

### TypeScript Guidelines

#### Type Imports
Always use type-only imports for types:

```typescript
// ✅ Correct
import type { CareerData, Milestone } from '../types';
import { validateCareerData } from '../utils/validation';

// ❌ Incorrect
import { CareerData, Milestone, validateCareerData } from '../types';
```

#### Interface Definitions
Use descriptive interfaces with comprehensive documentation:

```typescript
/**
 * Props for the MilestoneCard component
 * 
 * @interface MilestoneCardProps
 */
interface MilestoneCardProps {
  /** The milestone data to display */
  milestone: Milestone;
  /** Whether the milestone is currently selected */
  isSelected?: boolean;
  /** Callback when milestone is clicked */
  onSelect?: (milestone: Milestone) => void;
  /** Custom CSS classes */
  className?: string;
}
```

#### Function Documentation
All functions must have JSDoc comments:

```typescript
/**
 * Validates a milestone object against the schema
 * 
 * @param milestone - The milestone object to validate
 * @param context - Validation context for error reporting
 * @returns Validation result with errors and warnings
 * 
 * @example
 * ```typescript
 * const result = validateMilestone(milestoneData, context);
 * if (!result.isValid) {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 */
export function validateMilestone(
  milestone: unknown,
  context: ValidationContext
): ValidationResult {
  // Implementation
}
```

### React Component Guidelines

#### Component Structure
Follow this structure for all components:

```typescript
/**
 * Component description and purpose
 * 
 * @fileoverview Brief description of the component
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import type { ComponentProps } from './types';

// ============================================================================
// INTERFACES
// ============================================================================

interface Props {
  // Props definition
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Component description
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ComponentName({ prop1, prop2 }: Props): JSX.Element {
  // Component implementation
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
}
```

#### Hooks Usage
Use hooks consistently and follow React best practices:

```typescript
// ✅ Correct hook usage
const [state, setState] = useState<StateType>(initialValue);
const memoizedValue = useMemo(() => expensiveCalculation(data), [data]);
const callback = useCallback((param: string) => {
  // Callback implementation
}, [dependency]);

// ✅ Custom hooks
function useCareerData() {
  const [data, setData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hook implementation
  
  return { data, loading, error };
}
```

### Styling Guidelines

#### Tailwind CSS Usage
Use Tailwind utility classes with consistent patterns:

```typescript
// ✅ Good: Organized classes
<div className="
  flex items-center justify-between
  p-4 bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
  transition-colors duration-200
">

// ✅ Good: Conditional classes
<button className={`
  px-4 py-2 rounded-md font-medium transition-colors
  ${isActive 
    ? 'bg-blue-600 text-white' 
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }
`}>
```

#### Custom CSS
Minimize custom CSS and use CSS variables for theming:

```css
/* ✅ Good: CSS variables */
:root {
  --color-primary: #3B82F6;
  --duration-normal: 0.3s;
}

.custom-component {
  color: var(--color-primary);
  transition: all var(--duration-normal) ease-in-out;
}
```

## 🧪 Testing Strategy

### Testing Philosophy
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Visual Tests**: Test UI consistency

### Testing Structure
```
src/
├── components/
│   ├── Component.tsx
│   └── Component.test.tsx
├── utils/
│   ├── utility.ts
│   └── utility.test.ts
└── __tests__/
    ├── integration/
    └── e2e/
```

### Test Examples

#### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MilestoneCard } from './MilestoneCard';
import type { Milestone } from '../types';

const mockMilestone: Milestone = {
  id: 'test-1',
  type: 'job',
  title: 'Software Developer',
  // ... other properties
};

describe('MilestoneCard', () => {
  it('renders milestone information correctly', () => {
    render(<MilestoneCard milestone={mockMilestone} />);
    
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<MilestoneCard milestone={mockMilestone} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockMilestone);
  });
});
```

#### Utility Testing
```typescript
import { validateMilestone } from './validation';
import type { ValidationContext } from '../types/validation';

describe('validateMilestone', () => {
  const context: ValidationContext = {
    path: 'milestone',
    parent: null,
    root: null,
    options: { strict: false, allowUnknownFields: true, maxErrors: 10, includeWarnings: true }
  };

  it('validates correct milestone data', () => {
    const validMilestone = {
      id: 'test-1',
      type: 'job',
      title: 'Developer',
      // ... other valid properties
    };
    
    const result = validateMilestone(validMilestone, context);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('returns errors for invalid data', () => {
    const invalidMilestone = {
      id: '', // Invalid: empty ID
      type: 'invalid-type', // Invalid: wrong type
    };
    
    const result = validateMilestone(invalidMilestone, context);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

## 🚀 Performance Guidelines

### React Performance

#### Memoization
Use React.memo and useMemo appropriately:

```typescript
// ✅ Memoize expensive components
const MilestoneCard = React.memo<MilestoneCardProps>(({ milestone, onSelect }) => {
  return (
    <div onClick={() => onSelect?.(milestone)}>
      {milestone.title}
    </div>
  );
});

// ✅ Memoize expensive calculations
const processedData = useMemo(() => {
  return milestones.map(milestone => ({
    ...milestone,
    formattedDate: formatDate(milestone.dateRange.start)
  }));
}, [milestones]);
```

#### Lazy Loading
Implement code splitting for large components:

```typescript
// ✅ Lazy load heavy components
const TimelineView = React.lazy(() => import('./components/Timeline/TimelineView'));
const MapView = React.lazy(() => import('./components/Map/MapView'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/timeline" element={<TimelineView />} />
        <Route path="/map" element={<MapView />} />
      </Routes>
    </Suspense>
  );
}
```

### Data Loading Performance

#### Caching Strategy
Implement intelligent caching:

```typescript
// ✅ Cache with expiration
const cache = new Map<string, { data: unknown; timestamp: number; expiration: number }>();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.timestamp + entry.expiration) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}
```

## 🔍 Debugging

### Debug Tools

#### Browser DevTools
- React Developer Tools
- Redux DevTools (if using Redux)
- Performance tab for profiling
- Network tab for data loading issues

#### Custom Debug Utilities
```typescript
// Debug logging utility
const debug = {
  log: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Career Path] ${message}`, data);
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[Career Path Error] ${message}`, error);
  }
};

// Performance monitoring
function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  debug.log(`${name} took ${end - start} milliseconds`);
  return result;
}
```

### Common Issues and Solutions

#### Data Loading Issues
```typescript
// ✅ Proper error handling
async function loadCareerData(): Promise<Result<CareerData>> {
  try {
    const response = await fetch('/data/career-data.yaml');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    const data = yaml.load(content) as CareerData;
    
    // Validate data
    const validation = validateCareerData(data);
    if (!validation.isValid) {
      throw new Error(`Invalid data: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    return { success: true, data };
  } catch (error) {
    debug.error('Failed to load career data', error as Error);
    return { success: false, error: error as Error };
  }
}
```

## 📦 Build and Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] All tests passing
- [ ] Linting passes
- [ ] Build completes successfully
- [ ] Performance metrics acceptable
- [ ] Accessibility tests pass
- [ ] Cross-browser testing complete

---

This development guide should be updated as the project evolves. Always refer to the latest version for current best practices and guidelines.
