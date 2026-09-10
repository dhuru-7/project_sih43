import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component ensuring that whenever any route/page or query changes,
 * the window and any scrollable containers are immediately reset to the top (0, 0).
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Prevent browser from automatically restoring previous scroll positions across route transitions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Immediately scroll the window to the very top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Reset scroll positions on any container elements that might have overflow-y: auto
    const scrollContainers = document.querySelectorAll(
      'main, .setu-portal, [data-scroll-container], .apple-page-enter, #root'
    );
    scrollContainers.forEach((el) => {
      if (el && el.scrollTop > 0) {
        el.scrollTop = 0;
      }
    });
  }, [pathname, search]);

  return null;
};
