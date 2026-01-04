// ============================================
// EditorSidebar Component - Sidebar اصلی ادیتور
// مسیر: src/components/editor/sidebar/EditorSidebar.jsx
// ============================================

import React, { useState } from 'react';
import TextTab from './TextTab';
import EffectsTab from './EffectsTab';
import MediaTab from './MediaTab';
import useAutoSave from '../../../hooks/useAutoSave';
import useUIStore from '../../../store/useUIStore';
import './EditorSidebar.css';

const EditorSidebar = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [collapsed, setCollapsed] = useState(false);
  
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  // فعال‌سازی Auto-Save
  const { lastSavedTime, isSaving, saveNow } = useAutoSave(5000, true);

  /**
   * تب‌های Sidebar
   */
  const tabs = [
    {
      id: 'editor',
      label: 'ویرایشگر',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'effects',
      label: 'افکت‌ها',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'media',
      label: 'مدیا',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'ai',
      label: 'AI',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  /**
   * رندر محتوای تب فعال
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return <TextTab />;
      case 'effects':
        return <EffectsTab />;
      case 'media':
        return <MediaTab />;
      case 'ai':
        return (
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-bold mb-2">دستیار AI</h3>
            <p className="text-sm opacity-70 mb-4">قابلیت AI در نسخه بعدی اضافه می‌شود</p>
          </div>
        );
      default:
        return null;
    }
  };

  // اگر Sidebar بسته است
  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed top-20 right-4 z-50 w-12 h-12 bg-glass-bg backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all shadow-xl"
        title="باز کردن Sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`editor-sidebar ${collapsed ? 'collapsed' : ''} ${className}`}>
      {/* هدر Sidebar */}
      <div className="sidebar-header">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🎬</span> ادیتور
          </h2>
          
          <div className="flex items-center gap-2">
            {/* وضعیت ذخیره */}
            <div className="text-xs opacity-70 flex items-center gap-2">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{lastSavedTime}</span>
                </>
              )}
            </div>

            {/* دکمه بستن */}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              title="بستن Sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="sidebar-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* محتوای تب */}
      <div className="sidebar-content">
        {renderTabContent()}
      </div>

      {/* فوتر Sidebar */}
      <div className="sidebar-footer">
        <button
          onClick={saveNow}
          className="btn btn-primary w-full btn-sm"
          disabled={isSaving}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره دستی'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditorSidebar;