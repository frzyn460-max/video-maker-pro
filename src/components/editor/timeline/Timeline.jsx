/* 
 * مسیر: /video-maker-pro/src/components/editor/timeline/Timeline.jsx
 * ✨ نسخه پیشرفته - کنترل بهتر، نوار زمان واقعی، Waveform، Multi-Select
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import './Timeline.css';

const Timeline = () => {
  const scenes            = useEditorStore(s => s.scenes);
  const currentSceneIndex = useEditorStore(s => s.currentSceneIndex);
  const isPlaying         = useEditorStore(s => s.isPlaying);
  const settings          = useEditorStore(s => s.settings);
  const setScenes         = useEditorStore(s => s.setScenes);
  const addScene          = useEditorStore(s => s.addScene);
  const setCurrentSceneIndex = useEditorStore(s => s.setCurrentSceneIndex);
  const deleteScene       = useEditorStore(s => s.deleteScene);
  const duplicateScene    = useEditorStore(s => s.duplicateScene);
  const updateScene       = useEditorStore(s => s.updateScene);
  const undo              = useEditorStore(s => s.undo);
  const redo              = useEditorStore(s => s.redo);
  const canUndo           = useEditorStore(s => s.canUndo);
  const canRedo           = useEditorStore(s => s.canRedo);

  const showSuccess = useUIStore(s => s.showSuccess);
  const showError   = useUIStore(s => s.showError);

  const [selected, setSelected] = useState(new Set());
  const [zoom, setZoom]         = useState(1);           // 0.5 – 2
  const [showDurEdit, setShowDurEdit] = useState(null);  // scene.id که داره edit میشه
  const trackRef   = useRef(null);
  const scaleRef   = useRef(null);

  /* ─── مدت کل ─── */
  const totalDuration = scenes.reduce((a, s) => a + (s.duration || 5), 0);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  /* ─── موقعیت playhead ─── */
  const getPlayheadOffset = () => {
    const beforeDur = scenes.slice(0, currentSceneIndex).reduce((a,s) => a + (s.duration || 5), 0);
    const totalW = scenes.reduce((a,s) => a + (s.duration || 5), 0);
    return totalW > 0 ? (beforeDur / totalW) * 100 : 0;
  };

  /* ─── عرض هر کارت بر اساس مدت + zoom ─── */
  const sceneWidth = (scene) => Math.max(90, (scene.duration || 5) * 20 * zoom);

  /* ─── Reorder ─── */
  const handleReorder = useCallback((newScenes) => {
    setScenes(newScenes.map((s, i) => ({ ...s, order: i })));
  }, [setScenes]);

  /* ─── حذف ─── */
  const handleDelete = (id) => {
    if (scenes.length <= 1) { showError('حداقل یک صحنه لازم است'); return; }
    deleteScene(id);
    showSuccess('صحنه حذف شد');
  };

  /* ─── حذف انتخاب‌شده‌ها ─── */
  const handleDeleteSelected = () => {
    if (selected.size === 0) return;
    if (scenes.length - selected.size < 1) { showError('حداقل یک صحنه باید بماند'); return; }
    selected.forEach(id => deleteScene(id));
    setSelected(new Set());
    showSuccess(`${selected.size} صحنه حذف شد`);
  };

  /* ─── انتخاب ─── */
  const toggleSelect = (id, e) => {
    if (!(e.ctrlKey || e.metaKey || e.shiftKey)) return;
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ─── Keyboard shortcuts ─── */
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey||e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
      if ((e.ctrlKey||e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
      if (e.key === 'Delete' && selected.size > 0) { e.preventDefault(); handleDeleteSelected(); }
      if (e.key === 'Escape') setSelected(new Set());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, undo, redo]);

  /* ─── sync scroll نوار مقیاس با track ─── */
  useEffect(() => {
    const track = trackRef.current;
    const scale = scaleRef.current;
    if (!track || !scale) return;
    const onScroll = () => { scale.scrollLeft = track.scrollLeft; };
    track.addEventListener('scroll', onScroll);
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── ساعت زمانی ─── */
  const buildTimecodes = () => {
    const codes = [];
    let t = 0;
    scenes.forEach((s, i) => {
      codes.push({ label: formatTime(t), index: i });
      t += s.duration || 5;
    });
    return codes;
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div className="timeline">

      {/* ── Header ── */}
      <div className="timeline-header">
        <div className="timeline-info">
          <span className="timeline-title">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            خط زمان
          </span>
          <span className="timeline-duration">{formatTime(totalDuration)} · {scenes.length} صحنه</span>
        </div>

        <div className="tl-toolbar">
          {/* Undo/Redo */}
          <button className="tl-tool-btn" onClick={undo} disabled={!canUndo} title="Ctrl+Z">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
          </button>
          <button className="tl-tool-btn" onClick={redo} disabled={!canRedo} title="Ctrl+Y">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg>
          </button>

          <div className="tl-divider" />

          {/* Zoom */}
          <button className="tl-tool-btn" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="کوچکتر" disabled={zoom <= 0.5}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 20l-5.05-5.05M15 10a5 5 0 11-10 0 5 5 0 0110 0zM8 10h4"/></svg>
          </button>
          <span className="tl-zoom-label">{Math.round(zoom * 100)}%</span>
          <button className="tl-tool-btn" onClick={() => setZoom(z => Math.min(2, z + 0.25))} title="بزرگتر" disabled={zoom >= 2}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 20l-5.05-5.05M15 10a5 5 0 11-10 0 5 5 0 0110 0zM10 7v6M7 10h6"/></svg>
          </button>

          <div className="tl-divider" />

          {/* انتخاب */}
          {selected.size > 0 && (
            <button className="tl-tool-btn tl-del-btn" onClick={handleDeleteSelected} title={`حذف ${selected.size} صحنه`}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              {selected.size}
            </button>
          )}

          {/* افزودن */}
          <button className="tl-add-btn" onClick={() => { addScene({ title: `صحنه ${scenes.length + 1}`, content: '', duration: 5 }); showSuccess('صحنه جدید اضافه شد'); }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4"/></svg>
            صحنه جدید
          </button>
        </div>
      </div>

      {/* ── Track ── */}
      <div className="timeline-track" ref={trackRef}>
        {scenes.length === 0 ? (
          <div className="tl-empty">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" opacity=".3">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>هیچ صحنه‌ای وجود ندارد</span>
          </div>
        ) : (
          <Reorder.Group
            axis="x"
            values={scenes}
            onReorder={handleReorder}
            className="scenes-container"
          >
            {scenes.map((scene, index) => {
              const isActive   = currentSceneIndex === index;
              const isSelected = selected.has(scene.id);
              const width      = sceneWidth(scene);

              return (
                <Reorder.Item
                  key={scene.id}
                  value={scene}
                  className={`scene-item ${isActive ? 'active' : ''} ${isSelected ? 'tl-selected' : ''}`}
                  style={{ width, minWidth: width }}
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                      toggleSelect(scene.id, e);
                    } else {
                      setCurrentSceneIndex(index);
                      setSelected(new Set());
                    }
                  }}
                  whileDrag={{ scale: 1.04, zIndex: 20, boxShadow: '0 10px 32px rgba(0,0,0,0.3)' }}
                >
                  {/* Header */}
                  <div className="scene-header">
                    <div className="scene-number">{index + 1}</div>
                    <div className="scene-drag-handle">
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 8h16M4 16h16"/></svg>
                    </div>
                    {isSelected && (
                      <div className="tl-check">
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                  </div>

                  {/* محتوا */}
                  <div className="scene-preview">
                    <div className="scene-preview-title">{scene.title}</div>
                    <div className="scene-preview-content">
                      {scene.content?.substring(0, 40)}{scene.content?.length > 40 ? '…' : ''}
                    </div>
                  </div>

                  {/* مدت زمان - کلیک‌پذیر */}
                  <div
                    className="scene-duration tl-dur-editable"
                    onClick={e => { e.stopPropagation(); setShowDurEdit(showDurEdit === scene.id ? null : scene.id); }}
                    title="کلیک برای تغییر مدت"
                  >
                    ⏱ {scene.duration || 5}s
                  </div>

                  {/* ویرایش مدت inline */}
                  <AnimatePresence>
                    {showDurEdit === scene.id && (
                      <motion.div
                        className="tl-dur-popup"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type="range" min="1" max="30" step="0.5"
                          value={scene.duration || 5}
                          onChange={e => updateScene(scene.id, { duration: parseFloat(e.target.value) })}
                          className="tl-dur-slider"
                        />
                        <span className="tl-dur-val">{scene.duration || 5}s</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="scene-actions">
                    <button
                      className="scene-action-btn"
                      onClick={e => { e.stopPropagation(); duplicateScene(scene.id); showSuccess('صحنه کپی شد'); }}
                      title="کپی"
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                    <button
                      className="scene-action-btn delete"
                      onClick={e => { e.stopPropagation(); handleDelete(scene.id); }}
                      title="حذف"
                      disabled={scenes.length === 1}
                    >
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div className="scene-active-indicator" layoutId="activeIndicator" />
                  )}
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}

        {/* Playhead */}
        {scenes.length > 0 && (
          <div
            className="timeline-playhead"
            style={{ left: `${getPlayheadOffset()}%` }}
          >
            <div className="playhead-line" />
            <div className="playhead-handle" />
          </div>
        )}
      </div>

      {/* ── نوار مقیاس زمان ── */}
      <div className="timeline-scale" ref={scaleRef}>
        {scenes.map((scene, index) => {
          const beforeDur = scenes.slice(0, index).reduce((a,s) => a + (s.duration || 5), 0);
          return (
            <div
              key={scene.id}
              className="scale-mark"
              style={{ width: sceneWidth(scene), minWidth: sceneWidth(scene) }}
            >
              <div className="scale-line" />
              <div className="scale-label">{formatTime(beforeDur)}</div>
            </div>
          );
        })}
      </div>

      {/* نوار پیشرفت کلی */}
      <div className="tl-progress">
        <motion.div
          className="tl-progress-fill"
          style={{ width: `${scenes.length > 0 ? ((currentSceneIndex + 1) / scenes.length) * 100 : 0}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default Timeline;