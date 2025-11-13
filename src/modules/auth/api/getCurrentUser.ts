import { useUserStore, type User } from "@/modules/auth";
import { apiExternal } from "@/shared/lib/api";

/**
 * Busca o usuário autenticado na API `/me` e popula a store global.
 *
 * Responsabilidade: Essa camada lida apenas com a lógica da requisição HTTP,
 * no exemplo abaixo você verá como ele apenas chama a interface, storage de cache
 * e o HTTP
 */
export async function getCurrentUser(): Promise<void>
{
    try {
        const response = await apiExternal<{
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
