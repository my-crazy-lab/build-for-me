/**
 * Mobile Navigation Component for Reviewly Application
 * 
 * Touch-optimized navigation with hamburger menu, swipe gestures,
 * and adaptive layout for mobile devices.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useResponsive, useTouchInteractions } from '../../hooks/useResponsive';
import './MobileNavigation.css';

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const { getSwipeHandlers } = useTouchInteractions();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/reviews', label: 'Reviews', icon: '📝', badge: 2 },
    { path: '/feedback', label: 'Feedback', icon: '💬', badge: 5 },
    { path: '/goals', label: 'Goals', icon: '🎯' },
    { path: '/templates', label: 'Templates', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/notifications', label: 'Notifications', icon: '🔔', badge: 3 },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-nav') && !target.closest('.mobile-menu')) {
        setIsMenuOpen(false);
        setShowUserMenu(false);
      }
    };

    if (isMenuOpen || showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen, showUserMenu]);

  // Swipe gestures for menu
  const swipeHandlers = getSwipeHandlers(
    () => setIsMenuOpen(false), // Swipe left to close
    () => setIsMenuOpen(true),  // Swipe right to open
    undefined,
    undefined,
    100
  );

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't render on desktop
  if (!isMobile && !isTablet) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className="header-title">
          <h1>Reviewly</h1>
        </div>

        <button
          className="user-menu-toggle"
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="Toggle user menu"
        >
          <div className="user-avatar">
            {user?.avatar || '👤'}
          </div>
          {navigationItems.some(item => item.badge) && (
            <div className="notification-indicator">
              {navigationItems.reduce((total, item) => total + (item.badge || 0), 0)}
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <nav 
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        {...swipeHandlers}
      >
        <div className="menu-header">
          <div className="user-info">
            <div className="user-avatar large">
              {user?.avatar || '👤'}
            </div>
            <div className="user-details">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <div className="menu-items">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-label">{item.label}</span>
              {item.badge && (
                <span className="item-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <button className="menu-item" onClick={() => navigate('/settings')}>
            <span className="item-icon">⚙️</span>
            <span className="item-label">Settings</span>
          </button>
          
          <button className="menu-item logout" onClick={handleLogout}>
            <span className="item-icon">🚪</span>
            <span className="item-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="user-menu-dropdown">
          <div className="dropdown-header">
            <div className="user-avatar">
              {user?.avatar || '👤'}
            </div>
            <div className="user-details">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="dropdown-items">
            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/profile')}
            >
              <span className="item-icon">👤</span>
              <span>Profile</span>
            </button>
            
            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/settings')}
            >
              <span className="item-icon">⚙️</span>
              <span>Settings</span>
            </button>
            
            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/notifications')}
            >
              <span className="item-icon">🔔</span>
              <span>Notifications</span>
              {navigationItems.find(item => item.path === '/notifications')?.badge && (
                <span className="item-badge">
                  {navigationItems.find(item => item.path === '/notifications')?.badge}
                </span>
              )}
            </button>
            
            <hr className="dropdown-divider" />
            
            <button className="dropdown-item logout" onClick={handleLogout}>
              <span className="item-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="bottom-navigation">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      )}
    </>
  );
};

export default MobileNavigation;
