import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useMediaQuery';
import './Navbar.css';

const Navbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const menuItems = [
    { label: 'خانه', href: '/', icon: '🏠' },
    { label: 'داشبورد', href: '/dashboard', icon: '📊' },
    { label: 'ویژگی‌ها', href: '#features', icon: '✨' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* خط درخشان بالای navbar */}
      <div className="navbar-glow-line" />

      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-brand">
          <div className="navbar-logo" onClick={() => navigate('/')}>
            <div className="navbar-logo-icon-wrap">
              <span className="navbar-logo-icon">🎬</span>
              <div className="navbar-logo-ring" />
            </div>
            <div className="navbar-logo-texts">
              <span className="navbar-logo-text">Video Maker</span>
              <span className="navbar-logo-badge">Pro</span>
            </div>
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
                onMouseEnter={() => setActiveHover(index)}
                onMouseLeave={() => setActiveHover(null)}
              >
                <span className="navbar-link-icon">{item.icon}</span>
                <span className="navbar-link-label">{item.label}</span>
                {activeHover === index && <span className="navbar-link-glow" />}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {!isMobile && (
            <>
              <button className="navbar-btn navbar-btn-ghost">
                <span>ورود</span>
              </button>
              <button
                className="navbar-btn navbar-btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                <span className="navbar-btn-text">شروع کنید</span>
                <span className="navbar-btn-arrow">←</span>
              </button>
            </>
          )}

          {isMobile && (
            <button
              className={`navbar-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="منوی موبایل"
            >
              <span className="toggle-bar bar-1" />
              <span className="toggle-bar bar-2" />
              <span className="toggle-bar bar-3" />
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
                className={`navbar-mobile-link ${location.pathname === item.href ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <span className="navbar-mobile-link-icon">{item.icon}</span>
                <span>{item.label}</span>
                <span className="navbar-mobile-link-arrow">←</span>
              </a>
            ))}

            <div className="navbar-mobile-actions">
              <button className="navbar-btn navbar-btn-ghost navbar-btn-fullwidth">ورود</button>
              <button
                className="navbar-btn navbar-btn-primary navbar-btn-fullwidth"
                onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
              >
                شروع کنید ←
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;