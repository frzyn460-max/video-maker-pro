import React, { useState, useEffect, useRef } from 'react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName   = localStorage.getItem('userName') || 'کاربر';
  const userAvatar = localStorage.getItem('userAvatar') || '👩‍💻';

  const menuItems = [
    { label: 'خانه',      href: '/',          icon: '🏠' },
    { label: 'داشبورد',  href: '/dashboard',  icon: '📊' },
    { label: 'ویژگی‌ها', href: '#features',  icon: '✨' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setUserMenuOpen(false);
    navigate('/');
  };

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
              {isLoggedIn ? (
                /* ── User Avatar Dropdown ── */
                <div className="navbar-user" ref={userMenuRef}>
                  <button
                    className="navbar-avatar-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    title="منوی کاربری"
                  >
                    <span className="navbar-avatar-emoji">{userAvatar}</span>
                    <span className="navbar-avatar-name">{userName}</span>
                    <svg
                      width="14" height="14" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth="2"
                      style={{ transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {/* dropdown */}
                  {userMenuOpen && (
                    <div className="navbar-user-menu">
                      <div className="num-header">
                        <span className="num-avatar">{userAvatar}</span>
                        <div>
                          <div className="num-name">{userName}</div>
                          <div className="num-email">{localStorage.getItem('userEmail') || ''}</div>
                        </div>
                      </div>
                      <div className="num-divider" />
                      {[
                        { icon:'👤', label:'پروفایل',   action: () => { navigate('/profile'); setUserMenuOpen(false); } },
                        { icon:'📊', label:'داشبورد',   action: () => { navigate('/dashboard'); setUserMenuOpen(false); } },
                        { icon:'⚙️', label:'تنظیمات',  action: () => { navigate('/profile'); setUserMenuOpen(false); } },
                      ].map((item, i) => (
                        <button key={i} className="num-item" onClick={item.action}>
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                      <div className="num-divider" />
                      <button className="num-item num-item-danger" onClick={handleLogout}>
                        <span>🚪</span>
                        <span>خروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className="navbar-btn navbar-btn-ghost"
                    onClick={() => navigate('/auth')}
                  >
                    <span>ورود</span>
                  </button>
                  <button
                    className="navbar-btn navbar-btn-primary"
                    onClick={() => navigate('/auth')}
                  >
                    <span className="navbar-btn-text">شروع کنید</span>
                    <span className="navbar-btn-arrow">←</span>
                  </button>
                </>
              )}
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
              {isLoggedIn ? (
                <>
                  <button
                    className="navbar-btn navbar-btn-ghost navbar-btn-fullwidth"
                    onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                  >
                    {userAvatar} {userName}
                  </button>
                  <button
                    className="navbar-btn navbar-btn-primary navbar-btn-fullwidth"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="navbar-btn navbar-btn-ghost navbar-btn-fullwidth"
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  >
                    ورود
                  </button>
                  <button
                    className="navbar-btn navbar-btn-primary navbar-btn-fullwidth"
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  >
                    شروع کنید ←
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;