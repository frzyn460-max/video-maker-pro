// ============================================
// useAutoSave Hook - رفع مشکل re-render
// مسیر: src/hooks/useAutoSave.js
// ============================================

import { useEffect, useRef, useCallback, useState } from 'react';
import { debounce } from '../utils/helpers';
import useProjectStore from '../store/useProjectStore';
import useUIStore from '../store/useUIStore';

/**
 * Hook برای ذخیره خودکار پروژه
 * @param {number} delay - تاخیر به میلی‌ثانیه (پیش‌فرض: 5000ms = 5s)
 * @param {boolean} enabled - فعال/غیرفعال بودن (پیش‌فرض: true)
 */
const useAutoSave = (delay = 5000, enabled = true) => {
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);
  const isSavingRef = useRef(false);
  
  // State محلی برای UI
  const [lastSavedTime, setLastSavedTime] = useState('هنوز ذخیره نشده');
  const [isSaving, setIsSaving] = useState(false);

  // دریافت از Store
  const currentProject = useProjectStore(state => state.currentProject);
  const updateCurrentProject = useProjectStore(state => state.updateCurrentProject);
  const showSuccess = useUIStore(state => state.showSuccess);
  const showError = useUIStore(state => state.showError);
  const showInfo = useUIStore(state => state.showInfo);

  /**
   * تابع ذخیره با debounce
   */
  const saveProject = useCallback(
    debounce(async () => {
      // اگر در حال ذخیره است، منتظر بمان
      if (isSavingRef.current) {
        return;
      }

      // اگر پروژه‌ای نیست، خروج
      if (!currentProject) {
        return;
      }

      try {
        isSavingRef.current = true;
        setIsSaving(true);

        // ذخیره در Store
        await updateCurrentProject({
          updatedAt: Date.now(),
        });

        // ذخیره موفق
        lastSavedRef.current = Date.now();
        setLastSavedTime('چند لحظه پیش');

      } catch (error) {
        console.error('❌ خطا در ذخیره:', error);
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    }, 1000), 
    [currentProject, updateCurrentProject]
  );

  /**
   * ذخیره دستی (بدون debounce)
   */
  const saveNow = useCallback(async () => {
    if (!currentProject) {
      showError('پروژه‌ای برای ذخیره وجود ندارد');
      return;
    }

    try {
      setIsSaving(true);

      await updateCurrentProject({
        updatedAt: Date.now(),
      });

      lastSavedRef.current = Date.now();
      setLastSavedTime('چند لحظه پیش');
      showSuccess('✅ ذخیره شد');

    } catch (error) {
      console.error('❌ خطا در ذخیره دستی:', error);
      showError('خطا در ذخیره پروژه');
    } finally {
      setIsSaving(false);
    }
  }, [currentProject, updateCurrentProject, showSuccess, showError]);

  /**
   * به‌روزرسانی زمان آخرین ذخیره هر 10 ثانیه
   */
  useEffect(() => {
    if (!lastSavedRef.current) return;

    const interval = setInterval(() => {
      const diff = Date.now() - lastSavedRef.current;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);

      if (seconds < 10) {
        setLastSavedTime('چند لحظه پیش');
      } else if (seconds < 60) {
        setLastSavedTime(`${seconds} ثانیه پیش`);
      } else if (minutes < 60) {
        setLastSavedTime(`${minutes} دقیقه پیش`);
      } else {
        setLastSavedTime(new Date(lastSavedRef.current).toLocaleTimeString('fa-IR'));
      }
    }, 10000); // هر 10 ثانیه

    return () => clearInterval(interval);
  }, []);

  /**
   * Effect برای ذخیره خودکار - فقط وقتی پروژه تغییر کنه
   */
  useEffect(() => {
    // اگر غیرفعال است یا پروژه نیست، خروج
    if (!enabled || !currentProject) {
      return;
    }

    // پاک کردن timeout قبلی
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // تنظیم timeout جدید
    saveTimeoutRef.current = setTimeout(() => {
      saveProject();
    }, delay);

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentProject?.updatedAt, delay, enabled]); // فقط وقتی updatedAt تغییر کنه

  /**
   * Effect برای ذخیره با کلید میانبر (Ctrl+S)
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S یا Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveNow();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveNow]);

  // Return
  return {
    saveNow,
    isSaving,
    lastSavedTime,
  };
};

export default useAutoSave;