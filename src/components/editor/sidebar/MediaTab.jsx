/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/MediaTab.jsx
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useMediaStore from '../../../store/useMediaStore';
import useEditorStore from '../../../store/useEditorStore';
import Button from '../../common/‌Button';
import Input from '../../common/Input';
import './MediaTab.css';

const MediaTab = () => {
  const bgImageRef = useRef(null);
  const bgVideoRef = useRef(null);
  const audioRef = useRef(null);

  const backgroundMedia = useMediaStore(state => state.backgroundMedia);
  const audioTrack = useMediaStore(state => state.audioTrack);
  const addBackgroundMedia = useMediaStore(state => state.addBackgroundMedia);
  const removeBackgroundMedia = useMediaStore(state => state.removeBackgroundMedia);
  const setAudioTrack = useMediaStore(state => state.setAudioTrack);
  const removeAudioTrack = useMediaStore(state => state.removeAudioTrack);

  const settings = useEditorStore(state => state.settings);
  const updateSettings = useEditorStore(state => state.updateSettings);

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);

  // آپلود تصویر پس‌زمینه
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      addBackgroundMedia({
        id: Date.now().toString(),
        type: 'image',
        url: event.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // آپلود ویدیو پس‌زمینه
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('لطفاً یک فایل ویدیویی انتخاب کنید');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      addBackgroundMedia({
        id: Date.now().toString(),
        type: 'video',
        url: event.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // آپلود موسیقی
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isAudioFile = file.type.startsWith('audio/') || 
                       file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|wma)$/i);

    if (!isAudioFile) {
      alert('لطفاً یک فایل صوتی معتبر انتخاب کنید');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const audioData = {
        id: Date.now().toString(),
        url: event.target.result,
        name: file.name,
        type: file.type,
        size: file.size
      };
      
      setAudioTrack(audioData);

      // ایجاد عنصر audio
      const audioEl = new Audio(event.target.result);
      audioEl.loop = true;
      audioEl.volume = volume / 100;
      
      audioEl.addEventListener('loadedmetadata', () => {
        setDuration(audioEl.duration);
      });

      audioEl.addEventListener('timeupdate', () => {
        setCurrentTime(audioEl.currentTime);
      });

      audioEl.addEventListener('ended', () => {
        setAudioPlaying(false);
        setCurrentTime(0);
      });

      setAudioElement(audioEl);
      
      console.log('✅ موسیقی آپلود شد:', file.name);
    };
    
    reader.readAsDataURL(file);
  };

  // حذف پس‌زمینه
  const handleRemoveBackground = () => {
    removeBackgroundMedia();
  };

  // تغییر وضعیت پخش موسیقی
  const toggleAudio = () => {
    if (!audioElement) return;

    if (audioPlaying) {
      audioElement.pause();
      setAudioPlaying(false);
    } else {
      audioElement.play();
      setAudioPlaying(true);
    }
  };

  // رفتن به عقب
  const skipBackward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
  };

  // رفتن به جلو
  const skipForward = () => {
    if (!audioElement) return;
    audioElement.currentTime = Math.min(duration, audioElement.currentTime + 10);
  };

  // تغییر موقعیت اهنگ
  const handleSeek = (e) => {
    if (!audioElement) return;
    const newTime = parseFloat(e.target.value);
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // تغییر حجم صدا
  const handleVolumeChange = (value) => {
    const newVolume = parseInt(value);
    setVolume(newVolume);
    updateSettings({ volume: newVolume });
    if (audioElement) {
      audioElement.volume = newVolume / 100;
    }
  };

  // حذف موسیقی
  const handleRemoveAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setAudioPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    removeAudioTrack();
  };

  // فرمت زمان
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // cleanup
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  return (
    <div className="media-tab">
      {/* بخش پس‌زمینه */}
      <div className="media-section">
        <h3 className="section-title">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          پس‌زمینه
        </h3>

        <div className="media-buttons">
          <button className="media-upload-btn image-btn" onClick={() => bgImageRef.current?.click()}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>عکس</span>
          </button>

          <button className="media-upload-btn video-btn" onClick={() => bgVideoRef.current?.click()}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span>ویدیو</span>
          </button>
        </div>

        <input
          ref={bgImageRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden-input"
        />
        <input
          ref={bgVideoRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden-input"
        />

        {/* نمایش پس‌زمینه فعلی */}
        {backgroundMedia && (
          <motion.div
            className="current-media"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="media-preview">
              {backgroundMedia.type === 'image' ? (
                <img src={backgroundMedia.url} alt="پس‌زمینه" />
              ) : (
                <video src={backgroundMedia.url} muted loop autoPlay />
              )}
            </div>
            <div className="media-info">
              <span className="media-name">{backgroundMedia.name}</span>
              <button className="media-remove-btn" onClick={handleRemoveBackground}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>

            {/* تنظیمات پس‌زمینه */}
            <div className="bg-settings">
              <div className="setting-item">
                <label className="setting-label">
                  <span>اندازه تصویر</span>
                  <span className="setting-value">{settings.bgScale}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={settings.bgScale}
                  onChange={(e) => updateSettings({ bgScale: parseInt(e.target.value) })}
                  className="slider"
                />
                <div className="scale-hints">
                  <span className="hint">کوچک (50%)</span>
                  <span className="hint">عادی (100%)</span>
                  <span className="hint">بزرگ (200%)</span>
                </div>
              </div>

              <div className="setting-item">
                <label className="setting-label">
                  <span>حالت نمایش</span>
                </label>
                <div className="display-mode-btns">
                  <button
                    className={`mode-btn ${settings.bgFit === 'cover' ? 'active' : ''}`}
                    onClick={() => updateSettings({ bgFit: 'cover' })}
                    title="پر کردن کامل"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                    </svg>
                    <span>پوشش کامل</span>
                  </button>
                  
                  <button
                    className={`mode-btn ${settings.bgFit === 'contain' ? 'active' : ''}`}
                    onClick={() => updateSettings({ bgFit: 'contain' })}
                    title="نمایش کامل"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
                    </svg>
                    <span>کامل در قاب</span>
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label className="setting-label">
                  <span>شفافیت</span>
                  <span className="setting-value">{settings.bgOpacity}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.bgOpacity}
                  onChange={(e) => updateSettings({ bgOpacity: parseInt(e.target.value) })}
                  className="slider"
                />
              </div>

              <div className="setting-item">
                <label className="setting-label">
                  <span>میزان تاری</span>
                  <span className="setting-value">{settings.bgBlur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={settings.bgBlur}
                  onChange={(e) => updateSettings({ bgBlur: parseInt(e.target.value) })}
                  className="slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* بخش موسیقی */}
      <div className="media-section">
        <h3 className="section-title">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
          موسیقی پس‌زمینه
        </h3>

        {!audioTrack ? (
          <button className="audio-upload-btn" onClick={() => audioRef.current?.click()}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span>انتخاب فایل صوتی</span>
            <span className="upload-hint">MP3, WAV, OGG, M4A</span>
          </button>
        ) : (
          <motion.div
            className="audio-player"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* اطلاعات موسیقی */}
            <div className="audio-header">
              <div className="audio-icon">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="audio-info-text">
                <div className="audio-title">{audioTrack.name}</div>
                <div className="audio-subtitle">موسیقی پس‌زمینه</div>
              </div>
              <button className="audio-delete-btn" onClick={handleRemoveAudio}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>

            {/* Timeline */}
            <div className="audio-timeline">
              <span className="time-current">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="timeline-slider"
              />
              <span className="time-duration">{formatTime(duration)}</span>
            </div>

            {/* کنترل‌های پخش */}
            <div className="audio-controls">
              <button className="control-btn" onClick={skipBackward} title="10 ثانیه به عقب">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                </svg>
              </button>

              <button className="control-btn play-btn" onClick={toggleAudio}>
                {audioPlaying ? (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button className="control-btn" onClick={skipForward} title="10 ثانیه به جلو">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                </svg>
              </button>
            </div>

            {/* کنترل حجم صدا */}
            <div className="volume-control">
              <svg className="volume-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
                className="volume-slider"
              />
              <span className="volume-value">{volume}%</span>
            </div>
          </motion.div>
        )}

        <input
          ref={audioRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="hidden-input"
        />
      </div>
    </div>
  );
};

export default MediaTab;