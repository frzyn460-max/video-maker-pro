// ============================================
// فرمت‌دهنده‌های Video Maker Pro
// ============================================

/**
 * فرمت اعداد فارسی
 */
export const toPersianNumber = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[digit]);
};

/**
 * فرمت اعداد انگلیسی
 */
export const toEnglishNumber = (str) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return String(str).replace(/[۰-۹]/g, (digit) => {
    return englishDigits[persianDigits.indexOf(digit)];
  });
};

/**
 * فرمت عدد با جداکننده هزارگان
 */
export const formatNumber = (num, usePersian = true) => {
  const formatted = new Intl.NumberFormat('fa-IR').format(num);
  return usePersian ? formatted : toEnglishNumber(formatted);
};

/**
 * فرمت درصد
 */
export const formatPercent = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * فرمت ارز (ریال)
 */
export const formatCurrency = (amount, usePersian = true) => {
  const formatted = new Intl.NumberFormat('fa-IR').format(amount);
  const result = usePersian ? formatted : toEnglishNumber(formatted);
  return `${result} ریال`;
};

/**
 * فرمت مدت زمان (به فارسی)
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} ثانیه`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes} دقیقه`;
    }
    return `${minutes} دقیقه و ${remainingSeconds} ثانیه`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ساعت`;
  }
  return `${hours} ساعت و ${remainingMinutes} دقیقه`;
};

/**
 * فرمت تاریخ شمسی
 */
export const formatJalaliDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

/**
 * فرمت تاریخ و زمان شمسی
 */
export const formatJalaliDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * فرمت تاریخ کوتاه
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

/**
 * فرمت زمان
 */
export const formatTimeOnly = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * فرمت حجم فایل
 */
export const formatBytes = (bytes, decimals = 2, usePersian = true) => {
  if (bytes === 0) return usePersian ? '۰ بایت' : '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const sizesEn = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  
  const formattedSize = usePersian ? toPersianNumber(size) : size;
  const unit = usePersian ? sizes[i] : sizesEn[i];
  
  return `${formattedSize} ${unit}`;
};

/**
 * فرمت نام فایل (حذف کاراکترهای نامعتبر)
 */
export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .toLowerCase();
};

/**
 * فرمت URL-friendly slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * فرمت شماره تلفن
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = String(phone).replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * فرمت کد ملی
 */
export const formatNationalCode = (code) => {
  const cleaned = String(code).replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 9)}-${cleaned.slice(9)}`;
  }
  
  return code;
};

/**
 * فرمت متن به Sentence Case
 */
export const toSentenceCase = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * فرمت متن به Title Case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * فرمت کد رنگ
 */
export const formatColorCode = (color) => {
  // اگر کد رنگ کوتاه است، تبدیل به فرمت کامل
  if (color.length === 4) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }
  return color.toUpperCase();
};

/**
 * فرمت نسبت ابعاد
 */
export const formatAspectRatio = (width, height) => {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

/**
 * فرمت رزولوشن ویدیو
 */
export const formatResolution = (width, height) => {
  return `${width}×${height}`;
};

/**
 * فرمت FPS
 */
export const formatFPS = (fps) => {
  return `${fps} fps`;
};

/**
 * فرمت Bitrate
 */
export const formatBitrate = (bitrate) => {
  if (bitrate < 1000) {
    return `${bitrate} kbps`;
  }
  return `${(bitrate / 1000).toFixed(1)} Mbps`;
};

/**
 * فرمت مدت زمان ویدیو (HH:MM:SS)
 */
export const formatVideoDuration = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '00:00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

/**
 * فرمت درصد پیشرفت
 */
export const formatProgress = (current, total) => {
  if (total === 0) return '0%';
  const percent = Math.round((current / total) * 100);
  return `${percent}%`;
};

/**
 * فرمت نام پروژه
 */
export const formatProjectName = (name) => {
  if (!name) return 'بدون نام';
  return name.trim().substring(0, 50);
};

/**
 * فرمت توضیحات
 */
export const formatDescription = (text, maxLength = 200) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * فرمت تگ‌ها
 */
export const formatTags = (tags) => {
  if (!Array.isArray(tags)) return [];
  return tags.map(tag => tag.trim().toLowerCase()).filter(Boolean);
};

/**
 * فرمت URL
 */
export const formatUrl = (url) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

/**
 * فرمت نسخه
 */
export const formatVersion = (version) => {
  const parts = version.split('.');
  return `v${parts.join('.')}`;
};

/**
 * فرمت وضعیت پروژه
 */
export const formatProjectStatus = (status) => {
  const statusMap = {
    draft: 'پیش‌نویس',
    in_progress: 'در حال کار',
    completed: 'تکمیل شده',
    archived: 'بایگانی شده',
  };
  return statusMap[status] || status;
};

/**
 * فرمت امتیاز
 */
export const formatRating = (rating, maxRating = 5) => {
  const stars = '⭐'.repeat(Math.round(rating));
  return `${stars} (${rating}/${maxRating})`;
};

/**
 * فرمت coordinate (برای timeline)
 */
export const formatCoordinate = (value) => {
  return Math.round(value);
};

/**
 * فرمت کیفیت ویدیو
 */
export const formatQuality = (quality) => {
  const qualityMap = {
    '480p': 'SD',
    '720p': 'HD',
    '1080p': 'Full HD',
    '1440p': '2K',
    '2160p': '4K',
  };
  return qualityMap[quality] || quality;
};

/**
 * فرمت خطا
 */
export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'خطای نامشخص';
};

/**
 * فرمت لیست به متن
 */
export const formatList = (items, separator = '، ') => {
  if (!Array.isArray(items) || items.length === 0) return '';
  return items.join(separator);
};

/**
 * فرمت بولین به بله/خیر
 */
export const formatBoolean = (value) => {
  return value ? 'بله' : 'خیر';
};

// ============================================
// Export
// ============================================
export default {
  toPersianNumber,
  toEnglishNumber,
  formatNumber,
  formatPercent,
  formatCurrency,
  formatDuration,
  formatJalaliDate,
  formatJalaliDateTime,
  formatShortDate,
  formatTimeOnly,
  formatBytes,
  sanitizeFileName,
  slugify,
  formatPhoneNumber,
  formatNationalCode,
  toSentenceCase,
  toTitleCase,
  formatColorCode,
  formatAspectRatio,
  formatResolution,
  formatFPS,
  formatBitrate,
  formatVideoDuration,
  formatProgress,
  formatProjectName,
  formatDescription,
  formatTags,
  formatUrl,
  formatVersion,
  formatProjectStatus,
  formatRating,
  formatCoordinate,
  formatQuality,
  formatError,
  formatList,
  formatBoolean,
};