'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  remainingTime: number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({
  children,
  timeout,
  onTimeout
}: {
  children: React.ReactNode;
  timeout: number;
  onTimeout: () => Promise<void>;
}) {
  const [remainingTime, setRemainingTime] = useState(timeout / 1000);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    let isActive = true;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);

      // Reset remaining time
      setRemainingTime(timeout / 1000);

      // Set new timeout
      timeoutId = setTimeout(async () => {
        if (isActive) {
          await onTimeout();
        }
      }, timeout);

      // Update countdown
      intervalId = setInterval(() => {
        if (isActive) {
          setRemainingTime(prev => {
            if (prev <= 1) {
              clearInterval(intervalId);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    };

    // Initial setup
    resetTimer();

    // Add event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, onTimeout]);

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
