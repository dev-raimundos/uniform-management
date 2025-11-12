"use client";

import { useCurrentUser } from "@/modules/auth";

/**
 * Componente cliente que inicializa os dados do usuário.
 *
 * É usado dentro do layout para garantir que o `/me`
 * seja chamado assim que a aplicação é carregada.
 *
 * Não renderiza nada visualmente — apenas executa o hook.
 */
export function UserInitializer() {
    useCurrentUser();
    return null;
}
