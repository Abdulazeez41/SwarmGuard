import { create } from "zustand";

type UiState = {
  commandPanelOpen: boolean;
  setCommandPanelOpen: (value: boolean) => void;
  activeAuditId: string | null;
  setActiveAuditId: (value: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandPanelOpen: true,
  setCommandPanelOpen: (value) => set({ commandPanelOpen: value }),
  activeAuditId: null,
  setActiveAuditId: (value) => set({ activeAuditId: value }),
}));
