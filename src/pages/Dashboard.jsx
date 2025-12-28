import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import ThemeToggle from '../components/common/ThemeToggle';
import Card, { CardBody, CardFooter, CardTitle, CardDescription } from '../components/common/Card';
import Modal, { ModalBody, ModalFooter, useConfirmModal } from '../components/common/Modal';
import { useIsMobile } from '../hooks/useMediaQuery';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';
import { formatPersianDate, getRelativeTime } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterStatus, setFilterStatus] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const { confirm, ConfirmModal } = useConfirmModal();

  const {
    projects,
    loadProjects,
    createProject,
    deleteProject,
    duplicateProject,
    isLoading,
  } = useProjectStore();

  const { showSuccess, showError } = useUIStore();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Filter and Sort Projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !filterStatus || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'createdAt') return b.createdAt - a.createdAt;
      return b.updatedAt - a.updatedAt;
    });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      showError('لطفاً نام پروژه را وارد کنید');
      return;
    }

    try {
      await createProject({ name: newProjectName });
      showSuccess('پروژه با موفقیت ساخته شد');
      setIsNewProjectModalOpen(false);
      setNewProjectName('');
    } catch (error) {
      showError('خطا در ساخت پروژه');
    }
  };

  const handleDeleteProject = async (id, name) => {
    const confirmed = await confirm({
      title: 'حذف پروژه',
      message: `آیا از حذف پروژه "${name}" اطمینان دارید؟`,
      confirmText: 'حذف',
      cancelText: 'لغو',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await deleteProject(id);
        showSuccess('پروژه حذف شد');
      } catch (error) {
        showError('خطا در حذف پروژه');
      }
    }
  };

  const handleDuplicateProject = async (id) => {
    try {
      await duplicateProject(id);
      showSuccess('پروژه کپی شد');
    } catch (error) {
      showError('خطا در کپی پروژه');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <ThemeToggle />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="dashboard-title">پروژه‌های من</h1>
              <p className="dashboard-subtitle">
                مدیریت و ویرایش پروژه‌های خود
              </p>
            </motion.div>

            <motion.button
              className="btn btn-primary"
              onClick={() => setIsNewProjectModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              <span>پروژه جدید</span>
            </motion.button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="dashboard-filters">
          <div className="dashboard-filters-left">
            {/* Search */}
            <div className="dashboard-search">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="جستجو در پروژه‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select
              className="dashboard-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updatedAt">آخرین به‌روزرسانی</option>
              <option value="createdAt">تاریخ ساخت</option>
              <option value="name">نام</option>
            </select>

            {/* Filter Status */}
            <select
              className="dashboard-select"
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
            >
              <option value="">همه</option>
              <option value="draft">پیش‌نویس</option>
              <option value="in_progress">در حال کار</option>
              <option value="completed">تکمیل شده</option>
            </select>
          </div>

          <div className="dashboard-filters-right">
            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="نمایش شبکه‌ای"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
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

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>در حال بارگذاری...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">📁</div>
            <h3>پروژه‌ای یافت نشد</h3>
            <p>
              {searchQuery
                ? 'نتیجه‌ای برای جستجوی شما یافت نشد'
                : 'هنوز پروژه‌ای ساخته نشده است'}
            </p>
            {!searchQuery && (
              <button
                className="btn btn-primary"
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                ساخت اولین پروژه
              </button>
            )}
          </div>
        ) : (
          <motion.div
            className={`projects-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                index={index}
                onDelete={handleDeleteProject}
                onDuplicate={handleDuplicateProject}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="پروژه جدید"
        size="sm"
      >
        <ModalBody>
          <div className="form-group">
            <label>نام پروژه</label>
            <input
              type="text"
              placeholder="نام پروژه خود را وارد کنید..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-md justify-end">
            <button
              className="btn btn-ghost"
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              لغو
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateProject}
            >
              ساخت پروژه
            </button>
          </div>
        </ModalFooter>
      </Modal>

      <ConfirmModal />
    </div>
  );
};

// ============================================
// Project Card Component
// ============================================
const ProjectCard = ({ project, viewMode, index, onDelete, onDuplicate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors = {
    draft: { bg: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', label: 'پیش‌نویس' },
    in_progress: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'در حال کار' },
    completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'تکمیل شده' },
  };

  const status = statusColors[project.status] || statusColors.draft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        hoverable
        clickable
        className={`project-card project-card-${viewMode}`}
      >
        <CardBody>
          <div className="project-card-header">
            <div className="project-card-icon">🎬</div>
            <div className="project-card-menu">
              <button
                className="project-card-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="12" cy="19" r="2"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="project-card-dropdown">
                  <button onClick={() => { setMenuOpen(false); }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    ویرایش
                  </button>
                  <button onClick={() => { onDuplicate(project.id); setMenuOpen(false); }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    کپی
                  </button>
                  <button 
                    className="danger" 
                    onClick={() => { onDelete(project.id, project.name); setMenuOpen(false); }}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    حذف
                  </button>
                </div>
              )}
            </div>
          </div>

          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            {project.description || 'بدون توضیحات'}
          </CardDescription>

          <div className="project-card-meta">
            <span className="project-card-badge" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
            <span className="project-card-date">
              {getRelativeTime(project.updatedAt)}
            </span>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default Dashboard;