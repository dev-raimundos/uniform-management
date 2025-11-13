"use client";

import { QueryClient } from "@tanstack/react-query";

let client: QueryClient | null = null;

/**
 * Retorna uma instância única (singleton) do QueryClient.
 *
 * Evita recriação durante navegação do Next.js,
 * garantindo cache consistente e estável.
 */
export function getQueryClient() {
    if (!client) {
        client = new QueryClient({
            defaultOptions: {
                queries: {
                    /**
                     * ❗ IMPORTANTE:
                     * Com Next.js App Router, o ideal é NÃO revalidar
                     * automaticamente ao focar a janela.
                     */
                    refetchOnWindowFocus: false,
                    refetchOnReconnect: false,

                    /**
                     * ❗ Opcional:
                     * Retry é bom em produção, mas baixo para UX.
                     */
                    retry: 1,

                    /**
                     * Tempo em que a query permanece "fresca".
                     * Evita re-fetchs acidentais.
                     */
                    staleTime: 1000 * 60 * 5, // 5 minutos

                    /**
                     * Evita re-execução da query sem necessidade.
                     */
                    refetchInterval: false,

                    /**
                     * ❗ IMPORTANTE:
                     * Queries jogam erro no suspense, mas podem ser tratadas.
                     */
                    throwOnError: false,
                },

                mutations: {
                    retry: 1,
                },
            },
        });
    }
    return client;
}
