import type { User } from "@/modules/auth";
import { create } from "zustand";

/**
 * Estado global do usuário autenticado.
 *
 * Permite acessar e modificar o usuário em qualquer componente da aplicação.
 */
interface UserState {
    /** Usuário autenticado atual (ou null se não logado). */
    user: User | null;

    /** Define o usuário autenticado. */
    setUser: (user: User) => void;

    /** Limpa o estado do usuário (logout). */
    clearUser: () => void;
}

/**
 * Hook Zustand para o estado do usuário.
 *
 * Uso:
 * ```tsx
 * const user = useUserStore((state) => state.user);
 * const setUser = useUserStore((state) => state.setUser);
 * ```
 */
export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
