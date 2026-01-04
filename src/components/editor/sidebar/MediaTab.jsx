// ============================================
// MediaTab Component - تب مدیا (عکس، ویدیو، موسیقی)
// مسیر: src/components/editor/sidebar/MediaTab.jsx
// ============================================

import React, { useRef } from 'react';
import useMediaStore from '../../../store/useMediaStore';
import useUIStore from '../../../store/useUIStore';
import { validateImageFile, validateVideoFile, validateAudioFile } from '../../../utils/validators';
import { formatFileSize } from '../../../utils/formatters';

const MediaTab = () => {
  const {
    bgImage,
    bgVideo,
    bgType,
    audio,
    bgSettings,
    audioSettings,
    uploadBackgroundImage,
    uploadBackgroundVideo,
    uploadAudio,
    removeBackground,
    removeAudio,
    updateBgSettings,
    updateAudioSettings,
    toggleAudioPlayback,
    audioPlaying,
  } = useMediaStore();

  const { showSuccess, showError } = useUIStore();

  // Refs
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  /**
   * آپلود تصویر پس‌زمینه
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    try {
      await uploadBackgroundImage(file);
      showSuccess('✅ تصویر پس‌زمینه اضافه شد');
    } catch (error) {
      showError('خطا در بارگذاری تصویر');
    }
  };

  /**
   * آپلود ویدیو پس‌زمینه
   */
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    try {
      await uploadBackgroundVideo(file);
      showSuccess('✅ ویدیو پس‌زمینه اضافه شد');
    } catch (error) {
      showError('خطا در بارگذاری ویدیو');
    }
  };

  /**
   * آپلود فایل صوتی
   */
  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    try {
      await uploadAudio(file);
      showSuccess('✅ موسیقی اضافه شد');
    } catch (error) {
      showError('خطا در بارگذاری موسیقی');
    }
  };

  /**
   * حذف پس‌زمینه
   */
  const handleRemoveBackground = () => {
    if (window.confirm('آیا می‌خواهید پس‌زمینه را حذف کنید؟')) {
      removeBackground();
      showSuccess('پس‌زمینه حذف شد');
    }
  };

  /**
   * حذف موسیقی
   */
  const handleRemoveAudio = () => {
    if (window.confirm('آیا می‌خواهید موسیقی را حذف کنید؟')) {
      removeAudio();
      showSuccess('موسیقی حذف شد');
    }
  };

  return (
    <div className="space-y-4">
      {/* ========== بخش پس‌زمینه ========== */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <span>🖼️</span> پس‌زمینه
          </h3>
          {(bgImage || bgVideo) && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              فعال
            </span>
          )}
        </div>

        {/* دکمه‌های آپلود */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="btn btn-primary btn-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>عکس</span>
          </button>

          <button
            onClick={() => videoInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>ویدیو</span>
          </button>
        </div>

        {/* ورودی‌های مخفی */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
        />

        {/* پیش‌نمایش */}
        {(bgImage || bgVideo) && (
          <div className="space-y-3">
            {/* تصویر پیش‌نمایش */}
            <div className="relative rounded-lg overflow-hidden border border-white/10">
              {bgType === 'image' && bgImage && (
                <img
                  src={bgImage.data}
                  alt="پیش‌نمایش"
                  className="w-full h-32 object-cover"
                />
              )}
              {bgType === 'video' && bgVideo && (
                <video
                  src={bgVideo.data}
                  className="w-full h-32 object-cover"
                  muted
                  loop
                  autoPlay
                />
              )}
            </div>

            {/* اطلاعات فایل */}
            <div className="text-xs opacity-70 space-y-1">
              <p>📁 {bgType === 'image' ? bgImage?.name : bgVideo?.name}</p>
              <p>💾 {formatFileSize(bgType === 'image' ? bgImage?.size : bgVideo?.size)}</p>
            </div>

            {/* تنظیمات پس‌زمینه */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              {/* شفافیت */}
              <div className="setting-group">
                <label className="flex justify-between text-xs mb-2">
                  <span>شفافیت</span>
                  <span className="font-bold text-primary-500">
                    {bgSettings.opacity}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgSettings.opacity}
                  onChange={(e) => updateBgSettings({ opacity: parseInt(e.target.value) })}
                  className="slider w-full"
                />
              </div>

              {/* میزان تاری */}
              <div className="setting-group">
                <label className="flex justify-between text-xs mb-2">
                  <span>میزان تاری</span>
                  <span className="font-bold text-primary-500">
                    {bgSettings.blur}px
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={bgSettings.blur}
                  onChange={(e) => updateBgSettings({ blur: parseInt(e.target.value) })}
                  className="slider w-full"
                />
              </div>
            </div>

            {/* دکمه حذف */}
            <button
              onClick={handleRemoveBackground}
              className="btn btn-ghost btn-sm w-full"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>حذف پس‌زمینه</span>
            </button>
          </div>
        )}
      </div>

      {/* ========== بخش موسیقی ========== */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <span>🎵</span> موسیقی پس‌زمینه
          </h3>
          {audio && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              فعال
            </span>
          )}
        </div>

        {/* دکمه آپلود */}
        {!audio && (
          <button
            onClick={() => audioInputRef.current?.click()}
            className="btn btn-primary w-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>انتخاب موسیقی</span>
          </button>
        )}

        {/* ورودی مخفی */}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="hidden"
        />

        {/* پلیر موسیقی */}
        {audio && (
          <div className="space-y-3">
            {/* اطلاعات فایل */}
            <div className="text-xs opacity-70 space-y-1 p-3 bg-white/5 rounded-lg">
              <p>🎵 {audio.name}</p>
              <p>💾 {formatFileSize(audio.size)}</p>
            </div>

            {/* دکمه پخش */}
            <button
              onClick={toggleAudioPlayback}
              className="btn btn-primary w-full"
            >
              {audioPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>توقف</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>پخش</span>
                </>
              )}
            </button>

            {/* تنظیمات صدا */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              {/* حجم صدا */}
              <div className="setting-group">
                <label className="flex justify-between text-xs mb-2">
                  <span>حجم صدا</span>
                  <span className="font-bold text-primary-500">
                    {audioSettings.volume}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioSettings.volume}
                  onChange={(e) => updateAudioSettings({ volume: parseInt(e.target.value) })}
                  className="slider w-full"
                />
              </div>

              {/* گزینه‌ها */}
              <div className="space-y-2">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={audioSettings.loop}
                    onChange={(e) => updateAudioSettings({ loop: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="toggle-switch"></div>
                  <span className="text-xs">تکرار خودکار</span>
                </label>

                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={audioSettings.fadeIn}
                    onChange={(e) => updateAudioSettings({ fadeIn: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="toggle-switch"></div>
                  <span className="text-xs">Fade In (شروع آرام)</span>
                </label>

                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={audioSettings.fadeOut}
                    onChange={(e) => updateAudioSettings({ fadeOut: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="toggle-switch"></div>
                  <span className="text-xs">Fade Out (پایان آرام)</span>
                </label>
              </div>
            </div>

            {/* دکمه حذف */}
            <button
              onClick={handleRemoveAudio}
              className="btn btn-ghost btn-sm w-full"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>حذف موسیقی</span>
            </button>
          </div>
        )}
      </div>

      {/* راهنما */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs opacity-70 leading-relaxed">
          <strong className="text-primary-500">نکته:</strong> فایل‌های پس‌زمینه و موسیقی در پروژه شما ذخیره می‌شوند.
          حجم فایل‌ها را کنترل کنید.
        </p>
      </div>
    </div>
  );
};

export default MediaTab;