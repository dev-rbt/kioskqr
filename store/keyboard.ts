import { create } from 'zustand';

interface KeyboardStore {
  isOpen: boolean;
  value: string;
  onChange?: (value: string) => void;
  setKeyboard: (isOpen: boolean, value?: string, onChange?: (value: string) => void) => void;
}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  isOpen: false,
  value: '',
  onChange: undefined,
  setKeyboard: (isOpen, value = '', onChange) => set({ isOpen, value, onChange }),
}));
