import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useInactivityRedirect({
  timeout,
  onTimeout,
}: {
  timeout: number;
  onTimeout: () => void;
}) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();

  const clearInactivityTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  // Clear timer on pathname changes
  useEffect(() => {
    clearInactivityTimer();
  }, [pathname]);

  // Setup timer and event listeners
  useEffect(() => {
    const startTimer = () => {
      clearInactivityTimer();
      timeoutRef.current = setTimeout(onTimeout, timeout);
    };

    // Initial timer
    startTimer();

    // Event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, startTimer);
    });

    // Cleanup
    return () => {
      clearInactivityTimer();
      events.forEach(event => {
        document.removeEventListener(event, startTimer);
      });
    };
  }, [timeout, onTimeout]);
}
