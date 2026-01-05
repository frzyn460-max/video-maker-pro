// ============================================
// Editor Page - صفحه ادیتور اصلی
// مسیر: src/pages/Editor.jsx
// ============================================

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditorSidebar from '../components/editor/sidebar/EditorSidebar';
import Viewport from '../components/editor/viewport/Viewport';
import ThemeToggle from '../components/common/ThemeToggle';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';
import './Editor.css';

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { loadProject, currentProject, isLoading } = useProjectStore();
  const { showError } = useUIStore();

  // بارگذاری پروژه
  useEffect(() => {
    if (projectId) {
      loadProject(projectId).catch(() => {
        showError('پروژه یافت نشد');
        navigate('/dashboard');
      });
    }
  }, [projectId, loadProject, showError, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>در حال بارگذاری ادیتور...</p>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <ThemeToggle />
      
      {/* Header */}
      <div className="editor-header">
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
            <h1 className="editor-project-name">
              {currentProject?.name || 'پروژه جدید'}
            </h1>
            <span className="editor-project-status">
              {currentProject?.status === 'draft' && '📝 پیش‌نویس'}
              {currentProject?.status === 'in_progress' && '⚙️ در حال کار'}
              {currentProject?.status === 'completed' && '✅ تکمیل شده'}
            </span>
          </div>
        </div>

        <div className="editor-header-right">
          <button className="btn btn-outline btn-sm">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span>خروجی</span>
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="editor-main">
        {/* Sidebar */}
        <EditorSidebar />

        {/* Viewport */}
        <Viewport />
      </div>
    </div>
  );
};

export default Editor;