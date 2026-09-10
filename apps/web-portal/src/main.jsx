import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent mobile long-press selection menu on static text & icons, while fully allowing right-click on desktop view
if (typeof window !== 'undefined') {
  const isEditableTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || el.isContentEditable || el.classList?.contains('selectable-text');
  };

  const isDesktopEnvironment = (e) => {
    return (
      window.innerWidth >= 768 ||
      (window.matchMedia && window.matchMedia('(pointer: fine)').matches) ||
      (e && (e.pointerType === 'mouse' || e.button === 2 || e.which === 3))
    );
  };

  window.addEventListener('contextmenu', (e) => {
    // Always allow right click on desktop view
    if (isDesktopEnvironment(e)) {
      return;
    }
    if (!isEditableTarget(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('selectstart', (e) => {
    // Always allow selection on desktop view
    if (isDesktopEnvironment(e)) {
      return;
    }
    if (!isEditableTarget(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

