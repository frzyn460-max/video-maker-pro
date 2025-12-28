import React from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';
import './Footer.css';

const Footer = () => {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'ویژگی‌ها', href: '#features' },
      { label: 'قالب‌ها', href: '#templates' },
      { label: 'قیمت‌گذاری', href: '#pricing' },
      { label: 'راهنما', href: '#help' },
    ],
    company: [
      { label: 'درباره ما', href: '#about' },
      { label: 'تماس با ما', href: '#contact' },
      { label: 'وبلاگ', href: '#blog' },
      { label: 'فرصت‌های شغلی', href: '#careers' },
    ],
    legal: [
      { label: 'حریم خصوصی', href: '#privacy' },
      { label: 'شرایط استفاده', href: '#terms' },
      { label: 'قوانین', href: '#legal' },
      { label: 'کوکی‌ها', href: '#cookies' },
    ],
    social: [
      { label: 'توییتر', href: '#', icon: '🐦' },
      { label: 'اینستاگرام', href: '#', icon: '📷' },
      { label: 'یوتیوب', href: '#', icon: '▶️' },
      { label: 'گیت‌هاب', href: '#', icon: '💻' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎬</span>
              <span className="footer-logo-text">Video Maker Pro</span>
            </div>
            <p className="footer-description">
              ابزار حرفه‌ای ساخت ویدیو از متن
              <br />
              برای همه افراد خلاق
            </p>
            
            {/* Social Links */}
            <div className="footer-social">
              {footerLinks.social.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="footer-social-link"
                  aria-label={item.label}
                  title={item.label}
                >
                  <span>{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {!isMobile && (
            <>
              <div className="footer-links-section">
                <h3 className="footer-links-title">محصول</h3>
                <ul className="footer-links-list">
                  {footerLinks.product.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="footer-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-links-section">
                <h3 className="footer-links-title">شرکت</h3>
                <ul className="footer-links-list">
                  {footerLinks.company.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="footer-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-links-section">
                <h3 className="footer-links-title">قانونی</h3>
                <ul className="footer-links-list">
                  {footerLinks.legal.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="footer-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h3 className="footer-newsletter-title">خبرنامه</h3>
            <p className="footer-newsletter-text">
              آخرین اخبار و به‌روزرسانی‌ها را دریافت کنید
            </p>
            <form className="footer-newsletter-form">
              <input
                type="email"
                placeholder="ایمیل شما..."
                className="footer-newsletter-input"
              />
              <button type="submit" className="footer-newsletter-button">
                عضویت
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Links */}
        {isMobile && (
          <div className="footer-mobile-links">
            <div className="footer-mobile-section">
              <h4>لینک‌های مفید</h4>
              <div className="footer-mobile-links-grid">
                {[...footerLinks.product, ...footerLinks.company].map((item, index) => (
                  <a key={index} href={item.href} className="footer-mobile-link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Video Maker Pro. تمامی حقوق محفوظ است.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-version">نسخه 2.0.0</span>
            <span className="footer-separator">•</span>
            <span className="footer-status">
              <span className="footer-status-dot"></span>
              همه سیستم‌ها فعال
            </span>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="footer-decoration"></div>
    </footer>
  );
};

export default Footer;