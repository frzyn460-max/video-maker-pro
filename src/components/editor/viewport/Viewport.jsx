/* 
 * مسیر: /video-maker-pro/src/components/editor/viewport/Viewport.jsx
 * ✨ نسخه پیشرفته - افکت‌های جدید + کنترل‌های حرفه‌ای + Export آماده‌سازی
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useMediaStore from '../../../store/useMediaStore';
import useUIStore from '../../../store/useUIStore';
import './Viewport.css';

/* ─────────── transition animations ─────────── */
const TRANSITIONS = {
  fade:    { initial: { opacity: 0, y: 20 },        animate: { opacity: 1, y: 0 },        exit: { opacity: 0, y: -20 } },
  slide:   { initial: { opacity: 0, x: 80 },         animate: { opacity: 1, x: 0 },         exit: { opacity: 0, x: -80 } },
  zoom:    { initial: { opacity: 0, scale: 0.6 },    animate: { opacity: 1, scale: 1 },    exit: { opacity: 0, scale: 1.4 } },
  flip:    { initial: { opacity: 0, rotateY: 90 },   animate: { opacity: 1, rotateY: 0 },  exit: { opacity: 0, rotateY: -90 } },
  blur:    { initial: { opacity: 0, filter: 'blur(24px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(24px)' } },
  rise:    { initial: { opacity: 0, y: 60, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -60, scale: 0.95 } },
  glitch2: { initial: { opacity: 0, x: -10, skewX: 10 }, animate: { opacity: 1, x: 0, skewX: 0 }, exit: { opacity: 0, x: 10, skewX: -10 } },
  reveal:  { initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)' }, animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)' }, exit: { opacity: 0, clipPath: 'inset(0 0 0 100%)' } },
};

/* ─────────── Particles hook ─────────── */
const useParticles = (canvasRef, viewportRef, enabled, style = 'default') => {
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const COUNT = style === 'snow' ? 120 : style === 'fire' ? 80 : 150;

    const resize = () => {
      if (!viewportRef.current) return;
      const r = viewportRef.current.getBoundingClientRect();
      canvas.width = document.fullscreenElement ? window.innerWidth : r.width;
      canvas.height = document.fullscreenElement ? window.innerHeight : r.height;
    };

    const makeParticle = () => {
      const w = canvas.width || 800;
      const h = canvas.height || 450;
      if (style === 'snow') return {
        x: Math.random() * w, y: -10,
        vx: (Math.random() - 0.5) * 0.5, vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 4 + 1, opacity: Math.random() * 0.7 + 0.3, color: '#ffffff',
      };
      if (style === 'fire') return {
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.4, y: h + 10,
        vx: (Math.random() - 0.5) * 2, vy: -(Math.random() * 3 + 2),
        size: Math.random() * 6 + 2, opacity: Math.random() * 0.8 + 0.2,
        color: `hsl(${Math.random() * 40 + 10}, 100%, ${Math.random() * 40 + 50}%)`,
      };
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 0.5, opacity: Math.random() * 0.5 + 0.2, color: '#ffffff',
      };
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('fullscreenchange', resize);

    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        ctx.beginPath();
        if (style === 'fire') {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          g.addColorStop(0, p.color);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        p.opacity -= 0.002;

        const oob =
          (style === 'snow' && p.y > canvas.height) ||
          (style === 'fire' && (p.y < -20 || p.opacity <= 0)) ||
          (style === 'default' && (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height));

        if (oob || p.opacity <= 0) particles[i] = makeParticle();
        if (style === 'default') {
          if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
          if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
          p.opacity = Math.abs(Math.sin(Date.now() / 2000 + i)) * 0.4 + 0.1;
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('fullscreenchange', resize);
    };
  }, [enabled, style]);
};

