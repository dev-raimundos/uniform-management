import { create } from "zustand";

/**
 * Representa o usuário autenticado retornado pela API `/me`.
 */
export interface User {
    id: string;
    nome: string;
    email: string;
    avatar: string | null;
    departamento: string;
    cargo: string;
    empresa: string;
    ativo: string;
    possui_ramal: string;
    line_id: string;
    permissoes: string[];
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

/**
 * Store global para controle do usuário autenticado.
 *
 * Uso:
 * ```tsx
 * const user = useUserStore((state) => state.user);
 * const setUser = useUserStore((state) => state.setUser);
 * ```
 */
export const useUserStore = create<UserState>(
    (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
