import { create } from 'zustand';

interface ILoadStore {
    isLoaded: boolean;
    setIsLoaded: () => void;
}
export const useLoadStore = create<ILoadStore>((set) => {
    return {
        isLoaded: false,
        setIsLoaded: () => set(() => ({ isLoaded: true })),
    };
});
