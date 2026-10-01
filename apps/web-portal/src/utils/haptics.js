/**
 * Setu Tactile & Haptic Engine
 * Provides dual-layer tactile feedback:
 * 1. Hardware vibration via Navigator Vibration API (mobile devices & supported trackpads)
 * 2. Instantaneous synthesized acoustic micro-clicks via Web Audio (desktop & mobile)
 */

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
};

export const triggerHaptic = (type = 'click') => {
  if (typeof window === 'undefined') return;

  // 1. Hardware Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'hover') {
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

  // 2. Synthesized Tactile Acoustic Pulse (<1ms response)
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      // Gentle micro-tick on hover (no lift, just subtle tactile affirmation)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.012);

      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.start(now);
      osc.stop(now + 0.012);
    } else if (type === 'click') {
      // Crisp mechanical button latch
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.022);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.start(now);
      osc.stop(now + 0.022);
    } else if (type === 'snap') {
      // Deep resonant snap when image covers the entire screen
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.038);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      osc.start(now);
      osc.stop(now + 0.038);
    }
  } catch (e) {}
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

  const unlockAudio = () => {
    getAudioContext();
  };

  // Browser audio unlock on first user gesture
  ['pointerdown', 'mousedown', 'keydown', 'touchstart'].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { once: true, passive: true });
  });

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
