'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './client';
import React from "react";

interface ReactQueryProviderProps
{
    children: React.ReactNode;
}

/**
 * Provedor global do React Query.
 *
 * Envolve toda a aplicação em layout.tsx,
 * permitindo que qualquer componente use `useQuery` e `useMutation`.
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps)
{
    return (
        <QueryClientProvider client={ queryClient }>
            { children }
            {/* DevTools serve para inspecionar queries no navegador */ }
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </QueryClientProvider>
    );
}
