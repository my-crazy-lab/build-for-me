/**
 * Button Component for Reviewly Application
 * 
 * This component provides a versatile, accessible button with multiple variants,
 * sizes, and states. It features neumorphism design, smooth animations, and
 * comprehensive accessibility support.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Multiple sizes (small, medium, large)
 * - Loading states
 * - Icon support
 * - Disabled states
 * - Accessibility support
 * - Neumorphism styling
 * - Smooth animations
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
// Define types locally to avoid import issues
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';
import LoadingSpinner from '../common/LoadingSpinner';
import './Button.css';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  motionProps?: MotionProps;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  motionProps = {},
  onClick,
  ...props
}, ref) => {
  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Simple animation props
  const animationProps = !isDisabled ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  // Handle click with loading state
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Build class names
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    isDisabled && 'btn-disabled',
    className,
  ].filter(Boolean).join(' ');

  // Separate motion props from HTML button props to avoid conflicts
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    ...htmlProps
  } = props;

  return (
    <motion.button
      ref={ref}
      className={classNames}
      disabled={isDisabled}
      onClick={handleClick}
      {...animationProps}
      {...motionProps}
      {...htmlProps}
    >
      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="btn-icon btn-icon-left">
          {leftIcon}
        </span>
      )}

      {/* Loading Spinner */}
      {loading && (
        <span className="btn-icon btn-icon-left">
          <LoadingSpinner 
            size="small" 
            color={variant === 'primary' ? '#ffffff' : 'currentColor'} 
          />
        </span>
      )}

      {/* Button Text */}
      <span className="btn-text">
        {children}
      </span>

      {/* Right Icon */}
      {rightIcon && !loading && (
        <span className="btn-icon btn-icon-right">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

// Specialized button components
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="success" {...props} />
);

export const WarningButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="warning" {...props} />
);

export const InfoButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="info" {...props} />
);

// Icon button component
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, ...props }) => (
  <Button {...props} className={`btn-icon-only ${props.className || ''}`}>
    {icon}
  </Button>
);

// Button group component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'small',
  className = '',
}) => {
  const classNames = [
    'btn-group',
    `btn-group-${orientation}`,
    `btn-group-spacing-${spacing}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {children}
    </div>
  );
};

// Floating action button component
interface FABProps extends Omit<ButtonProps, 'variant' | 'size'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: ButtonSize;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  position = 'bottom-right',
  size = 'large',
  className = '',
  ...props
}) => {
  const classNames = [
    'btn-fab',
    `btn-fab-${position}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Button
      variant="primary"
      size={size}
      className={classNames}
      {...props}
    />
  );
};

export default Button;
