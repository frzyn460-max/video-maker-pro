/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/EditorSidebar.jsx
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextTab from './TextTab';
import EffectsTab from './EffectsTab';
import MediaTab from './MediaTab';
import AITab from './AITab';
import './EditorSidebar.css';

const TABS = [
  {
    id: 'editor',
    label: 'ویرایشگر',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
    ),
    component: TextTab
  },
  {
    id: 'effects',
    label: 'افکت‌ها',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
      </svg>
    ),
    component: EffectsTab
  },
  {
    id: 'media',
    label: 'مدیا',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
    component: MediaTab
  },
  {
    id: 'ai',
    label: 'AI',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    component: AITab
  }
];

const EditorSidebar = () => {
  const [activeTab, setActiveTab] = useState('editor');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || TextTab;

  return (
    <div className="editor-sidebar-container">
      {/* تب‌ها */}
      <div className="sidebar-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* محتوای تب فعال */}
      <div className="sidebar-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="tab-content-wrapper"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorSidebar;