/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/AITab.jsx
 * ✨ نسخه پیشرفته - تاریخچه، پیشنهادات، مدل‌های مختلف، رفع باگ‌ها
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import './AITab.css';

/* ─────────────────── helpers ─────────────────── */

const QUICK_PROMPTS = [
  { label: '🎬 صحنه سینمایی', text: 'یک صحنه سینمایی حماسی با موسیقی و حرکت دوربین بساز' },
  { label: '🌙 شب آرام', text: 'یک صحنه آرام شبانه با نور ماه و صدای طبیعت' },
  { label: '🎵 آهنگ عاشقانه', text: 'بندهای یک آهنگ عاشقانه با احساسات عمیق' },
  { label: '🌊 طوفان', text: 'یک صحنه پر هیجان از طوفان دریا با امواج عظیم' },
  { label: '🌅 طلوع', text: 'صحنه طلوع آفتاب با فضایی دلگشا و امیدوارانه' },
  { label: '🏙️ شهر شب', text: 'صحنه شهر در شب با نورهای رنگی و شلوغی' },
];

const TONE_OPTIONS = [
  { value: 'cinematic', label: '🎬 سینمایی' },
  { value: 'poetic',    label: '🌸 شاعرانه' },
  { value: 'dramatic',  label: '⚡ دراماتیک' },
  { value: 'romantic',  label: '💕 عاشقانه' },
  { value: 'epic',      label: '🗡️ حماسی' },
  { value: 'calm',      label: '🍃 آرام' },
];

const parseAIScenes = (text) => {
  // چند روش مختلف برای پارس
  const patterns = [
    /(?:صحنه\s*\d+\s*:?\s*)([\s\S]*?)(?=صحنه\s*\d+|$)/gi,
    /(?:\*\*صحنه[^*]+\*\*:?\s*)([\s\S]*?)(?=\*\*صحنه|$)/gi,
    /(?:^\d+\.\s+)([\s\S]*?)(?=^\d+\.|$)/gim,
  ];

  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length >= 2) {
      return matches.map((m, i) => ({
        id: `ai-${Date.now()}-${i}`,
        order: i,
        title: `صحنه ${i + 1}`,
        content: m[1]?.trim().replace(/\*\*/g, '') || '',
        duration: 5,
      })).filter(s => s.content.length > 0);
    }
  }

  // fallback: تقسیم بر اساس خط خالی
  const parts = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return parts.map((p, i) => ({
    id: `ai-${Date.now()}-${i}`,
    order: i,
    title: `صحنه ${i + 1}`,
    content: p.trim().replace(/^\**صحنه[^:]+:\s*\**/, '').replace(/\*\*/g, '').trim(),
    duration: 5,
  }));
};

const buildSystemPrompt = (tone) => {
  const toneDesc = {
    cinematic:  'سینمایی و دراماتیک با جزئیات بصری',
    poetic:     'شاعرانه و ادبی با تصاویر زیبا',
    dramatic:   'پرتنش و احساسی با کشمکش قوی',
    romantic:   'عاشقانه و ملایم با احساسات عمیق',
    epic:       'حماسی و قهرمانانه با مقیاس بزرگ',
    calm:       'آرام و مدیتیتیو با فضای ذهنی',
  };
  return `تو یک نویسنده متن فیلم حرفه‌ای فارسی هستی. 
متن صحنه‌ها را به فارسی روان و ${toneDesc[tone] || 'سینمایی'} بنویس.
هر صحنه با "صحنه اول:" ، "صحنه دوم:" و... شروع شود.
هر صحنه حداکثر 3-4 جمله کوتاه و تأثیرگذار باشد.
فقط متن صحنه‌ها بنویس، بدون توضیح اضافه.`;
};

/* ─────────────────── Component ─────────────────── */

