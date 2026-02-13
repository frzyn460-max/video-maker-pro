/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/EffectsTab.jsx
 */

import React from 'react';
import useEditorStore from '../../../store/useEditorStore';
import './EffectsTab.css';

const EffectsTab = () => {
  const settings = useEditorStore(state => state.settings);
  const updateSettings = useEditorStore(state => state.updateSettings);

  const handleToggleEffect = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="effects-tab">
      {/* تنظیمات پایه */}
      <div className="effects-section">
        <h3 className="section-header">⚙️ تنظیمات پایه</h3>
        
        <div className="setting-item">
          <label className="setting-label">
            <span>سرعت پخش</span>
            <span className="setting-value">{settings.speed}×</span>
          </label>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={settings.speed}
            onChange={(e) => updateSettings({ speed: parseFloat(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>مدت نمایش</span>
            <span className="setting-value">{settings.duration}s</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={settings.duration}
            onChange={(e) => updateSettings({ duration: parseFloat(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>ترانزیشن</span>
          </label>
          <select
            value={settings.transition}
            onChange={(e) => updateSettings({ transition: e.target.value })}
            className="custom-select"
          >
            <option value="fade">محو شدن (Fade)</option>
            <option value="slide">اسلاید (Slide)</option>
            <option value="zoom">زوم (Zoom)</option>
            <option value="flip">چرخش (Flip)</option>
          </select>
        </div>
      </div>

      {/* تنظیمات متن */}
      <div className="effects-section">
        <h3 className="section-header">📝 تنظیمات متن</h3>

        <div className="setting-item">
          <label className="setting-label">
            <span>اندازه فونت</span>
            <span className="setting-value">{settings.fontSize}px</span>
          </label>
          <input
            type="range"
            min="16"
            max="120"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>رنگ متن</span>
            <div className="color-preview" style={{ background: settings.textColor }}></div>
          </label>
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => updateSettings({ textColor: e.target.value })}
            className="color-picker"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>موقعیت متن</span>
          </label>
          <select
            value={settings.textPosition}
            onChange={(e) => updateSettings({ textPosition: e.target.value })}
            className="custom-select"
          >
            <option value="top">بالا</option>
            <option value="center">وسط</option>
            <option value="bottom">پایین</option>
          </select>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">سایه متن</span>
              <span className="toggle-desc">افزودن سایه به متن</span>
            </div>
            <div
              className={`toggle-switch ${settings.textShadow ? 'active' : ''}`}
              onClick={() => handleToggleEffect('textShadow')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>

      {/* افکت‌های متن */}
      <div className="effects-section">
        <h3 className="section-header">✨ افکت‌های متن</h3>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">تایپ‌رایتر</span>
              <span className="toggle-desc">نمایش متن به صورت تایپی</span>
            </div>
            <div
              className={`toggle-switch ${settings.typewriter ? 'active' : ''}`}
              onClick={() => handleToggleEffect('typewriter')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">درخشش متن</span>
              <span className="toggle-desc">افکت نورانی متن</span>
            </div>
            <div
              className={`toggle-switch ${settings.glow ? 'active' : ''}`}
              onClick={() => handleToggleEffect('glow')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>

      {/* افکت‌های تصویری */}
      <div className="effects-section">
        <h3 className="section-header">🎬 افکت‌های تصویری</h3>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">Ken Burns</span>
              <span className="toggle-desc">حرکت و زوم آرام تصویر</span>
            </div>
            <div
              className={`toggle-switch ${settings.kenburns ? 'active' : ''}`}
              onClick={() => handleToggleEffect('kenburns')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">ذرات</span>
              <span className="toggle-desc">ذرات شناور در پس‌زمینه</span>
            </div>
            <div
              className={`toggle-switch ${settings.particles ? 'active' : ''}`}
              onClick={() => handleToggleEffect('particles')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">ویگنت (تاریک کناره)</span>
              <span className="toggle-desc">تیره شدن گوشه‌ها</span>
            </div>
            <div
              className={`toggle-switch ${settings.vignette ? 'active' : ''}`}
              onClick={() => handleToggleEffect('vignette')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">دانه‌دار (Grainy)</span>
              <span className="toggle-desc">افکت فیلم قدیمی</span>
            </div>
            <div
              className={`toggle-switch ${settings.grainy ? 'active' : ''}`}
              onClick={() => handleToggleEffect('grainy')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>

      {/* افکت‌های پیشرفته */}
      <div className="effects-section">
        <h3 className="section-header">🔥 افکت‌های پیشرفته</h3>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">لرزش (Shake)</span>
              <span className="toggle-desc">لرزش خفیف صفحه</span>
            </div>
            <div
              className={`toggle-switch ${settings.shake ? 'active' : ''}`}
              onClick={() => handleToggleEffect('shake')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">Glitch (خرابی دیجیتال)</span>
              <span className="toggle-desc">افکت خرابی پیکسلی</span>
            </div>
            <div
              className={`toggle-switch ${settings.glitch ? 'active' : ''}`}
              onClick={() => handleToggleEffect('glitch')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>

        <div className="toggle-card">
          <label className="toggle-label">
            <div className="toggle-info">
              <span className="toggle-name">انحراف رنگ (Chromatic)</span>
              <span className="toggle-desc">جدایی رنگ‌های RGB</span>
            </div>
            <div
              className={`toggle-switch ${settings.chromatic ? 'active' : ''}`}
              onClick={() => handleToggleEffect('chromatic')}
            >
              <div className="toggle-thumb"></div>
            </div>
          </label>
        </div>
      </div>

      {/* فیلترهای رنگ */}
      <div className="effects-section">
        <h3 className="section-header">🎨 فیلترهای رنگ</h3>

        <div className="setting-item">
          <label className="setting-label">
            <span>روشنایی</span>
            <span className="setting-value">{settings.brightness}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.brightness}
            onChange={(e) => updateSettings({ brightness: parseInt(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>کنتراست</span>
            <span className="setting-value">{settings.contrast}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.contrast}
            onChange={(e) => updateSettings({ contrast: parseInt(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="setting-item">
          <label className="setting-label">
            <span>اشباع رنگ</span>
            <span className="setting-value">{settings.saturation}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.saturation}
            onChange={(e) => updateSettings({ saturation: parseInt(e.target.value) })}
            className="slider"
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsTab;