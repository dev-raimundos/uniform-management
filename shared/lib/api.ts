import { env } from "@/shared/config/env";

/**
 * Tipos de métodos HTTP aceitos.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Parâmetros aceitos pela função `api`.
 * Baseado em `RequestInit`, com suporte a corpo genérico.
 */
export interface ApiOptions extends Omit<RequestInit, "body"> {
    method?: HttpMethod;
    body?: unknown;
}

/**
 * Função universal para realizar requisições HTTP padronizadas.
 *
 * Centraliza a comunicação entre o front-end e a API da aplicação,
 * aplicando automaticamente:
 *  - Base URL do backend (`env.NEXT_PUBLIC_API_URL`);
 *  - Cabeçalhos padrão (`Content-Type: application/json`);
 *  - Envio automático de cookies (`credentials: "include"`);
 *  - Conversão automática do corpo para JSON;
 *  - Tratamento unificado de erros.
 *
 * ---
 *
 * ### Uso básico
 * ```ts
 * // Exemplo 1: Buscar usuários
 * const users = await api<User[]>("/users");
 *
 * // Exemplo 2: Criar um novo usuário
 * const newUser = await api<User>("/users", {
 *   method: "POST",
 *   body: { name: "Lucas", email: "lucas@empresa.com" }
 * });
 * ```
 *
 * ### Tratamento de erro
 * ```ts
 * try {
 *   const users = await api<User[]>("/users");
 * } catch (error) {
 *   console.error("Falha ao buscar usuários:", error);
 * }
 * ```
 *
 * @template T Tipo esperado na resposta JSON.
 * @param {string} path Caminho do endpoint (ex: "/users")
 * @param {ApiOptions} [options] Configurações opcionais (method, corpo, headers, etc.)
 * @returns {Promise<T>} Retorna o corpo da resposta convertido em JSON tipado.
 * @throws {Error} Se a resposta não for bem-sucedida (posição HTTP fora da faixa 200–299)
 */
export async function api<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const baseUrl = env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${path}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
        body: formatBody(options.body),
        cache: "no-store",
    });

    if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw new Error(message);
    }

    return (await response.json()) as T;
}

/**
 * Converte o corpo da requisição em formato adequado para o `fetch`.
 */
function formatBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Extrai mensagens de erro da resposta HTTP.
 */
async function extractErrorMessage(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as Record<string, unknown>;
        return String(data.message ?? data.error ?? res.statusText);
    } catch {
        return res.statusText;
    }
}
