/* 
 * مسیر: /video-maker-pro/src/pages/Templates.jsx
 */

import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Templates = () => {
  return (
    <div className="templates-page">
      <Navbar />
      
      <main className="templates-main" style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>قالب‌ها</h1>
          <p style={{ color: 'var(--text-secondary)' }}>این صفحه در حال توسعه است...</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Templates;