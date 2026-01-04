// ============================================
// EffectsTab Component - تب افکت‌ها
// مسیر: src/components/editor/sidebar/EffectsTab.jsx
// ============================================

import React, { useState } from 'react';
import useEditorStore from '../../../store/useEditorStore';
import effectsData from '../../../data/effects.json';
import transitionsData from '../../../data/transitions.json';

const EffectsTab = () => {
  const { settings, updateSettings } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState('all');

  /**
   * تغییر تنظیمات
   */
  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  /**
   * تغییر افکت
   */
  const toggleEffect = (effectId) => {
    updateSettings({ [effectId]: !settings[effectId] });
  };

  /**
   * فیلتر افکت‌ها بر اساس دسته‌بندی
   */
  const filteredEffects = activeCategory === 'all'
    ? effectsData.effects
    : effectsData.effects.filter(effect => effect.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* هدر */}
      <div>
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <span>⚡</span> افکت‌ها و جلوه‌های بصری
        </h3>
        <p className="text-xs opacity-70 mt-1">
          افکت‌های سینمایی را فعال کنید
        </p>
      </div>

      {/* تنظیمات پایه */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        {/* سرعت پخش */}
        <div className="setting-group">
          <label className="flex justify-between text-xs mb-2">
            <span>سرعت پخش</span>
            <span className="font-bold text-primary-500">
              {settings.speed}×
            </span>
          </label>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={settings.speed}
            onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
            className="slider w-full"
          />
        </div>

        {/* مدت نمایش صحنه */}
        <div className="setting-group">
          <label className="flex justify-between text-xs mb-2">
            <span>مدت نمایش صحنه</span>
            <span className="font-bold text-primary-500">
              {settings.duration}s
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.5"
            value={settings.duration}
            onChange={(e) => handleSettingChange('duration', parseFloat(e.target.value))}
            className="slider w-full"
          />
        </div>

        {/* نوع انتقال */}
        <div className="setting-group">
          <label className="text-xs mb-2 block">نوع انتقال بین صحنه‌ها</label>
          <select
            value={settings.transition}
            onChange={(e) => handleSettingChange('transition', e.target.value)}
            className="select-custom w-full"
          >
            {transitionsData.transitions.map((transition) => (
              <option key={transition.id} value={transition.id}>
                {transition.icon} {transition.name}
              </option>
            ))}
          </select>
        </div>

        {/* اندازه فونت */}
        <div className="setting-group">
          <label className="flex justify-between text-xs mb-2">
            <span>اندازه فونت</span>
            <span className="font-bold text-primary-500">
              {settings.fontSize}px
            </span>
          </label>
          <input
            type="range"
            min="20"
            max="120"
            step="4"
            value={settings.fontSize}
            onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
            className="slider w-full"
          />
        </div>
      </div>

      {/* دسته‌بندی افکت‌ها */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          همه
        </button>
        {effectsData.categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* لیست افکت‌ها */}
      <div className="glass-card rounded-xl p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {filteredEffects.map((effect) => (
          <div
            key={effect.id}
            className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-primary-500/50 transition-all"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[effect.id] || false}
                onChange={() => toggleEffect(effect.id)}
                className="sr-only peer"
              />
              <div className="toggle-switch mt-0.5"></div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{effect.icon}</span>
                  <span className="text-sm font-semibold">{effect.name}</span>
                  <span className="text-xs opacity-50">{effect.nameEn}</span>
                </div>
                <p className="text-xs opacity-70">{effect.description}</p>
              </div>
            </label>

            {/* تنظیمات افکت (اگر فعال باشد) */}
            {settings[effect.id] && effect.settings && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                {Object.entries(effect.settings).map(([key, setting]) => (
                  <div key={key} className="setting-group">
                    <label className="flex justify-between text-xs mb-1">
                      <span>{setting.label}</span>
                      <span className="font-bold text-primary-500">
                        {settings[`${effect.id}_${key}`] || setting.default}
                        {setting.unit || ''}
                      </span>
                    </label>
                    {setting.type === 'range' && (
                      <input
                        type="range"
                        min={setting.min}
                        max={setting.max}
                        step={setting.step || 1}
                        value={settings[`${effect.id}_${key}`] || setting.default}
                        onChange={(e) =>
                          handleSettingChange(
                            `${effect.id}_${key}`,
                            parseFloat(e.target.value)
                          )
                        }
                        className="slider w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* پیش‌فرض‌ها */}
      <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
        <p className="text-xs font-semibold mb-2">⚙️ پیش‌فرض‌های سریع</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              updateSettings({
                typewriter: true,
                kenburns: true,
                vignette: true,
                glow: true,
              })
            }
            className="btn btn-ghost btn-sm"
          >
            سینمایی
          </button>
          <button
            onClick={() =>
              updateSettings({
                particles: true,
                glow: true,
                shake: false,
                glitch: false,
              })
            }
            className="btn btn-ghost btn-sm"
          >
            مینیمال
          </button>
          <button
            onClick={() =>
              updateSettings({
                shake: true,
                glitch: true,
                chromatic: true,
                grainy: true,
              })
            }
            className="btn btn-ghost btn-sm"
          >
            گلیچ
          </button>
          <button
            onClick={() =>
              updateSettings({
                typewriter: false,
                kenburns: false,
                particles: false,
                vignette: false,
                glow: false,
                grainy: false,
                shake: false,
                glitch: false,
                chromatic: false,
              })
            }
            className="btn btn-ghost btn-sm"
          >
            بدون افکت
          </button>
        </div>
      </div>
    </div>
  );
};

export default EffectsTab;