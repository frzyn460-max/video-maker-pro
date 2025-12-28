// ============================================
// Editor Store - مدیریت ادیتور
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { parseScenes, generateId } from '../utils/helpers';

const useEditorStore = create(
  devtools(
    (set, get) => ({
      // ============================================
      // State
      // ============================================
      scenes: [],
      currentSceneIndex: 0,
      text: '',
      settings: { ...DEFAULT_SETTINGS },
      
      // وضعیت پخش
      isPlaying: false,
      isPaused: false,
      isRecording: false,
      
      // Timeline
      timelineZoom: 1,
      currentTime: 0,
      totalDuration: 0,
      
      // History (Undo/Redo)
      history: [],
      historyIndex: -1,
      maxHistory: 50,
      
      // UI State
      activeTab: 'editor',
      sidebarCollapsed: false,
      timelineCollapsed: false,

      // ============================================
      // مدیریت متن و صحنه‌ها
      // ============================================
      setText: (text) => {
        set({ text });
        get().parseText();
      },

      parseText: () => {
        const { text } = get();
        const scenes = parseScenes(text);
        
        set({ 
          scenes,
          totalDuration: scenes.reduce((sum, scene) => 
            sum + (scene.duration || 5), 0
          ),
        });
        
        get().saveToHistory();
      },

      // ============================================
      // مدیریت صحنه‌ها
      // ============================================
      addScene: (scene) => {
        const newScene = {
          id: generateId(),
          title: scene.title || '',
          content: scene.content || '',
          duration: scene.duration || 5,
          transition: scene.transition || 'fade',
          ...scene,
        };

        set((state) => ({
          scenes: [...state.scenes, newScene],
          totalDuration: state.totalDuration + newScene.duration,
        }));

        get().saveToHistory();
      },

      updateScene: (index, updates) => {
        set((state) => {
          const newScenes = [...state.scenes];
          const oldDuration = newScenes[index].duration || 5;
          newScenes[index] = { ...newScenes[index], ...updates };
          
          const newDuration = newScenes[index].duration || 5;
          const durationDiff = newDuration - oldDuration;

          return {
            scenes: newScenes,
            totalDuration: state.totalDuration + durationDiff,
          };
        });

        get().saveToHistory();
      },

      deleteScene: (index) => {
        set((state) => {
          const deletedScene = state.scenes[index];
          const newScenes = state.scenes.filter((_, i) => i !== index);
          
          return {
            scenes: newScenes,
            currentSceneIndex: Math.max(0, Math.min(state.currentSceneIndex, newScenes.length - 1)),
            totalDuration: state.totalDuration - (deletedScene.duration || 5),
          };
        });

        get().saveToHistory();
      },

      moveScene: (fromIndex, toIndex) => {
        set((state) => {
          const newScenes = [...state.scenes];
          const [movedScene] = newScenes.splice(fromIndex, 1);
          newScenes.splice(toIndex, 0, movedScene);
          
          return { scenes: newScenes };
        });

        get().saveToHistory();
      },

      duplicateScene: (index) => {
        const { scenes } = get();
        const sceneToDuplicate = scenes[index];
        
        const duplicated = {
          ...sceneToDuplicate,
          id: generateId(),
          title: `${sceneToDuplicate.title} (کپی)`,
        };

        set((state) => {
          const newScenes = [...state.scenes];
          newScenes.splice(index + 1, 0, duplicated);
          
          return {
            scenes: newScenes,
            totalDuration: state.totalDuration + duplicated.duration,
          };
        });

        get().saveToHistory();
      },

      // ============================================
      // صحنه فعلی
      // ============================================
      setCurrentScene: (index) => {
        const { scenes } = get();
        if (index >= 0 && index < scenes.length) {
          set({ currentSceneIndex: index });
        }
      },

      nextScene: () => {
        const { currentSceneIndex, scenes } = get();
        if (currentSceneIndex < scenes.length - 1) {
          set({ currentSceneIndex: currentSceneIndex + 1 });
        }
      },

      prevScene: () => {
        const { currentSceneIndex } = get();
        if (currentSceneIndex > 0) {
          set({ currentSceneIndex: currentSceneIndex - 1 });
        }
      },

      // ============================================
      // تنظیمات
      // ============================================
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        
        get().saveToHistory();
      },

      resetSettings: () => {
        set({ settings: { ...DEFAULT_SETTINGS } });
        get().saveToHistory();
      },

      // ============================================
      // کنترل پخش
      // ============================================
      play: () => {
        set({ isPlaying: true, isPaused: false });
      },

      pause: () => {
        set({ isPaused: true, isPlaying: false });
      },

      stop: () => {
        set({ 
          isPlaying: false, 
          isPaused: false, 
          currentSceneIndex: 0,
          currentTime: 0,
        });
      },

      togglePlayPause: () => {
        const { isPlaying, isPaused } = get();
        
        if (isPlaying) {
          get().pause();
        } else if (isPaused) {
          get().play();
        } else {
          get().play();
        }
      },

      // ============================================
      // ضبط
      // ============================================
      startRecording: () => {
        set({ isRecording: true, isPlaying: true });
      },

      stopRecording: () => {
        set({ isRecording: false, isPlaying: false });
      },

      // ============================================
      // Timeline
      // ============================================
      setTimelineZoom: (zoom) => {
        set({ timelineZoom: Math.max(0.5, Math.min(3, zoom)) });
      },

      zoomIn: () => {
        const { timelineZoom } = get();
        get().setTimelineZoom(timelineZoom + 0.25);
      },

      zoomOut: () => {
        const { timelineZoom } = get();
        get().setTimelineZoom(timelineZoom - 0.25);
      },

      setCurrentTime: (time) => {
        const { totalDuration } = get();
        set({ currentTime: Math.max(0, Math.min(time, totalDuration)) });
      },

      seekToScene: (index) => {
        const { scenes } = get();
        let time = 0;
        
        for (let i = 0; i < index && i < scenes.length; i++) {
          time += scenes[i].duration || 5;
        }
        
        set({ currentTime: time, currentSceneIndex: index });
      },

      // ============================================
      // History (Undo/Redo)
      // ============================================
      saveToHistory: () => {
        const { scenes, settings, history, historyIndex, maxHistory } = get();
        
        const snapshot = {
          scenes: JSON.parse(JSON.stringify(scenes)),
          settings: JSON.parse(JSON.stringify(settings)),
          timestamp: Date.now(),
        };

        // حذف history های بعد از index فعلی
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(snapshot);

        // محدود کردن history
        if (newHistory.length > maxHistory) {
          newHistory.shift();
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      undo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex > 0) {
          const snapshot = history[historyIndex - 1];
          set({
            scenes: JSON.parse(JSON.stringify(snapshot.scenes)),
            settings: JSON.parse(JSON.stringify(snapshot.settings)),
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        
        if (historyIndex < history.length - 1) {
          const snapshot = history[historyIndex + 1];
          set({
            scenes: JSON.parse(JSON.stringify(snapshot.scenes)),
            settings: JSON.parse(JSON.stringify(snapshot.settings)),
            historyIndex: historyIndex + 1,
          });
        }
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },

      // ============================================
      // UI State
      // ============================================
      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      toggleTimeline: () => {
        set((state) => ({ timelineCollapsed: !state.timelineCollapsed }));
      },

      // ============================================
      // قالب‌ها
      // ============================================
      loadTemplate: (template) => {
        set({
          text: template.text || '',
          scenes: template.scenes || [],
          settings: { ...DEFAULT_SETTINGS, ...template.settings },
        });
        
        get().parseText();
        get().saveToHistory();
      },

      // ============================================
      // آمار
      // ============================================
      getStats: () => {
        const { scenes, text } = get();
        
        return {
          sceneCount: scenes.length,
          totalDuration: scenes.reduce((sum, s) => sum + (s.duration || 5), 0),
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
          charCount: text.length,
        };
      },

      // ============================================
      // Export State
      // ============================================
      exportState: () => {
        const { scenes, text, settings } = get();
        return {
          scenes: JSON.parse(JSON.stringify(scenes)),
          text,
          settings: JSON.parse(JSON.stringify(settings)),
        };
      },

      importState: (state) => {
        set({
          scenes: state.scenes || [],
          text: state.text || '',
          settings: { ...DEFAULT_SETTINGS, ...state.settings },
        });
        
        get().saveToHistory();
      },

      // ============================================
      // ریست
      // ============================================
      resetEditor: () => {
        set({
          scenes: [],
          currentSceneIndex: 0,
          text: '',
          settings: { ...DEFAULT_SETTINGS },
          isPlaying: false,
          isPaused: false,
          isRecording: false,
          timelineZoom: 1,
          currentTime: 0,
          totalDuration: 0,
          history: [],
          historyIndex: -1,
        });
      },
    }),
    { name: 'EditorStore' }
  )
);

export default useEditorStore;