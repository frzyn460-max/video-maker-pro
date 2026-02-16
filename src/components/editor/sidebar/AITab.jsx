/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/AITab.jsx
 * ✨ نسخه جدید
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import './AITab.css';

const AITab = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const setScenes = useEditorStore(state => state.setScenes);
  const showSuccess = useUIStore(state => state.showSuccess);
  const showError = useUIStore(state => state.showError);

  const parseScenes = (text) => {
    const sceneBlocks = text.split(/(?=صحنه)/);
    return sceneBlocks
      .map((block, index) => {
        const lines = block.trim().split('\n').filter(l => l.trim());
        if (lines.length === 0) return null;
        const title = lines[0].replace(/صحنه.*?:/i, '').trim();
        const content = lines.slice(1).join(' ').replace(/تصویر:|صدا:/gi, '').trim();
        return {
          id: `scene-${Date.now()}-${index}`,
          order: index,
          title: title || `صحنه ${index + 1}`,
          content: content || '',
          duration: 5
        };
      })
      .filter(Boolean);
  };

  // تولید صحنه با AI
  const handleGenerateScenes = async () => {
    if (!prompt.trim()) {
      showError('لطفاً درخواست خود را وارد کنید');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': 'YOUR_API_KEY_HERE'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `به فارسی در قالب صحنه‌های سینمایی پاسخ بده. هر صحنه با "صحنه اول:"، "صحنه دوم:" شروع شود.\n\nدرخواست: ${prompt}\n\nفقط متن صحنه‌ها.`
          }]
        })
      });

      if (!response.ok) throw new Error('خطا در ارتباط با سرور');

      const data = await response.json();
      if (data.content && Array.isArray(data.content)) {
        const text = data.content.map(item => item.type === 'text' ? item.text : '').join('\n').trim();
        if (!text) throw new Error('پاسخ خالی دریافت شد');
        const parsedScenes = parseScenes(text);
        setScenes(parsedScenes);
        showSuccess('صحنه‌ها با موفقیت تولید شدند');
        setPrompt('');
      } else {
        throw new Error('فرمت پاسخ نامعتبر است');
      }
    } catch (error) {
      console.error('خطا در تولید صحنه:', error);
      showError('خطا: برای استفاده از AI باید API Key خود را در کد قرار دهید');
    } finally {
      setIsGenerating(false);
    }
  };

  // بهینه‌سازی صحنه‌های موجود
  const handleOptimizeScenes = async () => {
    const scenes = useEditorStore.getState().scenes;
    if (scenes.length === 0) { showError('صحنه‌ای برای بهینه‌سازی وجود ندارد'); return; }
    setIsGenerating(true);
    try {
      const scenesText = scenes.map(s => `صحنه ${s.order + 1}: ${s.title}\n${s.content}`).join('\n\n');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': 'YOUR_API_KEY_HERE'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `این متن را برای نمایش سینمایی بهینه کن:\n\n${scenesText}\n\nفقط متن بهینه‌شده.`
          }]
        })
      });

      if (!response.ok) throw new Error('خطا در ارتباط با سرور');
      const data = await response.json();
      if (data.content && Array.isArray(data.content)) {
        const text = data.content.map(item => item.type === 'text' ? item.text : '').join('\n').trim();
        if (!text) throw new Error('پاسخ خالی دریافت شد');
        const parsedScenes = parseScenes(text).map((s, i) => ({
          ...s,
          duration: scenes[i]?.duration || 5
        }));
        setScenes(parsedScenes);
        showSuccess('صحنه‌ها بهینه‌سازی شدند');
      }
    } catch (error) {
      showError('خطا: برای استفاده از AI باید API Key خود را در کد قرار دهید');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-tab">
      {/* Header */}
      <div className="ai-header">
        <h3 className="tab-title">
          <span className="title-icon">🤖</span>
          دستیار هوش مصنوعی
        </h3>
      </div>

      {/* توضیحات */}
      <motion.div
        className="ai-info"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <p className="info-title">✦ AI می‌تواند</p>
        <ul className="info-list">
          <li>تولید صحنه‌های سینمایی حرفه‌ای</li>
          <li>پیشنهاد افکت‌های مناسب</li>
          <li>بهینه‌سازی و اصلاح متن</li>
          <li>ایجاد محتوای خلاقانه</li>
        </ul>
      </motion.div>

      {/* Prompt */}
      <div className="prompt-container">
        <label className="prompt-label">درخواست شما</label>
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="مثال: یک صحنه سینمایی از غروب آفتاب کنار دریا بساز..."
          rows={4}
          disabled={isGenerating}
        />
      </div>

      {/* دکمه‌ها */}
      <div className="ai-actions">
        <button
          className="ai-generate-btn"
          onClick={handleGenerateScenes}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className="spinner-small"></div>
              <span>در حال تولید...</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>تولید صحنه جدید</span>
            </>
          )}
        </button>

        <button
          className="ai-optimize-btn"
          onClick={handleOptimizeScenes}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner-small" style={{ borderColor: 'rgba(139,92,246,0.25)', borderTopColor: '#8b5cf6' }}></div>
              <span>در حال بهینه‌سازی...</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>بهینه‌سازی صحنه‌های موجود</span>
            </>
          )}
        </button>
      </div>

      {/* یادآوری */}
      <div className="ai-note">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>برای استفاده از AI باید API Key خود را در کد قرار دهید</span>
      </div>
    </div>
  );
};

export default AITab;