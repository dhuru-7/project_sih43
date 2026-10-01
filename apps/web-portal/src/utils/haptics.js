/**
 * Setu Tactile & Haptic Engine
 * Provides authentic hardware vibration via Navigator Vibration API on mobile devices.
 * Web Audio speaker playback is disabled so the browser tab does NOT show an audio/speaker icon.
 */

export const triggerHaptic = (type = 'click') => {
  if (typeof window === 'undefined') return;

  // 1. Hardware Vibration for Mobile Devices
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'scroll' || type === 'tick') {
        navigator.vibrate(3);
      } else if (type === 'hover') {
        navigator.vibrate(4);
      } else if (type === 'click') {
        navigator.vibrate(12);
      } else if (type === 'snap') {
        navigator.vibrate([10, 25, 12]);
      } else if (type === 'heavy') {
        navigator.vibrate(25);
      }
    } catch (e) {}
  }
};

/**
 * Universal Global Delegated Haptic Listener
 * Automatically applies tactile hover and mechanical click feedback to all buttons,
 * pills, and interactive CTAs across the entire application without needing individual props.
 */
let lastHoveredElement = null;
let lastHoverTimestamp = 0;

export const initGlobalHaptics = () => {
  if (typeof window === 'undefined' || window.__setuHapticsInitialized) return;
  window.__setuHapticsInitialized = true;

  const buttonSelector = 'button, .setu-btn, .setu-apple-cta, .setu-walkthrough-pill-chip, a[role="button"], input[type="button"], input[type="submit"], .btn';

  // Tactile Micro-Tick on Hover
  document.addEventListener('mouseover', (e) => {
    const btn = e.target.closest(buttonSelector);
    if (!btn) {
      lastHoveredElement = null;
      return;
    }
    const now = Date.now();
    if (btn !== lastHoveredElement || now - lastHoverTimestamp > 320) {
      lastHoveredElement = btn;
      lastHoverTimestamp = now;
      triggerHaptic('hover');
    }
  }, { passive: true });

  // Crisp Mechanical Click Latch on Press
  document.addEventListener('mousedown', (e) => {
    const btn = e.target.closest(buttonSelector);
    if (btn) {
      triggerHaptic('click');
    }
  }, { passive: true });
};

// Auto-run if running in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalHaptics);
  } else {
    initGlobalHaptics();
  }
}
