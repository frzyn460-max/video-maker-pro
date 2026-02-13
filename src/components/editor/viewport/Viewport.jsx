/* 
 * مسیر: /video-maker-pro/src/components/editor/viewport/Viewport.jsx
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useMediaStore from '../../../store/useMediaStore';
import './Viewport.css';

const Viewport = () => {
  const viewportRef = useRef(null);
  const particlesCanvasRef = useRef(null);
  
  const scenes = useEditorStore(state => state.scenes);
  const currentSceneIndex = useEditorStore(state => state.currentSceneIndex);
  const isPlaying = useEditorStore(state => state.isPlaying);
  const settings = useEditorStore(state => state.settings);
  const setCurrentSceneIndex = useEditorStore(state => state.setCurrentSceneIndex);
  const setIsPlaying = useEditorStore(state => state.setIsPlaying);
  
  const backgroundMedia = useMediaStore(state => state.backgroundMedia);
  const audioTrack = useMediaStore(state => state.audioTrack);
  
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const audioRef = useRef(null);

  const currentScene = scenes[currentSceneIndex];

  // افکت تایپ‌نویس
  useEffect(() => {
    if (!currentScene || !currentScene.content) {
      setDisplayedText('');
      return;
    }

    if (!settings.typewriter) {
      setDisplayedText(currentScene.content);
      return;
    }

    setDisplayedText('');
    let index = 0;
    const speed = 50 / (settings.speed || 1);
    const content = currentScene.content || '';
    
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentScene, settings.typewriter, settings.speed]);

  // پخش خودکار
  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    const duration = (currentScene.duration || settings.duration) * 1000 / settings.speed;
    let startTime = Date.now();
    let animationFrame;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);

      if (progressValue < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        // صحنه بعدی
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex(currentSceneIndex + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
          setCurrentSceneIndex(0);
          setProgress(0);
        }
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, currentScene, currentSceneIndex, scenes.length, settings.duration, settings.speed, setCurrentSceneIndex, setIsPlaying]);

  // افکت Ken Burns
  useEffect(() => {
    if (!settings.kenburns || !backgroundMedia || backgroundMedia.type !== 'image') return;

    const bgElement = document.getElementById('viewport-bg-image');
    if (!bgElement) return;

    bgElement.style.transition = 'transform 15s ease-out';
    bgElement.style.transform = currentSceneIndex % 2 === 0 ? 'scale(1.2)' : 'scale(1)';

    return () => {
      if (bgElement) {
        bgElement.style.transform = 'scale(1)';
      }
    };
  }, [currentSceneIndex, settings.kenburns, backgroundMedia]);

  // افکت ذرات
  useEffect(() => {
    if (!settings.particles || !particlesCanvasRef.current) return;

    const canvas = particlesCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 200;
    
    const resizeCanvas = () => {
      if (!viewportRef.current) return;
      
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      
      // در حالت fullscreen از window استفاده کن
      if (document.fullscreenElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        const rect = viewportRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      
      // اگه سایز تغییر کرد، ذرات رو دوباره توزیع کن
      if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
        particles.forEach(p => {
          // ذراتی که خارج از محدوده‌ن رو دوباره جایگذاری کن
          if (p.x > canvas.width) {
            p.x = Math.random() * canvas.width;
          }
          if (p.y > canvas.height) {
            p.y = Math.random() * canvas.height;
          }
        });
        
        // اگه ذرات کم شدن، اضافه کن
        while (particles.length < particleCount) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 2.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
          });
        }
      }
    };
    
    // ایجاد اولیه ذرات
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (viewportRef.current?.getBoundingClientRect().width || 1920),
        y: Math.random() * (viewportRef.current?.getBoundingClientRect().height || 1080),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('fullscreenchange', resizeCanvas);

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        
        // برگشت از لبه‌ها
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -1;
          p.x = Math.max(0, Math.min(canvas.width, p.x));
        }
        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -1;
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }
      });
      
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('fullscreenchange', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [settings.particles]);

  // تمام صفحه
  const toggleFullscreen = () => {
    if (!viewportRef.current) return;

    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // کنترل‌های پخش با sync موزیک
  const handlePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    // کنترل موزیک پس‌زمینه
    if (audioRef.current) {
      if (newPlayState) {
        audioRef.current.play().catch(err => console.log('Audio play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      setProgress(0);
      setIsPlaying(false);
      
      // توقف موزیک
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setProgress(0);
      setIsPlaying(false);
      
      // توقف موزیک
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(false);
    
    // ریست موزیک
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // میانبرهای کیبورد حرفه‌ای
  useEffect(() => {
    const handleKeyPress = (e) => {
      // نادیده گرفتن وقتی در input/textarea هستیم
      const target = e.target;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }

      // Space - پخش/توقف (با موزیک)
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
        return;
      }

      // Arrow Left - صحنه بعدی (RTL)
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNextScene();
        return;
      }

      // Arrow Right - صحنه قبلی (RTL)
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlePrevScene();
        return;
      }

      // Arrow Up - افزایش سرعت
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newSpeed = Math.min(settings.speed + 0.25, 3);
        useEditorStore.getState().updateSettings({ speed: newSpeed });
        return;
      }

      // Arrow Down - کاهش سرعت
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newSpeed = Math.max(settings.speed - 0.25, 0.25);
        useEditorStore.getState().updateSettings({ speed: newSpeed });
        return;
      }

      // F یا f - تمام صفحه
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Escape - خروج از تمام صفحه
      if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        }
        return;
      }

      // R یا r - ریستارت
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
        return;
      }

      // Home - اولین صحنه
      if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSceneIndex(0);
        setProgress(0);
        return;
      }

      // End - آخرین صحنه
      if (e.key === 'End') {
        e.preventDefault();
        setCurrentSceneIndex(scenes.length - 1);
        setProgress(0);
        return;
      }

      // M یا m - Mute/Unmute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.muted = !audioRef.current.muted;
        }
        return;
      }

      // اعداد 1-9 - رفتن به صحنه مشخص
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const sceneNum = parseInt(e.key) - 1;
        if (sceneNum < scenes.length) {
          setCurrentSceneIndex(sceneNum);
          setProgress(0);
          setIsPlaying(false);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentSceneIndex, scenes.length, isFullscreen, settings.speed]);

  // محاسبه استایل‌های افکت
  const getTextStyle = () => {
    const style = {
      fontSize: `${settings.fontSize}px`,
      color: settings.textColor || '#ffffff'
    };

    if (settings.textShadow) {
      style.textShadow = '0 4px 20px rgba(0,0,0,0.8)';
      if (settings.glow) {
        style.textShadow += ', 0 0 20px rgba(255,255,255,0.8), 0 0 40px var(--primary)';
      }
    }

    return style;
  };

  const getTextPosition = () => {
    switch (settings.textPosition) {
      case 'top':
        return 'flex-start';
      case 'bottom':
        return 'flex-end';
      default:
        return 'center';
    }
  };

  // انیمیشن انتقال
  const getTransitionAnimation = () => {
    const animations = {
      fade: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 }
      },
      slide: {
        initial: { opacity: 0, x: '100%' },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '-100%' }
      },
      zoom: {
        initial: { opacity: 0, scale: 0.3 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 2 }
      },
      blur: {
        initial: { opacity: 0, filter: 'blur(30px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(30px)' }
      },
      rotate: {
        initial: { opacity: 0, rotate: -180, scale: 0.5 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
        exit: { opacity: 0, rotate: 180, scale: 0.5 }
      }
    };

    return animations[settings.transition] || animations.fade;
  };

  if (scenes.length === 0) {
    return (
      <div className="viewport-empty">
        <div className="empty-icon">📝</div>
        <h3>صحنه‌ای وجود ندارد</h3>
        <p>لطفاً از تب "ویرایشگر" صحنه‌های خود را اضافه کنید</p>
      </div>
    );
  }

  return (
    <div 
      ref={viewportRef}
      className={`viewport ${isFullscreen ? 'fullscreen' : ''}`}
      style={{
        filter: `brightness(${settings.brightness / 100}) contrast(${settings.contrast / 100}) saturate(${settings.saturation / 100})`,
        aspectRatio: settings.aspectRatio.replace(':', '/') || '16/9'
      }}
    >
      {/* پس‌زمینه */}
      <div className="viewport-background">
        {backgroundMedia && backgroundMedia.type === 'image' && (
          <img
            id="viewport-bg-image"
            src={backgroundMedia.url}
            alt="پس‌زمینه"
            className="bg-image"
            style={{
              opacity: settings.bgOpacity / 100,
              filter: `blur(${settings.bgBlur}px)`,
              objectFit: settings.bgFit || 'cover',
              transform: `scale(${(settings.bgScale || 100) / 100})`
            }}
          />
        )}
        {backgroundMedia && backgroundMedia.type === 'video' && (
          <video
            id="viewport-bg-video"
            src={backgroundMedia.url}
            className="bg-video"
            muted
            loop
            autoPlay
            style={{
              opacity: settings.bgOpacity / 100,
              filter: `blur(${settings.bgBlur}px)`,
              objectFit: settings.bgFit || 'cover',
              transform: `scale(${(settings.bgScale || 100) / 100})`
            }}
          />
        )}
      </div>

      {/* کانواس ذرات */}
      {settings.particles && (
        <canvas
          ref={particlesCanvasRef}
          className="particles-canvas"
        />
      )}

      {/* Film Grain */}
      {settings.grainy && <div className="film-grain" />}

      {/* نوارهای سینمایی */}
      <div className="letterbox letterbox-top" />
      <div className="letterbox letterbox-bottom" />

      {/* صحنه اصلی */}
      <div 
        className="viewport-stage"
        style={{ alignItems: getTextPosition() }}
      >
        <AnimatePresence mode="wait">
          {currentScene && (
            <motion.div
              key={currentScene.id}
              className="scene-content"
              {...getTransitionAnimation()}
              transition={{ duration: 0.8 }}
            >
              {currentScene.title && currentScene.title !== 'undefined' && (
                <div className="scene-title">{currentScene.title}</div>
              )}
              <div
                className={`scene-text ${settings.shake ? 'shake-effect' : ''} ${settings.glitch ? 'glitch-effect' : ''} ${settings.chromatic ? 'chromatic-effect' : ''}`}
                style={getTextStyle()}
                data-text={currentScene.content || ''}
              >
                {displayedText || currentScene.content || ''}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vignette */}
      {settings.vignette && <div className="vignette" />}

      {/* کنترل‌ها و اطلاعات */}
      <div className="viewport-info">
        <div className="scene-counter">
          صحنه {currentSceneIndex + 1}/{scenes.length}
        </div>
        <div className="time-display">
          {Math.floor((currentSceneIndex * settings.duration) / 60).toString().padStart(2, '0')}:
          {Math.floor((currentSceneIndex * settings.duration) % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* دکمه‌های کنترل */}
      <div className="viewport-controls">
        <button className="control-btn" onClick={handlePrevScene} disabled={currentSceneIndex === 0}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        <button className="control-btn control-btn-large" onClick={handlePlayPause}>
          {isPlaying ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        <button className="control-btn" onClick={handleNextScene} disabled={currentSceneIndex === scenes.length - 1}>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>

      {/* دکمه تمام صفحه */}
      <button className="fullscreen-btn" onClick={toggleFullscreen}>
        {isFullscreen ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        )}
      </button>

      {/* موزیک پس‌زمینه */}
      {audioTrack && (
        <audio
          ref={audioRef}
          src={audioTrack.url}
          loop
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default Viewport;