import { useEffect, useRef } from 'react';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';

interface VirtualKeyboardEvent extends CustomEvent {
  detail: { value: string };
}

export function useVirtualKeyboard() {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { setIsOpen, setInputRef } = useKeyboardStore();

  useEffect(() => {
    const input = inputRef.current;
    
    if (!input) return;

    const handleFocus = () => {
      setInputRef(input as HTMLInputElement);
      setIsOpen(true);
    };

    const handleVirtualKeyboardInput = (e: Event) => {
      const event = e as VirtualKeyboardEvent;
      if (event.detail?.value !== undefined) {
        const virtualKeyboardEvent = new CustomEvent('virtualkeyboardinput', {
          detail: { value: event.detail.value }
        });
        input.dispatchEvent(virtualKeyboardEvent);
      }
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('virtualkeyboardinput', handleVirtualKeyboardInput);
    
    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('virtualkeyboardinput', handleVirtualKeyboardInput);
      setInputRef(null);
    };
  }, [setInputRef, setIsOpen]);

  return inputRef;
}
