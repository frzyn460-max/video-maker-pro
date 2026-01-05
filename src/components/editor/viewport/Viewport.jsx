// ============================================
// Viewport Component - محیط پیش‌نمایش اصلی
// مسیر: src/components/editor/viewport/Viewport.jsx
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import SceneRenderer from './SceneRenderer';
import Controls from './Controls';
import useEditorStore from '../../../store/useEditorStore';
import useMediaStore from '../../../store/useMediaStore';
import useUIStore from '../../../store/useUIStore';
import './Viewport.css';

const Viewport = () => {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Store
  const {
    scenes,
    currentSceneIndex,
    isPlaying,
    settings,
    setCurrentScene,
  } = useEditorStore();
  
  const { bgImage, bgVideo, bgType } = useMediaStore();
  const { showSuccess, showWarning } = useUIStore();

  // صحنه فعلی
  const currentScene = scenes[currentSceneIndex];

  /**
   * تغییر حالت Fullscreen
   */
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await canvasRef.current?.requestFullscreen();
        setIsFullscreen(true);
        showSuccess('حالت تمام‌صفحه فعال شد');
      } catch (error) {
        showWarning('مرورگر شما از حالت تمام‌صفحه پشتیبانی نمی‌کند');
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /**
   * گوش دادن به تغییرات Fullscreen
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Keyboard Shortcuts
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // F - Fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className={`viewport-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="viewport-header">
          <h3 className="viewport-title">
            پیش‌نمایش
          </h3>
          
          <div className="viewport-actions">
            {/* Quality Indicator */}
            <div className="quality-indicator">
              <span className="quality-dot"></span>
              <span>{settings.videoQuality}</span>
            </div>

            {/* Aspect Ratio */}
            <div className="quality-indicator" style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)'}}>
              <span>{settings.aspectRatio}</span>
            </div>

            {/* Fullscreen Button */}
            <button
              className="viewport-action-btn"
              onClick={toggleFullscreen}
              title="تمام‌صفحه (F)"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="viewport-main">
        <div 
          ref={canvasRef}
          className={`viewport-canvas ${isFullscreen ? 'fullscreen' : ''}`}
        >
          {/* Scene Info Overlay */}
          {!isFullscreen && currentScene && (
            <div className="scene-info-overlay">
              <span>صحنه {currentSceneIndex + 1}</span>
              <span>•</span>
              <span>{currentScene.title || 'بدون عنوان'}</span>
            </div>
          )}

          {/* Scene Renderer */}
          {scenes.length > 0 ? (
            <SceneRenderer
              scene={currentScene}
              bgImage={bgImage}
              bgVideo={bgVideo}
              bgType={bgType}
              settings={settings}
              isPlaying={isPlaying}
            />
          ) : (
            <div className="viewport-empty">
              <div className="viewport-empty-icon">🎬</div>
              <h3 className="viewport-empty-title">هیچ صحنه‌ای وجود ندارد</h3>
              <p className="viewport-empty-description">
                برای شروع، متن صحنه‌های خود را در تب "ویرایشگر" وارد کنید
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {!isFullscreen && (
        <div className="viewport-footer">
          <Controls />
        </div>
      )}
    </div>
  );
};

export default Viewport;