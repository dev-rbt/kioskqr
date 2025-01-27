import { create } from 'zustand';

interface TimerStore {
  remainingTime: number;
  setRemainingTime: (time: number) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  remainingTime: 60,
  setRemainingTime: (time) => set({ remainingTime: time }),
}));
