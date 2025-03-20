import { create } from 'zustand';

type ThemeStore = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const useTheme = create<ThemeStore>((set) => ({
  isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));