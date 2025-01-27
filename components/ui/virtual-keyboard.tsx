"use client";

import useBranchStore from '@/store/branch';
import { useState, useEffect, useCallback } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { create } from 'zustand';

interface KeyboardStore {
  isOpen: boolean;
  inputRef: HTMLInputElement | HTMLTextAreaElement | null;
  setIsOpen: (isOpen: boolean) => void;
  setInputRef: (ref: HTMLInputElement | HTMLTextAreaElement | null) => void;
}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  isOpen: false,
  inputRef: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setInputRef: (ref) => set({ inputRef: ref }),
}));

export function VirtualKeyboard() {
  const { t } = useBranchStore();
  const { isOpen, inputRef, setIsOpen } = useKeyboardStore();
  const [layout, setLayout] = useState("default");
  const [previewValue, setPreviewValue] = useState("");
  const [isInModal, setIsInModal] = useState(false);

  useEffect(() => {
    if (inputRef && isOpen) {
      setPreviewValue(inputRef.value);
      // Input modal içinde mi kontrol et
      setIsInModal(!!inputRef.closest('[role="dialog"]'));
    }
  }, [inputRef, isOpen]);

  const onKeyPress = (button: string) => {
    if (!inputRef) return;

    let newValue = inputRef.value;
    if (button === "{shift}" || button === "{lock}") {
      setLayout(layout === "default" ? "shift" : "default");
      return;
    }

    if (button === "{bksp}") {
      newValue = inputRef.value.slice(0, -1);
    } else if (button === "{space}") {
      newValue = inputRef.value + " ";
    } else {
      newValue = inputRef.value + button;
    }

    inputRef.value = newValue;
    setPreviewValue(newValue);

    // Trigger virtual keyboard input event
    const event = new CustomEvent('virtualkeyboardinput', { 
      detail: { value: newValue },
      bubbles: true 
    });
    inputRef.dispatchEvent(event);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Eğer event.target null ise veya document'ta değilse işlemi durdur
    if (!event.target || !document.contains(event.target as Node)) {
      return;
    }

    const target = event.target as HTMLElement;
    
    // Klavye veya modal içindeki elementlere tıklanırsa kapanmayı engelle
    if (
      target.closest('.simple-keyboard') || 
      target.closest('[role="dialog"]') || 
      (inputRef && inputRef.contains(target))
    ) {
      return;
    }

    setIsOpen(false);
  }, [inputRef]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-background/95 backdrop-blur-sm border-t shadow-2xl"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full p-4">
        <div className="flex flex-col space-y-4">
          {/* Preview Input ve Tamam Butonu */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={previewValue}
              readOnly
              className="flex-1 p-4 rounded-xl border border-input bg-white/50 text-lg"
              placeholder="Metin girin..."
            />
            <button
              onClick={handleClose}
              className="px-6 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              {t.common.ok}
            </button>
          </div>

          {/* Klavye */}
          <div 
            className="p-2 bg-white/50 rounded-xl"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Keyboard
              onKeyPress={onKeyPress}
              layoutName={layout}
              physicalKeyboardHighlight={false}
              preventMouseDownDefault={true}
              stopMouseDownPropagation={true}
              disableCaretPositioning={true}
              disableButtonHold={true}
              layout={{
                default: [
                  "1 2 3 4 5 6 7 8 9 0 {bksp}",
                  "q w e r t y u i o p",
                  "a s d f g h j k l",
                  "{shift} z x c v b n m",
                  "{space}",
                ],
                shift: [
                  "! @ # $ % ^ & * ( ) {bksp}",
                  "Q W E R T Y U I O P",
                  "A S D F G H J K L",
                  "{shift} Z X C V B N M",
                  "{space}",
                ]
              }}
              display={{
                "{bksp}": "⌫",
                "{shift}": "⇧",
                "{space}": "Space"
              }}
              buttonTheme={[
                {
                  class: "keyboard-button",
                  buttons: "{shift} {bksp}"
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
