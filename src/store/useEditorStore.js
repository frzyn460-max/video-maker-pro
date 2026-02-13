/* 
 * مسیر: /video-maker-pro/src/store/useEditorStore.js
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useEditorStore = create(
  persist(
    (set, get) => ({
      // صحنه‌ها
      scenes: [],
      currentSceneIndex: 0,
      isPlaying: false,

      // تنظیمات
      settings: {
        // تنظیمات پایه
        duration: 5,
        speed: 1,
        transition: 'fade',
        
        // تنظیمات متن
        fontSize: 48,
        textColor: '#ffffff',
        textPosition: 'center',
        textShadow: true,
        
        // تنظیمات افکت
        typewriter: false,
        kenburns: false,
        particles: false,
        vignette: false,
        glow: false,
        grainy: false,
        shake: false,
        glitch: false,
        chromatic: false,
        
        // تنظیمات رنگ
        brightness: 100,
        contrast: 100,
        saturation: 100,
        
        // تنظیمات پس‌زمینه
        bgOpacity: 100,
        bgBlur: 0,
        
        // تنظیمات ویدیو
        aspectRatio: '16:9',
        quality: 'high',
        fps: 30
      },

      // ✅ تابع setScenes - اصلاح شده
      setScenes: (scenes) => set({ scenes }),

      // ✅ تابع addScene
      addScene: (scene) => set((state) => ({
        scenes: [...state.scenes, {
          id: scene.id || `scene-${Date.now()}`,
          order: state.scenes.length,
          title: scene.title || `صحنه ${state.scenes.length + 1}`,
          content: scene.content || '',
          duration: scene.duration || state.settings.duration,
          ...scene
        }]
      })),

      // ✅ تابع updateScene
      updateScene: (sceneId, updates) => set((state) => ({
        scenes: state.scenes.map(scene =>
          scene.id === sceneId ? { ...scene, ...updates } : scene
        )
      })),

      // ✅ تابع deleteScene
      deleteScene: (sceneId) => set((state) => ({
        scenes: state.scenes
          .filter(scene => scene.id !== sceneId)
          .map((scene, index) => ({ ...scene, order: index }))
      })),

      // ✅ تابع duplicateScene
      duplicateScene: (sceneId) => set((state) => {
        const sceneToDuplicate = state.scenes.find(s => s.id === sceneId);
        if (!sceneToDuplicate) return state;

        const newScene = {
          ...sceneToDuplicate,
          id: `scene-${Date.now()}`,
          order: state.scenes.length,
          title: `${sceneToDuplicate.title} (کپی)`
        };

        return { scenes: [...state.scenes, newScene] };
      }),

      // ✅ تابع reorderScenes
      reorderScenes: (newScenes) => set({
        scenes: newScenes.map((scene, index) => ({ ...scene, order: index }))
      }),

      // ✅ تنظیم صحنه فعلی
      setCurrentSceneIndex: (index) => set({ currentSceneIndex: index }),

      // ✅ تنظیم وضعیت پخش
      setIsPlaying: (isPlaying) => set({ isPlaying }),

      // ✅ تنظیم تنظیمات
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      // ✅ ریست کردن همه چیز
      reset: () => set({
        scenes: [],
        currentSceneIndex: 0,
        isPlaying: false,
        settings: {
          duration: 5,
          speed: 1,
          transition: 'fade',
          fontSize: 48,
          textColor: '#ffffff',
          textPosition: 'center',
          textShadow: true,
          typewriter: false,
          kenburns: false,
          particles: false,
          vignette: false,
          glow: false,
          grainy: false,
          shake: false,
          glitch: false,
          chromatic: false,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          bgOpacity: 100,
          bgBlur: 0,
          aspectRatio: '16:9',
          quality: 'high',
          fps: 30
        }
      }),

      // ✅ بارگذاری پروژه
      loadProject: (projectData) => set({
        scenes: projectData.scenes || [],
        settings: { ...get().settings, ...projectData.settings },
        currentSceneIndex: 0,
        isPlaying: false
      }),

      // ✅ دریافت داده‌های پروژه برای ذخیره
      getProjectData: () => ({
        scenes: get().scenes,
        settings: get().settings
      })
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        settings: state.settings
      })
    }
  )
);

export default useEditorStore;