/*
 * مسیر: /video-maker-pro/src/components/ui/Toast.jsx
 * ✨ سیستم Toast کامل با انیمیشن
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useUIStore from '../../store/useUIStore';
import './Toast.css';

const ICONS = {
  success: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
  ),
};

const Toast = ({ toast }) => {
  const removeToast = useUIStore(s => s.removeToast);

  return (
    <motion.div
      className={`toast toast-${toast.type}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      layout
    >
      <div className="toast-icon">{ICONS[toast.type]}</div>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => removeToast(toast.id)}>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const toasts = useUIStore(s => s.toasts);

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;