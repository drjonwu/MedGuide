
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 1024; // Corresponds to Tailwind 'lg'

export function useDevice() {
  // Initialize with safe defaults
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    // Media query for layout handling
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const updateSpecs = () => {
      setIsMobile(mobileQuery.matches);
    };

    // Initial check
    updateSpecs();

    // Event Listeners for real-time sensing
    mobileQuery.addEventListener('change', updateSpecs);
    
    // Fallback for resize events
    window.addEventListener('resize', updateSpecs);

    return () => {
      mobileQuery.removeEventListener('change', updateSpecs);
      window.removeEventListener('resize', updateSpecs);
    };
  }, []);

  return { isMobile };
}

// Backward compatibility wrapper
export function useIsMobile() {
  const { isMobile } = useDevice();
  return isMobile;
}
