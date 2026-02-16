/*
 * مسیر: /video-maker-pro/src/components/editor/sidebar/TextTab.jsx
 * ✨ نسخه پیشرفته - قابلیت‌های جدید: Drag&Drop، Multi-Select، Search، Smart Split
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import './TextTab.css';

/* ─────────────────────────── helpers ─────────────────────────── */

const SMART_DELIMITERS = [/\n\n+/, /\n(?=[^\n])/];

function splitLyrics(text, mode = 'paragraph') {
  const verses =
    mode === 'paragraph'
      ? text.split(/\n\n+/).filter(v => v.trim())
      : text.split(/\n/).filter(v => v.trim());
  return verses;
}

/* ─────────────────────────── SceneCard ─────────────────────────── */

const SceneCard = React.memo(({ scene, index, isActive, isSelected, onSelect, onActivate, onUpdate, onDelete, onDuplicate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Reorder.Item
      value={scene}
      id={scene.id}
      className={`scene-card ${isActive ? 'scene-active' : ''} ${isSelected ? 'scene-selected' : ''}`}
      whileDrag={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', zIndex: 50 }}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey) {
          onSelect(scene.id, true);
        } else {
          onActivate(index);
        }
      }}
    >
      {/* شماره + handle */}
      <div className="sc-header">
        <div className="sc-drag-handle" title="بکش بنداز">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/>
            <circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/>
          </svg>
        </div>

        <div className={`sc-number ${isActive ? 'sc-number-active' : ''}`}>{index + 1}</div>

        <input
          className="sc-title"
          value={scene.title || ''}
          onChange={e => onUpdate(scene.id, { title: e.target.value })}
          onClick={e => e.stopPropagation()}
          placeholder={`صحنه ${index + 1}`}
        />

        <div className="sc-actions">
          <button className="sc-btn" onClick={e => { e.stopPropagation(); onDuplicate(scene.id); }} title="کپی">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
          <button className="sc-btn sc-btn-del" onClick={e => { e.stopPropagation(); onDelete(scene.id); }} title="حذف">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <button className="sc-btn" onClick={e => { e.stopPropagation(); setIsExpanded(x => !x); }} title="ویرایش">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* پیش‌نمایش / textarea */}
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <textarea
              className="sc-textarea"
              value={scene.content || ''}
              onChange={e => onUpdate(scene.id, { content: e.target.value })}
              onClick={e => e.stopPropagation()}
              placeholder="متن صحنه..."
              rows={4}
            />
            <div className="sc-footer">
              <label className="sc-dur-label">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {scene.duration || 5}s
              </label>
              <input
                type="range" min="1" max="30" step="0.5"
                value={scene.duration || 5}
                onChange={e => onUpdate(scene.id, { duration: parseFloat(e.target.value) })}
                className="sc-dur-slider"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="preview"
            className="sc-preview"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {scene.content ? scene.content.slice(0, 80) + (scene.content.length > 80 ? '…' : '') : <span className="sc-empty-hint">بدون متن</span>}
          </motion.p>
        )}
      </AnimatePresence>

      {/* نوار مدت‌زمان */}
      <div className="sc-dur-bar">
        <div className="sc-dur-fill" style={{ width: `${Math.min(((scene.duration || 5) / 30) * 100, 100)}%` }} />
      </div>

      {/* نشانگر صحنه فعال */}
      {isActive && <div className="sc-active-dot" />}
    </Reorder.Item>
  );
});

/* ─────────────────────────── TextTab ─────────────────────────── */

