/* 
 * مسیر: /video-maker-pro/src/pages/Profile.jsx
 * ✨ آمارهای واقعی از useProjectStore
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore, { useUserProjects } from '../store/useProjectStore';
import './Profile.css';

// ══════════════════════════════════════════════════════════
//  HELPER COMPONENTS
// ══════════════════════════════════════════════════════════

// Sparkline Chart
const Sparkline = ({ data, color = '#6366f1', height = 40 }) => {
  if (!data || data.length === 0) return <div style={{ height }} />;
  
  const max = Math.max(...data, 1);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height, width: '100%' }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,100 ${points} 100,100`}
        fill={`url(#grad-${color})`}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// Ring Progress
const Ring = ({ value, max, color = '#6366f1', size = 80 }) => {
  const percent = Math.min(100, (value / max) * 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="8"
      />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
      <text x="40" y="45" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

// ══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════

const Profile = () => {
  const navigate = useNavigate();
  
  // ✅ استفاده از selector اختصاصی که فقط پروژه‌های کاربر فعلی رو برمی‌گردونه
  const projects = useUserProjects();

  // ── Authentication Check ────────────────────────────────
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  // ── User Profile State ─────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'کاربر ناشناس');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'user@example.com');
  const [userBio, setUserBio] = useState(localStorage.getItem('userBio') || 'سازنده محتوای ویدیویی');
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar') || '🎬');
  const [userPhone, setUserPhone] = useState(localStorage.getItem('userPhone') || '');
  const [userWebsite, setUserWebsite] = useState(localStorage.getItem('userWebsite') || '');
  
  const joinDate = localStorage.getItem('joinDate') || new Date().toLocaleDateString('fa-IR');

  // ── Theme State ────────────────────────────────────────
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ══════════════════════════════════════════════════════════
  //  REAL STATISTICS FROM useProjectStore
  // ══════════════════════════════════════════════════════════

  const realStats = useMemo(() => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // ── Basic Counts ──────────────────────────────────────
    const totalProjects = projects.length;
    const totalScenes = projects.reduce((acc, p) => acc + (p.scenes?.length || 0), 0);
    const totalDurationSec = projects.reduce((acc, p) => {
      return acc + (p.scenes?.reduce((s, scene) => s + (scene.duration || 5), 0) || 0);
    }, 0);
    const totalChars = projects.reduce((acc, p) => {
      return acc + (p.scenes?.reduce((s, scene) => s + (scene.content?.length || 0), 0) || 0);
    }, 0);

    // ── Averages ──────────────────────────────────────────
    const avgScenesPerProject = totalProjects > 0 ? (totalScenes / totalProjects).toFixed(1) : 0;

    // ── Active Projects (modified in last 7 days) ─────────
    const activeProjects = projects.filter(p => {
      return (now - p.lastModified) < (7 * oneDayMs);
    }).length;

    // ── Weekly Activity (last 7 days) ────────────────────
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * oneDayMs;
      const dayEnd = dayStart + oneDayMs;
      return projects.filter(p => {
        const created = p.createdAt >= dayStart && p.createdAt < dayEnd;
        const edited = p.lastModified >= dayStart && p.lastModified < dayEnd && p.lastModified !== p.createdAt;
        return created || edited;
      }).length;
    });

    // ── Monthly Heatmap (last 28 days) ───────────────────
    const monthlyActivity = Array.from({ length: 28 }, (_, i) => {
      const dayStart = now - (27 - i) * oneDayMs;
      const dayEnd = dayStart + oneDayMs;
      return projects.filter(p => {
        const created = p.createdAt >= dayStart && p.createdAt < dayEnd;
        const edited = p.lastModified >= dayStart && p.lastModified < dayEnd && p.lastModified !== p.createdAt;
        return created || edited;
      }).length;
    });

    // ── Recent Activities (last 8 actions) ───────────────
    const allActivities = [];
    projects.forEach(p => {
      allActivities.push({
        type: 'create',
        name: p.name,
        timestamp: p.createdAt,
      });
      if (p.lastModified !== p.createdAt) {
        allActivities.push({
          type: 'edit',
          name: p.name,
          timestamp: p.lastModified,
        });
      }
    });
    const recentActivities = allActivities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    // ── Effect Usage ─────────────────────────────────────
    const effectCounts = {
      typewriter: 0,
      glow: 0,
      neon: 0,
      particles: 0,
      kenburns: 0,
      vignette: 0,
    };

    projects.forEach(p => {
      const s = p.settings || {};
      if (s.typewriter) effectCounts.typewriter++;
      if (s.glow) effectCounts.glow++;
      if (s.neon) effectCounts.neon++;
      if (s.particles) effectCounts.particles++;
      if (s.kenburns) effectCounts.kenburns++;
      if (s.vignette) effectCounts.vignette++;
    });

    // ── Transition Usage ─────────────────────────────────
    const transitionCounts = {};
    projects.forEach(p => {
      const t = p.settings?.transition || 'fade';
      transitionCounts[t] = (transitionCounts[t] || 0) + 1;
    });
    const topTransition = Object.keys(transitionCounts).sort((a, b) => 
      transitionCounts[b] - transitionCounts[a]
    )[0] || 'fade';

    // ── Scores (0-100) ───────────────────────────────────
    const projectScore = Math.min(100, totalProjects * 8);
    const sceneScore = Math.min(100, totalScenes * 1.5);
    const durScore = Math.min(100, (totalDurationSec / 60) * 2);
    const actScore = Math.min(100, activeProjects * 12);

    // ── Used Effects Count ───────────────────────────────
    const usedEffectCount = Object.values(effectCounts).filter(c => c > 0).length;

    return {
      totalProjects,
      totalScenes,
      totalDurationSec,
      totalChars,
      avgScenesPerProject,
      activeProjects,
      weeklyActivity,
      monthlyActivity,
      recentActivities,
      effectCounts,
      topTransition,
      projectScore,
      sceneScore,
      durScore,
      actScore,
      usedEffectCount,
    };
  }, [projects]);

  // ── Helper: Format Duration ────────────────────────────
  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Helper: Relative Time ──────────────────────────────
  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'همین الان';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    if (days < 30) return `${Math.floor(days / 7)} هفته پیش`;
    return `${Math.floor(days / 30)} ماه پیش`;
  };

  // ── Achievements ───────────────────────────────────────
  const achievements = [
    { icon: '🌱', name: 'اولین پروژه', desc: 'اولین پروژه رو ساختی', earned: realStats.totalProjects >= 1 },
    { icon: '🎬', name: 'کارگردان', desc: '5 پروژه ساختی', earned: realStats.totalProjects >= 5 },
    { icon: '🎭', name: 'صحنه‌پرداز', desc: '50 صحنه ساختی', earned: realStats.totalScenes >= 50 },
    { icon: '⚡', name: 'پرکار', desc: '7 روز متوالی فعال بودی', earned: realStats.activeProjects >= 7 },
    { icon: '🏆', name: 'استاد', desc: '10 پروژه ساختی', earned: realStats.totalProjects >= 10 },
    { icon: '🎪', name: 'خلاق', desc: '4 افکت مختلف استفاده کردی', earned: realStats.usedEffectCount >= 4 },
  ];

  // ── Save Profile ───────────────────────────────────────
  const handleSave = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userBio', userBio);
    localStorage.setItem('userAvatar', userAvatar);
    localStorage.setItem('userPhone', userPhone);
    localStorage.setItem('userWebsite', userWebsite);
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/auth');
  };

  const avatarOptions = ['🎬', '🎥', '🎞️', '🎪', '🎭', '🎨', '🎸', '🎤', '🎧', '🎹'];

  // ══════════════════════════════════════════════════════════
  //  EMPTY STATE
  // ══════════════════════════════════════════════════════════

  const EmptyState = () => (
    <div className="profile-empty">
      <div className="profile-empty-icon">📭</div>
      <h3>هنوز پروژه‌ای ساخته نشده</h3>
      <p>برای شروع، اولین پروژه خودت رو بساز</p>
      <button 
        className="profile-empty-btn"
        onClick={() => navigate('/dashboard')}
      >
        + بساز اولین پروژه
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════

  return (
    <div className="profile-page">
      {/* Cover Section */}
      <div className="profile-cover">
        <div className="profile-cover-gradient" />
        <div className="profile-cover-orb profile-cover-orb-1" />
        <div className="profile-cover-orb profile-cover-orb-2" />
        <div className="profile-cover-grid" />
      </div>

      {/* Hero Row */}
      <div className="profile-hero">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar" onClick={() => isEditing && setAvatarPickerOpen(true)}>
            {userAvatar}
          </div>
          {avatarPickerOpen && isEditing && (
            <div className="profile-avatar-picker">
              {avatarOptions.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { setUserAvatar(emoji); setAvatarPickerOpen(false); }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{userName}</h1>
          <p>{userBio}</p>
          <div className="profile-meta">
            <span>📧 {userEmail}</span>
            <span>📅 عضو از {joinDate}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button onClick={toggleTheme} title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}>
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'روشن' : 'تاریک'}
          </button>
          <button onClick={() => navigate('/dashboard')}>
            <span>🏠</span>
            داشبورد
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {realStats.totalProjects > 0 && (
        <div className="profile-quick-stats">
          <div className="profile-stat-card">
            <div className="profile-stat-icon">📦</div>
            <div className="profile-stat-value">{realStats.totalProjects}</div>
            <div className="profile-stat-label">پروژه</div>
            <Sparkline data={realStats.weeklyActivity} color="#6366f1" />
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">🎬</div>
            <div className="profile-stat-value">{realStats.totalScenes}</div>
            <div className="profile-stat-label">صحنه</div>
            <Sparkline data={realStats.weeklyActivity.map(v => v * 3)} color="#8b5cf6" />
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">⏱️</div>
            <div className="profile-stat-value">{formatDuration(realStats.totalDurationSec)}</div>
            <div className="profile-stat-label">مدت زمان</div>
            <Sparkline data={realStats.weeklyActivity.map(v => v * 5)} color="#ec4899" />
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">⚡</div>
            <div className="profile-stat-value">{realStats.activeProjects}</div>
            <div className="profile-stat-label">پروژه فعال</div>
            <Sparkline data={realStats.weeklyActivity} color="#10b981" />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          نمای کلی
        </button>
        <button 
          className={activeTab === 'activity' ? 'active' : ''} 
          onClick={() => setActiveTab('activity')}
        >
          فعالیت
        </button>
        <button 
          className={activeTab === 'stats' ? 'active' : ''} 
          onClick={() => setActiveTab('stats')}
        >
          آمار
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''} 
          onClick={() => setActiveTab('settings')}
        >
          تنظیمات
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {/* TAB: Overview */}
        {activeTab === 'overview' && (
          <>
            {realStats.totalProjects === 0 ? (
              <EmptyState />
            ) : (
              <div className="profile-overview">
                {/* Weekly Chart */}
                <div className="profile-panel">
                  <h3>فعالیت هفتگی</h3>
                  <div className="profile-chart">
                    {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, i) => (
                      <div key={i} className="profile-chart-bar">
                        <div 
                          className="profile-chart-fill"
                          style={{ 
                            height: `${(realStats.weeklyActivity[i] / Math.max(...realStats.weeklyActivity, 1)) * 100}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        >
                          <span className="profile-chart-value">{realStats.weeklyActivity[i]}</span>
                        </div>
                        <span className="profile-chart-label">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Rings */}
                <div className="profile-panel">
                  <h3>میزان فعالیت</h3>
                  <div className="profile-rings">
                    <div className="profile-ring-item">
                      <Ring value={realStats.projectScore} max={100} color="#6366f1" />
                      <p>پروژه‌ها</p>
                    </div>
                    <div className="profile-ring-item">
                      <Ring value={realStats.sceneScore} max={100} color="#8b5cf6" />
                      <p>صحنه‌ها</p>
                    </div>
                    <div className="profile-ring-item">
                      <Ring value={realStats.durScore} max={100} color="#ec4899" />
                      <p>مدت زمان</p>
                    </div>
                    <div className="profile-ring-item">
                      <Ring value={realStats.actScore} max={100} color="#10b981" />
                      <p>فعالیت</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="profile-panel">
                  <h3>آخرین فعالیت‌ها</h3>
                  {realStats.recentActivities.length === 0 ? (
                    <p className="profile-no-data">هنوز فعالیتی ثبت نشده</p>
                  ) : (
                    <div className="profile-activity-list">
                      {realStats.recentActivities.map((act, i) => (
                        <div key={i} className="profile-activity-item">
                          <div className={`profile-activity-dot profile-activity-dot-${act.type}`} />
                          <div className="profile-activity-content">
                            <p>
                              {act.type === 'create' ? '📦 ساخت پروژه' : '✏️ ویرایش'} 
                              <strong> {act.name}</strong>
                            </p>
                            <span>{getRelativeTime(act.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: Activity */}
        {activeTab === 'activity' && (
          <>
            {realStats.totalProjects === 0 ? (
              <EmptyState />
            ) : (
              <div className="profile-activity-tab">
                {/* Heatmap */}
                <div className="profile-panel">
                  <h3>نقشه حرارتی (28 روز گذشته)</h3>
                  <div className="profile-heatmap">
                    {realStats.monthlyActivity.map((count, i) => (
                      <div
                        key={i}
                        className={`profile-heatmap-cell profile-heatmap-${
                          count === 0 ? 'empty' : count <= 2 ? 'low' : count <= 5 ? 'medium' : 'high'
                        }`}
                        title={`${count} فعالیت`}
                      />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="profile-panel">
                  <h3>تایم‌لاین</h3>
                  {realStats.recentActivities.length === 0 ? (
                    <p className="profile-no-data">هنوز فعالیتی ثبت نشده</p>
                  ) : (
                    <div className="profile-timeline">
                      {realStats.recentActivities.map((act, i) => (
                        <div key={i} className="profile-timeline-item">
                          <div className={`profile-timeline-dot profile-timeline-dot-${act.type}`} />
                          <div className="profile-timeline-content">
                            <h4>{act.name}</h4>
                            <p>{act.type === 'create' ? 'ساخت پروژه جدید' : 'ویرایش پروژه'}</p>
                            <span>{getRelativeTime(act.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: Stats */}
        {activeTab === 'stats' && (
          <>
            {realStats.totalProjects === 0 ? (
              <EmptyState />
            ) : (
              <div className="profile-stats-tab">
                <div className="profile-stats-grid">
                  <div className="profile-panel">
                    <h3>آمار کلی</h3>
                    <div className="profile-stat-row">
                      <span>تعداد کاراکترها</span>
                      <strong>{realStats.totalChars.toLocaleString('fa-IR')}</strong>
                    </div>
                    <div className="profile-stat-row">
                      <span>مجموع مدت زمان</span>
                      <strong>{formatDuration(realStats.totalDurationSec)}</strong>
                    </div>
                    <div className="profile-stat-row">
                      <span>میانگین صحنه</span>
                      <strong>{realStats.avgScenesPerProject}</strong>
                    </div>
                  </div>

                  <div className="profile-panel">
                    <h3>استفاده از افکت‌ها</h3>
                    <div className="profile-effect-stats">
                      {Object.entries(realStats.effectCounts).map(([name, count]) => (
                        <div key={name} className="profile-effect-bar">
                          <span>{name}</span>
                          <div className="profile-effect-bar-track">
                            <div 
                              className="profile-effect-bar-fill"
                              style={{ width: `${(count / Math.max(...Object.values(realStats.effectCounts), 1)) * 100}%` }}
                            />
                          </div>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="profile-panel">
                    <h3>ترانزیشن محبوب</h3>
                    <div className="profile-transition-box">
                      <div className="profile-transition-icon">🎬</div>
                      <h4>{realStats.topTransition}</h4>
                      <p>بیشترین استفاده</p>
                    </div>
                  </div>

                  <div className="profile-panel">
                    <h3>دستاوردها</h3>
                    <div className="profile-achievements">
                      {achievements.map((ach, i) => (
                        <div 
                          key={i} 
                          className={`profile-achievement ${ach.earned ? 'earned' : ''}`}
                        >
                          <div className="profile-achievement-icon">{ach.icon}</div>
                          <h4>{ach.name}</h4>
                          <p>{ach.desc}</p>
                          {ach.earned && <div className="profile-achievement-badge">✓</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: Settings */}
        {activeTab === 'settings' && (
          <div className="profile-settings-tab">
            <div className="profile-panel">
              <div className="profile-settings-header">
                <h3>اطلاعات پروفایل</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                    ✏️ ویرایش
                  </button>
                ) : (
                  <div className="profile-edit-actions">
                    <button onClick={handleSave} className="profile-save-btn">
                      ✓ ذخیره
                    </button>
                    <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
                      ✕ لغو
                    </button>
                  </div>
                )}
              </div>
              <div className="profile-form">
                <div className="profile-form-group">
                  <label>نام</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>ایمیل</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>بیو</label>
                  <textarea
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>شماره تماس</label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="profile-form-group">
                  <label>وبسایت</label>
                  <input
                    type="url"
                    value={userWebsite}
                    onChange={(e) => setUserWebsite(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="profile-panel profile-danger-zone">
              <h3>منطقه خطرناک</h3>
              <p>خروج از حساب کاربری</p>
              <button onClick={handleLogout} className="profile-logout-btn">
                🚪 خروج از حساب
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div className="profile-toast">
          ✓ اطلاعات با موفقیت ذخیره شد
        </div>
      )}
    </div>
  );
};

export default Profile;