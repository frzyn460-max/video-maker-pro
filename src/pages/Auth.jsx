/*
 * مسیر: /video-maker-pro/src/pages/Auth.jsx
 * ✨ طراحی کاملاً جدید
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';
import './Auth.css';

/* ── Particle Canvas ───────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
        ctx.fill();
      });
      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="auth-canvas" />;
};

/* ── SVG Icons ─────────────────────────────────────── */
const IconUser   = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail   = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const IconLock   = () => <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconEye    = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>;
const IconArrow  = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconGoogle = () => <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
const IconBack   = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IconCheck  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>;

/* ── Floating Feature Card ─────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay, style }) => (
  <motion.div
    className="auth-feature-card"
    style={style}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    <span className="afc-icon">{icon}</span>
    <div>
      <div className="afc-title">{title}</div>
      <div className="afc-desc">{desc}</div>
    </div>
  </motion.div>
);

/* ── Password Strength ─────────────────────────────── */
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'حداقل ۸ کاراکتر', ok: password.length >= 8 },
    { label: 'عدد', ok: /\d/.test(password) },
    { label: 'حرف بزرگ', ok: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ef4444', '#f59e0b', '#10b981'];
  const labels = ['ضعیف', 'متوسط', 'قوی'];

  if (!password) return null;

  return (
    <motion.div
      className="pass-strength"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="pass-bars">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="pass-bar"
            style={{ background: i < score ? colors[score - 1] : 'var(--auth-border)' }}
          />
        ))}
      </div>
      <span style={{ color: colors[score - 1] || '#888', fontSize: '0.75rem', fontWeight: 700 }}>
        {score > 0 ? labels[score - 1] : ''}
      </span>
      <div className="pass-checks">
        {checks.map((c, i) => (
          <span key={i} className={`pass-check ${c.ok ? 'ok' : ''}`}>
            {c.ok && <IconCheck />} {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Main Component ────────────────────────────────── */
const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode]         = useState('login');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [focused, setFocused]   = useState('');
  const [step, setStep]         = useState(0); // 0=form, 1=success

  const change = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (mode === 'register' && !form.name.trim()) return 'لطفاً نام خود را وارد کنید';
    if (!form.email.trim() || !form.email.includes('@')) return 'ایمیل معتبر وارد کنید';
    if (form.password.length < 6) return 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const userName = form.name.trim() || form.email.split('@')[0];
    
    // Generate unique userId if registering, or check existing user
    let userId = localStorage.getItem('userId');
    if (mode === 'register' || !userId) {
      // Generate unique ID: timestamp + random string
      userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', form.email);
    localStorage.setItem('userAvatar', '');
    if (!localStorage.getItem('joinDate')) {
      localStorage.setItem('joinDate', new Date().toISOString());
    }

    setLoading(false);
    setStep(1);
    setTimeout(() => navigate('/dashboard'), 1400);
  };

  const googleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'کاربر گوگل');
    localStorage.setItem('userEmail', 'user@gmail.com');
    localStorage.setItem('joinDate', new Date().toISOString());
    navigate('/dashboard');
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-root">
      <ParticleCanvas />

      {/* ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* back button */}
      <motion.button
        className="auth-back-btn"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <IconBack />
        <span>بازگشت</span>
      </motion.button>

      <ThemeToggle alwaysVisible />

      <div className="auth-layout">

        {/* ── Left Panel ─────────────────────────── */}
        <motion.div
          className="auth-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">🎬</div>
            <div>
              <div className="auth-logo-name">Video Maker Pro</div>
              <div className="auth-logo-sub">ساخت ویدیو حرفه‌ای</div>
            </div>
          </div>

          {/* big headline */}
          <div className="auth-headline">
            <h1 className="auth-h1">
              خلاقیت را<br />
              <span className="auth-h1-gradient">زنده کن</span>
            </h1>
            <p className="auth-h1-sub">
              از متن تا ویدیوی سینمایی در چند ثانیه.
              با هوش مصنوعی پیشرفته و افکت‌های حرفه‌ای.
            </p>
          </div>

          {/* feature cards */}
          <div className="auth-features">
            <FeatureCard icon="⚡" title="رندر فوری" desc="بدون نصب، مستقیم در مرورگر" delay={0.4} />
            <FeatureCard icon="🎨" title="+۲۰ افکت" desc="سینمایی با کیفیت ۴K" delay={0.5} />
            <FeatureCard icon="🤖" title="AI پیشرفته" desc="تولید محتوای خودکار" delay={0.6} />
          </div>

          {/* social proof */}
          <motion.div
            className="auth-social-proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="asp-avatars">
              {['👩‍💻', '👨‍🎨', '👩‍🎬', '👨‍💼'].map((e, i) => (
                <div key={i} className="asp-avatar" style={{ zIndex: 4 - i }}>{e}</div>
              ))}
            </div>
            <div className="asp-text">
              <span className="asp-num">+۱۰,۰۰۰</span> خلاق از این ابزار استفاده می‌کنند
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right Panel (Form) ──────────────────── */}
        <motion.div
          className="auth-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="auth-card">

            {/* success screen */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="success"
                  className="auth-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="auth-success-icon">🎉</div>
                  <h2 className="auth-success-title">خوش آمدید!</h2>
                  <p className="auth-success-sub">در حال انتقال به داشبورد...</p>
                  <div className="auth-success-bar">
                    <div className="auth-success-fill" />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* tabs */}
                  <div className="auth-tabs">
                    <button
                      className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                      onClick={() => switchMode('login')}
                    >
                      ورود
                    </button>
                    <button
                      className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                      onClick={() => switchMode('register')}
                    >
                      ثبت‌نام
                    </button>
                    <div
                      className="auth-tab-indicator"
                      style={{ transform: mode === 'login' ? 'translateX(0)' : 'translateX(-100%)' }}
                    />
                  </div>

                  {/* heading */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22 }}
                      className="auth-heading"
                    >
                      <h2 className="auth-title">
                        {mode === 'login' ? '👋 خوش آمدید' : '🚀 شروع کنید'}
                      </h2>
                      <p className="auth-subtitle">
                        {mode === 'login'
                          ? 'وارد حساب کاربری‌تان شوید'
                          : 'یک حساب رایگان بسازید'}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* form */}
                  <form onSubmit={submit} className="auth-form" noValidate>

                    {/* name field (register only) */}
                    <AnimatePresence>
                      {mode === 'register' && (
                        <motion.div
                          className="auth-field"
                          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.28 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <label className="auth-label">نام</label>
                          <div className={`auth-input-wrap ${focused === 'name' ? 'focused' : ''}`}>
                            <IconUser />
                            <input
                              type="text"
                              name="name"
                              placeholder="نام و نام خانوادگی"
                              value={form.name}
                              onChange={change}
                              onFocus={() => setFocused('name')}
                              onBlur={() => setFocused('')}
                              className="auth-input"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* email */}
                    <div className="auth-field">
                      <label className="auth-label">ایمیل</label>
                      <div className={`auth-input-wrap ${focused === 'email' ? 'focused' : ''}`}>
                        <IconMail />
                        <input
                          type="email"
                          name="email"
                          placeholder="example@email.com"
                          value={form.email}
                          onChange={change}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          className="auth-input"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* password */}
                    <div className="auth-field">
                      <div className="auth-label-row">
                        <label className="auth-label">رمز عبور</label>
                        {mode === 'login' && (
                          <button type="button" className="auth-forgot">فراموشی رمز؟</button>
                        )}
                      </div>
                      <div className={`auth-input-wrap ${focused === 'password' ? 'focused' : ''}`}>
                        <IconLock />
                        <input
                          type={showPass ? 'text' : 'password'}
                          name="password"
                          placeholder={mode === 'register' ? 'حداقل ۶ کاراکتر' : 'رمز عبور'}
                          value={form.password}
                          onChange={change}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused('')}
                          className="auth-input"
                        />
                        <button
                          type="button"
                          className="auth-eye"
                          onClick={() => setShowPass(p => !p)}
                        >
                          {showPass ? <IconEyeOff /> : <IconEye />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {mode === 'register' && (
                          <PasswordStrength password={form.password} />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* remember me (login) */}
                    {mode === 'login' && (
                      <label className="auth-remember">
                        <input type="checkbox" className="auth-checkbox" />
                        <span className="auth-checkbox-custom" />
                        مرا به خاطر بسپار
                      </label>
                    )}

                    {/* error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="auth-error"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          ⚠️ {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* submit */}
                    <button
                      type="submit"
                      className={`auth-submit ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="auth-spinner" />
                          <span>لطفاً صبر کنید...</span>
                        </>
                      ) : (
                        <>
                          <span>{mode === 'login' ? 'ورود به حساب' : 'ساخت حساب رایگان'}</span>
                          <IconArrow />
                        </>
                      )}
                    </button>

                    {/* divider */}
                    <div className="auth-divider"><span>یا</span></div>

                    {/* google */}
                    <button type="button" className="auth-google" onClick={googleLogin}>
                      <IconGoogle />
                      <span>ادامه با Google</span>
                    </button>

                  </form>

                  {/* switch mode */}
                  <p className="auth-switch">
                    {mode === 'login' ? 'حساب ندارید؟' : 'حساب دارید؟'}
                    {' '}
                    <button
                      type="button"
                      className="auth-switch-btn"
                      onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                    >
                      {mode === 'login' ? 'ثبت‌نام کنید' : 'وارد شوید'}
                    </button>
                  </p>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;