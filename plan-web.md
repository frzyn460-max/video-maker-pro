# 🎬 Video Maker Pro - ساختار کامل پروژه

## 📁 نمای کلی

```
video-maker-pro/
│
├── 📦 public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── 📂 assets/
│       ├── 📂 images/
│       │   ├── logo.png
│       │   ├── hero-bg.jpg
│       │   └── placeholder.jpg
│       └── 📂 templates/
│           ├── movie-template.jpg
│           ├── poem-template.jpg
│           └── quote-template.jpg
│
├── 📦 src/
│   │
│   ├── 📂 components/
│   │   │
│   │   ├── 📂 common/                    # کامپوننت‌های مشترک
│   │   │   ├── ✅ ThemeToggle.jsx        [فاز 1 - ساخته شد]
│   │   │   ├── ✅ ThemeToggle.css        [فاز 1 - ساخته شد]
│   │   │   ├── ⏳ Button.jsx             [فاز 3]
│   │   │   ├── ⏳ Card.jsx               [فاز 5]
│   │   │   ├── ⏳ Modal.jsx              [فاز 5]
│   │   │   ├── ⏳ Loading.jsx            [فاز 12]
│   │   │   ├── ⏳ Toast.jsx              [فاز 12]
│   │   │   └── ⏳ Input.jsx              [فاز 3]
│   │   │
│   │   ├── 📂 layout/                    # Layout Components
│   │   │   ├── ⏳ Navbar.jsx             [فاز 4]
│   │   │   ├── ⏳ Sidebar.jsx            [فاز 6]
│   │   │   └── ⏳ Footer.jsx             [فاز 4]
│   │   │
│   │   └── 📂 editor/                    # کامپوننت‌های ادیتور
│   │       │
│   │       ├── 📂 sidebar/               # تب‌های Sidebar
│   │       │   ├── ⏳ EditorSidebar.jsx  [فاز 6]
│   │       │   ├── ⏳ TextTab.jsx        [فاز 6]
│   │       │   ├── ⏳ EffectsTab.jsx     [فاز 6]
│   │       │   ├── ⏳ MediaTab.jsx       [فاز 6]
│   │       │   ├── ⏳ AITab.jsx          [فاز 11]
│   │       │   └── ⏳ ExportTab.jsx      [فاز 10]
│   │       │
│   │       ├── 📂 viewport/              # Viewport
│   │       │   ├── ⏳ Viewport.jsx       [فاز 7]
│   │       │   ├── ⏳ SceneRenderer.jsx  [فاز 7]
│   │       │   └── ⏳ Controls.jsx       [فاز 7]
│   │       │
│   │       ├── 📂 timeline/              # Timeline
│   │       │   ├── ⏳ Timeline.jsx       [فاز 8]
│   │       │   ├── ⏳ Track.jsx          [فاز 8]
│   │       │   ├── ⏳ Playhead.jsx       [فاز 8]
│   │       │   └── ⏳ SceneClip.jsx      [فاز 8]
│   │       │
│   │       └── 📂 modals/                # مودال‌های ادیتور
│   │           ├── ⏳ ExportModal.jsx    [فاز 10]
│   │           ├── ⏳ TemplateModal.jsx  [فاز 9]
│   │           └── ⏳ SettingsModal.jsx  [فاز 6]
│   │
│   ├── 📂 pages/                         # صفحات اصلی
│   │   ├── ⏳ Home.jsx                   [فاز 4]
│   │   ├── ⏳ Dashboard.jsx              [فاز 5]
│   │   ├── ⏳ Editor.jsx                 [فاز 7]
│   │   ├── ⏳ Templates.jsx              [فاز 9]
│   │   └── ⏳ NotFound.jsx               [فاز 12]
│   │
│   ├── 📂 store/                         # State Management (Zustand)
│   │   ├── ⏳ useProjectStore.js         [فاز 3]
│   │   ├── ⏳ useEditorStore.js          [فاز 3]
│   │   ├── ⏳ useMediaStore.js           [فاز 3]
│   │   └── ⏳ useUIStore.js              [فاز 3]
│   │
│   ├── 📂 services/                      # سرویس‌ها
│   │   ├── ⏳ storageService.js          [فاز 2]
│   │   ├── ⏳ exportService.js           [فاز 10]
│   │   ├── ⏳ aiService.js               [فاز 11]
│   │   └── ⏳ templateService.js         [فاز 9]
│   │
│   ├── 📂 context/                       # React Context
│   │   └── ✅ ThemeContext.jsx           [فاز 1 - ساخته شد]
│   │
│   ├── 📂 hooks/                         # Custom Hooks
│   │   ├── ⏳ useAutoSave.js             [فاز 6]
│   │   ├── ⏳ useKeyboard.js             [فاز 12]
│   │   ├── ⏳ useMediaQuery.js           [فاز 4]
│   │   └── ⏳ useToast.js                [فاز 12]
│   │
│   ├── 📂 utils/                         # توابع کمکی
│   │   ├── ⏳ helpers.js                 [فاز 2]
│   │   ├── ⏳ constants.js               [فاز 2]
│   │   ├── ⏳ validators.js              [فاز 6]
│   │   └── ⏳ formatters.js              [فاز 2]
│   │
│   ├── 📂 data/                          # داده‌های استاتیک
│   │   ├── ⏳ templates.json             [فاز 9]
│   │   ├── ⏳ effects.json               [فاز 6]
│   │   └── ⏳ transitions.json           [فاز 6]
│   │
│   ├── 📂 styles/                        # استایل‌ها
│   │   ├── ✅ index.css                  [فاز 1 - ساخته شد]
│   │   └── ✅ animations.css             [فاز 1 - ساخته شد]
│   │
│   ├── ✅ App.js                          [فاز 1 - ساخته شد]
│   ├── ⏳ App.css                         [فاز 4]
│   ├── ⏳ index.js                        [فاز 3 - به‌روزرسانی]
│   └── ⏳ setupTests.js                   [فاز 12]
│
├── 📄 .env.example                        [فاز 11]
├── 📄 .gitignore                          [موجود]
├── 📄 package.json                        [موجود]
├── 📄 package-lock.json                   [موجود]
└── 📄 README.md                           [فاز 12]
```

