/*
 * مسیر: /video-maker-pro/src/store/useProjectStore.js
 * ✨ نسخه فیکس شده - تضمینی
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// تمپلیت پیش‌فرض برای پروژه جدید
const DEFAULT_SCENES = [
  {
    id: '1',
    content: 'صحنه اول: شروع داستان\nتصویر: شهر در شب، نورهای رنگارنگ خیابان‌ها',
    duration: 5,
    order: 0
  },
  {
    id: '2',
    content: 'صحنه دوم: تنش و هیجان\nصدا: ضربان قلب تند و تندتر می‌شود',
    duration: 5,
    order: 1
  },
  {
    id: '3',
    content: 'صحنه سوم: اوج داستان\nتصویر: چوبینو سریع در کوچه‌های تاریک شهر',
    duration: 5,
    order: 2
  },
  {
    id: '4',
    content: 'صحنه چهارم: پایان\nآرامش دوباره به شهر بازمی‌گردد',
    duration: 5,
    order: 3
  }
];

const DEFAULT_SETTINGS = {
  speed: 1,
  duration: 5,
  transition: 'fade',
  fontSize: 48,
  textColor: '#ffffff',
  textPosition: 'center',
  textShadow: true,
  typewriter: false,
  glow: false,
  kenburns: false,
  particles: false,
  vignette: false,
  grainy: false,
  shake: false,
  glitch: false,
  chromatic: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  aspectRatio: '16:9',
  bgOpacity: 100,
  bgBlur: 0,
  bgScale: 100,
  bgFit: 'cover'
};

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],

      // بارگذاری پروژه‌ها
      loadProjects: () => {
        try {
          const storedProjects = localStorage.getItem('video-maker-projects');
          if (storedProjects) {
            const projects = JSON.parse(storedProjects);
            set({ projects });
            console.log('✅ Projects loaded:', projects.length);
          }
        } catch (error) {
          console.error('❌ Error loading projects:', error);
        }
      },

      // ساخت پروژه جدید
      createProject: async (name) => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          console.error('❌ No userId! User must be logged in.');
          alert('لطفاً ابتدا وارد حساب کاربری شوید');
          return null;
        }

        const newProject = {
          id: Date.now().toString(),
          userId: userId,
          name: name || 'پروژه جدید',
          createdAt: Date.now(),
          lastModified: Date.now(),
          scenes: DEFAULT_SCENES,
          settings: DEFAULT_SETTINGS,
          thumbnail: null,
          duration: DEFAULT_SCENES.reduce((acc, scene) => acc + (scene.duration || 5), 0)
        };

        // بررسی مجدد userId قبل از ذخیره
        console.log('🆕 Creating project for userId:', userId);

        set(state => ({
          projects: [newProject, ...state.projects]
        }));

        // ذخیره در localStorage
        const allProjects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(allProjects));

        console.log('✅ Project created:', newProject.name, 'ID:', newProject.id);
        return newProject;
      },

      // به‌روزرسانی پروژه
      updateProject: async (projectId, updates) => {
        const userId = localStorage.getItem('userId');
        
        set(state => ({
          projects: state.projects.map(project => {
            if (project.id === projectId && project.userId === userId) {
              return {
                ...project,
                ...updates,
                lastModified: Date.now()
              };
            }
            return project;
          })
        }));

        const allProjects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(allProjects));
        console.log('✅ Project updated:', projectId);
      },

      // حذف پروژه
      deleteProject: async (projectId) => {
        const userId = localStorage.getItem('userId');
        
        set(state => ({
          projects: state.projects.filter(project => 
            !(project.id === projectId && project.userId === userId)
          )
        }));

        const allProjects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(allProjects));
        console.log('✅ Project deleted:', projectId);
      },

      // کپی پروژه
      duplicateProject: async (projectId) => {
        const userId = localStorage.getItem('userId');
        const originalProject = get().projects.find(p => 
          p.id === projectId && p.userId === userId
        );
        
        if (!originalProject) return null;

        const duplicatedProject = {
          ...originalProject,
          id: Date.now().toString(),
          userId: userId,
          name: `${originalProject.name} (کپی)`,
          createdAt: Date.now(),
          lastModified: Date.now()
        };

        set(state => ({
          projects: [duplicatedProject, ...state.projects]
        }));

        const allProjects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(allProjects));
        console.log('✅ Project duplicated:', duplicatedProject.name);
        return duplicatedProject;
      },

      // گرفتن یک پروژه
      getProject: (projectId) => {
        const userId = localStorage.getItem('userId');
        return get().projects.find(p => 
          p.id === projectId && p.userId === userId
        );
      }
    }),
    {
      name: 'video-maker-projects-storage'
    }
  )
);

// ═══════════════════════════════════════════════════════════
// SELECTORS - برای استفاده در کامپوننت‌ها
// ═══════════════════════════════════════════════════════════

// گرفتن فقط پروژه‌های کاربر فعلی
export const useUserProjects = () => {
  const allProjects = useProjectStore(state => state.projects);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  
  if (!userId) return [];
  
  const filtered = allProjects.filter(p => p.userId === userId);
  console.log('🔍 Filtered projects for', userId, ':', filtered.length, 'out of', allProjects.length);
  return filtered;
};

export default useProjectStore;