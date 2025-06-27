/**
 * Love Journey - Toast Utility
 * 
 * Centralized toast notification utility with consistent styling
 * and easy-to-use methods for success, error, info, and loading states.
 * 
 * Created: 2025-06-27
 * Version: 1.0.0
 */

import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle, Heart } from 'lucide-react';

// Custom toast styles that work with our theme system
const getToastStyle = (type) => {
  const baseStyle = {
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '400px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  };

  const styles = {
    success: {
      ...baseStyle,
      background: 'rgb(34, 197, 94)',
      color: 'white',
      border: '1px solid rgb(22, 163, 74)',
    },
    error: {
      ...baseStyle,
      background: 'rgb(239, 68, 68)',
      color: 'white',
      border: '1px solid rgb(220, 38, 38)',
    },
    info: {
      ...baseStyle,
      background: 'rgb(59, 130, 246)',
      color: 'white',
      border: '1px solid rgb(37, 99, 235)',
    },
    warning: {
      ...baseStyle,
      background: 'rgb(245, 158, 11)',
      color: 'white',
      border: '1px solid rgb(217, 119, 6)',
    },
    love: {
      ...baseStyle,
      background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))',
      color: 'white',
      border: '1px solid rgb(190, 24, 93)',
    }
  };

  return styles[type] || baseStyle;
};

// Custom toast component with icon
const ToastContent = ({ icon: Icon, message, type }) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span className="flex-1">{message}</span>
  </div>
);

// Toast utility functions
export const showToast = {
  success: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto`}
          style={getToastStyle('success')}
        >
          <ToastContent icon={CheckCircle} message={message} type="success" />
        </div>
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },

  error: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto`}
          style={getToastStyle('error')}
        >
          <ToastContent icon={XCircle} message={message} type="error" />
        </div>
      ),
      {
        duration: 6000,
        ...options,
      }
    );
  },

  info: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto`}
          style={getToastStyle('info')}
        >
          <ToastContent icon={Info} message={message} type="info" />
        </div>
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },

  warning: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto`}
          style={getToastStyle('warning')}
        >
          <ToastContent icon={AlertTriangle} message={message} type="warning" />
        </div>
      ),
      {
        duration: 5000,
        ...options,
      }
    );
  },

  love: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} pointer-events-auto`}
          style={getToastStyle('love')}
        >
          <ToastContent icon={Heart} message={message} type="love" />
        </div>
      ),
      {
        duration: 4000,
        ...options,
      }
    );
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: getToastStyle('info'),
      duration: Infinity,
      ...options,
    });
  },

  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      {
        style: getToastStyle('info'),
        success: {
          style: getToastStyle('success'),
          duration: 4000,
        },
        error: {
          style: getToastStyle('error'),
          duration: 6000,
        },
        ...options,
      }
    );
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  }
};

// Convenience methods for common use cases
export const toastSuccess = showToast.success;
export const toastError = showToast.error;
export const toastInfo = showToast.info;
export const toastWarning = showToast.warning;
export const toastLove = showToast.love;
export const toastLoading = showToast.loading;
export const toastPromise = showToast.promise;

// API error handler
export const handleApiError = (error, defaultMessage = 'Something went wrong') => {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  
  if (error.response?.data?.message) {
    message = error.response.data.message;
  } else if (error.message) {
    message = error.message;
  }
  
  showToast.error(message);
  return message;
};

// API success handler
export const handleApiSuccess = (message, data = null) => {
  showToast.success(message);
  return data;
};

export default showToast;
