import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery';
import './Navbar.css';

const Navbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'خانه', href: '/', icon: '🏠' },
    { label: 'داشبورد', href: '/dashboard', icon: '📊' },
    { label: 'ویژگی‌ها', href: '#features', icon: '✨' },
    { label: 'قالب‌ها', href: '#templates', icon: '🎨' },
    { label: 'راهنما', href: '#help', icon: '❓' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="navbar-logo-icon">🎬</span>
            <span className="navbar-logo-text">Video Maker Pro</span>
          </div>
        </div>

        {/* Desktop Menu */}
        {!isMobile && (
          <div className="navbar-menu">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href.startsWith('#') ? item.href : undefined}
                onClick={(e) => {
                  if (!item.href.startsWith('#')) {
                    e.preventDefault();
                    navigate(item.href);
                  }
                }}
                className={`navbar-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                <span className="navbar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {!isMobile && (
            <>
              <button className="navbar-btn navbar-btn-outline">
                ورود
              </button>
              <button 
                className="navbar-btn navbar-btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                شروع کنید
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              className="navbar-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="منوی موبایل"
            >
              {mobileMenuOpen ? (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-mobile-menu-content">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="navbar-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="navbar-mobile-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
            
            <div className="navbar-mobile-actions">
              <button className="navbar-btn navbar-btn-outline navbar-btn-fullwidth">
                ورود
              </button>
              <button className="navbar-btn navbar-btn-primary navbar-btn-fullwidth">
                شروع کنید
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;