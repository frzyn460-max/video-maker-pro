/* 
 * مسیر: /video-maker-pro/src/components/editor/sidebar/EffectsTab.jsx
 * ✨ نسخه پیشرفته - افکت‌های جدید + پیش‌نمایش زنده
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import './EffectsTab.css';

/* ─── helpers ─── */
const Toggle = ({ value, onChange, name, desc }) => (
  <div className="toggle-card">
    <label className="toggle-label">
      <div className="toggle-info">
        <span className="toggle-name">{name}</span>
        {desc && <span className="toggle-desc">{desc}</span>}
      </div>
      <div
        className={`toggle-switch ${value ? 'active' : ''}`}
        onClick={onChange}
        role="switch"
        aria-checked={value}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && onChange()}
      >
        <div className="toggle-thumb" />
      </div>
    </label>
  </div>
);

const Slider = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="setting-item">
    <label className="setting-label">
      <span>{label}</span>
      <span className="setting-value">{value}{unit}</span>
    </label>
    <input
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={e => onChange(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
      className="slider"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div className="setting-item">
    <label className="setting-label"><span>{label}</span></label>
    <select value={value} onChange={e => onChange(e.target.value)} className="custom-select">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

/* ─── Section wrapper ─── */
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fx-section">
      <button className="fx-section-header" onClick={() => setOpen(x => !x)}>
        <span>{title}</span>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="fx-section-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Text Preview ─── */
const TextPreview = ({ settings }) => {
  const style = {
    fontSize: '18px',
    color: settings.textColor || '#ffffff',
    fontWeight: 900,
    textShadow: settings.textShadow
      ? settings.glow
        ? '0 0 12px rgba(255,255,255,0.8), 0 0 24px var(--primary)'
        : '0 2px 8px rgba(0,0,0,0.8)'
      : 'none',
  };

  return (
    <div className="fx-preview">
      <div
        className={[
          'fx-preview-text',
          settings.glitch ? 'glitch-effect' : '',
          settings.neon ? 'neon-effect' : '',
          settings.outline ? 'outline-effect' : '',
        ].join(' ')}
        style={style}
        data-text="متن نمونه"
      >
        متن نمونه
      </div>
      <div className="fx-preview-label">پیش‌نمایش</div>
    </div>
  );
};

/* ─── GRADIENT PRESETS ─── */
const GRADIENTS = [
  { label: 'شب', value: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { label: 'غروب', value: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { label: 'اقیانوس', value: 'linear-gradient(135deg, #0099f7, #f11712)' },
  { label: 'جنگل', value: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { label: 'آتش', value: 'linear-gradient(135deg, #f83600, #f9d423)' },
  { label: 'سحر', value: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
  { label: 'سرد', value: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' },
  { label: 'تاریک', value: 'linear-gradient(135deg, #000000, #434343)' },
];

/* ═══════════════════════════════════════
   EffectsTab
   ═══════════════════════════════════════ */
const EffectsTab = () => {
  const settings       = useEditorStore(s => s.settings);
  const updateSettings = useEditorStore(s => s.updateSettings);

  const set = (key, val) => updateSettings({ [key]: val });
  const tog = (key) => updateSettings({ [key]: !settings[key] });

  return (
    <div className="effects-tab">

      {/* ── پیش‌نمایش زنده ── */}
      <TextPreview settings={settings} />

      {/* ════════ پایه ════════ */}
      <Section title="⚙️ تنظیمات پایه">
        <Slider label="سرعت پخش" value={settings.speed || 1} min={0.25} max={3} step={0.25} unit="×" onChange={v => set('speed', v)} />
        <Slider label="مدت نمایش پیش‌فرض" value={settings.duration || 5} min={1} max={30} step={0.5} unit="s" onChange={v => set('duration', v)} />

        <SelectField
          label="ترانزیشن"
          value={settings.transition || 'fade'}
          options={[
            { value: 'fade',    label: '🌫️ محو (Fade)' },
            { value: 'slide',   label: '➡️ اسلاید' },
            { value: 'zoom',    label: '🔍 زوم' },
            { value: 'flip',    label: '🔄 چرخش' },
            { value: 'blur',    label: '💨 تار' },
            { value: 'rise',    label: '⬆️ بالا آمدن' },
            { value: 'glitch2', label: '⚡ گلیچ' },
            { value: 'reveal',  label: '📜 آشکار' },
          ]}
          onChange={v => set('transition', v)}
        />

        <SelectField
          label="نسبت تصویر"
          value={settings.aspectRatio || '16:9'}
          options={[
            { value: '16:9', label: '16:9 (یوتیوب)' },
            { value: '9:16', label: '9:16 (استوری)' },
            { value: '1:1',  label: '1:1 (پست)' },
            { value: '4:3',  label: '4:3 (کلاسیک)' },
            { value: '21:9', label: '21:9 (سینمایی)' },
          ]}
          onChange={v => set('aspectRatio', v)}
        />
      </Section>

      {/* ════════ متن ════════ */}
      <Section title="📝 تنظیمات متن">
        <Slider label="اندازه فونت" value={settings.fontSize || 48} min={16} max={120} unit="px" onChange={v => set('fontSize', v)} />

        <div className="setting-item">
          <label className="setting-label">
            <span>رنگ متن</span>
            <div className="color-preview" style={{ background: settings.textColor || '#ffffff' }} />
          </label>
          <input type="color" value={settings.textColor || '#ffffff'} onChange={e => set('textColor', e.target.value)} className="color-picker" />
        </div>

        <SelectField
          label="موقعیت متن"
          value={settings.textPosition || 'center'}
          options={[
            { value: 'top',    label: '⬆️ بالا' },
            { value: 'center', label: '⬛ وسط' },
            { value: 'bottom', label: '⬇️ پایین' },
          ]}
          onChange={v => set('textPosition', v)}
        />

        <SelectField
          label="فونت"
          value={settings.fontFamily || 'inherit'}
          options={[
            { value: 'inherit',      label: '🔤 پیش‌فرض' },
            { value: "'Vazirmatn', sans-serif", label: 'وزیرمتن' },
            { value: 'serif',        label: 'سریف' },
            { value: 'monospace',    label: 'تک‌عرض' },
            { value: "'Georgia', serif", label: 'جورجیا' },
          ]}
          onChange={v => set('fontFamily', v)}
        />

        <Slider label="فاصله حروف" value={settings.letterSpacing || 0} min={-0.1} max={0.5} step={0.01} unit="em" onChange={v => set('letterSpacing', v)} />
        <Slider label="فاصله خطوط" value={settings.lineHeight || 1.3} min={1} max={2.5} step={0.05} unit="" onChange={v => set('lineHeight', v)} />

        <Toggle value={settings.textShadow}   onChange={() => tog('textShadow')}   name="سایه متن"     desc="سایه زیر متن" />
        <Toggle value={settings.letterbox !== false}  onChange={() => set('letterbox', !(settings.letterbox !== false))}  name="نوار سینمایی"  desc="نوار مشکی بالا و پایین" />
      </Section>

      {/* ════════ افکت‌های متن ════════ */}
      <Section title="✨ افکت‌های متن">
        <Toggle value={settings.typewriter} onChange={() => tog('typewriter')} name="⌨️ تایپ‌رایتر" desc="نمایش متن حرف به حرف" />
        <Toggle value={settings.glow}       onChange={() => tog('glow')}       name="💫 درخشش"      desc="هاله نورانی دور متن" />
        <Toggle value={settings.neon}       onChange={() => tog('neon')}       name="🌟 نئون"        desc="افکت نئون کلاسیک" />
        <Toggle value={settings.outline}    onChange={() => tog('outline')}    name="📋 توخالی"     desc="فقط خطوط متن" />
        <Toggle value={settings.chromatic}  onChange={() => tog('chromatic')}  name="🌈 انحراف رنگ" desc="جدایی RGB" />
        <Toggle value={settings.glitch}     onChange={() => tog('glitch')}     name="⚡ گلیچ"        desc="افکت خرابی دیجیتال" />
      </Section>

      {/* ════════ افکت‌های تصویر ════════ */}
      <Section title="🎬 افکت‌های تصویر">
        <Toggle value={settings.kenburns}   onChange={() => tog('kenburns')}   name="🎥 Ken Burns"  desc="زوم و حرکت آرام" />
        <Toggle value={settings.vignette}   onChange={() => tog('vignette')}   name="🎭 ویگنت"      desc="تاریک شدن کناره‌ها" />
        {settings.vignette && (
          <Slider label="شدت ویگنت" value={settings.vignetteStrength || 70} min={10} max={100} unit="%" onChange={v => set('vignetteStrength', v)} />
        )}
        <Toggle value={settings.grainy}     onChange={() => tog('grainy')}     name="📹 دانه‌دار"   desc="فیلم کلاسیک" />
        <Toggle value={settings.scanlines}  onChange={() => tog('scanlines')}  name="📺 خطوط اسکن"  desc="مانیتور قدیمی" />
        <Toggle value={settings.shake}      onChange={() => tog('shake')}      name="📳 لرزش"       desc="لرزش صفحه" />
        <Toggle value={settings.colorOverlay} onChange={() => tog('colorOverlay')} name="🎨 روکش رنگی" desc="لایه رنگی شفاف" />
        {settings.colorOverlay && (
          <div className="setting-item">
            <label className="setting-label">
              <span>رنگ روکش</span>
              <div className="color-preview" style={{ background: settings.colorOverlayColor || 'rgba(0,0,0,0.3)' }} />
            </label>
            <input type="color" value={settings.colorOverlayColor?.replace(/rgba\(.+\)/, '#000000') || '#000000'}
              onChange={e => set('colorOverlayColor', e.target.value + '55')}
              className="color-picker" />
          </div>
        )}
      </Section>

      {/* ════════ ذرات ════════ */}
      <Section title="✨ سیستم ذرات" defaultOpen={false}>
        <Toggle value={settings.particles} onChange={() => tog('particles')} name="ذرات فعال" desc="ذرات شناور در پس‌زمینه" />
        {settings.particles && (
          <SelectField
            label="سبک ذرات"
            value={settings.particleStyle || 'default'}
            options={[
              { value: 'default', label: '⭐ پیش‌فرض' },
              { value: 'snow',    label: '❄️ برف' },
              { value: 'fire',    label: '🔥 آتش' },
            ]}
            onChange={v => set('particleStyle', v)}
          />
        )}
      </Section>

      {/* ════════ پس‌زمینه گرادیانت ════════ */}
      <Section title="🌈 پس‌زمینه گرادیانت" defaultOpen={false}>
        <p className="fx-hint">اگر تصویر/ویدیو ندارید از این استفاده کنید</p>
        <div className="fx-gradient-grid">
          {GRADIENTS.map(g => (
            <button
              key={g.value}
              className={`fx-gradient-btn ${settings.gradientBg === g.value ? 'active' : ''}`}
              style={{ background: g.value }}
              onClick={() => set('gradientBg', settings.gradientBg === g.value ? '' : g.value)}
              title={g.label}
            >
              <span className="fx-grad-label">{g.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ════════ فیلترهای رنگ ════════ */}
      <Section title="🎨 فیلترهای رنگ" defaultOpen={false}>
        <Slider label="روشنایی"  value={settings.brightness || 100} min={0}  max={200} unit="%" onChange={v => set('brightness', v)} />
        <Slider label="کنتراست"  value={settings.contrast || 100}   min={0}  max={200} unit="%" onChange={v => set('contrast', v)} />
        <Slider label="اشباع"    value={settings.saturation || 100} min={0}  max={200} unit="%" onChange={v => set('saturation', v)} />
        <Toggle value={settings.sepia}      onChange={() => tog('sepia')}      name="🟤 سپیا"       desc="رنگ کلاسیک قهوه‌ای" />
        {settings.sepia && (
          <Slider label="مقدار سپیا" value={settings.sepiaAmount || 50} min={0} max={100} unit="%" onChange={v => set('sepiaAmount', v)} />
        )}
        <Toggle value={settings.hueRotate} onChange={() => tog('hueRotate')} name="🎡 چرخش رنگ"  desc="تغییر همه رنگ‌ها" />
        {settings.hueRotate && (
          <Slider label="زاویه چرخش" value={settings.hueRotateAngle || 0} min={0} max={360} unit="°" onChange={v => set('hueRotateAngle', v)} />
        )}
      </Section>

    </div>
  );
};

export default EffectsTab;