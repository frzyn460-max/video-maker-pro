// ============================================
// توابع کمکی Video Maker Pro
// ============================================

import { FILE_LIMITS } from './constants';

// ============================================
// توابع زمان
// ============================================

/**
 * تبدیل ثانیه به فرمت mm:ss
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * تبدیل فرمت mm:ss به ثانیه
 */
export const parseTime = (timeString) => {
  const parts = timeString.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return minutes * 60 + seconds;
};

/**
 * تاخیر (Promise-based)
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ============================================
// توابع فایل
// ============================================

/**
 * تبدیل فایل به Base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * تبدیل Base64 به Blob
 */
export const base64ToBlob = (base64, mimeType) => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
};

/**
 * دانلود فایل
 */
export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * بررسی نوع فایل
 */
export const getFileType = (file) => {
  const type = file.type.split('/')[0];
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'audio') return 'audio';
  return 'unknown';
};

/**
 * بررسی اعتبار فایل
 */
export const validateFile = (file, type) => {
  const limits = FILE_LIMITS[type];
  if (!limits) return { valid: false, error: 'نوع فایل نامعتبر' };
  
  // بررسی حجم
  if (file.size > limits.maxSize) {
    return { 
      valid: false, 
      error: `حجم فایل نباید بیشتر از ${formatFileSize(limits.maxSize)} باشد` 
    };
  }
  
  // بررسی نوع
  if (!limits.types.includes(file.type)) {
    return { 
      valid: false, 
      error: `فرمت فایل باید یکی از این‌ها باشد: ${limits.extensions.join(', ')}` 
    };
  }
  
  return { valid: true };
};

/**
 * فرمت حجم فایل
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ============================================
// توابع متن
// ============================================

/**
 * پارس کردن متن به صحنه‌ها
 */
export const parseScenes = (text) => {
  if (!text || !text.trim()) return [];
  
  const sceneBlocks = text.split(/(?=صحنه)/);
  
  return sceneBlocks
    .map(block => {
      const lines = block.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) return null;
      
      const title = lines[0].replace(/صحنه.*?:/i, '').trim();
      const content = lines
        .slice(1)
        .join(' ')
        .replace(/تصویر:|صدا:/gi, '')
        .trim();
      
      return { 
        id: generateId(),
        title, 
        content,
        duration: 5,
        transition: 'fade',
      };
    })
    .filter(Boolean);
};

/**
 * شمارش کلمات
 */
export const countWords = (text) => {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * محدود کردن طول متن
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * حذف HTML Tags
 */
export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// ============================================
// توابع ID و تاریخ
// ============================================

/**
 * تولید ID یکتا
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * تولید UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * فرمت تاریخ فارسی
 */
export const formatPersianDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * تاریخ نسبی (مثلاً: 2 ساعت پیش)
 */
export const getRelativeTime = (date) => {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'هم‌اکنون';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 30) return `${days} روز پیش`;
  return formatPersianDate(date);
};

// ============================================
// توابع رنگ
// ============================================

/**
 * تبدیل HEX به RGBA
 */
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * بررسی روشنایی رنگ
 */
export const isColorDark = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

// ============================================
// توابع Array
// ============================================

/**
 * حذف آیتم از آرایه
 */
export const removeItem = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

/**
 * جابجایی آیتم در آرایه
 */
export const moveItem = (array, fromIndex, toIndex) => {
  const item = array[fromIndex];
  const newArray = removeItem(array, fromIndex);
  return [
    ...newArray.slice(0, toIndex),
    item,
    ...newArray.slice(toIndex)
  ];
};

/**
 * مرتب‌سازی بر اساس کلید
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * گروه‌بندی بر اساس کلید
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
};

// ============================================
// توابع Object
// ============================================

/**
 * Deep Clone
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge Objects
 */
export const mergeDeep = (target, source) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
};

/**
 * بررسی Object بودن
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// ============================================
// توابع Number
// ============================================

/**
 * محدود کردن عدد بین min و max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * تولید عدد تصادفی
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * گرد کردن به n رقم اعشار
 */
export const roundTo = (value, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ============================================
// توابع Validation
// ============================================

/**
 * بررسی خالی بودن
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * بررسی URL
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * بررسی Email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ============================================
// توابع Browser
// ============================================

/**
 * کپی متن به Clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('خطا در کپی:', err);
    return false;
  }
};

/**
 * بررسی پشتیبانی از ویژگی
 */
export const isFeatureSupported = (feature) => {
  switch (feature) {
    case 'clipboard':
      return !!navigator.clipboard;
    case 'fullscreen':
      return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    case 'mediaRecorder':
      return !!window.MediaRecorder;
    case 'indexedDB':
      return !!window.indexedDB;
    default:
      return false;
  }
};

/**
 * دریافت اطلاعات مرورگر
 */
export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  
  if (ua.includes('Firefox')) browserName = 'Firefox';
  else if (ua.includes('Chrome')) browserName = 'Chrome';
  else if (ua.includes('Safari')) browserName = 'Safari';
  else if (ua.includes('Edge')) browserName = 'Edge';
  
  return {
    name: browserName,
    userAgent: ua,
    language: navigator.language,
    platform: navigator.platform,
  };
};

// ============================================
// توابع localStorage
// ============================================

/**
 * ذخیره در localStorage
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('خطا در ذخیره:', err);
    return false;
  }
};

/**
 * خواندن از localStorage
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error('خطا در خواندن:', err);
    return defaultValue;
  }
};

/**
 * حذف از localStorage
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error('خطا در حذف:', err);
    return false;
  }
};

// ============================================
// Export همه توابع
// ============================================
export default {
  formatTime,
  parseTime,
  wait,
  debounce,
  throttle,
  fileToBase64,
  base64ToBlob,
  downloadFile,
  getFileType,
  validateFile,
  formatFileSize,
  parseScenes,
  countWords,
  truncateText,
  stripHtml,
  generateId,
  generateUUID,
  formatPersianDate,
  getRelativeTime,
  hexToRgba,
  isColorDark,
  removeItem,
  moveItem,
  sortBy,
  groupBy,
  deepClone,
  mergeDeep,
  clamp,
  randomInt,
  roundTo,
  isEmpty,
  isValidUrl,
  isValidEmail,
  copyToClipboard,
  isFeatureSupported,
  getBrowserInfo,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
};