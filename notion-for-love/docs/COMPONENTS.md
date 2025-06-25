# 🧩 Component Documentation

This document provides comprehensive documentation for all reusable components in the Love Journey application.

## 📁 Component Structure

```
src/components/
├── ui/                    # Basic UI components
│   ├── Button.js         # Primary button component
│   ├── Input.js          # Form input component
│   ├── Card.js           # Container card component
│   ├── Modal.js          # Modal dialog component
│   ├── Badge.js          # Status badge component
│   ├── Avatar.js         # User avatar component
│   ├── LoadingSpinner.js # Loading indicator
│   ├── Tooltip.js        # Tooltip component
│   └── ThemeToggle.js    # Theme switcher
├── layout/               # Layout components
│   ├── Layout.js         # Main app layout
│   ├── Header.js         # Application header
│   └── Sidebar.js        # Navigation sidebar
├── dashboard/            # Dashboard widgets
│   ├── DashboardWidget.js
│   └── widgets/
├── auth/                 # Authentication components
│   └── ProtectedRoute.js
└── search/               # Search functionality
    └── GlobalSearch.js
```

## 🎨 Design System

### Color Palette

The application uses an **Earthy Neutrals** color scheme by default:

- **Primary**: `#A57B5B` (Terracotta)
- **Secondary**: `#6A7B53` (Olive Green)
- **Neutral**: `#E5D5C5` (Cream Beige)
- **Accent**: `#D4A574` (Warm Sand)

### Typography

- **UI Text**: Inter font family
- **Headings**: Playfair Display (serif)
- **Code**: JetBrains Mono

### Spacing Scale

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

## 🧱 Core Components

### Button

A versatile button component with multiple variants and states.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'romantic'`
- `size`: `'sm' | 'md' | 'lg'`
- `loading`: `boolean`
- `disabled`: `boolean`
- `fullWidth`: `boolean`
- `leftIcon`: `ReactNode`
- `rightIcon`: `ReactNode`
- `as`: `ElementType` (for polymorphic rendering)

**Usage:**
```jsx
import Button from '../components/ui/Button';

// Basic usage
<Button variant="primary" size="md">
  Click me
</Button>

// With icons
<Button 
  variant="romantic" 
  leftIcon={<Heart />}
  rightIcon={<ArrowRight />}
>
  Add Milestone
</Button>

// Loading state
<Button loading disabled>
  Saving...
</Button>
```

### Input

Form input component with validation and styling.

**Props:**
- `label`: `string`
- `error`: `string`
- `helperText`: `string`
- `leftIcon`: `ReactNode`
- `rightIcon`: `ReactNode`
- `fullWidth`: `boolean`

**Usage:**
```jsx
import Input from '../components/ui/Input';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  leftIcon={<Mail />}
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Card

Container component for grouping related content.

**Props:**
- `variant`: `'default' | 'glass' | 'romantic'`
- `hover`: `boolean`
- `clickable`: `boolean`
- `padding`: `'none' | 'sm' | 'md' | 'lg'`

**Usage:**
```jsx
import Card from '../components/ui/Card';

<Card variant="romantic" hover clickable>
  <Card.Header>
    <Card.Title>Milestone Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Content goes here
  </Card.Content>
</Card>
```

### Modal

Accessible modal dialog component.

**Props:**
- `isOpen`: `boolean`
- `onClose`: `function`
- `title`: `string`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `closeOnOverlayClick`: `boolean`

**Usage:**
```jsx
import Modal from '../components/ui/Modal';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Add New Milestone"
  size="lg"
>
  <p>Modal content goes here</p>
</Modal>
```

### Badge

Small status indicator component.

**Props:**
- `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'`
- `size`: `'sm' | 'md' | 'lg'`

**Usage:**
```jsx
import Badge from '../components/ui/Badge';

<Badge variant="success" size="sm">
  Completed
</Badge>
```

### Avatar

User avatar component with fallback support.

**Props:**
- `src`: `string`
- `name`: `string`
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `showStatus`: `boolean`
- `status`: `'online' | 'offline' | 'away' | 'busy'`

**Usage:**
```jsx
import Avatar from '../components/ui/Avatar';

<Avatar
  src={user.avatar}
  name={user.name}
  size="md"
  showStatus
  status="online"
/>
```

### LoadingSpinner

Loading indicator with multiple variants.

**Props:**
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `variant`: `'spinner' | 'heart' | 'pulse' | 'dots'`
- `text`: `string`

**Usage:**
```jsx
import LoadingSpinner from '../components/ui/LoadingSpinner';

<LoadingSpinner
  size="lg"
  variant="heart"
  text="Loading your love journey..."
/>
```

## 🎯 Best Practices

### Component Development

1. **Use TypeScript-style JSDoc comments** for prop documentation
2. **Follow the compound component pattern** for complex components
3. **Implement proper accessibility** with ARIA attributes
4. **Use forwardRef** for components that need ref forwarding
5. **Include comprehensive prop validation**

### Styling Guidelines

1. **Use Tailwind CSS classes** for styling
2. **Follow the design system** color palette and spacing
3. **Implement responsive design** with mobile-first approach
4. **Use CSS custom properties** for theme variables
5. **Add smooth transitions** for interactive elements

### Testing Requirements

1. **Write unit tests** for all components
2. **Test accessibility** with screen readers
3. **Test keyboard navigation** functionality
4. **Test different prop combinations**
5. **Test error states** and edge cases

### Performance Considerations

1. **Use React.memo** for expensive components
2. **Implement lazy loading** for large components
3. **Optimize bundle size** with tree shaking
4. **Use proper key props** in lists
5. **Avoid unnecessary re-renders**

## 🔧 Development Workflow

### Adding New Components

1. Create component file in appropriate directory
2. Add comprehensive JSDoc documentation
3. Implement accessibility features
4. Write unit tests
5. Add to component documentation
6. Update Storybook stories (if applicable)

### Component Checklist

- [ ] Proper TypeScript/JSDoc documentation
- [ ] Accessibility attributes (ARIA, roles, etc.)
- [ ] Keyboard navigation support
- [ ] Responsive design implementation
- [ ] Dark mode support
- [ ] Unit tests with good coverage
- [ ] Error boundary handling
- [ ] Performance optimization

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**For questions or contributions, please refer to our [Contributing Guide](../CONTRIBUTING.md).**
