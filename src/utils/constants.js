// ============================================
// ثابت‌های پروژه Video Maker Pro
// ============================================

// نسخه برنامه
export const APP_VERSION = '2.0.0';
export const APP_NAME = 'Video Maker Pro';

// ============================================
// تنظیمات پیش‌فرض ادیتور
// ============================================
export const DEFAULT_SETTINGS = {
  speed: 1,
  duration: 5,
  transition: 'fade',
  fontSize: 48,
  fontFamily: 'Vazirmatn',
  textColor: '#ffffff',
  textAlign: 'center',
  textPosition: 'center',
  textShadow: true,
  
  // افکت‌ها
  typewriter: true,
  kenburns: true,
  particles: false,
  vignette: true,
  glow: true,
  grainy: false,
  shake: false,
  glitch: false,
  chromatic: false,
  
  // پس‌زمینه
  bgOpacity: 50,
  bgBlur: 10,
  
  // صدا
  volume: 100,
  
  // کیفیت
  videoQuality: '1080p',
  aspectRatio: '16:9',
  fps: 30,
  
  // فیلترها
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
};

// ============================================
// انواع انتقال (Transitions)
// ============================================
export const TRANSITIONS = [
  { value: 'fade', label: 'محو شدن', icon: '🌫️' },
  { value: 'slide', label: 'اسلاید', icon: '➡️' },
  { value: 'zoom', label: 'زوم', icon: '🔍' },
  { value: 'blur', label: 'تار شدن', icon: '🌀' },
  { value: 'rotate', label: 'چرخش', icon: '🔄' },
];

// ============================================
// کیفیت‌های ویدیو
// ============================================
export const VIDEO_QUALITIES = [
  { value: '480p', label: 'SD (480p)', width: 854, height: 480 },
  { value: '720p', label: 'HD (720p)', width: 1280, height: 720 },
  { value: '1080p', label: 'Full HD (1080p)', width: 1920, height: 1080 },
  { value: '1440p', label: '2K (1440p)', width: 2560, height: 1440 },
  { value: '2160p', label: '4K (2160p)', width: 3840, height: 2160 },
];

// ============================================
// نسبت‌های تصویر
// ============================================
export const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 (استاندارد)', ratio: 16 / 9 },
  { value: '21:9', label: '21:9 (سینمایی)', ratio: 21 / 9 },
  { value: '4:3', label: '4:3 (کلاسیک)', ratio: 4 / 3 },
  { value: '1:1', label: '1:1 (مربع)', ratio: 1 },
  { value: '9:16', label: '9:16 (عمودی)', ratio: 9 / 16 },
];

// ============================================
// فرمت‌های خروجی
// ============================================
export const EXPORT_FORMATS = [
  { value: 'webm', label: 'WebM', mimeType: 'video/webm' },
  { value: 'mp4', label: 'MP4', mimeType: 'video/mp4' },
];

// ============================================
// محدودیت‌های فایل
// ============================================
export const FILE_LIMITS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    types: ['video/mp4', 'video/webm', 'video/ogg'],
    extensions: ['.mp4', '.webm', '.ogg'],
  },
  audio: {
    maxSize: 20 * 1024 * 1024, // 20MB
    types: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    extensions: ['.mp3', '.wav', '.ogg'],
  },
};

// ============================================
// قالب‌های آماده
// ============================================
export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'همه', icon: '📦' },
  { id: 'movie', label: 'فیلم', icon: '🎬' },
  { id: 'poem', label: 'شعر', icon: '✍️' },
  { id: 'quote', label: 'نقل قول', icon: '💬' },
  { id: 'story', label: 'داستان', icon: '📖' },
  { id: 'social', label: 'شبکه‌های اجتماعی', icon: '📱' },
  { id: 'education', label: 'آموزشی', icon: '🎓' },
];

// ============================================
// میانبرهای کیبورد
// ============================================
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  STOP: 'Escape',
  NEXT_SCENE: 'ArrowRight',
  PREV_SCENE: 'ArrowLeft',
  FULLSCREEN: 'f',
  SAVE: 'ctrl+s',
  EXPORT: 'ctrl+e',
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  NEW_PROJECT: 'ctrl+n',
  DELETE: 'Delete',
};

