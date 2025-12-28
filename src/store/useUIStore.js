// ============================================
// UI Store - مدیریت وضعیت رابط کاربری
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { generateId } from '../utils/helpers';

const useUIStore = create(
  devtools(
    (set, get) => ({
      // ============================================
      // Modal State
      // ============================================
      modals: {
        export: false,
        import: false,
        settings: false,
        templates: false,
        ai: false,
        confirm: false,
        help: false,
      },
      
      modalData: null,

      // ============================================
      // Toast Notifications
      // ============================================
      toasts: [],
      maxToasts: 5,

      // ============================================
      // Loading State
      // ============================================
      isLoading: false,
      loadingMessage: '',

      // ============================================
      // Sidebar & Layout
      // ============================================
      sidebarOpen: true,
      timelineOpen: true,
      viewportFullscreen: false,

      // ============================================
      // مدیریت Modal
      // ============================================
      openModal: (modalName, data = null) => {
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
          modalData: data,
        }));
      },

      closeModal: (modalName) => {
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
          modalData: null,
        }));
      },

      closeAllModals: () => {
        set({
          modals: {
            export: false,
            import: false,
            settings: false,
            templates: false,
            ai: false,
            confirm: false,
            help: false,
          },
          modalData: null,
        });
      },

      toggleModal: (modalName) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: !state.modals[modalName],
          },
        }));
      },

      // ============================================
      // مدیریت Toast
      // ============================================
      addToast: (toast) => {
        const id = generateId();
        const newToast = {
          id,
          message: toast.message || '',
          type: toast.type || 'info', // success, error, warning, info
          duration: toast.duration || 3000,
          action: toast.action || null,
          ...toast,
        };

        set((state) => {
          const toasts = [...state.toasts, newToast];
          
          // محدود کردن تعداد toast ها
          if (toasts.length > state.maxToasts) {
            toasts.shift();
          }

          return { toasts };
        });

        // حذف خودکار بعد از duration
        if (newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }

        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      // Toast Shortcuts
      showSuccess: (message, duration = 3000) => {
        return get().addToast({ message, type: 'success', duration });
      },

      showError: (message, duration = 4000) => {
        return get().addToast({ message, type: 'error', duration });
      },

      showWarning: (message, duration = 3500) => {
        return get().addToast({ message, type: 'warning', duration });
      },

      showInfo: (message, duration = 3000) => {
        return get().addToast({ message, type: 'info', duration });
      },

      // ============================================
      // مدیریت Loading
      // ============================================
      setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message });
      },

      startLoading: (message = 'در حال بارگذاری...') => {
        set({ isLoading: true, loadingMessage: message });
      },

      stopLoading: () => {
        set({ isLoading: false, loadingMessage: '' });
      },

      // ============================================
      // مدیریت Sidebar & Layout
      // ============================================
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleTimeline: () => {
        set((state) => ({ timelineOpen: !state.timelineOpen }));
      },

      setTimelineOpen: (open) => {
        set({ timelineOpen: open });
      },

      toggleFullscreen: () => {
        set((state) => ({ 
          viewportFullscreen: !state.viewportFullscreen 
        }));
      },

      setFullscreen: (fullscreen) => {
        set({ viewportFullscreen: fullscreen });
      },

      // ============================================
      // مدیریت Confirm Dialog
      // ============================================
      confirm: (options) => {
        return new Promise((resolve) => {
          const modalData = {
            title: options.title || 'تأیید',
            message: options.message || 'آیا مطمئن هستید؟',
            confirmText: options.confirmText || 'بله',
            cancelText: options.cancelText || 'خیر',
            type: options.type || 'warning', // warning, danger, info
            onConfirm: () => {
              get().closeModal('confirm');
              resolve(true);
            },
            onCancel: () => {
              get().closeModal('confirm');
              resolve(false);
            },
          };

          set({
            modals: { ...get().modals, confirm: true },
            modalData,
          });
        });
      },

      // ============================================
      // Keyboard Shortcuts State
      // ============================================
      keyboardShortcutsEnabled: true,

      toggleKeyboardShortcuts: () => {
        set((state) => ({
          keyboardShortcutsEnabled: !state.keyboardShortcutsEnabled,
        }));
      },

      setKeyboardShortcuts: (enabled) => {
        set({ keyboardShortcutsEnabled: enabled });
      },

      // ============================================
      // Context Menu
      // ============================================
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        items: [],
      },

      showContextMenu: (x, y, items) => {
        set({
          contextMenu: {
            visible: true,
            x,
            y,
            items,
          },
        });
      },

      hideContextMenu: () => {
        set({
          contextMenu: {
            visible: false,
            x: 0,
            y: 0,
            items: [],
          },
        });
      },

      // ============================================
      // Drag & Drop State
      // ============================================
      isDragging: false,
      dragData: null,

      startDrag: (data) => {
        set({ isDragging: true, dragData: data });
      },

      endDrag: () => {
        set({ isDragging: false, dragData: null });
      },

      // ============================================
      // Viewport Focus Mode
      // ============================================
      focusMode: false,

      toggleFocusMode: () => {
        set((state) => ({ focusMode: !state.focusMode }));
      },

      setFocusMode: (focus) => {
        set({ focusMode: focus });
      },

      // ============================================
      // Grid/List View Toggle
      // ============================================
      viewMode: 'grid', // grid or list

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      toggleViewMode: () => {
        set((state) => ({
          viewMode: state.viewMode === 'grid' ? 'list' : 'grid',
        }));
      },

      // ============================================
      // Search State
      // ============================================
      searchOpen: false,
      searchQuery: '',

      openSearch: () => {
        set({ searchOpen: true });
      },

      closeSearch: () => {
        set({ searchOpen: false, searchQuery: '' });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      // ============================================
      // Tutorial/Onboarding
      // ============================================
      showTutorial: false,
      tutorialStep: 0,

      startTutorial: () => {
        set({ showTutorial: true, tutorialStep: 0 });
      },

      nextTutorialStep: () => {
        set((state) => ({
          tutorialStep: state.tutorialStep + 1,
        }));
      },

      prevTutorialStep: () => {
        set((state) => ({
          tutorialStep: Math.max(0, state.tutorialStep - 1),
        }));
      },

      closeTutorial: () => {
        set({ showTutorial: false, tutorialStep: 0 });
      },

      // ============================================
      // Theme (اگر نخواستیم از Context استفاده کنیم)
      // ============================================
      theme: 'dark',

      setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          localStorage.setItem('theme', newTheme);
          return { theme: newTheme };
        });
      },

      // ============================================
      // Notifications Badge
      // ============================================
      notificationCount: 0,

      incrementNotifications: () => {
        set((state) => ({
          notificationCount: state.notificationCount + 1,
        }));
      },

      clearNotifications: () => {
        set({ notificationCount: 0 });
      },

      // ============================================
      // Unsaved Changes Warning
      // ============================================
      hasUnsavedChanges: false,

      setUnsavedChanges: (hasChanges) => {
        set({ hasUnsavedChanges: hasChanges });
      },

      // ============================================
      // Performance Monitoring
      // ============================================
      fps: 60,
      performanceMode: 'auto', // auto, performance, quality

      setFPS: (fps) => {
        set({ fps });
      },

      setPerformanceMode: (mode) => {
        set({ performanceMode: mode });
      },

      // ============================================
      // ریست
      // ============================================
      resetUI: () => {
        set({
          modals: {
            export: false,
            import: false,
            settings: false,
            templates: false,
            ai: false,
            confirm: false,
            help: false,
          },
          modalData: null,
          toasts: [],
          isLoading: false,
          loadingMessage: '',
          sidebarOpen: true,
          timelineOpen: true,
          viewportFullscreen: false,
          focusMode: false,
          viewMode: 'grid',
          searchOpen: false,
          searchQuery: '',
          hasUnsavedChanges: false,
        });
      },
    }),
    { name: 'UIStore' }
  )
);

export default useUIStore;