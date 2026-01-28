// ============================================
// Editor Page - نسخه ساده و بدون باگ
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Editor.css';

const Editor = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [scenes, setScenes] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Settings
  const [settings, setSettings] = useState({
    fontSize: 48,
    textColor: '#ffffff',
    speed: 1,
    duration: 5,
  });

  // بارگذاری پروژه
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // پارس کردن متن به صحنه‌ها
  useEffect(() => {
    if (!text.trim()) {
      setScenes([]);
      return;
    }

    const sceneBlocks = text.split(/(?=صحنه)/i);
    const parsedScenes = sceneBlocks
      .map((block, index) => {
        const lines = block.trim().split('\n').filter(l => l.trim());
        if (lines.length === 0) return null;
        
        const title = lines[0].replace(/صحنه.*?:/i, '').trim();
        const content = lines.slice(1).join(' ').trim();
        
        return { 
          id: index,
          title: title || `صحنه ${index + 1}`, 
          content: content || title,
        };
      })
      .filter(Boolean);

    setScenes(parsedScenes);
    if (parsedScenes.length > 0 && currentSceneIndex >= parsedScenes.length) {
      setCurrentSceneIndex(0);
    }
  }, [text]);

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  const currentScene = scenes[currentSceneIndex];

  return (
    <div className="editor-page">
      {/* Header */}
      <header className="editor-header">
        <div className="editor-header-left">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/dashboard')}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>بازگشت</span>
          </button>
          
          <div className="editor-project-info">
            <h1 className="editor-project-name">پروژه جدید</h1>
            <span className="editor-project-status">📝 پیش‌نویس</span>
          </div>
        </div>

        <div className="editor-header-right">
          <button className="btn btn-outline btn-sm">
            پیش‌نمایش
          </button>
          <button className="btn btn-primary btn-sm">
            خروجی
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="editor-main">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="editor-sidebar">
            <div className="sidebar-header">
              <h2>ادیتور</h2>
              <button 
                className="sidebar-close"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="sidebar-tabs">
              <button 
                className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
              >
                📝 متن
              </button>
              <button 
                className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
                onClick={() => setActiveTab('effects')}
              >
                ⚡ افکت‌ها
              </button>
              <button 
                className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
              >
                🖼️ مدیا
              </button>
            </div>

            {/* Content */}
            <div className="sidebar-content">
              {activeTab === 'text' && (
                <div className="tab-content">
                  <div className="tab-header">
                    <h3>متن صحنه‌ها</h3>
                    <div className="tab-stats">
                      <span>{scenes.length} صحنه</span>
                      <span>•</span>
                      <span>{text.trim() ? text.trim().split(/\s+/).length : 0} کلمه</span>
                    </div>
                  </div>
                  
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="صحنه اول: شروع داستان&#10;متن صحنه اول...&#10;&#10;صحنه دوم: ادامه&#10;متن صحنه دوم..."
                    rows={12}
                    className="sidebar-textarea"
                  />
                  
                  <div className="sidebar-help">
                    💡 هر صحنه با "صحنه اول:"، "صحنه دوم:" و... شروع شود
                  </div>

                  {/* قالب‌های آماده */}
                  <div className="templates-section">
                    <h4>قالب‌های آماده</h4>
                    <div className="templates-grid">
                      <button 
                        className="template-btn"
                        onClick={() => setText(`صحنه اول: شب بارانی
تصویر: چراغ‌ها در آب منعکس می‌شوند

صحنه دوم: آرامش
قدم‌های آرام در خیابان خلوت

صحنه سوم: پایان
باران آرام می‌گیرد`)}
                      >
                        🎬 فیلم
                      </button>
                      <button 
                        className="template-btn"
                        onClick={() => setText(`صحنه اول: آغاز
دلم گرفته از این روزگار

صحنه دوم: تأمل  
چشمانت دریایی بی‌کران

صحنه سوم: پایان
و باران همچنان می‌بارد`)}
                      >
                        ✍️ شعر
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'effects' && (
                <div className="tab-content">
                  <h3>تنظیمات افکت</h3>
                  
                  {/* اندازه فونت */}
                  <div className="setting-group">
                    <label>
                      اندازه فونت: <strong>{settings.fontSize}px</strong>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={settings.fontSize}
                      onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                      className="slider"
                    />
                  </div>

                  {/* سرعت */}
                  <div className="setting-group">
                    <label>
                      سرعت: <strong>{settings.speed}×</strong>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.25"
                      value={settings.speed}
                      onChange={(e) => setSettings({...settings, speed: parseFloat(e.target.value)})}
                      className="slider"
                    />
                  </div>

                  {/* مدت نمایش */}
                  <div className="setting-group">
                    <label>
                      مدت نمایش: <strong>{settings.duration}s</strong>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={settings.duration}
                      onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                      className="slider"
                    />
                  </div>

                  {/* رنگ متن */}
                  <div className="setting-group">
                    <label>رنگ متن</label>
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                      className="color-input"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="tab-content">
                  <h3>مدیا</h3>
                  <div className="media-upload">
                    <div className="upload-placeholder">
                      <div className="upload-icon">📁</div>
                      <p>آپلود تصاویر و ویدیو</p>
                      <p className="upload-hint">در فاز بعدی فعال می‌شود</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Viewport */}
        <main className="editor-viewport">
          {!sidebarOpen && (
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          )}

          <div className="viewport-area">
            <div className="viewport-content">
              {scenes.length === 0 ? (
                <div className="viewport-empty">
                  <div className="empty-icon">🎬</div>
                  <h3>هیچ صحنه‌ای وجود ندارد</h3>
                  <p>متن صحنه‌های خود را در سایدبار وارد کنید</p>
                </div>
              ) : (
                <div className="scene-display">
                  <p 
                    className="scene-text"
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      color: settings.textColor,
                    }}
                  >
                    {currentScene?.content || ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="viewport-controls">
            <div className="controls-group">
              <button 
                className="control-btn"
                onClick={() => setCurrentSceneIndex(Math.max(0, currentSceneIndex - 1))}
                disabled={currentSceneIndex === 0}
              >
                ⏮
              </button>
              <button className="control-btn control-btn-play">▶</button>
              <button 
                className="control-btn"
                onClick={() => setCurrentSceneIndex(Math.min(scenes.length - 1, currentSceneIndex + 1))}
                disabled={currentSceneIndex === scenes.length - 1}
              >
                ⏭
              </button>
            </div>
            
            <div className="controls-info">
              <span>0:00 / {settings.duration}:00</span>
              <span>صحنه {currentSceneIndex + 1} از {scenes.length}</span>
            </div>
          </div>
        </main>
      </div>

      {/* Theme Toggle */}
      <button 
        className="theme-toggle-fixed"
        onClick={() => {
          const html = document.documentElement;
          const current = html.getAttribute('data-theme');
          html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
        }}
      >
        🌙
      </button>
    </div>
  );
};

export default Editor;