---

## 📊 آمار فایل‌ها

### ✅ **فایل‌های ساخته شده (فاز 1):**
```
✓ src/context/ThemeContext.jsx
✓ src/components/common/ThemeToggle.jsx
✓ src/components/common/ThemeToggle.css
✓ src/styles/index.css
✓ src/styles/animations.css
✓ src/App.js

جمع: 6 فایل کامل
```

### ⏳ **فایل‌های باقی‌مانده:**
```
📌 فاز 2: 4 فایل (Storage System)
📌 فاز 3: 7 فایل (State Management + Utils)
📌 فاز 4: 5 فایل (Home Page)
📌 فاز 5: 3 فایل (Dashboard)
📌 فاز 6: 9 فایل (Editor Sidebar)
📌 فاز 7: 3 فایل (Viewport)
📌 فاز 8: 4 فایل (Timeline)
📌 فاز 9: 4 فایل (Templates)
📌 فاز 10: 2 فایل (Export)
📌 فاز 11: 3 فایل (AI)
📌 فاز 12: 6 فایل (Polish)

جمع: 50 فایل باقی‌مانده
```

### 📈 **پیشرفت کلی:**
```
✅ کامل شده: 6 فایل (10.7%)
⏳ باقی‌مانده: 50 فایل (89.3%)

جمع کل: 56 فایل
```

---

## 🗺️ **نقشه راه (Roadmap)**

### **✅ فاز 1: تنظیمات پایه** [کامل شد - 6 فایل]
```
✓ ThemeContext
✓ ThemeToggle
✓ CSS اصلی
✓ انیمیشن‌ها
✓ App.js پایه
```

### **⏳ فاز 2: Storage System** [بعدی - 4 فایل]
```
○ storageService.js (کامل با IndexedDB)
○ helpers.js
○ constants.js
○ formatters.js
```

### **⏳ فاز 3: State Management** [7 فایل]
```
○ useProjectStore.js
○ useEditorStore.js
○ useMediaStore.js
○ useUIStore.js
○ Button.jsx
○ Input.jsx
○ index.js (به‌روزرسانی)
```

### **⏳ فاز 4: Home Page** [5 فایل]
```
○ Home.jsx
○ Navbar.jsx
○ Footer.jsx
○ useMediaQuery.js
○ App.css
```

### **⏳ فاز 5: Dashboard** [3 فایل]
```
○ Dashboard.jsx
○ Card.jsx
○ Modal.jsx
```

### **⏳ فاز 6: Editor Sidebar** [9 فایل]
```
○ EditorSidebar.jsx
○ TextTab.jsx
○ EffectsTab.jsx
○ MediaTab.jsx
○ SettingsModal.jsx
○ useAutoSave.js
○ validators.js
○ effects.json
○ transitions.json
```

### **⏳ فاز 7: Viewport** [3 فایل]
```
○ Viewport.jsx
○ SceneRenderer.jsx
○ Controls.jsx
```

### **⏳ فاز 8: Timeline** [4 فایل]
```
○ Timeline.jsx
○ Track.jsx
○ Playhead.jsx
○ SceneClip.jsx
```

### **⏳ فاز 9: Templates** [4 فایل]
```
○ Templates.jsx
○ TemplateModal.jsx
○ templateService.js
○ templates.json
```

### **⏳ فاز 10: Export** [2 فایل]
```
○ ExportModal.jsx
○ exportService.js
```

### **⏳ فاز 11: AI** [3 فایل]
```
○ AITab.jsx
○ aiService.js
○ .env.example
```

