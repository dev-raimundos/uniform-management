"use client";
import { useCurrentUser } from "@/modules/auth";

/**
 * Inicializa os dados do usuário autenticado.
 */
export function UserInitializer() {
    useCurrentUser();
    return null;
}
