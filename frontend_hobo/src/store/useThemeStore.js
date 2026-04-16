import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('hobo-theme') || 'dark', // default to dark
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('hobo-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
  initTheme: () => {
    const theme = localStorage.getItem('hobo-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }
}));