const AITab = () => {
  const [prompt, setPrompt]           = useState('');
  const [tone, setTone]               = useState('cinematic');
  const [sceneCount, setSceneCount]   = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [task, setTask]               = useState('generate'); // generate | optimize | translate
  const [history, setHistory]         = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [result, setResult]           = useState(null); // { scenes, raw }
  const [showResult, setShowResult]   = useState(false);
  const textareaRef = useRef(null);

  const addScene     = useEditorStore(s => s.addScene);
  const setScenes    = useEditorStore(s => s.setScenes);
  const scenes       = useEditorStore(s => s.scenes);
  const showSuccess  = useUIStore(s => s.showSuccess);
  const showError    = useUIStore(s => s.showError);

  /* ─── auto-resize textarea ─── */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [prompt]);

  /* ─── call API ─── */
  const callAPI = async (messages, systemPrompt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY || 'YOUR_KEY_HERE',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.content?.map(b => b.type === 'text' ? b.text : '').join('').trim() || '';
  };

  /* ─── تولید صحنه ─── */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setShowResult(false);
    try {
      const userMsg = `درخواست: ${prompt.trim()}\nتعداد صحنه: ${sceneCount}\nسبک: ${tone}`;
      const raw = await callAPI([{ role: 'user', content: userMsg }], buildSystemPrompt(tone));
      const parsed = parseAIScenes(raw);

      if (parsed.length === 0) throw new Error('هیچ صحنه‌ای شناسایی نشد');

      setResult({ scenes: parsed, raw });
      setShowResult(true);
      setHistory(prev => [{ prompt: prompt.trim(), time: new Date().toLocaleTimeString('fa'), count: parsed.length }, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error(err);
      showError('خطا: ' + (err.message.includes('YOUR_KEY') ? 'API Key تنظیم نشده' : err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─── بهینه‌سازی صحنه‌های موجود ─── */
  const handleOptimize = async () => {
    if (scenes.length === 0) { showError('هیچ صحنه‌ای وجود ندارد'); return; }
    setIsGenerating(true);
    setShowResult(false);
    try {
      const scenesText = scenes.map((s, i) => `صحنه ${i + 1}: ${s.content}`).join('\n\n');
      const sys = `تو یک ویراستار حرفه‌ای فارسی هستی. متن صحنه‌ها را بهتر، روان‌تر و ${tone === 'cinematic' ? 'سینمایی‌تر' : tone + 'تر'} کن.
همان تعداد صحنه را با همان شماره‌گذاری برگردان.`;
      const raw = await callAPI([{ role: 'user', content: `این صحنه‌ها را بهینه کن:\n\n${scenesText}` }], sys);
      const parsed = parseAIScenes(raw);

      if (parsed.length === 0) throw new Error('نتیجه‌ای دریافت نشد');

      // حفظ duration اصلی
      const merged = parsed.map((s, i) => ({ ...s, duration: scenes[i]?.duration || 5 }));
      setResult({ scenes: merged, raw });
      setShowResult(true);
    } catch (err) {
      showError('خطا: ' + (err.message.includes('YOUR_KEY') ? 'API Key تنظیم نشده' : err.message));
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─── اعمال نتیجه ─── */
  const applyResult = (mode = 'replace') => {
    if (!result) return;
    if (mode === 'replace') {
      setScenes(result.scenes);
      showSuccess(`${result.scenes.length} صحنه جایگزین شد`);
    } else {
      result.scenes.forEach(s => addScene(s));
      showSuccess(`${result.scenes.length} صحنه اضافه شد`);
    }
    setShowResult(false);
    setResult(null);
    setPrompt('');
  };

  /* ═════════════════════ RENDER ═════════════════════ */
  return (
    <div className="ai-tab">

      {/* Header */}
      <div className="ai-header">
        <h3 className="tab-title">
          <span className="title-icon">🤖</span>
          دستیار هوش مصنوعی
        </h3>
        {history.length > 0 && (
          <button className="ai-hist-toggle" onClick={() => setShowHistory(x => !x)} title="تاریخچه">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {history.length}
          </button>
        )}
      </div>

      {/* Task selector */}
      <div className="ai-task-bar">
        {[
          { id: 'generate', label: '✨ تولید', icon: '✨' },
          { id: 'optimize', label: '🔧 بهینه', icon: '🔧' },
        ].map(t => (
          <button
            key={t.id}
            className={`ai-task-btn ${task === t.id ? 'active' : ''}`}
            onClick={() => { setTask(t.id); setShowResult(false); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Prompt - فقط برای generate */}
      <AnimatePresence>
        {task === 'generate' && (
          <motion.div className="ai-input-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Quick Prompts */}
            <div className="ai-quick-label">پیشنهادات سریع</div>
            <div className="ai-quick-grid">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  className="ai-quick-btn"
                  onClick={() => { setPrompt(qp.text); textareaRef.current?.focus(); }}
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div className="prompt-container">
              <label className="prompt-label">درخواست شما</label>
              <textarea
                ref={textareaRef}
                className="prompt-input"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="توضیح دهید چه صحنه‌هایی می‌خواهید..."
                disabled={isGenerating}
                rows={3}
                onKeyDown={e => { if (e.ctrlKey && e.key === 'Enter') handleGenerate(); }}
              />
              <div className="ai-input-meta">
                <span className="ai-char-count">{prompt.length} کاراکتر</span>
                <span className="ai-shortcut-hint">Ctrl+Enter برای ارسال</span>
              </div>
            </div>

            {/* Options row */}
            <div className="ai-options-row">
              <div className="ai-opt-group">
                <label className="ai-opt-label">سبک</label>
                <select className="ai-select" value={tone} onChange={e => setTone(e.target.value)}>
                  {TONE_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="ai-opt-group">
                <label className="ai-opt-label">تعداد صحنه</label>
                <div className="ai-count-ctrl">
                  <button className="ai-count-btn" onClick={() => setSceneCount(n => Math.max(1, n - 1))} disabled={sceneCount <= 1}>−</button>
                  <span className="ai-count-val">{sceneCount}</span>
                  <button className="ai-count-btn" onClick={() => setSceneCount(n => Math.min(10, n + 1))} disabled={sceneCount >= 10}>+</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {task === 'optimize' && (
          <motion.div className="ai-optimize-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="ai-opt-info-card">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div>
                <strong>{scenes.length} صحنه</strong> موجود برای بهینه‌سازی
                <p>AI متن صحنه‌ها را روان‌تر و سینمایی‌تر می‌کند.</p>
              </div>
            </div>
            <div className="ai-opt-group" style={{ marginTop: '0.75rem' }}>
              <label className="ai-opt-label">سبک بهینه‌سازی</label>
              <select className="ai-select" value={tone} onChange={e => setTone(e.target.value)}>
                {TONE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate/Optimize button */}
      <button
        className="ai-generate-btn"
        onClick={task === 'generate' ? handleGenerate : handleOptimize}
        disabled={isGenerating || (task === 'generate' && !prompt.trim()) || (task === 'optimize' && scenes.length === 0)}
      >
        {isGenerating ? (
          <>
            <div className="spinner-small" />
            <span>در حال پردازش...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>{task === 'generate' ? `تولید ${sceneCount} صحنه` : 'بهینه‌سازی صحنه‌ها'}</span>
          </>
        )}
      </button>

      {/* نتیجه AI */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            className="ai-result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <div className="ai-result-header">
              <span className="ai-result-title">✅ {result.scenes.length} صحنه آماده شد</span>
              <button className="ai-result-close" onClick={() => setShowResult(false)}>×</button>
            </div>
            <div className="ai-result-preview">
              {result.scenes.slice(0, 3).map((s, i) => (
                <div key={i} className="ai-result-item">
                  <span className="ai-result-num">{i + 1}</span>
                  <span className="ai-result-text">{s.content.slice(0, 60)}{s.content.length > 60 ? '…' : ''}</span>
                </div>
              ))}
              {result.scenes.length > 3 && <div className="ai-result-more">+ {result.scenes.length - 3} صحنه دیگر</div>}
            </div>
            <div className="ai-result-actions">
              <button className="ai-apply-btn ai-apply-replace" onClick={() => applyResult('replace')}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                جایگزینی
              </button>
              <button className="ai-apply-btn ai-apply-add" onClick={() => applyResult('add')}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                اضافه کردن
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* تاریخچه */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div className="ai-history" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="ai-hist-header">
              <span>تاریخچه</span>
              <button onClick={() => setHistory([])} className="ai-hist-clear">پاک کردن</button>
            </div>
            {history.map((h, i) => (
              <div key={i} className="ai-hist-item" onClick={() => { setPrompt(h.prompt); setShowHistory(false); }}>
                <span className="ai-hist-text">{h.prompt.slice(0, 50)}{h.prompt.length > 50 ? '…' : ''}</span>
                <div className="ai-hist-meta">
                  <span>{h.count} صحنه</span>
                  <span>{h.time}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* یادآوری */}
      <div className="ai-note">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>نیاز به <code>REACT_APP_ANTHROPIC_KEY</code> در <code>.env</code></span>
      </div>
    </div>
  );
};

export default AITab;