// ============================================
// TextTab Component - تب ویرایش متن
// مسیر: src/components/editor/sidebar/TextTab.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import { validateSceneText } from '../../../utils/validators';
import { countWords } from '../../../utils/helpers';

const TextTab = () => {
  const { text, setText, scenes, parseText } = useEditorStore();
  const { showSuccess, showError } = useUIStore();

  const [localText, setLocalText] = useState(text || '');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // به‌روزرسانی آمار
  useEffect(() => {
    const words = countWords(localText);
    const chars = localText.length;
    setWordCount(words);
    setCharCount(chars);
  }, [localText]);

  // همگام‌سازی با Store
  useEffect(() => {
    setLocalText(text || '');
  }, [text]);

  /**
   * تغییر متن
   */
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setLocalText(newText);
    setText(newText);
  };

  /**
   * بارگذاری قالب
   */
  const loadTemplate = (type) => {
    const templates = {
      movie: `صحنه اول: شروع داستان
تصویر: شهر در شب، نورهای رنگارنگ

صحنه دوم: تنش و هیجان
صدا: ضربان قلب تند می‌شود

صحنه سوم: اوج داستان
تصویر: دویدن در کوچه‌های تاریک

صحنه چهارم: پایان
آرامش دوباره به شهر بازمی‌گردد`,

      poem: `صحنه اول: آغاز
دلم گرفته از این روزگار بی‌رحم

صحنه دوم: تأمل
چشمانت دریایی بی‌کران از راز

صحنه سوم: احساس
و دلم می‌خواهد پرواز کند با تو

صحنه چهارم: پایان
و باران همچنان می‌بارد بر این شهر`,

      quote: `صحنه اول: حکمت اول
زندگی کوتاه است، آن را هدر نده

صحنه دوم: درس دوم
پس لحظه‌ها را با عشق زندگی کن

صحنه سوم: الهام
و عشق بورز به همه چیز و همه کس`,

      story: `صحنه اول: روزی روزگاری
در شهری دور، دختری زندگی می‌کرد

صحنه دوم: شروع ماجرا
او تصمیم گرفت به دنبال رویاهایش برود

صحنه سوم: مسیر سخت
راه پر از چالش بود اما تسلیم نشد

صحنه چهارم: پایان خوش
و سرانجام آرامش و شادی را یافت`,
    };

    const template = templates[type];
    if (template) {
      setLocalText(template);
      setText(template);
      showSuccess(`قالب ${type === 'movie' ? 'فیلم' : type === 'poem' ? 'شعر' : type === 'quote' ? 'نقل قول' : 'داستان'} بارگذاری شد`);
    }
  };

  /**
   * پاک کردن متن
   */
  const clearText = () => {
    if (localText.trim()) {
      if (window.confirm('آیا می‌خواهید متن را پاک کنید؟')) {
        setLocalText('');
        setText('');
        showSuccess('متن پاک شد');
      }
    }
  };

  /**
   * کپی متن
   */
  const copyText = async () => {
    if (!localText.trim()) {
      showError('متنی برای کپی وجود ندارد');
      return;
    }

    try {
      await navigator.clipboard.writeText(localText);
      showSuccess('متن کپی شد');
    } catch (error) {
      showError('خطا در کپی متن');
    }
  };

  return (
    <div className="space-y-4">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <span>📝</span> متن صحنه‌ها
          </h3>
          <p className="text-xs opacity-70 mt-1">
            هر صحنه با "صحنه اول:" شروع شود
          </p>
        </div>
        <div className="badge">
          {scenes.length} صحنه
        </div>
      </div>

      {/* ناحیه متن */}
      <div className="relative">
        <textarea
          value={localText}
          onChange={handleTextChange}
          rows={12}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-sm resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          placeholder="صحنه اول: شب بارانی
تصویر: چراغ‌ها در آب منعکس می‌شوند

صحنه دوم: آرامش
قدم‌های آرام در خیابان خلوت"
        />

        {/* شمارنده */}
        <div className="absolute bottom-3 left-3 text-xs bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
          <span className="font-bold text-primary-500">{wordCount}</span> کلمه •{' '}
          <span className="font-bold text-accent-400">{charCount}</span> حرف
        </div>
      </div>

      {/* دکمه‌های عملیاتی */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyText}
          className="btn btn-ghost btn-sm"
          disabled={!localText.trim()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>کپی</span>
        </button>

        <button
          onClick={clearText}
          className="btn btn-ghost btn-sm"
          disabled={!localText.trim()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>پاک کردن</span>
        </button>
      </div>

      {/* قالب‌های آماده */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20">
        <p className="text-xs font-semibold mb-3 flex items-center gap-2">
          <span>✨</span> قالب‌های آماده
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => loadTemplate('movie')}
            className="template-btn"
          >
            🎥 فیلم
          </button>
          <button
            onClick={() => loadTemplate('poem')}
            className="template-btn"
          >
            ✍️ شعر
          </button>
          <button
            onClick={() => loadTemplate('quote')}
            className="template-btn"
          >
            💬 نقل قول
          </button>
          <button
            onClick={() => loadTemplate('story')}
            className="template-btn"
          >
            📖 داستان
          </button>
        </div>
      </div>

      {/* راهنما */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs opacity-70 leading-relaxed">
          <strong className="text-primary-500">نکته:</strong> برای بهترین نتیجه، هر صحنه را با "صحنه اول:"، "صحنه دوم:" و... شروع کنید.
        </p>
      </div>
    </div>
  );
};

export default TextTab;