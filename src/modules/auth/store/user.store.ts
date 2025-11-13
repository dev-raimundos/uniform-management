import { create } from "zustand";
import type { User } from "@/modules/auth";

interface UserState {
    user: User | null;
    loaded: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    markLoaded: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loaded: false,

    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    markLoaded: () => set({ loaded: true }),
}));
