"use client";

import { useQuery, type QueryObserverResult } from "@tanstack/react-query";
import { api } from "@/shared/lib/api";
import { useUserStore, type User } from "@/shared/store/user.store";

async function fetchCurrentUser(): Promise<User> {
    const response = await api<{ results: User }>("/me");
    return response.results;
}

/**
 * Hook responsável por buscar e manter o estado do usuário autenticado.
 *
 * Utiliza TanStack React Query para requisição e cache, e Zustand para persistência
 * global do usuário. Faz a chamada ao endpoint `/me`, armazena o resultado na store
 * e fornece o estado da query para uso nos componentes.
 *
 * @returns Um objeto com:
 * - `user`: Usuário autenticado atual.
 * - `loading`: Indica se a requisição está em andamento.
 * - `error`: Erro retornado pela query, se houver.
 * - `refetch`: Função para refazer manualmente a requisição.
 */
export function useCurrentUser(): {
    user: User | null;
    loading: boolean;
    error: unknown;
    refetch: () => Promise<QueryObserverResult<User, Error>>;
} {
    const { setUser } = useUserStore();

    const query = useQuery<User, Error>({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    // Sincroniza o estado global conforme os resultados da query
    if (query.data) {
        setUser(query.data);
    } else if (query.error) {
        useUserStore.getState().clearUser();
    }

    return {
        user: query.data ?? useUserStore.getState().user,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
