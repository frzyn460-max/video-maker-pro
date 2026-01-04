// ============================================
// SettingsModal Component - مودال تنظیمات پیشرفته
// مسیر: src/components/editor/modals/SettingsModal.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../../common/Modal';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import { AVAILABLE_FONTS, DEFAULT_COLORS } from '../../../utils/constants';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useEditorStore();
  const { showSuccess } = useUIStore();

  // State محلی برای تنظیمات
  const [localSettings, setLocalSettings] = useState({ ...settings });

  // همگام‌سازی با Store
  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  /**
   * تغییر تنظیمات محلی
   */
  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * ذخیره تنظیمات
   */
  const handleSave = () => {
    updateSettings(localSettings);
    showSuccess('✅ تنظیمات ذخیره شد');
    onClose();
  };

  /**
   * لغو و بازگشت
   */
  const handleCancel = () => {
    setLocalSettings({ ...settings }); // بازگشت به تنظیمات قبلی
    onClose();
  };

  /**
   * بازگشت به پیش‌فرض
   */
  const handleReset = () => {
    if (window.confirm('آیا می‌خواهید تنظیمات را به حالت پیش‌فرض بازگردانید؟')) {
      const defaultSettings = {
        videoQuality: '1080p',
        aspectRatio: '16:9',
        fps: 30,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        textPosition: 'center',
        textAlign: 'center',
        textColor: '#ffffff',
        textShadow: true,
        fontFamily: 'Vazirmatn',
      };
      setLocalSettings(defaultSettings);
      showSuccess('تنظیمات به حالت پیش‌فرض بازگشت');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="⚙️ تنظیمات پیشرفته" size="lg">
      <ModalBody>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
          {/* ========== تنظیمات کیفیت ========== */}
          <div className="p-4 bg-white/5 rounded-xl space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-base">
              <span>🎥</span> کیفیت خروجی
            </h4>

            {/* کیفیت ویدیو */}
            <div>
              <label className="text-xs mb-2 block font-semibold">کیفیت ویدیو</label>
              <select
                value={localSettings.videoQuality}
                onChange={(e) => handleChange('videoQuality', e.target.value)}
                className="select-custom w-full"
              >
                <option value="480p">SD (480p)</option>
                <option value="720p">HD (720p)</option>
                <option value="1080p">Full HD (1080p)</option>
                <option value="1440p">2K (1440p)</option>
                <option value="2160p">4K (2160p)</option>
              </select>
            </div>

            {/* نسبت تصویر */}
            <div>
              <label className="text-xs mb-2 block font-semibold">نسبت تصویر</label>
              <select
                value={localSettings.aspectRatio}
                onChange={(e) => handleChange('aspectRatio', e.target.value)}
                className="select-custom w-full"
              >
                <option value="16:9">16:9 (استاندارد)</option>
                <option value="21:9">21:9 (سینمایی)</option>
                <option value="4:3">4:3 (کلاسیک)</option>
                <option value="1:1">1:1 (مربع)</option>
                <option value="9:16">9:16 (عمودی)</option>
              </select>
            </div>

            {/* FPS */}
            <div>
              <label className="text-xs mb-2 block font-semibold">FPS (فریم در ثانیه)</label>
              <select
                value={localSettings.fps}
                onChange={(e) => handleChange('fps', parseInt(e.target.value))}
                className="select-custom w-full"
              >
                <option value="24">24 fps (سینمایی)</option>
                <option value="30">30 fps (استاندارد)</option>
                <option value="60">60 fps (روان)</option>
              </select>
            </div>
          </div>

          {/* ========== تنظیمات رنگ و نور ========== */}
          <div className="p-4 bg-white/5 rounded-xl space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-base">
              <span>🎨</span> رنگ و نور
            </h4>

            {/* روشنایی */}
            <div className="setting-group">
              <label className="flex justify-between text-xs mb-2">
                <span className="font-semibold">روشنایی</span>
                <span className="font-bold text-primary-500">
                  {localSettings.brightness}%
                </span>
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={localSettings.brightness}
                onChange={(e) => handleChange('brightness', parseInt(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* کنتراست */}
            <div className="setting-group">
              <label className="flex justify-between text-xs mb-2">
                <span className="font-semibold">کنتراست</span>
                <span className="font-bold text-primary-500">
                  {localSettings.contrast}%
                </span>
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={localSettings.contrast}
                onChange={(e) => handleChange('contrast', parseInt(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* اشباع رنگ */}
            <div className="setting-group">
              <label className="flex justify-between text-xs mb-2">
                <span className="font-semibold">اشباع رنگ</span>
                <span className="font-bold text-primary-500">
                  {localSettings.saturation}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={localSettings.saturation}
                onChange={(e) => handleChange('saturation', parseInt(e.target.value))}
                className="slider w-full"
              />
            </div>

            {/* رنگ‌آمیزی (Hue) */}
            <div className="setting-group">
              <label className="flex justify-between text-xs mb-2">
                <span className="font-semibold">رنگ‌آمیزی</span>
                <span className="font-bold text-primary-500">
                  {localSettings.hue}°
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={localSettings.hue}
                onChange={(e) => handleChange('hue', parseInt(e.target.value))}
                className="slider w-full"
              />
            </div>
          </div>

          {/* ========== تنظیمات متن ========== */}
          <div className="p-4 bg-white/5 rounded-xl space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-base">
              <span>📐</span> متن
            </h4>

            {/* موقعیت متن */}
            <div>
              <label className="text-xs mb-2 block font-semibold">موقعیت متن</label>
              <select
                value={localSettings.textPosition}
                onChange={(e) => handleChange('textPosition', e.target.value)}
                className="select-custom w-full"
              >
                <option value="top">بالا</option>
                <option value="center">وسط</option>
                <option value="bottom">پایین</option>
              </select>
            </div>

            {/* تراز متن */}
            <div>
              <label className="text-xs mb-2 block font-semibold">تراز متن</label>
              <select
                value={localSettings.textAlign}
                onChange={(e) => handleChange('textAlign', e.target.value)}
                className="select-custom w-full"
              >
                <option value="right">راست</option>
                <option value="center">وسط</option>
                <option value="left">چپ</option>
              </select>
            </div>

            {/* فونت */}
            <div>
              <label className="text-xs mb-2 block font-semibold">فونت</label>
              <select
                value={localSettings.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="select-custom w-full"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* رنگ متن */}
            <div>
              <label className="text-xs mb-2 block font-semibold">رنگ متن</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={localSettings.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  placeholder="#ffffff"
                />
              </div>
              {/* رنگ‌های پیش‌فرض */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleChange('textColor', color)}
                    className="w-8 h-8 rounded-lg border-2 border-white/20 hover:border-white/50 transition-all"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* سایه متن */}
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={localSettings.textShadow}
                onChange={(e) => handleChange('textShadow', e.target.checked)}
                className="sr-only peer"
              />
              <div className="toggle-switch"></div>
              <span className="text-sm">سایه متن</span>
            </label>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex gap-3 justify-between w-full">
          <button onClick={handleReset} className="btn btn-ghost">
            بازگشت به پیش‌فرض
          </button>
          <div className="flex gap-2">
            <button onClick={handleCancel} className="btn btn-ghost">
              لغو
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>ذخیره</span>
            </button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default SettingsModal;