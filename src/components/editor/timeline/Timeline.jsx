/* 
 * مسیر: /video-maker-pro/src/components/editor/timeline/Timeline.jsx
 */

import React, { useState, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import useEditorStore from '../../../store/useEditorStore';
import useUIStore from '../../../store/useUIStore';
import Button from '../../common/‌Button';
import './Timeline.css';

const Timeline = () => {
  const scenes = useEditorStore(state => state.scenes);
  const currentSceneIndex = useEditorStore(state => state.currentSceneIndex);
  const setScenes = useEditorStore(state => state.setScenes);
  const setCurrentSceneIndex = useEditorStore(state => state.setCurrentSceneIndex);
  const deleteScene = useEditorStore(state => state.deleteScene);
  const duplicateScene = useEditorStore(state => state.duplicateScene);
  
  const showSuccess = useUIStore(state => state.showSuccess);
  const showError = useUIStore(state => state.showError);

  const [isDragging, setIsDragging] = useState(false);

  // تغییر ترتیب صحنه‌ها
  const handleReorder = (newScenes) => {
    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index
    }));
    setScenes(reorderedScenes);
  };

  // حذف صحنه
  const handleDeleteScene = (sceneId) => {
    if (scenes.length === 1) {
      showError('حداقل یک صحنه باید وجود داشته باشد');
      return;
    }

    deleteScene(sceneId);
    showSuccess('صحنه حذف شد');
    
    // اگر صحنه فعلی حذف شد، به صحنه قبلی برو
    if (currentSceneIndex >= scenes.length - 1) {
      setCurrentSceneIndex(Math.max(0, scenes.length - 2));
    }
  };

  // کپی صحنه
  const handleDuplicateScene = (sceneId) => {
    duplicateScene(sceneId);
    showSuccess('صحنه کپی شد');
  };

  // افزودن صحنه جدید
  const handleAddScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      order: scenes.length,
      title: `صحنه ${scenes.length + 1}`,
      content: '',
      duration: 5
    };
    setScenes([...scenes, newScene]);
    setCurrentSceneIndex(scenes.length);
    showSuccess('صحنه جدید اضافه شد');
  };

  // محاسبه مدت کل
  const getTotalDuration = () => {
    return scenes.reduce((total, scene) => total + (scene.duration || 5), 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timeline">
      {/* Header */}
      <div className="timeline-header">
        <div className="timeline-info">
          <span className="timeline-title">⏱️ خط زمان</span>
          <span className="timeline-duration">
            مدت کل: {formatTime(getTotalDuration())}
          </span>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddScene}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          <span>صحنه جدید</span>
        </Button>
      </div>

      {/* Scenes Track */}
      <div className="timeline-track">
        <Reorder.Group
          axis="x"
          values={scenes}
          onReorder={handleReorder}
          className="scenes-container"
        >
          {scenes.map((scene, index) => (
            <Reorder.Item
              key={scene.id}
              value={scene}
              className={`scene-item ${currentSceneIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentSceneIndex(index)}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              whileDrag={{ scale: 1.05, zIndex: 10 }}
            >
              {/* Scene Header */}
              <div className="scene-header">
                <div className="scene-number">{index + 1}</div>
                <div className="scene-drag-handle">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M4 8h16M4 16h16"/>
                  </svg>
                </div>
              </div>

              {/* Scene Content */}
              <div className="scene-preview">
                <div className="scene-preview-title">{scene.title}</div>
                <div className="scene-preview-content">
                  {scene.content.substring(0, 50)}
                  {scene.content.length > 50 ? '...' : ''}
                </div>
              </div>

              {/* Scene Duration */}
              <div className="scene-duration">
                {scene.duration || 5}s
              </div>

              {/* Scene Actions */}
              <div className="scene-actions">
                <button
                  className="scene-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateScene(scene.id);
                  }}
                  title="کپی"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>

                <button
                  className="scene-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteScene(scene.id);
                  }}
                  title="حذف"
                  disabled={scenes.length === 1}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              {/* Active Indicator */}
              {currentSceneIndex === index && (
                <motion.div
                  className="scene-active-indicator"
                  layoutId="activeIndicator"
                />
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Playhead */}
      <div 
        className="timeline-playhead"
        style={{
          left: `${(currentSceneIndex / scenes.length) * 100}%`
        }}
      >
        <div className="playhead-line" />
        <div className="playhead-handle" />
      </div>

      {/* Timeline Scale */}
      <div className="timeline-scale">
        {scenes.map((_, index) => (
          <div key={index} className="scale-mark">
            <div className="scale-line" />
            <div className="scale-label">{index + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;