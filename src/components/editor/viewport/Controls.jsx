// ============================================
// Controls Component - کنترل‌های پخش
// مسیر: src/components/editor/viewport/Controls.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import useEditorStore from '../../../store/useEditorStore';
import { formatTime } from '../../../utils/helpers';

const Controls = () => {
  const {
    scenes,
    currentSceneIndex,
    isPlaying,
    isPaused,
    settings,
    play,
    pause,
    stop,
    nextScene,
    prevScene,
    setCurrentScene,
  } = useEditorStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // محاسبه مدت کل
  useEffect(() => {
    const totalDuration = scenes.reduce((sum, scene) => sum + (scene.duration || 5), 0);
    setDuration(totalDuration);
  }, [scenes]);

  /**
   * شبیه‌سازی پیشرفت زمان
   */
  useEffect(() => {
    if (!isPlaying || scenes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 0.1;
        
        // اگر به انتهای صحنه رسیدیم
        const currentScene = scenes[currentSceneIndex];
        const sceneDuration = currentScene?.duration || 5;
        
        if (newTime >= sceneDuration) {
          if (currentSceneIndex < scenes.length - 1) {
            nextScene();
            return 0;
          } else {
            stop();
            return 0;
          }
        }
        
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, scenes, nextScene, stop]);

  /**
   * ریست زمان هنگام تغییر صحنه
   */
  useEffect(() => {
    setCurrentTime(0);
  }, [currentSceneIndex]);

  /**
   * Handle Play/Pause
   */
  const handlePlayPause = () => {
    if (scenes.length === 0) return;
    
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  /**
   * Handle Stop
   */
  const handleStop = () => {
    stop();
    setCurrentTime(0);
  };

  /**
   * Handle Scene Change
   */
  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      prevScene();
      setCurrentTime(0);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      nextScene();
      setCurrentTime(0);
    }
  };

  /**
   * Progress Bar
   */
  const currentScene = scenes[currentSceneIndex];
  const sceneDuration = currentScene?.duration || 5;
  const progress = (currentTime / sceneDuration) * 100;

  return (
    <div className="controls-container">
      {/* Progress Bar */}
      <div className="controls-progress">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="progress-info">
          <span className="progress-time">
            {formatTime(currentTime)} / {formatTime(sceneDuration)}
          </span>
          <span className="progress-scene">
            صحنه {currentSceneIndex + 1} از {scenes.length}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="controls-playback">
        {/* Previous Scene */}
        <button
          className="control-btn"
          onClick={handlePrevScene}
          disabled={currentSceneIndex === 0}
          title="صحنه قبلی"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          className="control-btn control-btn-primary"
          onClick={handlePlayPause}
          disabled={scenes.length === 0}
          title={isPlaying ? 'توقف' : 'پخش'}
        >
          {isPlaying ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        {/* Stop */}
        <button
          className="control-btn"
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          title="توقف کامل"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        </button>

        {/* Next Scene */}
        <button
          className="control-btn"
          onClick={handleNextScene}
          disabled={currentSceneIndex === scenes.length - 1}
          title="صحنه بعدی"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Settings Display */}
      <div className="controls-settings">
        <div className="setting-badge">
          <span className="setting-label">سرعت:</span>
          <span className="setting-value">{settings.speed}×</span>
        </div>
        
        <div className="setting-badge">
          <span className="setting-label">FPS:</span>
          <span className="setting-value">{settings.fps}</span>
        </div>
        
        <div className="setting-badge">
          <span className="setting-label">کیفیت:</span>
          <span className="setting-value">{settings.videoQuality}</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;