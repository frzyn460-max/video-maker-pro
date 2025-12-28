// ============================================
// Project Store - مدیریت پروژه‌ها با Zustand
// ============================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import storageService from '../services/storageService';
import { DEFAULT_SETTINGS, PROJECT_STATUS } from '../utils/constants';
import { generateId } from '../utils/helpers';

const useProjectStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ============================================
        // State
        // ============================================
        projects: [],
        currentProject: null,
        recentProjects: [],
        isLoading: false,
        error: null,
        filter: {
          search: '',
          status: null,
          sortBy: 'updatedAt',
          sortOrder: 'desc',
        },

        // ============================================
        // بارگذاری پروژه‌ها
        // ============================================
        loadProjects: async () => {
          set({ isLoading: true, error: null });
          try {
            const projects = await storageService.getAllProjects();
            set({ projects, isLoading: false });
          } catch (error) {
            set({ 
              error: 'خطا در بارگذاری پروژه‌ها', 
              isLoading: false 
            });
          }
        },

        // ============================================
        // ساخت پروژه جدید
        // ============================================
        createProject: async (projectData) => {
          set({ isLoading: true, error: null });
          try {
            const newProject = {
              name: projectData.name || 'پروژه جدید',
              description: projectData.description || '',
              scenes: [],
              settings: { ...DEFAULT_SETTINGS },
              bgImage: null,
              bgVideo: null,
              audio: null,
              status: PROJECT_STATUS.DRAFT,
              ...projectData,
            };

            const created = await storageService.createProject(newProject);
            
            set((state) => ({
              projects: [created, ...state.projects],
              currentProject: created,
              isLoading: false,
            }));

            // اضافه به لیست اخیر
            get().addToRecent(created.id);

            return created;
          } catch (error) {
            set({ 
              error: 'خطا در ساخت پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        // ============================================
        // بارگذاری یک پروژه
        // ============================================
        loadProject: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const project = await storageService.getProject(id);
            
            if (!project) {
              throw new Error('پروژه یافت نشد');
            }

            set({ currentProject: project, isLoading: false });
            get().addToRecent(id);
            
            return project;
          } catch (error) {
            set({ 
              error: 'خطا در بارگذاری پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        // ============================================
        // به‌روزرسانی پروژه
        // ============================================
        updateProject: async (id, updates) => {
          set({ isLoading: true, error: null });
          try {
            const updated = await storageService.updateProject(id, updates);
            
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === id ? updated : p
              ),
              currentProject: state.currentProject?.id === id 
                ? updated 
                : state.currentProject,
              isLoading: false,
            }));

            return updated;
          } catch (error) {
            set({ 
              error: 'خطا در به‌روزرسانی پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        // ============================================
        // به‌روزرسانی پروژه فعلی
        // ============================================
        updateCurrentProject: async (updates) => {
          const { currentProject } = get();
          if (!currentProject) return null;
          
          return get().updateProject(currentProject.id, updates);
        },

        // ============================================
        // حذف پروژه
        // ============================================
        deleteProject: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await storageService.deleteProject(id);
            
            set((state) => ({
              projects: state.projects.filter((p) => p.id !== id),
              currentProject: state.currentProject?.id === id 
                ? null 
                : state.currentProject,
              recentProjects: state.recentProjects.filter((pid) => pid !== id),
              isLoading: false,
            }));

            return true;
          } catch (error) {
            set({ 
              error: 'خطا در حذف پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        // ============================================
        // کپی پروژه
        // ============================================
        duplicateProject: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const duplicated = await storageService.duplicateProject(id);
            
            set((state) => ({
              projects: [duplicated, ...state.projects],
              isLoading: false,
            }));

            return duplicated;
          } catch (error) {
            set({ 
              error: 'خطا در کپی پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        // ============================================
        // جستجو
        // ============================================
        searchProjects: async (query) => {
          set({ isLoading: true, error: null });
          try {
            const results = await storageService.searchProjects(query);
            set({ isLoading: false });
            return results;
          } catch (error) {
            set({ 
              error: 'خطا در جستجو', 
              isLoading: false 
            });
            return [];
          }
        },

        // ============================================
        // فیلتر
        // ============================================
        setFilter: (filterUpdates) => {
          set((state) => ({
            filter: { ...state.filter, ...filterUpdates },
          }));
        },

        getFilteredProjects: () => {
          const { projects, filter } = get();
          let filtered = [...projects];

          // جستجو
          if (filter.search) {
            const query = filter.search.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
          }

          // فیلتر وضعیت
          if (filter.status) {
            filtered = filtered.filter((p) => p.status === filter.status);
          }

          // مرتب‌سازی
          filtered.sort((a, b) => {
            const aVal = a[filter.sortBy];
            const bVal = b[filter.sortBy];
            
            if (filter.sortOrder === 'asc') {
              return aVal > bVal ? 1 : -1;
            } else {
              return aVal < bVal ? 1 : -1;
            }
          });

          return filtered;
        },

        // ============================================
        // پروژه‌های اخیر
        // ============================================
        addToRecent: (projectId) => {
          set((state) => {
            const recent = [
              projectId,
              ...state.recentProjects.filter((id) => id !== projectId),
            ].slice(0, 10); // فقط 10 تا نگه می‌داریم

            return { recentProjects: recent };
          });
        },

        getRecentProjects: () => {
          const { projects, recentProjects } = get();
          return recentProjects
            .map((id) => projects.find((p) => p.id === id))
            .filter(Boolean);
        },

        // ============================================
        // Export / Import
        // ============================================
        exportProject: async (id) => {
          try {
            return await storageService.exportProject(id);
          } catch (error) {
            set({ error: 'خطا در صادر کردن پروژه' });
            throw error;
          }
        },

        importProject: async (jsonData) => {
          set({ isLoading: true, error: null });
          try {
            const imported = await storageService.importProject(jsonData);
            
            set((state) => ({
              projects: [imported, ...state.projects],
              isLoading: false,
            }));

            return imported;
          } catch (error) {
            set({ 
              error: 'خطا در وارد کردن پروژه', 
              isLoading: false 
            });
            throw error;
          }
        },

        exportAllProjects: async () => {
          try {
            return await storageService.exportAllProjects();
          } catch (error) {
            set({ error: 'خطا در صادر کردن پروژه‌ها' });
            throw error;
          }
        },

        // ============================================
        // آمار
        // ============================================
        getStats: () => {
          const { projects } = get();
          
          return {
            total: projects.length,
            draft: projects.filter((p) => p.status === PROJECT_STATUS.DRAFT).length,
            inProgress: projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length,
            completed: projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length,
            archived: projects.filter((p) => p.status === PROJECT_STATUS.ARCHIVED).length,
          };
        },

        // ============================================
        // ریست
        // ============================================
        resetCurrentProject: () => {
          set({ currentProject: null });
        },

        clearError: () => {
          set({ error: null });
        },

        resetStore: () => {
          set({
            projects: [],
            currentProject: null,
            recentProjects: [],
            isLoading: false,
            error: null,
          });
        },
      }),
      {
        name: 'project-storage',
        partialize: (state) => ({
          recentProjects: state.recentProjects,
          filter: state.filter,
        }),
      }
    ),
    { name: 'ProjectStore' }
  )
);

export default useProjectStore;