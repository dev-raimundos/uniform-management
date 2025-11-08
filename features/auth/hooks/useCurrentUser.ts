"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/features/auth";
import { useUserStore } from "@/shared/store/user.store";

/**
 * Hook que mantém o usuário autenticado sincronizado com o backend.
 * Faz a requisição `/me` ao carregar o app, usando o token JWT do cookie.
 *
 * Exemplo de uso:
 * ```tsx
 * const { user } = useCurrentUser();
 * ```
 */
export function useCurrentUser() {
    const user = useUserStore(
        (state) => state.user)
    ;

    console.log('Renderizou com user:', user);

    useEffect(() => {
        if (!user) {
            console.log('Buscando usuário no backend...');
            void getCurrentUser();
        }
        }, [ user ]
    );

    return { user };
}
