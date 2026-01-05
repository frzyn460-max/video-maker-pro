// ============================================
// SceneRenderer Component - رندر صحنه‌ها
// مسیر: src/components/editor/viewport/SceneRenderer.jsx
// ============================================

import React, { useEffect, useState, useRef } from 'react';

const SceneRenderer = ({ 
  scene, 
  bgImage, 
  bgVideo, 
  bgType,
  settings,
  isPlaying 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const videoRef = useRef(null);
  
  const text = scene?.content || '';

  /**
   * افکت Typewriter
   */
  useEffect(() => {
    if (!settings.typewriter || !text) {
      setDisplayedText(text);
      return;
    }

    // ریست
    setDisplayedText('');
    setTextIndex(0);

    const typeSpeed = 50; // میلی‌ثانیه
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, typeSpeed);

    return () => clearInterval(typeInterval);
  }, [text, settings.typewriter]);

  /**
   * مدیریت ویدیو پس‌زمینه
   */
  useEffect(() => {
    if (videoRef.current && bgType === 'video') {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, bgType]);

  /**
   * استایل‌های پویا
   */
  const textStyle = {
    fontSize: `${settings.fontSize}px`,
    fontFamily: settings.fontFamily,
    color: settings.textColor,
    textAlign: settings.textAlign,
    textShadow: settings.textShadow 
      ? `0 4px 20px rgba(0, 0, 0, 0.8), 0 0 ${settings.glow ? '40px' : '0px'} ${settings.textColor}`
      : 'none',
  };

  const backgroundStyle = {
    opacity: settings.bgOpacity / 100,
    filter: `blur(${settings.bgBlur}px) brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) hue-rotate(${settings.hue}deg)`,
  };

  /**
   * کلاس‌های افکت
   */
  const effectClasses = [
    settings.kenburns && 'ken-burns',
    settings.shake && 'shake-effect',
    settings.glitch && 'glitch-effect',
  ].filter(Boolean).join(' ');

  return (
    <div className="scene-display">
      {/* Background Layer */}
      {bgType && (
        <div className="scene-background" style={backgroundStyle}>
          {bgType === 'image' && bgImage && (
            <img
              src={bgImage.data}
              alt="Background"
              className={`scene-background-image ${effectClasses}`}
            />
          )}
          
          {bgType === 'video' && bgVideo && (
            <video
              ref={videoRef}
              src={bgVideo.data}
              className={`scene-background-video ${effectClasses}`}
              loop
              muted
              playsInline
            />
          )}
        </div>
      )}

      {/* Vignette Effect */}
      {settings.vignette && (
        <div className="scene-effects vignette"></div>
      )}

      {/* Film Grain */}
      {settings.grainy && (
        <div className="scene-effects film-grain"></div>
      )}

      {/* Text Layer */}
      <div className="scene-text-layer">
        <p 
          className={`scene-text ${settings.typewriter ? 'typewriter' : ''} ${settings.glow ? 'glow-effect' : ''}`}
          style={textStyle}
          data-text={displayedText}
        >
          {displayedText}
        </p>
      </div>

      {/* Particles Effect */}
      {settings.particles && (
        <div className="scene-effects">
          <ParticlesEffect />
        </div>
      )}
    </div>
  );
};

/**
 * کامپوننت افکت Particles
 */
const ParticlesEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 50;

    // ساخت ذرات
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    // انیمیشن
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // حرکت
        particle.x += particle.vx;
        particle.y += particle.vy;

        // بازگشت از لبه‌ها
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // رسم
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // پاکسازی
    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

export default SceneRenderer;