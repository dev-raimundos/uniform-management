"use client";

import { useQuery, type QueryObserverResult } from "@tanstack/react-query";
import { useUserStore, type User } from "@/modules/auth";
import { api } from "@/shared/lib/api";
import { useEffect } from "react";

/**
 * Busca o usuário autenticado via API `/me`.
 *
 * @returns Um objeto com a chave `results` contendo os dados do usuário.
 */
async function fetchCurrentUser(): Promise<User> {
    const response = await api<{ results: User }>("/me");
    return response.results;
}

/**
 * Hook responsável por buscar e manter o estado do usuário autenticado.
 *
 * Utiliza:
 * - **TanStack React Query** para requisição e cache;
 * - **Zustand** (`useUserStore`) para persistência global do usuário.
 *
 * Faz automaticamente:
 *  - Chamada à API `/me`;
 *  - Armazenamento do resultado na store global;
 *  - Limpeza do estado em caso de erro (ex: token inválido).
 *
 * @example
 * ```tsx
 * const { user, loading, error, refetch } = useCurrentUser();
 *
 * if (loading) return <p>Carregando...</p>;
 * if (error) return <p>Erro: {(error as Error).message}</p>;
 *
 * return <h1>Bem-vindo, {user?.nome}</h1>;
 * ```
 *
 * @returns Um objeto contendo:
 * - `user`: Usuário autenticado atual ou `null` se não logado.
 * - `loading`: Indica se a requisição está em andamento.
 * - `error`: Erro retornado pela query (caso ocorra).
 * - `refetch`: Função para refazer manualmente a requisição.
 */
export function useCurrentUser(): {
    user: User | null;
    loading: boolean;
    error: unknown;
    refetch: () => Promise<QueryObserverResult<User, Error>>;
} {
    const { setUser, clearUser, user } = useUserStore();

    const query = useQuery<User, Error>({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
        refetchOnWindowFocus: false,
        retry: 1,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
        } else if (query.error) {
            clearUser();
        }
    }, [query.data, query.error, setUser, clearUser]);

    return {
        user: query.data ?? user,
        loading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
}
