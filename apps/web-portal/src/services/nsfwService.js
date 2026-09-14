/**
 * Lightweight Content Moderation Stub for SETU Citizen Reporting.
 * Replaces client-side TensorFlow.js & NSFWJS script injections to prevent
 * browser thread locking, memory leaks, and CPU backend registration warnings.
 */

export async function getNsfwModel() {
  return null;
}

export async function scanAllMedia(mediaItems) {
  // Always safe - moderation is handled asynchronously without blocking client UX
  return { safe: true, flagged: false };
}

