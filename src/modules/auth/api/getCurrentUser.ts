import { api } from "@/shared/lib/api";
import { useUserStore, type User } from "@/shared/store/user.store";

/**
 * Busca o usuário autenticado na API `/me` e popula a store global.
 */
export async function getCurrentUser(): Promise<void> {
    try {
        const response = await api<{
            error: boolean;
            message: string;
            results: User;
        }>("/me");

        if (response.error) {
            const { clearUser } = useUserStore.getState();
            clearUser();
            return;
        }

        const { setUser } = useUserStore.getState();
        setUser(response.results);
    } catch (error) {
        const { clearUser } = useUserStore.getState();
        clearUser();
        console.error("Falha ao carregar usuário:", error);
    }
}
