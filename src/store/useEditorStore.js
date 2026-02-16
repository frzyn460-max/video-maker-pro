/* 
 * مسیر: /video-maker-pro/src/store/useEditorStore.js
 * ✨ نسخه پیشرفته - با Undo/Redo و مدیریت بهتر state
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
  vignette: true,
  grainy: false,
  shake: false,
  glitch: false,
  chromatic: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  volume: 70,
  aspectRatio: '16:9',
  bgOpacity: 100,
  bgBlur: 0,
  bgScale: 100,
  bgFit: 'cover',
};

const MAX_HISTORY = 50;

const useEditorStore = create(
  subscribeWithSelector((set, get) => ({
    // ── State ──────────────────────────────────────────────
    scenes: [],
    currentSceneIndex: 0,
    isPlaying: false,
    settings: { ...DEFAULT_SETTINGS },

    // ── Undo/Redo History ──────────────────────────────────
    history: [],
    historyIndex: -1,

    // ── Clipboard ─────────────────────────────────────────
    clipboard: null,

    // ── Selection ─────────────────────────────────────────
    selectedSceneIds: [],

    // ═══════════════════════════════════════════════════════
    //  HISTORY HELPERS
    // ═══════════════════════════════════════════════════════
    _pushHistory: (snapshot) => {
      const { history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(snapshot);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      const newIndex = newHistory.length - 1;
      set({
        history: newHistory,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: false,
      });
    },

    _snapshot: () => ({
      scenes: JSON.parse(JSON.stringify(get().scenes)),
      settings: { ...get().settings },
    }),

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex <= 0) return false;
      const prev = history[historyIndex - 1];
      const newIndex = historyIndex - 1;
      set({
        scenes: prev.scenes,
        settings: prev.settings,
        historyIndex: newIndex,
        currentSceneIndex: Math.min(get().currentSceneIndex, prev.scenes.length - 1),
        canUndo: newIndex > 0,
        canRedo: newIndex < history.length - 1,
      });
      return true;
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex >= history.length - 1) return false;
      const next = history[historyIndex + 1];
      const newIndex = historyIndex + 1;
      set({
        scenes: next.scenes,
        settings: next.settings,
        historyIndex: newIndex,
        currentSceneIndex: Math.min(get().currentSceneIndex, next.scenes.length - 1),
        canUndo: newIndex > 0,
        canRedo: newIndex < history.length - 1,
      });
      return true;
    },

    canUndo: false,
    canRedo: false,

    // ═══════════════════════════════════════════════════════
    //  PROJECT LOAD
    // ═══════════════════════════════════════════════════════
    loadProject: ({ scenes = [], settings = {} }) => {
      const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
      const snapshot = { scenes: JSON.parse(JSON.stringify(scenes)), settings: { ...mergedSettings } };
      set({
        scenes,
        settings: mergedSettings,
        currentSceneIndex: 0,
        isPlaying: false,
        history: [snapshot],
        historyIndex: 0,
        selectedSceneIds: [],
        canUndo: false,
        canRedo: false,
      });
    },

    // ═══════════════════════════════════════════════════════
    //  SCENE ACTIONS
    // ═══════════════════════════════════════════════════════
    addScene: (sceneData = {}) => {
      get()._pushHistory(get()._snapshot());
      const newScene = {
        id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        order: get().scenes.length,
        title: sceneData.title || `صحنه ${get().scenes.length + 1}`,
        content: sceneData.content || '',
        duration: sceneData.duration ?? 5,
        ...sceneData,
      };
      set(state => ({
        scenes: [...state.scenes, newScene],
        currentSceneIndex: state.scenes.length,
      }));
      return newScene;
    },

    updateScene: (id, updates) => {
      set(state => ({
        scenes: state.scenes.map(s => s.id === id ? { ...s, ...updates } : s),
      }));
    },

    updateSceneWithHistory: (id, updates) => {
      get()._pushHistory(get()._snapshot());
      get().updateScene(id, updates);
    },

    deleteScene: (id) => {
      get()._pushHistory(get()._snapshot());
      set(state => {
        const newScenes = state.scenes.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }));
        return {
          scenes: newScenes,
          currentSceneIndex: Math.min(state.currentSceneIndex, Math.max(0, newScenes.length - 1)),
        };
      });
    },

    deleteSelectedScenes: () => {
      const { selectedSceneIds, scenes } = get();
      if (selectedSceneIds.length === 0) return;
      get()._pushHistory(get()._snapshot());
      const newScenes = scenes.filter(s => !selectedSceneIds.includes(s.id)).map((s, i) => ({ ...s, order: i }));
      set({
        scenes: newScenes,
        selectedSceneIds: [],
        currentSceneIndex: Math.min(get().currentSceneIndex, Math.max(0, newScenes.length - 1)),
      });
    },

    duplicateScene: (id) => {
      get()._pushHistory(get()._snapshot());
      set(state => {
        const idx = state.scenes.findIndex(s => s.id === id);
        if (idx === -1) return state;
        const original = state.scenes[idx];
        const copy = {
          ...original,
          id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: `${original.title} (کپی)`,
          order: idx + 1,
        };
        const newScenes = [
          ...state.scenes.slice(0, idx + 1),
          copy,
          ...state.scenes.slice(idx + 1),
        ].map((s, i) => ({ ...s, order: i }));
        return { scenes: newScenes, currentSceneIndex: idx + 1 };
      });
    },

    setScenes: (scenes) => {
      get()._pushHistory(get()._snapshot());
      set({ scenes });
    },

    moveScene: (fromIndex, toIndex) => {
      get()._pushHistory(get()._snapshot());
      set(state => {
        const scenes = [...state.scenes];
        const [removed] = scenes.splice(fromIndex, 1);
        scenes.splice(toIndex, 0, removed);
        return {
          scenes: scenes.map((s, i) => ({ ...s, order: i })),
          currentSceneIndex: toIndex,
        };
      });
    },

    // ── Copy/Paste ─────────────────────────────────────────
    copyScene: (id) => {
      const scene = get().scenes.find(s => s.id === id);
      if (scene) set({ clipboard: { ...scene } });
    },

    pasteScene: () => {
      const { clipboard } = get();
      if (!clipboard) return;
      get().addScene({
        ...clipboard,
        id: undefined,
        title: `${clipboard.title} (کپی)`,
      });
    },

    // ── Selection ─────────────────────────────────────────
    selectScene: (id, multi = false) => {
      set(state => {
        if (multi) {
          const already = state.selectedSceneIds.includes(id);
          return {
            selectedSceneIds: already
              ? state.selectedSceneIds.filter(x => x !== id)
              : [...state.selectedSceneIds, id],
          };
        }
        return { selectedSceneIds: [id] };
      });
    },

    clearSelection: () => set({ selectedSceneIds: [] }),

    // ═══════════════════════════════════════════════════════
    //  PLAYBACK
    // ═══════════════════════════════════════════════════════
    setCurrentSceneIndex: (index) => set({ currentSceneIndex: index }),

    setIsPlaying: (playing) => set({ isPlaying: playing }),

    nextScene: () => {
      const { currentSceneIndex, scenes } = get();
      if (currentSceneIndex < scenes.length - 1)
        set({ currentSceneIndex: currentSceneIndex + 1 });
    },

    prevScene: () => {
      const { currentSceneIndex } = get();
      if (currentSceneIndex > 0)
        set({ currentSceneIndex: currentSceneIndex - 1 });
    },

    // ═══════════════════════════════════════════════════════
    //  SETTINGS
    // ═══════════════════════════════════════════════════════
    updateSettings: (updates) => {
      set(state => ({ settings: { ...state.settings, ...updates } }));
    },

    resetSettings: () => {
      get()._pushHistory(get()._snapshot());
      set({ settings: { ...DEFAULT_SETTINGS } });
    },

    // ═══════════════════════════════════════════════════════
    //  EXPORT
    // ═══════════════════════════════════════════════════════
    getProjectData: () => ({
      scenes: get().scenes,
      settings: get().settings,
    }),
  }))
);

export default useEditorStore;