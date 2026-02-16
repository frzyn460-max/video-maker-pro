/* 
 * مسیر: /video-maker-pro/src/pages/Dashboard.jsx
 * ✨ نسخه جدید - هماهنگ با Home و Navbar
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';
import Navbar from '../components/layout/Navbar';
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
  if (diff < 3600000) return `${Math.floor(diff / 60000)} دقیقه پیش`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعت پیش`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} روز پیش`;
  return date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// آیکون‌های SVG
const IconPlus = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 4v16m8-8H4"/>
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const IconGrid = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
  </svg>
);

const IconList = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

const IconEdit = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

const IconVideo = () => (
  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const IconFilm = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
  </svg>
);

// ── کامپوننت Stats Row ──
const StatsRow = ({ projects }) => {
  const totalScenes = projects.reduce((sum, p) => sum + (p.scenes?.length || 0), 0);
  const recentCount = projects.filter(p => (Date.now() - p.lastModified) < 7 * 24 * 3600000).length;

  return (
    <div className="dashboard-stats">
      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-icon">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">کل پروژه‌ها</div>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="stat-icon">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-value">{totalScenes}</div>
          <div className="stat-label">کل صحنه‌ها</div>
        </div>
      </motion.div>

      <motion.div
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.20 }}
      >
        <div className="stat-icon">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-value">{recentCount}</div>
          <div className="stat-label">ویرایش‌شده این هفته</div>
        </div>
      </motion.div>
    </div>
  );
};

// ── کامپوننت اصلی Dashboard ──
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
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'fa');
      if (sortBy === 'created') return b.createdAt - a.createdAt;
      return b.lastModified - a.lastModified;
    });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) { showError('لطفاً نام پروژه را وارد کنید'); return; }
    try {
      const newProject = await createProject(newProjectName.trim());
      showSuccess('پروژه جدید ساخته شد');
      setShowCreateModal(false);
      setNewProjectName('');
      navigate(`/editor/${newProject.id}`);
    } catch {
      showError('خطا در ساخت پروژه');
    }
  };

  const handleOpenProject = (id) => navigate(`/editor/${id}`);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      showSuccess('پروژه حذف شد');
      setProjectToDelete(null);
    } catch {
      showError('خطا در حذف پروژه');
    }
  };

  const handleDuplicateProject = async (project) => {
    try {
      await createProject(`${project.name} (کپی)`);
      showSuccess('پروژه کپی شد');
    } catch {
      showError('خطا در کپی پروژه');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <ThemeToggle position="top-left" />

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* ── Header ── */}
          <motion.header
            className="dashboard-header"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="header-content">
              <div className="header-left">
                <h1 className="dashboard-title">پروژه‌های من</h1>
                <p className="dashboard-subtitle">
                  مدیریت و ویرایش پروژه‌های شما
                  {projects.length > 0 && (
                    <span className="project-count-badge">{projects.length}</span>
                  )}
                </p>
              </div>
              <div className="header-right">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowCreateModal(true)}
                  className="create-project-btn"
                >
                  <IconPlus />
                  <span>پروژه جدید</span>
                </Button>
              </div>
            </div>
          </motion.header>

          {/* ── Stats ── */}
          {projects.length > 0 && <StatsRow projects={projects} />}

          {/* ── Toolbar ── */}
          <motion.div
            className="dashboard-toolbar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="toolbar-left">
              <div className="search-box">
                <span className="search-icon"><IconSearch /></span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="جستجو در پروژه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')}>
                    <IconX />
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
                  <IconGrid />
                </button>
                <button
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="نمایش لیستی"
                >
                  <IconList />
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Projects ── */}
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                className="empty-state"
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <div className="empty-illustration">
                  <div className="empty-illustration-ring" />
                  <div className="empty-illustration-inner">🎬</div>
                </div>

                <h3 className="empty-title">
                  {searchQuery ? 'پروژه‌ای یافت نشد' : 'هنوز پروژه‌ای نساخته‌اید'}
                </h3>
                <p className="empty-description">
                  {searchQuery
                    ? `نتیجه‌ای برای «${searchQuery}» پیدا نشد. کلمه دیگری امتحان کنید.`
                    : 'اولین پروژه ویدیویی خود را بسازید و خلاقیت‌تان را به نمایش بگذارید.'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowCreateModal(true)}
                    className="empty-action"
                  >
                    <IconPlus />
                    <span>ساخت اولین پروژه</span>
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="projects"
                className={`projects-container ${viewMode}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(index * 0.06, 0.3) }}
                    className="project-card-wrapper"
                  >
                    <Card
                      variant="elevated"
                      className="project-card"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      {/* Thumbnail */}
                      <div className="project-thumbnail">
                        {project.thumbnail ? (
                          <img src={project.thumbnail} alt={project.name} />
                        ) : (
                          <div className="thumbnail-placeholder">
                            <IconVideo />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className={`project-status-badge ${(project.scenes?.length || 0) > 0 ? 'badge-active' : 'badge-draft'}`}>
                          {(project.scenes?.length || 0) > 0 ? 'در حال ساخت' : 'پیش‌نویس'}
                        </div>

                        <div className="thumbnail-overlay">
                          <div className="overlay-actions">
                            <button
                              className="overlay-btn"
                              onClick={(e) => { e.stopPropagation(); handleOpenProject(project.id); }}
                              title="ویرایش"
                            >
                              <IconEdit />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="project-content">
                        <h3 className="project-name">{project.name}</h3>
                        <div className="project-meta">
                          <span className="meta-item">
                            <IconClock />
                            {formatDate(project.lastModified)}
                          </span>
                          <span className="meta-item">
                            <IconFilm />
                            {project.scenes?.length || 0} صحنه
                          </span>
                        </div>
                        {project.description && (
                          <p className="project-description">{project.description}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="project-actions">
                        <button
                          className="action-btn action-btn-primary"
                          onClick={(e) => { e.stopPropagation(); handleOpenProject(project.id); }}
                          title="ویرایش پروژه"
                        >
                          <IconEdit />
                          <span>ویرایش</span>
                        </button>

                        <button
                          className="action-btn action-btn-ghost"
                          onClick={(e) => { e.stopPropagation(); handleDuplicateProject(project); }}
                          title="کپی پروژه"
                        >
                          <IconCopy />
                        </button>

                        <button
                          className="action-btn action-btn-danger"
                          onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }}
                          title="حذف پروژه"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modals ── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setNewProjectName(''); }}
        title="پروژه جدید"
      >
        <div className="create-project-modal">
          <p className="modal-description">نام پروژه جدید خود را وارد کنید</p>
          <Input
            type="text"
            placeholder="نام پروژه..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
            autoFocus
          />
          <div className="modal-actions">
            <Button variant="primary" onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              ساخت پروژه
            </Button>
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); setNewProjectName(''); }}>
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
          <p className="modal-warning">این عملیات قابل بازگشت نیست!</p>
          <div className="modal-actions">
            <Button variant="danger" onClick={handleDeleteProject}>حذف پروژه</Button>
            <Button variant="ghost" onClick={() => setProjectToDelete(null)}>لغو</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;