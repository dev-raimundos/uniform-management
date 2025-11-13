import { apiExternal } from "@/shared/lib/api";
import type { User } from "@/modules/auth";

/**
 * Função pura que busca o usuário via `/me`.
 * Usada pelo React Query.
 */
export async function fetchCurrentUser(): Promise<User> {
    const response = await apiExternal<{ results: User }>("/me");
    return response.results;
}
