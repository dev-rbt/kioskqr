import { useEffect, useRef } from 'react';

interface UseInactivityTimerProps {
    timeout: number;
    onTimeout: () => Promise<void>;
    events?: string[];
}

export const useInactivityTimer = ({
    timeout,
    onTimeout,
    events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
}: UseInactivityTimerProps) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(onTimeout, timeout);
        };

        resetTimer();

        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [timeout, onTimeout, events]);
};
