import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  isMobileNavOpen: boolean;
  isTaskDrawerOpen: boolean;
  selectedTaskId: string | null;
  showOnboarding: boolean;
  undoTask: { id: string; title: string; timeout: NodeJS.Timeout } | null;

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleMobileNav: () => void;
  openTaskDrawer: (taskId: string) => void;
  closeTaskDrawer: () => void;
  setShowOnboarding: (show: boolean) => void;
  setUndoTask: (task: { id: string; title: string; timeout: NodeJS.Timeout } | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      isMobileNavOpen: false,
      isTaskDrawerOpen: false,
      selectedTaskId: null,
      showOnboarding: false,
      undoTask: null,

      setTheme: (theme) => set({ theme }),

      toggleMobileNav: () => set((state) => ({
        isMobileNavOpen: !state.isMobileNavOpen,
      })),

      openTaskDrawer: (taskId) => set({
        isTaskDrawerOpen: true,
        selectedTaskId: taskId,
      }),

      closeTaskDrawer: () => set({
        isTaskDrawerOpen: false,
        selectedTaskId: null,
      }),

      setShowOnboarding: (show) => set({ showOnboarding: show }),

      setUndoTask: (task) => set({ undoTask: task }),
    }),
    {
      name: 'antigravity-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
