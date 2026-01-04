// ============================================
// Validators - توابع اعتبارسنجی
// ============================================

import { FILE_LIMITS } from './constants';

/**
 * اعتبارسنجی نام پروژه
 */
export const validateProjectName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'نام پروژه نمی‌تواند خالی باشد' };
  }

  if (name.length < 2) {
    return { valid: false, error: 'نام پروژه باید حداقل 2 حرف باشد' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'نام پروژه نباید بیشتر از 100 حرف باشد' };
  }

  // حروف غیرمجاز
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'نام پروژه شامل کاراکترهای غیرمجاز است' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی متن صحنه
 */
export const validateSceneText = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'متن صحنه نمی‌تواند خالی باشد' };
  }

  if (text.length < 5) {
    return { valid: false, error: 'متن صحنه باید حداقل 5 حرف باشد' };
  }

  if (text.length > 500) {
    return { valid: false, error: 'متن صحنه نباید بیشتر از 500 حرف باشد' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی فایل تصویر
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده است' };
  }

  const { maxSize, types, extensions } = FILE_LIMITS.image;

  // بررسی حجم
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `حجم فایل نباید بیشتر از ${maxSizeMB}MB باشد`
    };
  }

  // بررسی نوع فایل
  if (!types.includes(file.type)) {
    return {
      valid: false,
      error: `فرمت فایل باید یکی از این‌ها باشد: ${extensions.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی فایل ویدیو
 */
export const validateVideoFile = (file) => {
  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده است' };
  }

  const { maxSize, types, extensions } = FILE_LIMITS.video;

  // بررسی حجم
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `حجم فایل نباید بیشتر از ${maxSizeMB}MB باشد`
    };
  }

  // بررسی نوع
  if (!types.includes(file.type)) {
    return {
      valid: false,
      error: `فرمت فایل باید یکی از این‌ها باشد: ${extensions.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی فایل صوتی
 */
export const validateAudioFile = (file) => {
  if (!file) {
    return { valid: false, error: 'فایلی انتخاب نشده است' };
  }

  const { maxSize, types, extensions } = FILE_LIMITS.audio;

  // بررسی حجم
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `حجم فایل نباید بیشتر از ${maxSizeMB}MB باشد`
    };
  }

  // بررسی نوع
  if (!types.includes(file.type)) {
    return {
      valid: false,
      error: `فرمت فایل باید یکی از این‌ها باشد: ${extensions.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی مدت زمان صحنه
 */
export const validateSceneDuration = (duration) => {
  if (typeof duration !== 'number' || isNaN(duration)) {
    return { valid: false, error: 'مدت زمان باید عدد باشد' };
  }

  if (duration < 1) {
    return { valid: false, error: 'مدت زمان نباید کمتر از 1 ثانیه باشد' };
  }

  if (duration > 30) {
    return { valid: false, error: 'مدت زمان نباید بیشتر از 30 ثانیه باشد' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی اندازه فونت
 */
export const validateFontSize = (size) => {
  if (typeof size !== 'number' || isNaN(size)) {
    return { valid: false, error: 'اندازه فونت باید عدد باشد' };
  }

  if (size < 12) {
    return { valid: false, error: 'اندازه فونت نباید کمتر از 12 باشد' };
  }

  if (size > 120) {
    return { valid: false, error: 'اندازه فونت نباید بیشتر از 120 باشد' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی رنگ (HEX)
 */
export const validateColor = (color) => {
  if (!color) {
    return { valid: false, error: 'رنگ نمی‌تواند خالی باشد' };
  }

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexPattern.test(color)) {
    return { valid: false, error: 'فرمت رنگ باید HEX باشد (مثال: #FF0000)' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی درصد (0-100)
 */
export const validatePercentage = (value, label = 'مقدار') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: `${label} باید عدد باشد` };
  }

  if (value < 0) {
    return { valid: false, error: `${label} نباید کمتر از 0 باشد` };
  }

  if (value > 100) {
    return { valid: false, error: `${label} نباید بیشتر از 100 باشد` };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی سرعت پخش
 */
export const validateSpeed = (speed) => {
  if (typeof speed !== 'number' || isNaN(speed)) {
    return { valid: false, error: 'سرعت باید عدد باشد' };
  }

  if (speed < 0.25) {
    return { valid: false, error: 'سرعت نباید کمتر از 0.25 باشد' };
  }

  if (speed > 3) {
    return { valid: false, error: 'سرعت نباید بیشتر از 3 باشد' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی کیفیت ویدیو
 */
export const validateVideoQuality = (quality) => {
  const validQualities = ['480p', '720p', '1080p', '1440p', '2160p'];
  
  if (!validQualities.includes(quality)) {
    return {
      valid: false,
      error: `کیفیت باید یکی از این‌ها باشد: ${validQualities.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی نسبت ابعاد
 */
export const validateAspectRatio = (ratio) => {
  const validRatios = ['16:9', '21:9', '4:3', '1:1', '9:16'];
  
  if (!validRatios.includes(ratio)) {
    return {
      valid: false,
      error: `نسبت ابعاد باید یکی از این‌ها باشد: ${validRatios.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی URL
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return { valid: false, error: 'آدرس نمی‌تواند خالی باشد' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'آدرس معتبر نیست' };
  }
};

/**
 * اعتبارسنجی ایمیل
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'ایمیل نمی‌تواند خالی باشد' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { valid: false, error: 'فرمت ایمیل صحیح نیست' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی JSON
 */
export const validateJSON = (jsonString) => {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'فرمت JSON معتبر نیست' };
  }
};

/**
 * اعتبارسنجی تعداد صحنه‌ها
 */
export const validateSceneCount = (count) => {
  if (count === 0) {
    return { valid: false, error: 'لطفاً حداقل یک صحنه ایجاد کنید' };
  }

  if (count > 50) {
    return { valid: false, error: 'حداکثر 50 صحنه مجاز است' };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی تنظیمات پروژه
 */
export const validateProjectSettings = (settings) => {
  const errors = [];

  // بررسی سرعت
  const speedCheck = validateSpeed(settings.speed);
  if (!speedCheck.valid) errors.push(speedCheck.error);

  // بررسی مدت زمان
  const durationCheck = validateSceneDuration(settings.duration);
  if (!durationCheck.valid) errors.push(durationCheck.error);

  // بررسی اندازه فونت
  const fontSizeCheck = validateFontSize(settings.fontSize);
  if (!fontSizeCheck.valid) errors.push(fontSizeCheck.error);

  // بررسی رنگ متن
  const colorCheck = validateColor(settings.textColor);
  if (!colorCheck.valid) errors.push(colorCheck.error);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
};

/**
 * اعتبارسنجی داده‌های Export
 */
export const validateExportData = (data) => {
  if (!data) {
    return { valid: false, error: 'داده‌ای برای صادر کردن وجود ندارد' };
  }

  if (!data.scenes || !Array.isArray(data.scenes)) {
    return { valid: false, error: 'صحنه‌ای برای صادر کردن وجود ندارد' };
  }

  if (data.scenes.length === 0) {
    return { valid: false, error: 'حداقل یک صحنه برای صادر کردن لازم است' };
  }

  return { valid: true };
};

/**
 * تمیز کردن نام فایل از کاراکترهای غیرمجاز
 */
export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 100);
};

/**
 * تبدیل بایت به فرمت قابل خواندن
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 بایت';
  
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * بررسی پشتیبانی مرورگر از ویژگی
 */
export const checkBrowserSupport = () => {
  const support = {
    mediaRecorder: !!window.MediaRecorder,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    indexedDB: !!window.indexedDB,
    localStorage: typeof Storage !== 'undefined',
    canvas: !!document.createElement('canvas').getContext,
    audioContext: !!(window.AudioContext || window.webkitAudioContext),
  };

  const unsupported = Object.keys(support).filter(key => !support[key]);
  
  if (unsupported.length > 0) {
    return {
      supported: false,
      missing: unsupported,
      message: `مرورگر شما از این ویژگی‌ها پشتیبانی نمی‌کند: ${unsupported.join(', ')}`
    };
  }

  return { supported: true };
};

// ============================================
// Export همه
// ============================================
export default {
  validateProjectName,
  validateSceneText,
  validateImageFile,
  validateVideoFile,
  validateAudioFile,
  validateSceneDuration,
  validateFontSize,
  validateColor,
  validatePercentage,
  validateSpeed,
  validateVideoQuality,
  validateAspectRatio,
  validateUrl,
  validateEmail,
  validateJSON,
  validateSceneCount,
  validateProjectSettings,
  validateExportData,
  sanitizeFileName,
  formatFileSize,
  checkBrowserSupport,
};