// ============================================
// پیام‌های Toast
// ============================================
export const TOAST_MESSAGES = {
  // موفقیت
  PROJECT_SAVED: 'پروژه با موفقیت ذخیره شد',
  PROJECT_DELETED: 'پروژه حذف شد',
  PROJECT_EXPORTED: 'پروژه صادر شد',
  FILE_UPLOADED: 'فایل با موفقیت بارگذاری شد',
  COPIED: 'کپی شد',
  
  // خطا
  ERROR_SAVE: 'خطا در ذخیره پروژه',
  ERROR_LOAD: 'خطا در بارگذاری پروژه',
  ERROR_EXPORT: 'خطا در صادر کردن',
  ERROR_FILE_SIZE: 'حجم فایل بیش از حد مجاز است',
  ERROR_FILE_TYPE: 'فرمت فایل پشتیبانی نمی‌شود',
  ERROR_NETWORK: 'خطا در اتصال به اینترنت',
  
  // هشدار
  UNSAVED_CHANGES: 'تغییرات ذخیره نشده دارید',
  CONFIRM_DELETE: 'آیا مطمئن هستید؟',
  NO_SCENES: 'لطفاً ابتدا متن صحنه‌ها را وارد کنید',
};

// ============================================
// تنظیمات انیمیشن
// ============================================
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const ANIMATION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// ============================================
// Breakpoints برای Responsive
// ============================================
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

// ============================================
// تنظیمات LocalStorage
// ============================================
export const STORAGE_KEYS = {
  THEME: 'theme',
  PROJECTS: 'projects',
  SETTINGS: 'settings',
  RECENT_PROJECTS: 'recentProjects',
  USER_PREFERENCES: 'userPreferences',
};

// ============================================
// تنظیمات IndexedDB
// ============================================
export const DB_CONFIG = {
  name: 'VideoMakerProDB',
  version: 1,
  stores: {
    projects: 'projects',
    media: 'media',
    settings: 'settings',
  },
};

// ============================================
// محدودیت‌های عمومی
// ============================================
export const LIMITS = {
  MAX_PROJECTS: 100,
  MAX_SCENES: 50,
  MAX_SCENE_DURATION: 30, // ثانیه
  MIN_SCENE_DURATION: 1,
  MAX_FONT_SIZE: 120,
  MIN_FONT_SIZE: 12,
  MAX_TEXT_LENGTH: 500,
};

// ============================================
// رنگ‌های پیش‌فرض
// ============================================
export const DEFAULT_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f59e0b', 
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
];

// ============================================
// فونت‌های موجود
// ============================================
export const AVAILABLE_FONTS = [
  { value: 'Vazirmatn', label: 'وزیرمتن' },
  { value: 'Samim', label: 'صمیم' },
  { value: 'Shabnam', label: 'شبنم' },
  { value: 'Yekan', label: 'یکان' },
];

// ============================================
// وضعیت‌های پروژه
// ============================================
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// ============================================
// نوع‌های مدیا
// ============================================
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
};

// ============================================
// تنظیمات Particles
// ============================================
export const PARTICLES_CONFIG = {
  count: 50,
  minSize: 1,
  maxSize: 3,
  speed: 0.5,
  color: 'rgba(255, 255, 255, 0.5)',
};

// ============================================
// تنظیمات Timeline
// ============================================
export const TIMELINE_CONFIG = {
  pixelsPerSecond: 50,
  minZoom: 0.5,
  maxZoom: 3,
  snapEnabled: true,
  snapThreshold: 10,
};

// ============================================
// API URLs (برای AI)
// ============================================
export const API_URLS = {
  CLAUDE: 'https://api.anthropic.com/v1/messages',
};

// ============================================
// پیام‌های راهنما
// ============================================
export const HELP_MESSAGES = {
  TEXT_TAB: 'متن صحنه‌های خود را وارد کنید. هر صحنه با "صحنه اول:" شروع می‌شود.',
  EFFECTS_TAB: 'افکت‌ها و جلوه‌های بصری را تنظیم کنید.',
  MEDIA_TAB: 'تصاویر، ویدیوها و موسیقی پس‌زمینه را اضافه کنید.',
  AI_TAB: 'از هوش مصنوعی برای تولید محتوا استفاده کنید.',
  TIMELINE: 'صحنه‌ها را جابجا کنید یا مدت آن‌ها را تغییر دهید.',
};

// ============================================
// Export
// ============================================
export default {
  APP_VERSION,
  APP_NAME,
  DEFAULT_SETTINGS,
  TRANSITIONS,
  VIDEO_QUALITIES,
  ASPECT_RATIOS,
  EXPORT_FORMATS,
  FILE_LIMITS,
  TEMPLATE_CATEGORIES,
  KEYBOARD_SHORTCUTS,
  TOAST_MESSAGES,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  BREAKPOINTS,
  STORAGE_KEYS,
  DB_CONFIG,
  LIMITS,
  DEFAULT_COLORS,
  AVAILABLE_FONTS,
  PROJECT_STATUS,
  MEDIA_TYPES,
  PARTICLES_CONFIG,
  TIMELINE_CONFIG,
  API_URLS,
  HELP_MESSAGES,
};