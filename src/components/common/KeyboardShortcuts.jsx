/*
 * مسیر: /video-maker-pro/src/components/common/KeyboardShortcuts.jsx
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './KeyboardShortcuts.css';

const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // ? یا / - نمایش راهنما
      if (e.key === '?' || e.key === '/') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      
      // Escape - بستن راهنما
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  const shortcuts = [
    { key: 'Space', description: 'پخش / توقف (با موزیک)' },
    { key: '←', description: 'صحنه بعدی' },
    { key: '→', description: 'صحنه قبلی' },
    { key: '↑', description: 'افزایش سرعت' },
    { key: '↓', description: 'کاهش سرعت' },
    { key: 'F', description: 'تمام صفحه' },
    { key: 'Esc', description: 'خروج از تمام صفحه' },
    { key: 'R', description: 'ریستارت' },
    { key: 'M', description: 'بی‌صدا / صدادار' },
    { key: 'Home', description: 'اولین صحنه' },
    { key: 'End', description: 'آخرین صحنه' },
    { key: '1-9', description: 'رفتن به صحنه مشخص' },
    { key: 'Ctrl+S', description: 'ذخیره پروژه' },
    { key: '?', description: 'نمایش این راهنما' }
  ];

  return (
    <>
      {/* دکمه راهنما */}
      <button
        className="shortcuts-toggle-btn"
        onClick={() => setIsVisible(!isVisible)}
        title="کلیدهای میانبر (Press ?)"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M12 14l9-5-9-5-9 5 9 5z"/>
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
        </svg>
      </button>

      {/* راهنمای کلیدها */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="shortcuts-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="shortcuts-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shortcuts-header">
                <h3>⌨️ کلیدهای میانبر</h3>
                <button className="close-btn" onClick={() => setIsVisible(false)}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="shortcuts-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <kbd className="shortcut-key">{shortcut.key}</kbd>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </div>
                ))}
              </div>

              <div className="shortcuts-footer">
                <p>💡 فشار دادن <kbd>?</kbd> برای بستن این راهنما</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;