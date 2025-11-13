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
    /** Method HTTP a ser utilizado (GET, POST, PUT, DELETE, PATCH). */
    method?: HttpMethod;
    /** Corpo da requisição — serializado automaticamente quando necessário. */
    body?: unknown;
}

/**
 * Função genérica para requisições HTTP padronizadas à API externa.
 *
 * ---
 *
 * ## Objetivo
 * Centralizar todas as chamadas `fetch()` que se destinam à API **externa**
 * definida pela variável de ambiente `NEXT_PUBLIC_API_URL`.
 *
 * ---
 *
 * ## Comportamento
 *
 * - Obtém automaticamente o token JWT salvo via `js-cookie`;
 * - Injeta o header `Authorization: Bearer <token>` quando disponível;
 * - Define o header `Content-Type: application/json` por padrão;
 * - Converte o corpo (`body`) em JSON automaticamente, exceto para `string` e `FormData`;
 * - **Não força `cache: no-store`** — permitindo caching normal do navegador;
 * - Lança uma `Error` padronizada caso a resposta não seja `2xx`.
 *
 * ---
 *
 * ## Exemplos
 *
 * ### GET
 * ```ts
 * const user = await apiExternal<User>("/me");
 * ```
 *
 * ### POST
 * ```ts
 * await apiExternal("/users", {
 *   method: "POST",
 *   body: { name: "Lucas" },
 * });
 * ```
 *
 * ### Upload (FormData)
 * ```ts
 * const data = new FormData();
 * data.append("file", file);
 *
 * await apiExternal("/upload", {
 *   method: "POST",
 *   body: data,
 * });
 * ```
 *
 * ---
 *
 * @template T Tipo esperado na resposta JSON.
 * @param path Caminho relativo da API (ex.: `"/me"`).
 * @param options Configurações adicionais da requisição.
 * @returns Resposta tipada da API externa.
 * @throws `Error` caso a resposta HTTP não seja bem-sucedida.
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
    });

    if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw new Error(message);
    }

    return (await response.json()) as T;
}

/**
 * Resolve o token JWT atual a partir do cookie `token`.
 *
 * - Disponível somente no cliente (`js-cookie` não funciona no servidor);
 * - Retorna `null` caso o token não exista.
 */
function resolveAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = Cookies.get("token");
    if (token) return token;

    console.warn("[apiExternal] Nenhum token encontrado no cookie.");
    return null;
}

/**
 * Formata o corpo da requisição para envio via `fetch`.
 *
 * - `string` e `FormData` são mantidos;
 * - Objetos são automaticamente serializados para JSON;
 * - Valores `null` e `undefined` removem o corpo.
 */
function formatBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Extrai uma mensagem de erro padronizada da resposta HTTP.
 */
async function extractErrorMessage(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as Record<string, unknown>;
        return String(data.message ?? data.error ?? res.statusText);
    } catch {
        return res.statusText;
    }
}
