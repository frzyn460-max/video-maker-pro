/* 
 * مسیر: /video-maker-pro/src/pages/Auth.jsx
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode]         = useState('login');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && !form.name.trim())
      return setError('لطفاً نام خود را وارد کنید');
    if (!form.email.trim())
      return setError('لطفاً ایمیل را وارد کنید');
    if (form.password.length < 6)
      return setError('رمز عبور باید حداقل ۶ کاراکتر باشد');

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    // ذخیره وضعیت ورود
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', form.name.trim() || form.email.split('@')[0]);

    setLoading(false);
    navigate('/dashboard');
  };

  const googleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'کاربر');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <ThemeToggle position="fixed-top" />

      <button className="auth-back" onClick={() => navigate('/')}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        بازگشت
      </button>

      <div className="auth-bg">
        <div className="ab ab1"/><div className="ab ab2"/>
        <div className="auth-dots"/>
      </div>

      <div className="auth-layout">

        {/* ── Left visual ────────────────────────── */}
        <motion.div className="auth-visual"
          initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}}
          transition={{duration:0.7, ease:[0.16,1,0.3,1]}}>

          <div className="av-brand">
            <span className="av-emoji">🎬</span>
            <span className="av-name">Video Maker Pro</span>
          </div>

          <div className="av-mockup">
            <div className="avm-bar">
              <span className="avm-dot" style={{background:'#ef4444'}}/>
              <span className="avm-dot" style={{background:'#f59e0b'}}/>
              <span className="avm-dot" style={{background:'#10b981'}}/>
            </div>
            <div className="avm-screen">
              {[...Array(10)].map((_,i)=>(
                <span key={i} className="avm-star" style={{'--i':i}}/>
              ))}
              <span className="avm-label">🎬 Video Maker Pro</span>
            </div>
            <div className="avm-timeline">
              {['#ef4444','#8b5cf6','#10b981','#f59e0b'].map((c,i)=>(
                <span key={i} className="avm-seg"
                  style={{background:c, flex:[2,1.5,2,1][i]}}/>
              ))}
            </div>
          </div>

          <ul className="av-perks">
            {['✨  بیش از ۲۰ افکت سینمایی',
              '🚀  رندر فوری بدون نصب',
              '🎵  همگام‌سازی با موسیقی'].map((t,i)=>(
              <motion.li key={i}
                initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
                transition={{delay:0.45+i*0.12}}>
                {t}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── Right form ─────────────────────────── */}
        <motion.div className="auth-card"
          initial={{opacity:0,x:50}} animate={{opacity:1,x:0}}
          transition={{duration:0.7, delay:0.1, ease:[0.16,1,0.3,1]}}>

          {/* tabs */}
          <div className="auth-tabs">
            <button className={`at ${mode==='login'?'on':''}`}
              onClick={()=>{setMode('login');setError('');}}>ورود</button>
            <button className={`at ${mode==='register'?'on':''}`}
              onClick={()=>{setMode('register');setError('');}}>ثبت‌نام</button>
            <div className="at-slider"
              style={{transform: mode==='login'?'translateX(0)':'translateX(-100%)'}}/>
          </div>

          {/* heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}} transition={{duration:0.2}}>
              <h1 className="auth-title">
                {mode==='login'?'👋 خوش آمدید':'🎉 حساب بسازید'}
              </h1>
              <p className="auth-sub">
                {mode==='login'?'وارد حساب خود شوید':'یک حساب رایگان بسازید'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* form */}
          <form onSubmit={submit} className="af" noValidate>

            <AnimatePresence>
              {mode==='register' && (
                <motion.div className="afg"
                  initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                  exit={{opacity:0,height:0}} transition={{duration:0.28}}
                  style={{overflow:'hidden'}}>
                  <label>نام</label>
                  <div className="aff">
                    <UserIcon/><input type="text" name="name"
                      placeholder="نام شما" value={form.name} onChange={change}/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="afg">
              <label>ایمیل</label>
              <div className="aff">
                <MailIcon/>
                <input type="email" name="email" placeholder="example@email.com"
                  value={form.email} onChange={change}/>
              </div>
            </div>

            <div className="afg">
              <label>رمز عبور</label>
              <div className="aff">
                <LockIcon/>
                <input type={showPass?'text':'password'} name="password"
                  placeholder="حداقل ۶ کاراکتر" value={form.password} onChange={change}/>
                <button type="button" className="af-eye"
                  onClick={()=>setShowPass(p=>!p)}>
                  {showPass ? <EyeOffIcon/> : <EyeIcon/>}
                </button>
              </div>
            </div>

            {mode==='login' && (
              <div className="af-row">
                <label className="af-rem">
                  <input type="checkbox"/>
                  <span className="af-chk"/>
                  مرا به خاطر بسپار
                </label>
                <button type="button" className="af-forgot">فراموشی رمز؟</button>
              </div>
            )}

            {error && (
              <motion.p className="af-err"
                initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}>
                ⚠️ {error}
              </motion.p>
            )}

            <button type="submit"
              className={`af-btn ${loading?'loading':''}`} disabled={loading}>
              {loading
                ? <><span className="af-spin"/><span>لطفاً صبر کنید...</span></>
                : <><span>{mode==='login'?'ورود به حساب':'ساخت حساب'}</span>
                    <ArrowIcon/>
                  </>
              }
            </button>

            <div className="af-divider"><span>یا</span></div>

            <button type="button" className="af-google" onClick={googleLogin}>
              <GoogleIcon/>
              ورود با Google
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* ── tiny icon components ──────────────────────────── */
const UserIcon  = () => <svg className="af-ico" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon  = () => <svg className="af-ico" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
const LockIcon  = () => <svg className="af-ico" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const EyeIcon   = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon= () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>;
const ArrowIcon = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>;
const GoogleIcon= () => <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;

export default Auth;