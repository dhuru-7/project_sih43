import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent mobile long-press selection menu ("select all / copy / paste") on static text & icons
if (typeof window !== 'undefined') {
  const isEditableTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || el.isContentEditable || el.classList?.contains('selectable-text');
  };

  window.addEventListener('contextmenu', (e) => {
    if (!isEditableTarget(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('selectstart', (e) => {
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