/* ─────────── Countdown overlay ─────────── */
const Countdown = ({ onDone }) => {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onDone]);

  return (
    <div className="vp-countdown">
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="vp-countdown-num"
        >
          {count > 0 ? count : '▶'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

/* ─────────── Speed indicator ─────────── */
const SpeedBadge = ({ speed }) =>
  speed !== 1 ? (
    <div className="vp-speed-badge">{speed}×</div>
  ) : null;

/* ═══════════════════════════════════════════
   VIEWPORT
   ═══════════════════════════════════════════ */
const Viewport = () => {
  const viewportRef       = useRef(null);
  const particlesRef      = useRef(null);
  const progressTimer     = useRef(null);

  const scenes            = useEditorStore(s => s.scenes);
  const idx               = useEditorStore(s => s.currentSceneIndex);
  const isPlaying         = useEditorStore(s => s.isPlaying);
  const settings          = useEditorStore(s => s.settings);
  const setIdx            = useEditorStore(s => s.setCurrentSceneIndex);
  const setIsPlaying      = useEditorStore(s => s.setIsPlaying);
  const updateSettings    = useEditorStore(s => s.updateSettings);
  const nextScene         = useEditorStore(s => s.nextScene);
  const prevScene         = useEditorStore(s => s.prevScene);

  const bgMedia           = useMediaStore(s => s.backgroundMedia);
  const audioTrack        = useMediaStore(s => s.audioTrack);
  const audioVolume       = useMediaStore(s => s.audioVolume);
  const audioMuted        = useMediaStore(s => s.audioMuted);

  const showSuccess       = useUIStore(s => s.showSuccess);

  const [progress, setProgress]     = useState(0);
  const [isFullscreen, setFullscreen] = useState(false);
  const [displayedText, setText]    = useState('');
  const [showCountdown, setCountdown] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const audioRef = useRef(null);
  const kenRef   = useRef(null);

  const scene = scenes[idx];

  /* ── Particles ── */
  useParticles(
    particlesRef,
    viewportRef,
    settings.particles,
    settings.particleStyle || 'default'
  );

  /* ── Typewriter ── */
  useEffect(() => {
    if (!scene?.content) { setText(''); return; }
    if (!settings.typewriter) { setText(scene.content); return; }
    setText('');
    let i = 0;
    const speed = Math.max(10, 50 / (settings.speed || 1));
    const iv = setInterval(() => {
      if (i < scene.content.length) { setText(scene.content.slice(0, ++i)); }
      else clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [scene, settings.typewriter, settings.speed]);

  /* ── Auto-play timer ── */
  useEffect(() => {
    if (!isPlaying || !scene) return;
    const dur = (scene.duration || settings.duration) * 1000 / (settings.speed || 1);
    let start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / dur) * 100, 100);
      setProgress(p);
      if (p < 100) {
        progressTimer.current = requestAnimationFrame(tick);
      } else {
        if (idx < scenes.length - 1) {
          setIdx(idx + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
          setIdx(0);
          setProgress(0);
        }
      }
    };
    progressTimer.current = requestAnimationFrame(tick);
    return () => { if (progressTimer.current) cancelAnimationFrame(progressTimer.current); };
  }, [isPlaying, scene, idx, scenes.length, settings.duration, settings.speed]);

  /* ── Ken Burns ── */
  useEffect(() => {
    if (!settings.kenburns || !kenRef.current) return;
    kenRef.current.style.transition = 'transform 12s ease-out';
    kenRef.current.style.transform = idx % 2 === 0 ? 'scale(1.18) translate(-2%, -1%)' : 'scale(1.12) translate(2%, 1%)';
    return () => { if (kenRef.current) kenRef.current.style.transform = 'scale(1)'; };
  }, [idx, settings.kenburns]);

  /* ── Fullscreen listener ── */
  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  /* ── Controls auto-hide ── */
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(hoverTimeout);
    const t = setTimeout(() => setShowControls(false), 2500);
    setHoverTimeout(t);
  }, [hoverTimeout]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextScene(); setProgress(0); setIsPlaying(false);
          break;
        case 'ArrowRight':
          e.preventDefault();
          prevScene(); setProgress(0); setIsPlaying(false);
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateSettings({ speed: Math.min(3, (settings.speed || 1) + 0.25) });
          break;
        case 'ArrowDown':
          e.preventDefault();
          updateSettings({ speed: Math.max(0.25, (settings.speed || 1) - 0.25) });
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyR':
          e.preventDefault();
          handleRestart();
          break;
        case 'KeyM':
          e.preventDefault();
          if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
          break;
        case 'Home':
          e.preventDefault();
          setIdx(0); setProgress(0);
          break;
        case 'End':
          e.preventDefault();
          setIdx(scenes.length - 1); setProgress(0);
          break;
        default:
          if (e.key >= '1' && e.key <= '9') {
            const n = parseInt(e.key) - 1;
            if (n < scenes.length) { setIdx(n); setProgress(0); setIsPlaying(false); }
          }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying, idx, scenes.length, settings.speed]);

  /* ── Actions ── */
  const handlePlayPause = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (audioRef.current) {
      next ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
    }
  };

  const handlePlayWithCountdown = () => {
    if (!isPlaying) {
      setCountdown(true);
    } else {
      handlePlayPause();
    }
  };

  const handleRestart = () => {
    setIdx(0); setProgress(0); setIsPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const toggleFullscreen = () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ── Text styling ── */
  const textStyle = {
    fontSize: `${settings.fontSize || 48}px`,
    color: settings.textColor || '#ffffff',
    textShadow: settings.textShadow
      ? settings.glow
        ? '0 4px 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.6), 0 0 60px var(--primary)'
        : '0 4px 20px rgba(0,0,0,0.8)'
      : 'none',
    fontWeight: settings.fontWeight || 900,
    letterSpacing: settings.letterSpacing ? `${settings.letterSpacing}em` : undefined,
    lineHeight: settings.lineHeight || 1.3,
    fontFamily: settings.fontFamily || 'inherit',
  };

  const stageAlign =
    settings.textPosition === 'top' ? 'flex-start' :
    settings.textPosition === 'bottom' ? 'flex-end' : 'center';

  const transition = TRANSITIONS[settings.transition] || TRANSITIONS.fade;

  /* ── Empty state ── */
  if (scenes.length === 0) {
    return (
      <div className="viewport-empty">
        <motion.div
          className="empty-icon"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >🎬</motion.div>
        <h3>صحنه‌ای وجود ندارد</h3>
        <p>از تب «ویرایشگر» صحنه‌های خود را اضافه کنید</p>
      </div>
    );
  }

  /* ── CSS filter string ── */
  const cssFilter = [
    `brightness(${(settings.brightness || 100) / 100})`,
    `contrast(${(settings.contrast || 100) / 100})`,
    `saturate(${(settings.saturation || 100) / 100})`,
    settings.sepia ? `sepia(${settings.sepiaAmount || 50}%)` : '',
    settings.hueRotate ? `hue-rotate(${settings.hueRotateAngle || 0}deg)` : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={viewportRef}
      className={`viewport ${isFullscreen ? 'fullscreen' : ''} ${settings.shake ? 'shake-effect' : ''}`}
      style={{
        filter: cssFilter,
        aspectRatio: (settings.aspectRatio || '16:9').replace(':', '/'),
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Countdown ── */}
      <AnimatePresence>
        {showCountdown && (
          <Countdown onDone={() => { setCountdown(false); handlePlayPause(); }} />
        )}
      </AnimatePresence>

      {/* ── Speed badge ── */}
      <SpeedBadge speed={settings.speed || 1} />

      {/* ── Background ── */}
      <div className="viewport-background">
        {bgMedia?.type === 'image' && (
          <img
            ref={kenRef}
            src={bgMedia.url}
            alt=""
            className="bg-image"
            style={{
              opacity: (settings.bgOpacity || 100) / 100,
              filter: `blur(${settings.bgBlur || 0}px)`,
              objectFit: settings.bgFit || 'cover',
              transform: `scale(${(settings.bgScale || 100) / 100})`,
            }}
          />
        )}
        {bgMedia?.type === 'video' && (
          <video
            src={bgMedia.url}
            className="bg-video"
            muted loop autoPlay playsInline
            style={{
              opacity: (settings.bgOpacity || 100) / 100,
              filter: `blur(${settings.bgBlur || 0}px)`,
              objectFit: settings.bgFit || 'cover',
              transform: `scale(${(settings.bgScale || 100) / 100})`,
            }}
          />
        )}
        {!bgMedia && settings.gradientBg && (
          <div
            className="bg-gradient"
            style={{ background: settings.gradientBg }}
          />
        )}
      </div>

      {/* ── Color overlay ── */}
      {settings.colorOverlay && (
        <div
          className="vp-color-overlay"
          style={{
            background: settings.colorOverlayColor || 'rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* ── Particles ── */}
      {settings.particles && (
        <canvas ref={particlesRef} className="particles-canvas" />
      )}

      {/* ── Film grain ── */}
      {settings.grainy && <div className="film-grain" />}

      {/* ── Scan lines ── */}
      {settings.scanlines && <div className="vp-scanlines" />}

      {/* ── Letterbox ── */}
      {settings.letterbox !== false && (
        <>
          <div className="letterbox letterbox-top" />
          <div className="letterbox letterbox-bottom" />
        </>
      )}

      {/* ── Scene content ── */}
      <div className="viewport-stage" style={{ alignItems: stageAlign }}>
        <AnimatePresence mode="wait">
          {scene && (
            <motion.div
              key={scene.id}
              className="scene-content"
              {...transition}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              {scene.title && scene.title !== 'undefined' && (
                <motion.div
                  className="scene-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {scene.title}
                </motion.div>
              )}

              <div
                className={[
                  'scene-text',
                  settings.glitch ? 'glitch-effect' : '',
                  settings.chromatic ? 'chromatic-effect' : '',
                  settings.neon ? 'neon-effect' : '',
                  settings.outline ? 'outline-effect' : '',
                ].join(' ')}
                style={textStyle}
                data-text={scene.content || ''}
              >
                {displayedText || scene.content || ''}
              </div>

              {/* sub-text */}
              {scene.subtitle && (
                <motion.div
                  className="scene-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ delay: 0.5 }}
                >
                  {scene.subtitle}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Vignette ── */}
      {settings.vignette && (
        <div
          className="vignette"
          style={{ opacity: (settings.vignetteStrength || 70) / 100 }}
        />
      )}

      {/* ── Glitch effect overlay ── */}
      {settings.glitch && <div className="glitch-overlay" />}

      {/* ── Overlay info ── */}
      <motion.div
        className="viewport-info"
        animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="scene-counter">
          {idx + 1} / {scenes.length}
        </div>
        <div className="time-display">
          {(() => {
            const t = scenes.slice(0, idx).reduce((a, s) => a + (s.duration || 5), 0);
            return `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
          })()}
        </div>
      </motion.div>

      {/* ── Progress bar ── */}
      <div className="progress-container">
        <motion.div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Controls ── */}
      <motion.div
        className="viewport-controls"
        animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="control-btn"
          onClick={handleRestart}
          title="شروع از اول (R)"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>

        <button
          className="control-btn"
          onClick={() => { prevScene(); setProgress(0); setIsPlaying(false); }}
          disabled={idx === 0}
          title="صحنه قبلی (→)"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <button
          className="control-btn control-btn-large"
          onClick={handlePlayWithCountdown}
          title="پخش / توقف (Space)"
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.svg key="pause" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"
                initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </motion.svg>
            ) : (
              <motion.svg key="play" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"
                initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </button>

        <button
          className="control-btn"
          onClick={() => { nextScene(); setProgress(0); setIsPlaying(false); }}
          disabled={idx === scenes.length - 1}
          title="صحنه بعدی (←)"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>

        {/* مدت صحنه فعلی */}
        <div className="vp-scene-dur">
          {scene?.duration || 5}s
        </div>
      </motion.div>

      {/* ── Fullscreen btn ── */}
      <motion.button
        className="fullscreen-btn"
        animate={{ opacity: showControls ? 1 : 0 }}
        onClick={toggleFullscreen}
        title="تمام صفحه (F)"
      >
        {isFullscreen ? (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        )}
      </motion.button>

      {/* ── Audio ── */}
      {audioTrack && (
        <audio
          ref={audioRef}
          src={audioTrack.url}
          loop
          style={{ display: 'none' }}
          volume={audioVolume / 100}
          muted={audioMuted}
        />
      )}
    </div>
  );
};

export default Viewport;