import { create } from 'zustand';

interface ChargeModalState {
    isChargeModalOpen: boolean;
    openChargeModal: () => void;
    closeChargeModal: () => void;
}

export const usePointModalStore = create<ChargeModalState>((set) => ({
    isChargeModalOpen: false,
    openChargeModal: () => set({ isChargeModalOpen: true }),
    closeChargeModal: () => set({ isChargeModalOpen: false }),
}));
