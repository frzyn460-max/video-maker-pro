// ============================================
// Storage Service - مدیریت کامل ذخیره‌سازی
// IndexedDB + localStorage برای عملکرد بهینه
// ============================================

import Dexie from 'dexie';
import { DB_CONFIG, STORAGE_KEYS } from '../utils/constants';
import { generateId, deepClone } from '../utils/helpers';

// ============================================
// راه‌اندازی IndexedDB
// ============================================
class VideoMakerDB extends Dexie {
  constructor() {
    super(DB_CONFIG.name);
    
    this.version(DB_CONFIG.version).stores({
      projects: '++id, name, createdAt, updatedAt, status',
      media: '++id, projectId, type, name, size',
      settings: 'key',
    });
  }
}

const db = new VideoMakerDB();

// ============================================
// Storage Service Class
// ============================================
class StorageService {
  constructor() {
    this.db = db;
    this.isIndexedDBSupported = this._checkIndexedDBSupport();
  }

  // ============================================
  // بررسی پشتیبانی IndexedDB
  // ============================================
  _checkIndexedDBSupport() {
    try {
      return !!window.indexedDB;
    } catch (e) {
      return false;
    }
  }

  // ============================================
  // مدیریت پروژه‌ها
  // ============================================

  /**
   * دریافت همه پروژه‌ها
   */
  async getAllProjects() {
    try {
      if (!this.isIndexedDBSupported) {
        // Fallback به localStorage
        return this._getProjectsFromLocalStorage();
      }

      const projects = await this.db.projects.orderBy('updatedAt').reverse().toArray();
      return projects;
    } catch (error) {
      console.error('خطا در دریافت پروژه‌ها:', error);
      return this._getProjectsFromLocalStorage();
    }
  }

  /**
   * دریافت یک پروژه
   */
  async getProject(id) {
    try {
      if (!this.isIndexedDBSupported) {
        const projects = this._getProjectsFromLocalStorage();
        return projects.find(p => p.id === id) || null;
      }

      const project = await this.db.projects.get(id);
      return project || null;
    } catch (error) {
      console.error('خطا در دریافت پروژه:', error);
      return null;
    }
  }

  /**
   * ذخیره پروژه جدید
   */
  async createProject(projectData) {
    try {
      const newProject = {
        ...projectData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: projectData.status || 'draft',
      };

      if (!this.isIndexedDBSupported) {
        return this._saveProjectToLocalStorage(newProject);
      }

      const id = await this.db.projects.add(newProject);
      return { ...newProject, id };
    } catch (error) {
      console.error('خطا در ساخت پروژه:', error);
      throw error;
    }
  }

  /**
   * به‌روزرسانی پروژه
   */
  async updateProject(id, updates) {
    try {
      const updatedData = {
        ...updates,
        updatedAt: Date.now(),
      };

      if (!this.isIndexedDBSupported) {
        return this._updateProjectInLocalStorage(id, updatedData);
      }

      await this.db.projects.update(id, updatedData);
      return await this.getProject(id);
    } catch (error) {
      console.error('خطا در به‌روزرسانی پروژه:', error);
      throw error;
    }
  }

  /**
   * حذف پروژه
   */
  async deleteProject(id) {
    try {
      if (!this.isIndexedDBSupported) {
        return this._deleteProjectFromLocalStorage(id);
      }

      // حذف فایل‌های مدیا مربوطه
      await this.db.media.where('projectId').equals(id).delete();
      
      // حذف پروژه
      await this.db.projects.delete(id);
      return true;
    } catch (error) {
      console.error('خطا در حذف پروژه:', error);
      throw error;
    }
  }

  /**
   * کپی کردن پروژه
   */
  async duplicateProject(id) {
    try {
      const project = await this.getProject(id);
      if (!project) throw new Error('پروژه یافت نشد');

      const duplicated = {
        ...deepClone(project),
        name: `${project.name} (کپی)`,
        id: undefined, // ID جدید ایجاد می‌شود
      };

      return await this.createProject(duplicated);
    } catch (error) {
      console.error('خطا در کپی پروژه:', error);
      throw error;
    }
  }

