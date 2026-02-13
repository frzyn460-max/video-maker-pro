/*
 * مسیر: /video-maker-pro/src/components/editor/TutorialModal.jsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TutorialModal.css';

const TutorialModal = ({ isOpen, onClose }) => {
  const [currentTab, setCurrentTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: '🎬 مبانی', icon: '🎬' },
    { id: 'shortcuts', label: '⌨️ کلیدها', icon: '⌨️' },
    { id: 'effects', label: '✨ افکت‌ها', icon: '✨' },
    { id: 'tips', label: '💡 نکات', icon: '💡' }
  ];

  const content = {
    basics: {
      title: 'نحوه کار با ادیتور',
      sections: [
        {
          title: '📝 اضافه کردن متن',
          steps: [
            'از تب "ویرایشگر" روی "+ افزودن صحنه" کلیک کنید',
            'متن خود را در textarea تایپ کنید',
            'برای متن آهنگ: از حالت "ساده" استفاده کنید',
            'هر بند آهنگ را با یک خط خالی جدا کنید',
            'روی "تبدیل به صحنه" کلیک کنید'
          ]
        },
        {
          title: '🎨 اضافه کردن پس‌زمینه',
          steps: [
            'به تب "مدیا" بروید',
            'روی "انتخاب تصویر" یا "انتخاب ویدیو" کلیک کنید',
            'فایل مورد نظر را انتخاب کنید',
            'از تنظیمات پس‌زمینه برای شفافیت و blur استفاده کنید'
          ]
        },
        {
          title: '🎵 اضافه کردن موزیک',
          steps: [
            'در تب "مدیا" روی "انتخاب فایل صوتی" کلیک کنید',
            'فایل موزیک (MP3, WAV, ...) را انتخاب کنید',
            'موزیک با فشار Space همزمان با متن پخش می‌شود',
            'با کلید M می‌توانید صدا را قطع/وصل کنید'
          ]
        },
        {
          title: '⚙️ تنظیمات افکت‌ها',
          steps: [
            'تب "افکت‌ها" را باز کنید',
            'سرعت، مدت زمان و transition را تنظیم کنید',
            'رنگ متن، سایز و موقعیت را انتخاب کنید',
            'افکت‌های بصری مثل Particles و Vignette را فعال کنید'
          ]
        }
      ]
    },
    shortcuts: {
      title: 'کلیدهای میانبر',
      sections: [
        {
          title: '⏯️ کنترل پخش',
          shortcuts: [
            { key: 'Space', desc: 'پخش / توقف (همراه با موزیک)' },
            { key: '←', desc: 'صحنه بعدی' },
            { key: '→', desc: 'صحنه قبلی' },
            { key: 'R', desc: 'ریستارت (شروع از اول)' }
          ]
        },
        {
          title: '🎯 ناوبری',
          shortcuts: [
            { key: 'Home', desc: 'رفتن به اولین صحنه' },
            { key: 'End', desc: 'رفتن به آخرین صحنه' },
            { key: '1-9', desc: 'رفتن مستقیم به صحنه مشخص' }
          ]
        },
        {
          title: '⚡ تنظیمات',
          shortcuts: [
            { key: '↑', desc: 'افزایش سرعت پخش (+0.25x)' },
            { key: '↓', desc: 'کاهش سرعت پخش (-0.25x)' },
            { key: 'M', desc: 'قطع/وصل صدای موزیک' }
          ]
        },
        {
          title: '🖥️ نمایش',
          shortcuts: [
            { key: 'F', desc: 'تمام صفحه' },
            { key: 'Esc', desc: 'خروج از تمام صفحه' }
          ]
        },
        {
          title: '💾 عمومی',
          shortcuts: [
            { key: 'Ctrl+S', desc: 'ذخیره پروژه' },
            { key: 'Esc', desc: 'بازگشت به داشبورد' },
            { key: '?', desc: 'نمایش راهنمای کلیدها' }
          ]
        }
      ]
    },
    effects: {
      title: 'راهنمای افکت‌ها',
      sections: [
        {
          title: '📝 افکت‌های متن',
          effects: [
            { name: 'Typewriter', desc: 'نمایش متن حرف به حرف مثل تایپ', icon: '⌨️' },
            { name: 'Glow', desc: 'درخشش دور متن', icon: '✨' },
            { name: 'Text Shadow', desc: 'سایه زیر متن برای خوانایی بهتر', icon: '🌑' }
          ]
        },
        {
          title: '🎬 افکت‌های تصویر',
          effects: [
            { name: 'Ken Burns', desc: 'زوم و حرکت آرام روی تصویر', icon: '🔍' },
            { name: 'Particles', desc: 'ذرات شناور در پس‌زمینه', icon: '✨' },
            { name: 'Vignette', desc: 'تاریک کردن گوشه‌های تصویر', icon: '🎭' },
            { name: 'Grainy', desc: 'افکت دانه‌دار فیلم کلاسیک', icon: '📹' }
          ]
        },
        {
          title: '🎨 افکت‌های پیشرفته',
          effects: [
            { name: 'Shake', desc: 'لرزش صفحه', icon: '📳' },
            { name: 'Glitch', desc: 'افکت خرابی دیجیتال', icon: '⚡' },
            { name: 'Chromatic', desc: 'جدایی رنگ‌های RGB', icon: '🌈' }
          ]
        },
        {
          title: '🎨 فیلترهای رنگ',
          effects: [
            { name: 'Brightness', desc: 'روشنایی تصویر (0-200%)', icon: '☀️' },
            { name: 'Contrast', desc: 'کنتراست رنگ‌ها (0-200%)', icon: '◐' },
            { name: 'Saturation', desc: 'غلظت رنگ‌ها (0-200%)', icon: '🎨' }
          ]
        }
      ]
    },
    tips: {
      title: 'نکات و ترفندها',
      sections: [
        {
          title: '🎯 نکات مهم',
          tips: [
            {
              icon: '💡',
              title: 'استفاده از حالت ساده',
              desc: 'برای متن آهنگ از حالت "ساده" استفاده کنید. کل متن را یکجا بنویسید و هر بند را با خط خالی جدا کنید.'
            },
            {
              icon: '🎨',
              title: 'ترکیب افکت‌ها',
              desc: 'می‌توانید چند افکت را با هم ترکیب کنید. مثلاً Typewriter + Glow + Particles برای جلوه زیبا.'
            },
            {
              icon: '⚡',
              title: 'کنترل سرعت',
              desc: 'برای همزمانی بهتر متن با موزیک، از کلیدهای ↑↓ برای تنظیم سرعت استفاده کنید.'
            },
            {
              icon: '🎵',
              title: 'sync موزیک',
              desc: 'موزیک با کلید Space همزمان با متن شروع و متوقف می‌شود.'
            }
          ]
        },
        {
          title: '🚀 ترفندهای حرفه‌ای',
          tips: [
            {
              icon: '🎬',
              title: 'تنظیم aspect ratio',
              desc: 'برای یوتیوب 16:9، برای اینستاگرام استوری 9:16، و برای پست 1:1 انتخاب کنید.'
            },
            {
              icon: '📐',
              title: 'اندازه تصویر',
              desc: 'از تنظیمات "اندازه تصویر" برای zoom in/out روی پس‌زمینه استفاده کنید.'
            },
            {
              icon: '🎨',
              title: 'موقعیت متن',
              desc: 'متن را بالا، وسط یا پایین قرار دهید تا با تصویر پس‌زمینه همخوانی داشته باشد.'
            },
            {
              icon: '💾',
              title: 'ذخیره خودکار',
              desc: 'پروژه هر 5 ثانیه خودکار ذخیره می‌شود، اما با Ctrl+S می‌توانید دستی ذخیره کنید.'
            }
          ]
        }
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="tutorial-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="tutorial-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="tutorial-header">
            <h2>📚 راهنمای کامل ویرایشگر</h2>
            <button className="tutorial-close" onClick={onClose}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="tutorial-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tutorial-tab ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="tutorial-content">
            <h3 className="content-title">{content[currentTab].title}</h3>

            {/* Basics Tab */}
            {currentTab === 'basics' && (
              <div className="basics-content">
                {content.basics.sections.map((section, idx) => (
                  <div key={idx} className="tutorial-section">
                    <h4>{section.title}</h4>
                    <ol className="steps-list">
                      {section.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            {/* Shortcuts Tab */}
            {currentTab === 'shortcuts' && (
              <div className="shortcuts-content">
                {content.shortcuts.sections.map((section, idx) => (
                  <div key={idx} className="tutorial-section">
                    <h4>{section.title}</h4>
                    <div className="shortcuts-grid">
                      {section.shortcuts.map((shortcut, i) => (
                        <div key={i} className="shortcut-row">
                          <kbd className="key-badge">{shortcut.key}</kbd>
                          <span className="key-desc">{shortcut.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Effects Tab */}
            {currentTab === 'effects' && (
              <div className="effects-content">
                {content.effects.sections.map((section, idx) => (
                  <div key={idx} className="tutorial-section">
                    <h4>{section.title}</h4>
                    <div className="effects-grid">
                      {section.effects.map((effect, i) => (
                        <div key={i} className="effect-card">
                          <span className="effect-icon">{effect.icon}</span>
                          <div className="effect-info">
                            <strong>{effect.name}</strong>
                            <p>{effect.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tips Tab */}
            {currentTab === 'tips' && (
              <div className="tips-content">
                {content.tips.sections.map((section, idx) => (
                  <div key={idx} className="tutorial-section">
                    <h4>{section.title}</h4>
                    <div className="tips-grid">
                      {section.tips.map((tip, i) => (
                        <div key={i} className="tip-card">
                          <span className="tip-icon">{tip.icon}</span>
                          <div className="tip-info">
                            <strong>{tip.title}</strong>
                            <p>{tip.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="tutorial-footer">
            <p>💡 نکته: با فشار دادن کلید <kbd>?</kbd> می‌توانید راهنمای کلیدها را مشاهده کنید</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialModal;