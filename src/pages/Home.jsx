import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ThemeToggle from '../components/common/ThemeToggle';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🎨',
      title: 'افکت‌های حرفه‌ای',
      description: 'بیش از 20 افکت سینمایی با کیفیت 4K برای هر سبک و ژانر',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🚀',
      title: 'سرعت بالا',
      description: 'رندر فوری و بهینه‌سازی شده برای تجربه‌ای روان و بی‌وقفه',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '✨',
      title: 'AI پیشرفته',
      description: 'تولید محتوای خودکار با هوش مصنوعی نسل جدید',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🎬',
      title: 'خروجی حرفه‌ای',
      description: 'Export با کیفیت تا 4K در فرمت‌های مختلف',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '🎵',
      title: 'موسیقی و صدا',
      description: 'کتابخانه گسترده موسیقی رویالتی‌فری برای هر پروژه',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: '📱',
      title: 'همه دستگاه‌ها',
      description: 'طراحی کاملاً واکنش‌گرا و بهینه برای موبایل و دسکتاپ',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'کاربر فعال' },
    { number: '50K+', label: 'ویدیو ساخته شده' },
    { number: '20+', label: 'افکت حرفه‌ای' },
    { number: '4.9', label: 'امتیاز کاربران' },
  ];

  return (
    <div className="home-page">
      <Navbar />
      <ThemeToggle />

      {/* ============ Hero Section ============ */}
      <section className="hero-section">
        <div className="hero-container">

          {/* Content */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span className="hero-badge-dot" />
              <span className="hero-badge-icon">✨</span>
              <span>نسخه 2.0 منتشر شد!</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              ساخت ویدیوهای
              <br />
              <span className="hero-title-gradient">حرفه‌ای</span>
              {' '}از متن
            </motion.h1>

            {/* Description */}
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              با Video Maker Pro، متن‌های خود را به ویدیوهای سینمایی خیره‌کننده تبدیل کنید.
              با افکت‌های حرفه‌ای، هوش مصنوعی پیشرفته و رابط کاربری ساده.
            </motion.p>

            {/* Actions */}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <button
                className="hero-btn hero-btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                <span>شروع رایگان</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <button className="hero-btn hero-btn-secondary">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                <span>تماشای دمو</span>
              </button>
            </motion.div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="hero-stat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <div className="hero-stat-number">{stat.number}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* تگ‌های شناور */}
            <div className="hero-visual-tag hero-visual-tag-1">🎬 ویدیو ساز حرفه‌ای</div>
            <div className="hero-visual-tag hero-visual-tag-2">✅ رندر آنی</div>

            <div className="hero-visual-card">
              {/* خط رنگی بالا از CSS */}
              <div className="hero-visual-header">
                <span className="hero-visual-dot" style={{ background: '#ef4444' }} />
                <span className="hero-visual-dot" style={{ background: '#f59e0b' }} />
                <span className="hero-visual-dot" style={{ background: '#10b981' }} />
                <span className="hero-visual-title">Video Maker Pro — ادیتور</span>
              </div>

              <div className="hero-visual-content">
                <div className="hero-visual-viewport">
                  <div className="hero-visual-text gradient-text">
                    🎬 ویدیو من
                  </div>

                  {/* نوارهای تایم‌لاین */}
                  <div className="hero-visual-timeline">
                    <div className="hero-visual-timeline-bar">
                      <div className="hero-visual-timeline-fill fill-primary" style={{ animationDelay: '0s' }} />
                    </div>
                    <div className="hero-visual-timeline-bar">
                      <div className="hero-visual-timeline-fill fill-pink" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <div className="hero-visual-timeline-bar">
                      <div className="hero-visual-timeline-fill fill-green" style={{ animationDelay: '0.8s' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorations */}
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
      </section>

      {/* ============ Features Section ============ */}
      <section className="features-section" id="features">
        <div className="features-container">
          <motion.div
            className="features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="features-label">⚡ قابلیت‌ها</div>
            <h2 className="features-title">ویژگی‌های قدرتمند</h2>
            <p className="features-subtitle">
              همه چیزی که برای ساخت ویدیوهای حرفه‌ای نیاز دارید
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                whileHover={{ y: -6 }}
              >
                <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="cta-title">آماده شروع هستید؟</h2>
            <p className="cta-description">
              همین حالا رایگان شروع کنید و اولین ویدیوی خود را بسازید
            </p>
            <button
              className="cta-button"
              onClick={() => navigate('/dashboard')}
            >
              <span>شروع رایگان</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
            <p className="cta-note">بدون نیاز به کارت اعتباری &nbsp;•&nbsp; بدون نصب</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;