### **⏳ فاز 12: Polish** [6 فایل]
```
○ Loading.jsx
○ Toast.jsx
○ NotFound.jsx
○ useKeyboard.js
○ useToast.js
○ README.md
```

---

## 🎯 **فایل‌های کلیدی هر بخش**

### **🎨 UI Components (11 فایل)**
```
✅ ThemeToggle.jsx + CSS
⏳ Button.jsx
⏳ Card.jsx
⏳ Modal.jsx
⏳ Loading.jsx
⏳ Toast.jsx
⏳ Input.jsx
⏳ Navbar.jsx
⏳ Footer.jsx
⏳ Sidebar.jsx
```

### **📝 Editor Components (13 فایل)**
```
⏳ EditorSidebar.jsx
⏳ TextTab.jsx
⏳ EffectsTab.jsx
⏳ MediaTab.jsx
⏳ AITab.jsx
⏳ ExportTab.jsx
⏳ Viewport.jsx
⏳ SceneRenderer.jsx
⏳ Controls.jsx
⏳ Timeline.jsx
⏳ Track.jsx
⏳ Playhead.jsx
⏳ SceneClip.jsx
```

### **🗃️ State & Services (11 فایل)**
```
✅ ThemeContext.jsx
⏳ useProjectStore.js
⏳ useEditorStore.js
⏳ useMediaStore.js
⏳ useUIStore.js
⏳ storageService.js
⏳ exportService.js
⏳ aiService.js
⏳ templateService.js
⏳ helpers.js
⏳ constants.js
```

### **📄 Pages (5 فایل)**
```
⏳ Home.jsx
⏳ Dashboard.jsx
⏳ Editor.jsx
⏳ Templates.jsx
⏳ NotFound.jsx
```

### **🎨 Styles (2 فایل)**
```
✅ index.css
✅ animations.css
```

### **🪝 Hooks (4 فایل)**
```
⏳ useAutoSave.js
⏳ useKeyboard.js
⏳ useMediaQuery.js
⏳ useToast.js
```

### **📊 Data Files (3 فایل)**
```
⏳ templates.json
⏳ effects.json
⏳ transitions.json
```

---

## 📅 **برنامه زمانی**

| فاز | تعداد فایل | زمان تخمینی | وضعیت |
|-----|-----------|-------------|-------|
| فاز 1 | 6 | 30 دقیقه | ✅ تمام |
| فاز 2 | 4 | 45 دقیقه | ⏳ بعدی |
| فاز 3 | 7 | 30 دقیقه | ⏳ |
| فاز 4 | 5 | 1 ساعت | ⏳ |
| فاز 5 | 3 | 1 ساعت | ⏳ |
| فاز 6 | 9 | 2 ساعت | ⏳ |
| فاز 7 | 3 | 1.5 ساعت | ⏳ |
| فاز 8 | 4 | 2 ساعت | ⏳ |
| فاز 9 | 4 | 1 ساعت | ⏳ |
| فاز 10 | 2 | 2 ساعت | ⏳ |
| فاز 11 | 3 | 1.5 ساعت | ⏳ |
| فاز 12 | 6 | 2 ساعت | ⏳ |

**جمع کل:** 56 فایل - حدود 15 ساعت کار

---

## 🎯 **اولویت‌بندی فایل‌ها**

### **🔴 فوری (فازهای 2-3):**
```
1. storageService.js       → ذخیره‌سازی
2. useProjectStore.js      → مدیریت پروژه
3. useEditorStore.js       → مدیریت ادیتور
4. Button.jsx              → کامپوننت پایه
```

### **🟡 مهم (فازهای 4-8):**
```
5. Home.jsx                → صفحه اصلی
6. Dashboard.jsx           → داشبورد
7. Editor.jsx              → صفحه ادیتور
8. Viewport.jsx            → نمایش صحنه
9. Timeline.jsx            → خط زمان
```

### **🟢 تکمیلی (فازهای 9-12):**
```
10. Templates.jsx          → قالب‌ها
11. ExportModal.jsx        → خروجی
12. AITab.jsx              → هوش مصنوعی
13. Toast.jsx              → اعلان‌ها
```

---

## 📌 **نکات مهم:**

1. **فایل‌های ساخته شده (✅):** آماده استفاده
2. **فایل‌های در انتظار (⏳):** قرار است ساخته شوند
3. **وابستگی‌ها:** هر فاز به فاز قبلی وابسته است
4. **قابلیت تغییر:** ساختار قابل تغییر بر اساس نیاز

---

## 🚀 **مرحله بعدی: فاز 2**

در فاز 2 می‌سازیم:
```
✓ storageService.js      → سیستم ذخیره‌سازی کامل
✓ helpers.js             → توابع کمکی
✓ constants.js           → ثابت‌ها
✓ formatters.js          → فرمت‌دهنده‌ها
```

**آماده‌اید شروع کنیم؟** 💪