const TextTab = () => {
  const scenes = useEditorStore(s => s.scenes);
  const currentSceneIndex = useEditorStore(s => s.currentSceneIndex);
  const addScene = useEditorStore(s => s.addScene);
  const updateScene = useEditorStore(s => s.updateScene);
  const deleteScene = useEditorStore(s => s.deleteScene);
  const duplicateScene = useEditorStore(s => s.duplicateScene);
  const setScenes = useEditorStore(s => s.setScenes);
  const setCurrentSceneIndex = useEditorStore(s => s.setCurrentSceneIndex);
  const deleteSelectedScenes = useEditorStore(s => s.deleteSelectedScenes);
  const selectedSceneIds = useEditorStore(s => s.selectedSceneIds);
  const selectScene = useEditorStore(s => s.selectScene);
  const clearSelection = useEditorStore(s => s.clearSelection);
  const copyScene = useEditorStore(s => s.copyScene);
  const pasteScene = useEditorStore(s => s.pasteScene);
  const clipboard = useEditorStore(s => s.clipboard);
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);
  const canUndo = useEditorStore(s => s.canUndo);
  const canRedo = useEditorStore(s => s.canRedo);

  const [mode, setMode] = useState('scenes'); // scenes | import
  const [lyrics, setLyrics] = useState('');
  const [splitMode, setSplitMode] = useState('paragraph'); // paragraph | line
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const fileInputRef = useRef(null);

  /* ───── محاسبه‌ها ───── */
  const filteredScenes = search
    ? scenes.filter(s =>
        s.title?.includes(search) ||
        s.content?.includes(search)
      )
    : scenes;

  const totalDuration = scenes.reduce((a, s) => a + (s.duration || 5), 0);
  const totalChars = scenes.reduce((a, s) => a + (s.content?.length || 0), 0);

  /* ───── آپلود فایل متنی ───── */
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setLyrics(ev.target.result);
      setMode('import');
    };
    reader.readAsText(file, 'UTF-8');
  };

  /* ───── پیش‌نمایش import ───── */
  useEffect(() => {
    if (!lyrics.trim()) { setImportPreview([]); setShowImportPreview(false); return; }
    const parts = splitLyrics(lyrics, splitMode);
    setImportPreview(parts);
    setShowImportPreview(true);
    setCharCount(lyrics.length);
  }, [lyrics, splitMode]);

  /* ───── تبدیل به صحنه ───── */
  const handleConvert = useCallback(() => {
    if (!lyrics.trim()) return;
    const parts = splitLyrics(lyrics, splitMode);
    parts.forEach((verse, i) => {
      addScene({ title: `صحنه ${scenes.length + i + 1}`, content: verse.trim(), duration: 5 });
    });
    setLyrics('');
    setShowImportPreview(false);
    setMode('scenes');
  }, [lyrics, splitMode, scenes.length, addScene]);

  /* ───── Reorder ───── */
  const handleReorder = (newScenes) => {
    setScenes(newScenes.map((s, i) => ({ ...s, order: i })));
  };

  /* ───── حذف انتخاب‌شده‌ها ───── */
  const handleDeleteSelected = () => {
    if (selectedSceneIds.length === 0) return;
    deleteSelectedScenes();
  };

  /* ───── کپی انتخاب‌شده ───── */
  const handleCopySelected = () => {
    if (selectedSceneIds.length === 1) {
      copyScene(selectedSceneIds[0]);
    }
  };

  /* ───── shortcut keys ───── */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedSceneIds.length === 1) { e.preventDefault(); handleCopySelected(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) { e.preventDefault(); pasteScene(); }
      if (e.key === 'Escape') clearSelection();
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') { e.preventDefault(); scenes.forEach(s => selectScene(s.id, true)); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedSceneIds, clipboard, scenes, selectScene, clearSelection, copyScene, pasteScene]);

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */

  return (
    <div className="text-tab">

      {/* ──── Header ──── */}
      <div className="tt-header">
        <div className="tt-title-row">
          <h3 className="tab-title">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            صحنه‌ها
          </h3>
          <div className="tt-mode-btns">
            <button className={`tt-mode-btn ${mode === 'scenes' ? 'active' : ''}`} onClick={() => setMode('scenes')} title="لیست صحنه‌ها">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button className={`tt-mode-btn ${mode === 'import' ? 'active' : ''}`} onClick={() => setMode('import')} title="وارد کردن متن">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </button>
          </div>
        </div>

        {/* آمار */}
        <div className="tt-stats">
          <span className="tt-stat"><strong>{scenes.length}</strong> صحنه</span>
          <span className="tt-stat-sep">·</span>
          <span className="tt-stat"><strong>{Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2,'0')}</strong> مدت</span>
          <span className="tt-stat-sep">·</span>
          <span className="tt-stat"><strong>{totalChars}</strong> کاراکتر</span>
        </div>

        {/* Undo/Redo */}
        <div className="tt-history">
          <button className="tt-hist-btn" onClick={undo} disabled={!canUndo} title="Ctrl+Z">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
            واگرد
          </button>
          <button className="tt-hist-btn" onClick={redo} disabled={!canRedo} title="Ctrl+Y">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>
            تکرار
          </button>
        </div>
      </div>

      {/* ──── حالت وارد کردن متن ──── */}
      <AnimatePresence mode="wait">
        {mode === 'import' && (
          <motion.div key="import" className="tt-import" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="tt-import-toolbar">
              <label className="tt-upload-btn" title="بارگذاری از فایل">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                بارگذاری فایل
                <input ref={fileInputRef} type="file" accept=".txt,.lrc,.srt" onChange={handleFileImport} style={{ display: 'none' }} />
              </label>

              <div className="tt-split-toggle">
                <button className={`tt-split-btn ${splitMode === 'paragraph' ? 'active' : ''}`} onClick={() => setSplitMode('paragraph')}>
                  بند به بند
                </button>
                <button className={`tt-split-btn ${splitMode === 'line' ? 'active' : ''}`} onClick={() => setSplitMode('line')}>
                  خط به خط
                </button>
              </div>
            </div>

            <div className="tt-import-hint">💡 هر بند را با یک خط خالی جدا کنید</div>

            <textarea
              className="tt-lyrics"
              value={lyrics}
              onChange={e => setLyrics(e.target.value)}
              placeholder={`مثال:\n\nبند اول آهنگ\nخط اول\nخط دوم\n\nبند دوم آهنگ\nخط اول\nخط دوم`}
              rows={8}
            />
            <div className="tt-char-count">{charCount} کاراکتر · {importPreview.length} صحنه</div>

            {/* پیش‌نمایش */}
            <AnimatePresence>
              {showImportPreview && importPreview.length > 0 && (
                <motion.div className="tt-preview-box" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <p className="tt-preview-label">پیش‌نمایش ({importPreview.length} صحنه):</p>
                  <div className="tt-preview-list">
                    {importPreview.slice(0, 5).map((p, i) => (
                      <div key={i} className="tt-preview-item">
                        <span className="tt-preview-num">{i + 1}</span>
                        <span className="tt-preview-text">{p.slice(0, 60)}{p.length > 60 ? '…' : ''}</span>
                      </div>
                    ))}
                    {importPreview.length > 5 && (
                      <div className="tt-preview-more">+ {importPreview.length - 5} صحنه دیگر</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="tt-import-actions">
              <button className="tt-btn-convert" onClick={handleConvert} disabled={!lyrics.trim()}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4"/></svg>
                افزودن {importPreview.length > 0 ? `(${importPreview.length})` : ''} صحنه
              </button>
              <button className="tt-btn-clear" onClick={() => { setLyrics(''); setImportPreview([]); }} disabled={!lyrics.trim()}>
                پاک کردن
              </button>
            </div>
          </motion.div>
        )}

        {/* ──── حالت لیست صحنه‌ها ──── */}
        {mode === 'scenes' && (
          <motion.div key="scenes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

            {/* جستجو */}
            <div className={`tt-search ${searchFocused ? 'focused' : ''}`}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                className="tt-search-input"
                placeholder="جستجو در صحنه‌ها..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {search && (
                <button className="tt-search-clear" onClick={() => setSearch('')}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>

            {/* نوار ابزار انتخاب */}
            <AnimatePresence>
              {selectedSceneIds.length > 0 && (
                <motion.div className="tt-selection-bar" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <span className="tt-sel-count">{selectedSceneIds.length} انتخاب شده</span>
                  <div className="tt-sel-actions">
                    {selectedSceneIds.length === 1 && (
                      <button className="tt-sel-btn" onClick={handleCopySelected} title="کپی">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      </button>
                    )}
                    <button className="tt-sel-btn tt-sel-del" onClick={handleDeleteSelected} title="حذف انتخاب‌شده‌ها">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      حذف
                    </button>
                    <button className="tt-sel-btn" onClick={clearSelection}>لغو</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Paste hint */}
            <AnimatePresence>
              {clipboard && (
                <motion.button className="tt-paste-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={pasteScene}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  چسباندن «{clipboard.title}» (Ctrl+V)
                </motion.button>
              )}
            </AnimatePresence>

            {/* دکمه اضافه کردن */}
            <button className="tt-add-btn" onClick={() => addScene({ title: `صحنه ${scenes.length + 1}`, content: '', duration: 5 })}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4"/></svg>
              افزودن صحنه
            </button>

            {/* لیست صحنه‌ها */}
            {filteredScenes.length === 0 ? (
              <div className="tt-empty">
                {search ? (
                  <>
                    <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" opacity=".3">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p>نتیجه‌ای برای «{search}» یافت نشد</p>
                    <button className="tt-empty-btn" onClick={() => setSearch('')}>پاک کردن جستجو</button>
                  </>
                ) : (
                  <>
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" opacity=".25">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p>هیچ صحنه‌ای وجود ندارد</p>
                    <button className="tt-empty-btn" onClick={() => setMode('import')}>وارد کردن متن</button>
                  </>
                )}
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={search ? filteredScenes : scenes}
                onReorder={search ? () => {} : handleReorder}
                className="tt-scenes-list"
                layoutScroll
              >
                <AnimatePresence>
                  {filteredScenes.map((scene, index) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      index={scenes.indexOf(scene)}
                      isActive={currentSceneIndex === scenes.indexOf(scene)}
                      isSelected={selectedSceneIds.includes(scene.id)}
                      onSelect={selectScene}
                      onActivate={setCurrentSceneIndex}
                      onUpdate={updateScene}
                      onDelete={deleteScene}
                      onDuplicate={duplicateScene}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextTab;