/*
 * مسیر: /video-maker-pro/src/components/editor/sidebar/TextTab.jsx
 */

import React, { useState } from 'react';
import useEditorStore from '../../../store/useEditorStore';
import './TextTab.css';

const TextTab = () => {
  const scenes = useEditorStore(state => state.scenes);
  const addScene = useEditorStore(state => state.addScene);
  const updateScene = useEditorStore(state => state.updateScene);
  const deleteScene = useEditorStore(state => state.deleteScene);
  const setCurrentSceneIndex = useEditorStore(state => state.setCurrentSceneIndex);
  
  const [lyrics, setLyrics] = useState('');
  const [mode, setMode] = useState('simple'); // simple یا scenes

  // تبدیل متن آهنگ به صحنه‌های مجزا
  const handleConvertLyrics = () => {
    if (!lyrics.trim()) return;

    // پاک کردن صحنه‌های قبلی
    scenes.forEach(scene => deleteScene(scene.id));

    // تقسیم بر اساس خط خالی (هر بند جدا)
    const verses = lyrics.split(/\n\n+/).filter(v => v.trim());
    
    verses.forEach((verse, index) => {
      addScene({
        content: verse.trim(),
        duration: 5,
        order: index
      });
    });

    setLyrics('');
  };

  // حالت ساده - یک textarea بزرگ
  if (mode === 'simple') {
    return (
      <div className="text-tab">
        <div className="text-tab-header">
          <h3 className="tab-title">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            متن آهنگ
          </h3>
          
          <button
            className={`mode-switch ${mode === 'scenes' ? 'active' : ''}`}
            onClick={() => setMode('scenes')}
            title="مدیریت صحنه‌ها"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <div className="simple-mode">
          <p className="simple-hint">
            💡 متن آهنگ خود را بنویسید. هر بند را با یک خط خالی جدا کنید.
          </p>
          
          <textarea
            className="lyrics-textarea"
            placeholder={`مثال:

بند اول آهنگ...
خط اول
خط دوم

بند دوم آهنگ...
خط اول
خط دوم`}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />

          <div className="lyrics-actions">
            <button 
              className="btn-convert"
              onClick={handleConvertLyrics}
              disabled={!lyrics.trim()}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              تبدیل به صحنه
            </button>
            
            <button 
              className="btn-clear"
              onClick={() => setLyrics('')}
              disabled={!lyrics.trim()}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              پاک کردن
            </button>
          </div>

          {scenes.length > 0 && (
            <div className="scenes-count">
              ✅ {scenes.length} صحنه ایجاد شده
            </div>
          )}
        </div>
      </div>
    );
  }

  // حالت مدیریت صحنه‌ها
  return (
    <div className="text-tab">
      <div className="text-tab-header">
        <h3 className="tab-title">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          مدیریت صحنه‌ها
        </h3>
        
        <button
          className="mode-switch"
          onClick={() => setMode('simple')}
          title="حالت ساده"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        </button>
      </div>

      <div className="scenes-mode">
        <button className="btn-add-scene" onClick={() => addScene({})}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          افزودن صحنه
        </button>

        <div className="scenes-list">
          {scenes.length === 0 ? (
            <div className="empty-scenes">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>هیچ صحنه‌ای وجود ندارد</p>
            </div>
          ) : (
            scenes.map((scene, index) => (
              <div key={scene.id} className="scene-card">
                <div className="scene-header">
                  <input
                    type="text"
                    className="scene-title-input"
                    value={scene.title || `صحنه ${index + 1}`}
                    onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                    placeholder={`صحنه ${index + 1}`}
                  />
                  <button
                    className="btn-delete-scene"
                    onClick={() => deleteScene(scene.id)}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                
                <textarea
                  className="scene-textarea"
                  value={scene.content}
                  onChange={(e) => updateScene(scene.id, { content: e.target.value })}
                  onClick={() => setCurrentSceneIndex(index)}
                  placeholder="متن صحنه..."
                />
                
                <div className="scene-duration">
                  <label>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {scene.duration || 5} ثانیه
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={scene.duration || 5}
                    onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) })}
                    className="duration-slider"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TextTab;