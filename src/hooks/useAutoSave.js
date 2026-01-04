// ============================================
// useAutoSave Hook - ذخیره خودکار
// مسیر: src/hooks/useAutoSave.js
// ============================================

import { useEffect, useRef, useCallback } from 'react';
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

  // دریافت از Store
  const { currentProject, updateCurrentProject } = useProjectStore();
  const { showSuccess, showError, showInfo } = useUIStore();

  /**
   * تابع ذخیره با debounce
   */
  const saveProject = useCallback(
    debounce(async () => {
      // اگر در حال ذخیره است، منتظر بمان
      if (isSavingRef.current) {
        console.log('⏳ در حال ذخیره...');
        return;
      }

      // اگر پروژه‌ای نیست، خروج
      if (!currentProject) {
        console.log('⚠️ پروژه‌ای برای ذخیره وجود ندارد');
        return;
      }

      try {
        isSavingRef.current = true;

        // نمایش وضعیت
        showInfo('در حال ذخیره...', 1000);

        // ذخیره در Store
        await updateCurrentProject({
          updatedAt: Date.now(),
        });

        // ذخیره موفق
        lastSavedRef.current = Date.now();
        showSuccess('✅ ذخیره شد', 2000);

        console.log('💾 پروژه ذخیره شد:', new Date().toLocaleTimeString('fa-IR'));
      } catch (error) {
        console.error('❌ خطا در ذخیره:', error);
        showError('خطا در ذخیره پروژه');
      } finally {
        isSavingRef.current = false;
      }
    }, 1000), // debounce برای جلوگیری از ذخیره‌های متوالی
    [currentProject, updateCurrentProject, showSuccess, showError, showInfo]
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
      showInfo('در حال ذخیره...', 1000);

      await updateCurrentProject({
        updatedAt: Date.now(),
      });

      lastSavedRef.current = Date.now();
      showSuccess('✅ ذخیره شد');

      console.log('💾 ذخیره دستی انجام شد');
    } catch (error) {
      console.error('❌ خطا در ذخیره دستی:', error);
      showError('خطا در ذخیره پروژه');
    }
  }, [currentProject, updateCurrentProject, showSuccess, showError, showInfo]);

  /**
   * دریافت زمان آخرین ذخیره (فرمت نسبی)
   */
  const getLastSavedTime = useCallback(() => {
    if (!lastSavedRef.current) return 'هنوز ذخیره نشده';

    const diff = Date.now() - lastSavedRef.current;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return 'چند لحظه پیش';
    if (seconds < 60) return `${seconds} ثانیه پیش`;
    if (minutes < 60) return `${minutes} دقیقه پیش`;

    return new Date(lastSavedRef.current).toLocaleTimeString('fa-IR');
  }, []);

  /**
   * Effect برای ذخیره خودکار
   */
  useEffect(() => {
    // اگر غیرفعال است، خروج
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
  }, [currentProject, delay, enabled, saveProject]);

  /**
   * Effect برای ذخیره هنگام خروج از صفحه
   */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentProject && isSavingRef.current === false) {
        // ذخیره سریع
        updateCurrentProject({ updatedAt: Date.now() });

        // نمایش پیام تأیید (در بعضی مرورگرها)
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentProject, updateCurrentProject]);

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

  /**
   * بررسی وضعیت ذخیره
   */
  const isSaving = () => isSavingRef.current;

  /**
   * بررسی نیاز به ذخیره
   */
  const needsSave = useCallback(() => {
    if (!currentProject) return false;
    if (!lastSavedRef.current) return true;

    const diff = Date.now() - lastSavedRef.current;
    return diff > delay;
  }, [currentProject, delay]);

  // Return
  return {
    saveNow, // ذخیره دستی
    isSaving: isSaving(), // آیا در حال ذخیره است؟
    lastSaved: lastSavedRef.current, // زمان آخرین ذخیره (timestamp)
    lastSavedTime: getLastSavedTime(), // زمان آخرین ذخیره (متنی)
    needsSave: needsSave(), // آیا نیاز به ذخیره دارد؟
  };
};

export default useAutoSave;