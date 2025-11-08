'use client';

import { QueryClient } from '@tanstack/react-query';

/**
 * Instância única (singleton) do QueryClient.
 *
 * É responsável por gerenciar o cache, requisições,
 * e estado global das queries.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true, // Recarrega quando o usuário volta à aba
            retry: 1,                   // Quantas tentativas em caso de erro
            staleTime: 30 * 1000,       // Dados considerados "frescos" por 30s
        },
    },
});
