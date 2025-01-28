'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface TimerContextType {
  remainingTime: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({
  children,
  timeout,
  onTimeout,
  excludedPaths = []
}: {
  children: React.ReactNode;
  timeout: number;
  onTimeout: () => Promise<void>;
  excludedPaths?: string[];
}) {
  const [remainingTime, setRemainingTime] = useState(timeout / 1000);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const isActiveRef = useRef(true);

  // Clear all timers
  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  // Reset timer function
  const resetTimer = () => {
    // Don't start timer if we're on an excluded path
    if (excludedPaths.some(path => pathname?.includes(path))) {
      clearTimers();
      return;
    }

    clearTimers();
    
    // Reset remaining time
    setRemainingTime(timeout / 1000);

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (isActiveRef.current) {
        await onTimeout();
      }
    }, timeout);

    // Update countdown
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearTimers();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  // Effect for pathname changes
  useEffect(() => {
    resetTimer();
  }, [pathname]);

  // Effect for event listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Only add event listeners if we're not on an excluded path
    if (!excludedPaths.some(path => pathname?.includes(path))) {
      events.forEach(event => {
        document.addEventListener(event, resetTimer);
      });
    }

    // Cleanup
    return () => {
      isActiveRef.current = false;
      clearTimers();
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname, excludedPaths, timeout, onTimeout]);

  return (
    <TimerContext.Provider value={{ remainingTime }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
