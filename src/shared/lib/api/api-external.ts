import Cookies from "js-cookie";
import { env } from "@/shared/config/env";

/**
 * Tipos de métodos HTTP aceitos pela função {@link apiExternal}.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Parâmetros opcionais aceitos pela função {@link apiExternal}.
 *
 * Baseado em `RequestInit`, com suporte adicional para `method` e `body`.
 */
export interface ApiOptions extends Omit<RequestInit, "body"> {
    /** Method HTTP da requisição (GET, POST, PUT, DELETE, PATCH). */
    method?: HttpMethod;

    /**
     * Corpo da requisição.
     * - Objetos são convertidos automaticamente para JSON;
     * - `FormData` e `string` são mantidos como estão.
     */
    body?: unknown;
}

/**
 * Função universal para requisições HTTP à API externa da aplicação.
 *
 * ---
 *
 * ## Objetivo
 * Centralizar todas as chamadas HTTP destinadas à API **externa**,
 * definida pela variável `NEXT_PUBLIC_API_URL`.
 *
 * ---
 *
 * ## Comportamento
 *
 * - Obtém o token JWT via `js-cookie` e injeta no header Authorization;
 * - Define `Content-Type: application/json` (padrão);
 * - Converte automaticamente o corpo da requisição em JSON quando necessário;
 * - **Não usa mais `cache: "no-store"`**, permitindo funcionamento normal
 *   do cache do navegador e evitando re-fetchs indesejados no Next.js;
 * - Lança um `Error` padronizado caso a resposta não seja `2xx`.
 *
 * ---
 *
 * ## Exemplos
 *
 * ### GET
 * ```ts
 * const result = await apiExternal<User>("/me");
 * ```
 *
 * ### POST (JSON)
 * ```ts
 * await apiExternal("/users", {
 *   method: "POST",
 *   body: { name: "Lucas" }
 * });
 * ```
 *
 * ### PUT (FormData)
 * ```ts
 * const data = new FormData();
 * data.append("file", image);
 *
 * await apiExternal("/profile/avatar", {
 *   method: "PUT",
 *   body: data
 * });
 * ```
 *
 * ### Headers adicionais
 * ```ts
 * await apiExternal("/export", {
 *   headers: { "X-Feature": "beta" }
 * });
 * ```
 *
 * ---
 *
 * @template T Tipo esperado no corpo da resposta.
 * @param path Caminho relativo do endpoint externo (ex.: `/me`, `/users/10`).
 * @param options Opções adicionais da requisição.
 * @returns JSON tipado da resposta.
 * @throws `Error` quando a API retorna status HTTP não bem-sucedido.
 */
export async function apiExternal<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const baseUrl = env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}${path}`;

    const token = resolveAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "omit",
        body: formatBody(options.body),
        /**
         * Não usamos mais `cache: "no-store"` aqui.
         * Deixamos o comportamento padrão do navegador,
         * que evita revalidações desnecessárias em navegação
         * do Next.js App Router.
         */
    });

    if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw new Error(message);
    }

    return (await response.json()) as T;
}

/**
 * Obtém o token de autenticação salvo no cookie `token`.
 *
 * - Disponível apenas no cliente;
 * - Retorna `null` caso não exista token.
 */
function resolveAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = Cookies.get("token");
    if (token) return token;

    console.warn("[apiExternal] Nenhum token encontrado no cookie.");
    return null;
}

/**
 * Formata corretamente o corpo da requisição.
 *
 * - `string` e `FormData` são retornados como estão;
 * - Objetos são automaticamente serializados em JSON;
 * - `null` e `undefined` resultam em ausência de corpo.
 */
function formatBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Extrai uma mensagem amigável da resposta de erro.
 *
 * - Tenta interpretar o JSON retornado pela API;
 * - Usa `message`, `error` ou `statusText`;
 * - Fallback em caso de resposta inválida.
 */
async function extractErrorMessage(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as Record<string, unknown>;
        return String(data.message ?? data.error ?? res.statusText);
    } catch {
        return res.statusText;
    }
}
