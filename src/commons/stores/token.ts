import { create } from 'zustand';

interface ITokenStore {
    accessToken: string;
    setAccessToken: (token: string) => void;
}

export const useTokenStore = create<ITokenStore>((set) => ({
    accessToken: '',
    setAccessToken: (newToken) =>
        set({
            accessToken: newToken,
        }),
}));