  /**
   * جستجو در پروژه‌ها
   */
  async searchProjects(query) {
    try {
      const projects = await this.getAllProjects();
      const lowerQuery = query.toLowerCase();
      
      return projects.filter(project => 
        project.name?.toLowerCase().includes(lowerQuery) ||
        project.description?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('خطا در جستجو:', error);
      return [];
    }
  }

  /**
   * فیلتر پروژه‌ها
   */
  async filterProjects(filters) {
    try {
      let projects = await this.getAllProjects();

      if (filters.status) {
        projects = projects.filter(p => p.status === filters.status);
      }

      if (filters.dateFrom) {
        projects = projects.filter(p => p.createdAt >= filters.dateFrom);
      }

      if (filters.dateTo) {
        projects = projects.filter(p => p.createdAt <= filters.dateTo);
      }

      return projects;
    } catch (error) {
      console.error('خطا در فیلتر:', error);
      return [];
    }
  }

  // ============================================
  // مدیریت فایل‌های مدیا
  // ============================================

  /**
   * ذخیره فایل مدیا
   */
  async saveMedia(projectId, mediaData) {
    try {
      const media = {
        ...mediaData,
        id: generateId(),
        projectId,
        createdAt: Date.now(),
      };

      if (!this.isIndexedDBSupported) {
        // برای localStorage حجم فایل محدود است
        return this._saveMediaToLocalStorage(media);
      }

      const id = await this.db.media.add(media);
      return { ...media, id };
    } catch (error) {
      console.error('خطا در ذخیره مدیا:', error);
      throw error;
    }
  }

  /**
   * دریافت فایل‌های مدیا پروژه
   */
  async getProjectMedia(projectId) {
    try {
      if (!this.isIndexedDBSupported) {
        return this._getMediaFromLocalStorage(projectId);
      }

      const media = await this.db.media
        .where('projectId')
        .equals(projectId)
        .toArray();
      
      return media;
    } catch (error) {
      console.error('خطا در دریافت مدیا:', error);
      return [];
    }
  }

  /**
   * حذف فایل مدیا
   */
  async deleteMedia(id) {
    try {
      if (!this.isIndexedDBSupported) {
        return this._deleteMediaFromLocalStorage(id);
      }

      await this.db.media.delete(id);
      return true;
    } catch (error) {
      console.error('خطا در حذف مدیا:', error);
      throw error;
    }
  }

  // ============================================
  // مدیریت تنظیمات
  // ============================================

  /**
   * ذخیره تنظیمات
   */
  async saveSetting(key, value) {
    try {
      if (!this.isIndexedDBSupported) {
        localStorage.setItem(`setting_${key}`, JSON.stringify(value));
        return true;
      }

      await this.db.settings.put({ key, value, updatedAt: Date.now() });
      return true;
    } catch (error) {
      console.error('خطا در ذخیره تنظیمات:', error);
      return false;
    }
  }

  /**
   * دریافت تنظیمات
   */
  async getSetting(key, defaultValue = null) {
    try {
      if (!this.isIndexedDBSupported) {
        const stored = localStorage.getItem(`setting_${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      }

      const setting = await this.db.settings.get(key);
      return setting ? setting.value : defaultValue;
    } catch (error) {
      console.error('خطا در دریافت تنظیمات:', error);
      return defaultValue;
    }
  }

  /**
   * حذف تنظیمات
   */
  async deleteSetting(key) {
    try {
      if (!this.isIndexedDBSupported) {
        localStorage.removeItem(`setting_${key}`);
        return true;
      }

      await this.db.settings.delete(key);
      return true;
    } catch (error) {
      console.error('خطا در حذف تنظیمات:', error);
      return false;
    }
  }

  // ============================================
  // Export / Import
  // ============================================

  /**
   * صادر کردن پروژه
   */
  async exportProject(id) {
    try {
      const project = await this.getProject(id);
      if (!project) throw new Error('پروژه یافت نشد');

      const media = await this.getProjectMedia(id);

      const exportData = {
        version: '2.0.0',
        project,
        media,
        exportedAt: Date.now(),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('خطا در صادر کردن:', error);
      throw error;
    }
  }

  /**
   * وارد کردن پروژه
   */
  async importProject(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.project) throw new Error('فرمت فایل نامعتبر است');

      // ساخت پروژه جدید
      const newProject = await this.createProject({
        ...data.project,
        id: undefined,
        name: `${data.project.name} (وارد شده)`,
      });

      // وارد کردن فایل‌های مدیا
      if (data.media && Array.isArray(data.media)) {
        for (const mediaItem of data.media) {
          await this.saveMedia(newProject.id, {
            ...mediaItem,
            id: undefined,
          });
        }
      }

      return newProject;
    } catch (error) {
      console.error('خطا در وارد کردن:', error);
      throw error;
    }
  }

  /**
   * صادر کردن همه پروژه‌ها
   */
  async exportAllProjects() {
    try {
      const projects = await this.getAllProjects();
      
      const exportData = {
        version: '2.0.0',
        projects,
        exportedAt: Date.now(),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('خطا در صادر کردن همه:', error);
      throw error;
    }
  }

  // ============================================
  // پاکسازی و نگهداری
  // ============================================

  /**
   * پاکسازی کش
   */
  async clearCache() {
    try {
      if (this.isIndexedDBSupported) {
        await this.db.delete();
        await this.db.open();
      }
      
      // پاکسازی localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project_') || key.startsWith('media_')) {
          localStorage.removeItem(key);
        }
      });

      return true;
    } catch (error) {
      console.error('خطا در پاکسازی:', error);
      return false;
    }
  }

  /**
   * دریافت اطلاعات فضای ذخیره‌سازی
   */
  async getStorageInfo() {
    try {
      const projects = await this.getAllProjects();
      const projectsSize = new Blob([JSON.stringify(projects)]).size;

      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || projectsSize,
          available: estimate.quota || 0,
          projects: projects.length,
        };
      }

      return {
        used: projectsSize,
        available: 0,
        projects: projects.length,
      };
    } catch (error) {
      console.error('خطا در دریافت اطلاعات:', error);
      return {
        used: 0,
        available: 0,
        projects: 0,
      };
    }
  }

  // ============================================
  // Fallback به localStorage
  // ============================================

  _getProjectsFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('خطا در localStorage:', error);
      return [];
    }
  }

  _saveProjectToLocalStorage(project) {
    try {
      const projects = this._getProjectsFromLocalStorage();
      projects.push(project);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      return project;
    } catch (error) {
      console.error('خطا در ذخیره:', error);
      throw error;
    }
  }

  _updateProjectInLocalStorage(id, updates) {
    try {
      const projects = this._getProjectsFromLocalStorage();
      const index = projects.findIndex(p => p.id === id);
      
      if (index !== -1) {
        projects[index] = { ...projects[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        return projects[index];
      }
      
      return null;
    } catch (error) {
      console.error('خطا در به‌روزرسانی:', error);
      throw error;
    }
  }

  _deleteProjectFromLocalStorage(id) {
    try {
      const projects = this._getProjectsFromLocalStorage();
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('خطا در حذف:', error);
      throw error;
    }
  }

  _saveMediaToLocalStorage(media) {
    try {
      const key = `media_${media.projectId}`;
      const stored = localStorage.getItem(key);
      const mediaList = stored ? JSON.parse(stored) : [];
      mediaList.push(media);
      localStorage.setItem(key, JSON.stringify(mediaList));
      return media;
    } catch (error) {
      console.error('خطا در ذخیره مدیا:', error);
      throw error;
    }
  }

  _getMediaFromLocalStorage(projectId) {
    try {
      const key = `media_${projectId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('خطا در دریافت مدیا:', error);
      return [];
    }
  }

  _deleteMediaFromLocalStorage(id) {
    try {
      // این عملیات کمی پیچیده‌تر است چون باید همه کلیدها را چک کنیم
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('media_')) {
          const mediaList = JSON.parse(localStorage.getItem(key));
          const filtered = mediaList.filter(m => m.id !== id);
          localStorage.setItem(key, JSON.stringify(filtered));
        }
      });
      return true;
    } catch (error) {
      console.error('خطا در حذف مدیا:', error);
      throw error;
    }
  }
}

// ============================================
// Export یک instance
// ============================================
const storageService = new StorageService();
export default storageService;