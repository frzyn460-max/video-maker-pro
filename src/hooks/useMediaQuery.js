// ============================================
// useMediaQuery Hook - برای Responsive Design
// ============================================

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../utils/constants';

/**
 * Hook برای چک کردن Media Query
 * @param {string} query - Media query string
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (e) => setMatches(e.matches);
    
    // Add listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Hook برای Breakpoints از constants
 */
export const useBreakpoint = () => {
  const isXs = useMediaQuery(`(max-width: ${BREAKPOINTS.sm - 1}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px) and (max-width: ${BREAKPOINTS.xl - 1}px)`);
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px) and (max-width: ${BREAKPOINTS.xxl - 1}px)`);
  const isXxl = useMediaQuery(`(min-width: ${BREAKPOINTS.xxl}px)`);

  // برای سادگی، current breakpoint
  let current = 'xs';
  if (isXxl) current = 'xxl';
  else if (isXl) current = 'xl';
  else if (isLg) current = 'lg';
  else if (isMd) current = 'md';
  else if (isSm) current = 'sm';

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
    current,
    // Helper functions
    isSmallScreen: isXs || isSm,
    isMediumScreen: isMd,
    isLargeScreen: isLg || isXl || isXxl,
  };
};

/**
 * Hook برای موبایل
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
};

/**
 * Hook برای تبلت
 */
export const useIsTablet = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`);
};

/**
 * Hook برای دسکتاپ
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
};

export default useMediaQuery;