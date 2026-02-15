/* 
 * مسیر: /video-maker-pro/src/pages/Editor.jsx
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../store/useEditorStore';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';
import useAutoSave from '../hooks/useAutoSave';
import ThemeToggle from '../components/common/ThemeToggle';
import Toast from '../components/common/Toast';
import TutorialModal from '../components/editor/TutorialModal';
import EditorSidebar from '../components/editor/sidebar/EditorSidebar';
import Viewport from '../components/editor/viewport/Viewport';
import Timeline from '../components/editor/timeline/Timeline';
import './Editor.css';

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const projects = useProjectStore(state => state.projects);
  const updateProject = useProjectStore(state => state.updateProject);
  
  const getProjectData = useEditorStore(state => state.getProjectData);
  const loadProject = useEditorStore(state => state.loadProject);
  
  const showSuccess = useUIStore(state => state.showSuccess);
  const showError = useUIStore(state => state.showError);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showTutorial, setShowTutorial] = useState(false);

  // بارگذاری پروژه
  useEffect(() => {
    if (!projectId) {
      navigate('/dashboard');
      return;
    }

    console.log('📝 Loading project:', projectId);
    
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      showError('پروژه یافت نشد');
      navigate('/dashboard');
      return;
    }

    try {
      loadProject({
        scenes: project.scenes || [],
        settings: project.settings || {}
      });

      console.log('✅ Project loaded:', project.name);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading project:', error);
      showError('خطا در بارگذاری پروژه');
      navigate('/dashboard');
    }
  }, [projectId, projects, navigate, showError, loadProject]);

  // ذخیره خودکار
  const { lastSaved, isSaving } = useAutoSave({
    projectId,
    getData: getProjectData,
    onSave: async (data) => {
      if (!projectId) return;
      
      try {
        await updateProject(projectId, {
          scenes: data.scenes,
          settings: data.settings,
          lastModified: Date.now()
        });
      } catch (error) {
        console.error('خطا در ذخیره:', error);
      }
    },
    interval: 5000
  });

  // ذخیره دستی
  const handleSave = async () => {
    if (!projectId) return;

    try {
      const data = getProjectData();
      await updateProject(projectId, {
        scenes: data.scenes,
        settings: data.settings,
        lastModified: Date.now()
      });
      
      // نمایش پیام موفقیت
      setToastMessage('✅ پروژه با موفقیت ذخیره شد!');
      setToastType('success');
      setShowToast(true);
      
      showSuccess('پروژه ذخیره شد');
    } catch (error) {
      setToastMessage('❌ خطا در ذخیره پروژه');
      setToastType('error');
      setShowToast(true);
      
      showError('خطا در ذخیره پروژه');
      console.error('Error saving:', error);
    }
  };

  // بازگشت به داشبورد
  const handleBack = () => {
    navigate('/dashboard');
  };

  // میانبرهای کیبورد
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="editor-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">در حال بارگذاری پروژه...</p>
        </div>
      </div>
    );
  }

  const currentProject = projects.find(p => p.id === projectId);

  return (
    <div className="editor-page">
      {/* آیکون دارک/لایت - پایین چپ - همیشه نمایان */}
      <ThemeToggle alwaysVisible />

      {/* Header */}
      <header className="editor-header">
        <div className="header-section header-left">
          <button 
            className="editor-btn back-btn" 
            onClick={handleBack}
            title="بازگشت به داشبورد (Esc)"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span>داشبورد</span>
          </button>
        </div>

        <div className="header-section header-center">
          <div className="project-info">
            <h1 className="project-name">{currentProject?.name || 'پروژه'}</h1>
            <div className="save-indicator">
              {isSaving ? (
                <span className="saving">
                  <div className="spinner-mini"></div>
                  در حال ذخیره...
                </span>
              ) : lastSaved ? (
                <span className="saved">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  ذخیره شد
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="header-section header-right">
          <div className="editor-controls">
            <button
              className={`editor-btn icon-btn ${isSidebarOpen ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="ابزارها"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>

            <button
              className={`editor-btn icon-btn ${isTimelineOpen ? 'active' : ''}`}
              onClick={() => setIsTimelineOpen(!isTimelineOpen)}
              title="خط زمان"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>

            <div className="divider"></div>

            <button
              className="editor-btn tutorial-btn"
              onClick={() => setShowTutorial(true)}
              title="راهنمای آموزش (؟)"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <span>راهنما</span>
            </button>

            <div className="divider"></div>

            <button 
              className="editor-btn save-btn"
              onClick={handleSave}
              title="ذخیره (Ctrl+S)"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              <span>ذخیره</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="editor-layout">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              className="editor-sidebar"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <EditorSidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="editor-main">
          <div className="viewport-wrapper">
            <Viewport />
          </div>

          {/* Timeline */}
          <AnimatePresence>
            {isTimelineOpen && (
              <motion.div
                className="timeline-wrapper"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Timeline />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
};

export default Editor;