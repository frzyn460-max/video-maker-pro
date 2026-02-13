/*
 * مسیر: /video-maker-pro/src/store/useProjectStore.js
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
        const newProject = {
          id: Date.now().toString(),
          name: name || 'پروژه جدید',
          createdAt: Date.now(),
          lastModified: Date.now(),
          scenes: DEFAULT_SCENES,
          settings: DEFAULT_SETTINGS,
          thumbnail: null,
          duration: DEFAULT_SCENES.reduce((acc, scene) => acc + (scene.duration || 5), 0)
        };

        set(state => ({
          projects: [newProject, ...state.projects]
        }));

        // ذخیره در localStorage
        const projects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(projects));

        console.log('✅ Project created:', newProject.name, newProject.id);
        return newProject;
      },

      // به‌روزرسانی پروژه
      updateProject: async (projectId, updates) => {
        set(state => ({
          projects: state.projects.map(project =>
            project.id === projectId
              ? {
                  ...project,
                  ...updates,
                  lastModified: Date.now()
                }
              : project
          )
        }));

        // ذخیره در localStorage
        const projects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(projects));

        console.log('✅ Project updated:', projectId);
      },

      // حذف پروژه
      deleteProject: async (projectId) => {
        set(state => ({
          projects: state.projects.filter(project => project.id !== projectId)
        }));

        // ذخیره در localStorage
        const projects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(projects));

        console.log('✅ Project deleted:', projectId);
      },

      // کپی پروژه
      duplicateProject: async (projectId) => {
        const originalProject = get().projects.find(p => p.id === projectId);
        if (!originalProject) return null;

        const duplicatedProject = {
          ...originalProject,
          id: Date.now().toString(),
          name: `${originalProject.name} (کپی)`,
          createdAt: Date.now(),
          lastModified: Date.now()
        };

        set(state => ({
          projects: [duplicatedProject, ...state.projects]
        }));

        // ذخیره در localStorage
        const projects = get().projects;
        localStorage.setItem('video-maker-projects', JSON.stringify(projects));

        console.log('✅ Project duplicated:', duplicatedProject.name);
        return duplicatedProject;
      },

      // گرفتن یک پروژه
      getProject: (projectId) => {
        return get().projects.find(p => p.id === projectId);
      }
    }),
    {
      name: 'video-maker-projects-storage'
    }
  )
);

export default useProjectStore;