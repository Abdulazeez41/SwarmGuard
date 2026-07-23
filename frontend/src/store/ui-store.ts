import { create } from "zustand";

type UiState = {
  commandPanelOpen: boolean;
  setCommandPanelOpen: (value: boolean) => void;
  activeAuditId: string | null;
  setActiveAuditId: (value: string | null) => void;
  hasAnalyzed: boolean;
  setHasAnalyzed: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandPanelOpen: true,
  setCommandPanelOpen: (value) => set({ commandPanelOpen: value }),
  activeAuditId: null,
  setActiveAuditId: (value) => set({ activeAuditId: value }),
  hasAnalyzed: false,
  setHasAnalyzed: (value) => set({ hasAnalyzed: value }),
}));
