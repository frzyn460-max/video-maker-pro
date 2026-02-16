/* 
 * مسیر: /video-maker-pro/src/components/editor/ExportPanel.jsx
 * ✨ سیستم Export کامل - ضبط ویدیو، GIF، تنظیمات
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../store/useEditorStore';
import useUIStore from '../../store/useUIStore';
import './ExportPanel.css';

/* ─── Quality presets ─── */
const QUALITY_PRESETS = {
  draft:  { label: '⚡ سریع',    bitrate: 1_000_000, fps: 24, suffix: '_draft' },
  hd:     { label: '🎬 HD',       bitrate: 4_000_000, fps: 30, suffix: '_hd' },
  fullhd: { label: '✨ Full HD',  bitrate: 8_000_000, fps: 30, suffix: '_fullhd' },
  '4k':   { label: '💎 4K',       bitrate: 20_000_000, fps: 60, suffix: '_4k' },
};

const FORMAT_OPTS = [
  { value: 'webm', label: 'WebM (پیشنهادی)', ext: '.webm' },
  { value: 'mp4',  label: 'MP4',              ext: '.mp4' },
];

/* ─── helper: mime ─── */
const getSupportedMime = (format) => {
  const mimes = format === 'mp4'
    ? ['video/mp4;codecs=h264', 'video/mp4', 'video/webm;codecs=h264']
    : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return mimes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';
};

/* ─── formatTime ─── */
const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
};

/* ═══════════════════════════════════════
   ExportPanel
   ═══════════════════════════════════════ */
