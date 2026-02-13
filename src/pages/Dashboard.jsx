/* 
 * مسیر: /video-maker-pro/src/pages/Dashboard.jsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';
import Navbar from '../components/layout/Navbar';
// import Footer from '../components/layout/Footer';  // ❌ حذف شد
import Button from '../components/common/‌Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import ThemeToggle from '../components/common/ThemeToggle';
import { formatDuration } from '../utils/formatters';
import './Dashboard.css';

// تابع فرمت تاریخ محلی
const formatDate = (timestamp) => {
  if (!timestamp) return 'نامشخص';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'هم‌اکنون';
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} دقیقه پیش`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} ساعت پیش`;
  }
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} روز پیش`;
  }
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('fa-IR', options);
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  const projects = useProjectStore(state => state.projects);
  const createProject = useProjectStore(state => state.createProject);
  const deleteProject = useProjectStore(state => state.deleteProject);
  const loadProjects = useProjectStore(state => state.loadProjects);
  
  const showSuccess = useUIStore(state => state.showSuccess);
  const showError = useUIStore(state => state.showError);

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('updated');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'fa');
        case 'created':
          return b.createdAt - a.createdAt;
        case 'updated':
        default:
          return b.lastModified - a.lastModified;
      }
    });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      showError('لطفاً نام پروژه را وارد کنید');
      return;
    }

    try {
      const newProject = await createProject(newProjectName.trim());
      showSuccess('پروژه جدید ساخته شد');
      setShowCreateModal(false);
      setNewProjectName('');
      navigate(`/editor/${newProject.id}`);
    } catch (error) {
      showError('خطا در ساخت پروژه');
      console.error('Error creating project:', error);
    }
  };

  const handleOpenProject = (projectId) => {
    console.log('🚀 Opening project:', projectId);
    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);
      showSuccess('پروژه حذف شد');
      setProjectToDelete(null);
    } catch (error) {
      showError('خطا در حذف پروژه');
      console.error('Error deleting project:', error);
    }
  };

  const handleDuplicateProject = async (project) => {
    try {
      const duplicatedProject = await createProject(`${project.name} (کپی)`);
      showSuccess('پروژه کپی شد');
    } catch (error) {
      showError('خطا در کپی پروژه');
      console.error('Error duplicating project:', error);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* ✨ دکمه تغییر تم - بالا چپ */}
      <ThemeToggle position="top-left" />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-content">
              <div className="header-left">
                <h1 className="dashboard-title">پروژه‌های من</h1>
                <p className="dashboard-subtitle">
                  مدیریت و ویرایش پروژه‌های خود
                </p>
              </div>
              <div className="header-right">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="create-project-btn"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>پروژه جدید</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Toolbar */}
          <div className="dashboard-toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <svg className="search-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="جستجو در پروژه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">آخرین به‌روزرسانی</option>
                <option value="created">تاریخ ایجاد</option>
                <option value="name">نام پروژه</option>
              </select>
            </div>

            <div className="toolbar-right">
              <div className="view-mode-toggle">
                <button
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="نمایش شبکه‌ای"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="نمایش لیستی"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3 className="empty-title">
                {searchQuery ? 'پروژه‌ای یافت نشد' : 'هنوز پروژه‌ای نساخته‌اید'}
              </h3>
              <p className="empty-description">
                {searchQuery 
                  ? 'کلمه کلیدی دیگری را امتحان کنید'
                  : 'برای شروع، یک پروژه جدید بسازید'
                }
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowCreateModal(true)}
                  className="empty-action"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>ساخت پروژه جدید</span>
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              className={`projects-container ${viewMode}`}
              layout
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="project-card-wrapper"
                >
                  <Card
                    variant="elevated"
                    className="project-card"
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <div className="project-thumbnail">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.name} />
                      ) : (
                        <div className="thumbnail-placeholder">
                          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      )}
                      
                      <div className="thumbnail-overlay">
                        <div className="overlay-actions">
                          <button
                            className="overlay-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenProject(project.id);
                            }}
                            title="ویرایش"
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="project-content">
                      <h3 className="project-name">{project.name}</h3>
                      
                      <div className="project-meta">
                        <span className="meta-item">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          {formatDate(project.lastModified)}
                        </span>
                        <span className="meta-item">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                          </svg>
                          {project.scenes?.length || 0} صحنه
                        </span>
                      </div>

                      {project.description && (
                        <p className="project-description">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="project-actions">
                      <button
                        className="action-btn action-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project.id);
                        }}
                        title="ویرایش پروژه"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span>ویرایش</span>
                      </button>

                      <button
                        className="action-btn action-btn-ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateProject(project);
                        }}
                        title="کپی پروژه"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </button>

                      <button
                        className="action-btn action-btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                        }}
                        title="حذف پروژه"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* ❌ Footer حذف شد */}

      {/* Modals */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewProjectName('');
        }}
        title="پروژه جدید"
      >
        <div className="create-project-modal">
          <p className="modal-description">
            نام پروژه جدید خود را وارد کنید
          </p>
          
          <Input
            type="text"
            placeholder="نام پروژه..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateProject();
              }
            }}
            autoFocus
          />

          <div className="modal-actions">
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
            >
              ساخت پروژه
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                setNewProjectName('');
              }}
            >
              لغو
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="حذف پروژه"
      >
        <div className="delete-project-modal">
          <div className="warning-icon">⚠️</div>
          <p className="modal-description">
            آیا مطمئن هستید که می‌خواهید پروژه <strong>"{projectToDelete?.name}"</strong> را حذف کنید؟
          </p>
          <p className="modal-warning">
            این عملیات قابل بازگشت نیست!
          </p>

          <div className="modal-actions">
            <Button
              variant="danger"
              onClick={handleDeleteProject}
            >
              حذف پروژه
            </Button>
            <Button
              variant="ghost"
              onClick={() => setProjectToDelete(null)}
            >
              لغو
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;