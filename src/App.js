/* 
 * مسیر: /video-maker-pro/src/App.js
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
// import Templates from './pages/Templates'; // فعلاً کامنت شد
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* صفحه اصلی */}
            <Route path="/" element={<Home />} />
            
            {/* احراز هویت */}
            <Route path="/auth" element={<Auth />} />
            
            {/* داشبورد */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* پروفایل کاربری */}
            <Route path="/profile" element={<Profile />} />
            
            {/* ادیتور */}
            <Route path="/editor/:projectId" element={<Editor />} />
            
            {/* قالب‌ها - فعلاً غیرفعال */}
            {/* <Route path="/templates" element={<Templates />} /> */}
            
            {/* ریدایرکت به صفحه اصلی برای مسیرهای نامعتبر */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;