const ExportPanel = ({ viewportRef, onClose }) => {
  const scenes   = useEditorStore(s => s.scenes);
  const settings = useEditorStore(s => s.settings);
  const showSuccess = useUIStore(s => s.showSuccess);
  const showError   = useUIStore(s => s.showError);

  const [quality, setQuality]   = useState('hd');
  const [format, setFormat]     = useState('webm');
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime]   = useState(0);
  const [progress, setProgress] = useState(0); // 0-100
  const [status, setStatus]     = useState('idle'); // idle | countdown | recording | processing | done
  const [filename, setFilename] = useState('video-maker-pro');
  const [countdown, setCountdown] = useState(3);
  const [captureMode, setCaptureMode] = useState('screen'); // screen | element

  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);
  const timerRef    = useRef(null);
  const cdTimerRef  = useRef(null);

  const totalDuration = scenes.reduce((a, s) => a + (s.duration || 5), 0);
  const preset = QUALITY_PRESETS[quality];

  /* ─── شروع ضبط ─── */
  const startRecording = useCallback(async () => {
    setStatus('countdown');
    setCountdown(3);

    // شمارش معکوس
    await new Promise(resolve => {
      let c = 3;
      cdTimerRef.current = setInterval(() => {
        c--;
        setCountdown(c);
        if (c <= 0) {
          clearInterval(cdTimerRef.current);
          resolve();
        }
      }, 1000);
    });

    try {
      let stream;

      if (captureMode === 'screen') {
        // ضبط کل صفحه
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            frameRate: preset.fps,
            width: { ideal: quality === '4k' ? 3840 : quality === 'fullhd' ? 1920 : 1280 },
            height: { ideal: quality === '4k' ? 2160 : quality === 'fullhd' ? 1080 : 720 },
          },
          audio: true,
        });
      } else {
        // ضبط عنصر viewport با Canvas
        if (!viewportRef?.current) throw new Error('Viewport یافت نشد');
        const el = viewportRef.current;
        // از captureStream استفاده می‌کنیم
        const canvas = el.querySelector('canvas') || document.createElement('canvas');
        canvas.width = el.offsetWidth || 1280;
        canvas.height = el.offsetHeight || 720;
        stream = canvas.captureStream(preset.fps);
      }

      const mime = getSupportedMime(format);
      const recorder = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: preset.bitrate,
      });

      chunksRef.current = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        const ext = format === 'mp4' ? '.mp4' : '.webm';
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = `${filename}${preset.suffix}${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus('done');
        showSuccess('ویدیو با موفقیت ذخیره شد!');
        clearInterval(timerRef.current);
      };

      recorderRef.current = recorder;
      recorder.start(100); // هر 100ms chunk

      setRecording(true);
      setStatus('recording');
      setRecTime(0);
      setProgress(0);

      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startedAt) / 1000;
        setRecTime(elapsed);
        setProgress(Math.min((elapsed / totalDuration) * 100, 99));
      }, 200);

      // توقف خودکار بعد از مدت پروژه
      setTimeout(() => {
        stopRecording();
      }, totalDuration * 1000 + 500);

    } catch (err) {
      setStatus('idle');
      showError('خطا در شروع ضبط: ' + err.message);
    }
  }, [captureMode, format, preset, quality, viewportRef, filename, totalDuration]);

  /* ─── توقف ضبط ─── */
  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      setStatus('processing');
      recorderRef.current.stop();
      recorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    clearInterval(timerRef.current);
    setRecording(false);
  }, []);

  /* ─── ذخیره تنظیمات به JSON ─── */
  const exportProjectJSON = () => {
    const data = {
      version: '2.0',
      scenes,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${filename}_project.json`; a.click();
    URL.revokeObjectURL(url);
    showSuccess('پروژه ذخیره شد');
  };

  /* ─── بارگذاری پروژه از JSON ─── */
  const importProjectJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        useEditorStore.getState().loadProject(data);
        showSuccess('پروژه بارگذاری شد');
        onClose?.();
      } catch {
        showError('فایل پروژه نامعتبر است');
      }
    };
    reader.readAsText(file);
  };

  /* ═══ RENDER ═══ */
  return (
    <motion.div
      className="export-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="ep-header">
        <div className="ep-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Export & ضبط
        </div>
        <button className="ep-close" onClick={onClose}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="ep-body">

        {/* ── اطلاعات پروژه ── */}
        <div className="ep-info-row">
          <div className="ep-info-chip">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
            {scenes.length} صحنه
          </div>
          <div className="ep-info-chip">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {fmtTime(totalDuration)}
          </div>
          <div className="ep-info-chip">
            {settings.aspectRatio || '16:9'}
          </div>
        </div>

        {/* ── نام فایل ── */}
        <div className="ep-field">
          <label className="ep-label">نام فایل</label>
          <input
            className="ep-input"
            value={filename}
            onChange={e => setFilename(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '-'))}
            placeholder="video-maker-pro"
            disabled={recording}
          />
        </div>

        {/* ── کیفیت ── */}
        <div className="ep-field">
          <label className="ep-label">کیفیت</label>
          <div className="ep-quality-grid">
            {Object.entries(QUALITY_PRESETS).map(([key, val]) => (
              <button
                key={key}
                className={`ep-quality-btn ${quality === key ? 'active' : ''}`}
                onClick={() => setQuality(key)}
                disabled={recording}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── فرمت ── */}
        <div className="ep-field">
          <label className="ep-label">فرمت</label>
          <div className="ep-format-row">
            {FORMAT_OPTS.map(f => (
              <button
                key={f.value}
                className={`ep-format-btn ${format === f.value ? 'active' : ''}`}
                onClick={() => setFormat(f.value)}
                disabled={recording}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── حالت ضبط ── */}
        <div className="ep-field">
          <label className="ep-label">روش ضبط</label>
          <div className="ep-capture-row">
            <button
              className={`ep-capture-btn ${captureMode === 'screen' ? 'active' : ''}`}
              onClick={() => setCaptureMode('screen')}
              disabled={recording}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              ضبط صفحه
            </button>
            <button
              className={`ep-capture-btn ${captureMode === 'element' ? 'active' : ''}`}
              onClick={() => setCaptureMode('element')}
              disabled={recording}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              فقط ویرایشگر
            </button>
          </div>
        </div>

        {/* ── وضعیت ضبط ── */}
        <AnimatePresence>
          {status === 'countdown' && (
            <motion.div className="ep-countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="ep-cd-num">{countdown}</span>
              <span className="ep-cd-text">ضبط شروع می‌شود...</span>
            </motion.div>
          )}

          {status === 'recording' && (
            <motion.div className="ep-rec-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="ep-rec-indicator" />
              <div className="ep-rec-info">
                <span className="ep-rec-time">{fmtTime(recTime)} / {fmtTime(totalDuration)}</span>
                <div className="ep-rec-progress">
                  <div className="ep-rec-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div className="ep-processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="ep-spinner" />
              در حال پردازش...
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div className="ep-done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              ✅ ویدیو با موفقیت ذخیره شد
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── دکمه اصلی ── */}
        <button
          className={`ep-main-btn ${recording ? 'recording' : ''}`}
          onClick={recording ? stopRecording : startRecording}
          disabled={status === 'countdown' || status === 'processing'}
        >
          {recording ? (
            <>
              <div className="ep-stop-icon" />
              توقف ضبط
            </>
          ) : (
            <>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8"/>
              </svg>
              شروع ضبط ویدیو
            </>
          )}
        </button>

        <div className="ep-divider">
          <span>یا</span>
        </div>

        {/* ── پروژه ── */}
        <div className="ep-project-section">
          <button className="ep-secondary-btn" onClick={exportProjectJSON}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            ذخیره پروژه (JSON)
          </button>
          <label className="ep-secondary-btn ep-import-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            بارگذاری پروژه
            <input type="file" accept=".json" onChange={importProjectJSON} style={{ display: 'none' }} />
          </label>
        </div>

        {/* نکته */}
        <div className="ep-note">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          برای بهترین کیفیت، قبل از ضبط پروژه را در تمام صفحه باز کنید
        </div>
      </div>
    </motion.div>
  );
};

export default ExportPanel;