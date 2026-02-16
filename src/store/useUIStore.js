/* 
 * مسیر: /video-maker-pro/src/store/useUIStore.js
 * ✨ نسخه کامل - Toast، Modal، Loading، Notifications
 */

import { create } from 'zustand';

let toastIdCounter = 0;

const useUIStore = create((set, get) => ({
  // ── Toasts ───────────────────────────────────────────────
  toasts: [],

  addToast: (toast) => {
    const id = ++toastIdCounter;
    const newToast = {
      id,
      type: 'info',
      duration: 3000,
      ...toast,
    };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    if (newToast.duration > 0) {
      setTimeout(() => get().removeToast(id), newToast.duration);
    }
    return id;
  },

  removeToast: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },

  clearToasts: () => set({ toasts: [] }),

  // shortcuts
  showSuccess: (message, opts = {}) =>
    get().addToast({ type: 'success', message, ...opts }),

  showError: (message, opts = {}) =>
    get().addToast({ type: 'error', message, duration: 5000, ...opts }),

  showInfo: (message, opts = {}) =>
    get().addToast({ type: 'info', message, ...opts }),

  showWarning: (message, opts = {}) =>
    get().addToast({ type: 'warning', message, duration: 4000, ...opts }),

  // ── Modals ───────────────────────────────────────────────
  modals: {},

  openModal: (id, data = {}) => {
    set(state => ({ modals: { ...state.modals, [id]: { open: true, data } } }));
  },

  closeModal: (id) => {
    set(state => ({
      modals: { ...state.modals, [id]: { open: false, data: {} } },
    }));
  },

  isModalOpen: (id) => !!get().modals[id]?.open,
  getModalData: (id) => get().modals[id]?.data || {},

  // ── Global loading ────────────────────────────────────────
  isLoading: false,
  loadingMessage: '',

  setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),

  // ── Sidebar ──────────────────────────────────────────────
  sidebarOpen: true,
  sidebarTab: 'editor',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  // ── Theme ─────────────────────────────────────────────────
  theme: 'dark',
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  // ── Keyboard shortcut help ────────────────────────────────
  shortcutsVisible: false,
  toggleShortcuts: () => set(state => ({ shortcutsVisible: !state.shortcutsVisible })),

  // ── Export panel ─────────────────────────────────────────
  exportPanelOpen: false,
  toggleExportPanel: () => set(state => ({ exportPanelOpen: !state.exportPanelOpen })),

  // ── Autosave status ───────────────────────────────────────
  lastSaved: null,
  isSaving: false,

  setSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (time = new Date()) => set({ lastSaved: time, isSaving: false }),
}));

export default useUIStore;