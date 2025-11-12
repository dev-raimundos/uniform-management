import Cookies from "js-cookie";
import { env } from "@/shared/config/env";

/**
 * Tipos de métodos HTTP aceitos pela função {@link api}.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Parâmetros opcionais aceitos pela função {@link api}.
 *
 * Baseado em `RequestInit`, com suporte adicional para `method` e `body`.
 */
export interface ApiOptions extends Omit<RequestInit, "body"> {
    /** Method HTTP (GET, POST, PUT, DELETE, PATCH). */
    method?: HttpMethod;
    /** Corpo da requisição — convertido automaticamente em JSON, exceto se for `FormData` ou `string`. */
    body?: unknown;
}

/**
 * Função universal para requisições HTTP padronizadas.
 *
 * Responsável por centralizar todas as chamadas `fetch()` da aplicação.
 *
 * ---
 *
 * Comportamento por ambiente:
 * - Desenvolvimento (localhost):
 *   - Usa token do `.env.local` (`NEXT_PUBLIC_TEST_TOKEN`) ou do `localStorage`.
 *   - Nunca envia cookies automáticos (`credentials: "omit"`).
 * - Produção:
 *   - Usa token do cookie `access_token` definido pelo proxy.
 *   - Envia o token via header `Authorization`.
 *
 * ---
 *
 * Recursos automáticos:
 * - Define o header `Authorization: Bearer <token>`.
 * - Define o `Content-Type: application/json`.
 * - Converte corpo (`body`) em JSON automaticamente.
 * - Extrai e padroniza mensagens de erro.
 * - Remove cache (`cache: "no-store"`).
 *
 * ---
 *
 * @template T Tipo esperado na resposta JSON.
 * @param path Caminho relativo do endpoint (ex: `"/users"`, `"/auth/login"`).
 * @param options Opções adicionais (Method HTTP, corpo, headers, etc.).
 * @returns Promise tipada com o corpo da resposta convertido em JSON.
 *
 * ---
 *
 * Exemplos de uso:
 *
 * GET — buscar dados:
 * ```ts
 * const users = await api<User[]>("/users");
 * ```
 *
 * GET — com parâmetros:
 * ```ts
 * const params = new URLSearchParams({ page: "2", active: "true" });
 * const users = await api<User[]>(`/users?${params}`);
 * ```
 *
 * POST — criando um recurso:
 * ```ts
 * const newUser = await api<User>("/users", {
 *   method: "POST",
 *   body: { name: "Lucas", email: "lucas@empresa.com" },
 * });
 * ```
 *
 * PUT — atualização total:
 * ```ts
 * await api<User>("/users/123", {
 *   method: "PUT",
 *   body: { name: "Lucas Silva", email: "lucas@empresa.com" },
 * });
 * ```
 *
 * PATCH — atualização parcial:
 * ```ts
 * await api("/users/123", {
 *   method: "PATCH",
 *   body: { status: "active" },
 * });
 * ```
 *
 * DELETE — exclusão de recurso:
 * ```ts
 * await api("/users/123", { method: "DELETE" });
 * ```
 *
 * Upload de arquivo (FormData):
 * ```ts
 * const formData = new FormData();
 * formData.append("file", fileInput.files[0]);
 *
 * await api("/uploads", {
 *   method: "POST",
 *   body: formData, // não definir Content-Type manualmente
 * });
 * ```
 *
 * Headers personalizados:
 * ```ts
 * await api("/reports", {
 *   headers: { "X-App-Version": "2.1.0" },
 * });
 * ```
 *
 * Tratamento de erro:
 * ```ts
 * try {
 *   const users = await api<User[]>("/users");
 * } catch (error) {
 *   console.error("Falha:", error);
 * }
 * ```
 */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
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
        cache: "no-store",
    });

    if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw new Error(message);
    }

    return (await response.json()) as T;
}

/**
 * Resolve o token de autenticação atual.
 *
 * Em produção: lê o cookie `access_token`.
 * Em desenvolvimento: lê do `localStorage` ou de `NEXT_PUBLIC_TEST_TOKEN`.
 *
 * @returns O token JWT atual ou `null` se não existir.
 */
function resolveAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const isProd = process.env.NODE_ENV === "production";

    if (isProd) {
        const token = Cookies.get("access_token");
        if (token) return token;
    }

    const localToken = localStorage.getItem("access_token");
    if (localToken) return localToken;

    const testToken = env.NEXT_PUBLIC_TEST_TOKEN;
    if (testToken) {
        console.log("[api] Usando token de teste do .env.local");
        return testToken;
    }

    console.warn("[api] Nenhum token encontrado.");
    return null;
}

/**
 * Converte o corpo da requisição para o formato apropriado.
 *
 * - Strings e `FormData` são mantidos como estão.
 * - Objetos são serializados em JSON.
 * - `undefined` e `null` são ignorados.
 *
 * @param body Corpo da requisição.
 * @returns Corpo formatado para envio via `fetch`.
 */
function formatBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Extrai uma mensagem de erro da resposta HTTP.
 *
 * Caso o corpo contenha um JSON com `message` ou `error`,
 * retorna esse valor. Caso contrário, retorna o `statusText`.
 *
 * Exemplo de resposta:
 * ```json
 * { "error": true, "message": "Usuário não encontrado" }
 * ```
 *
 * @param res Resposta HTTP.
 * @returns Mensagem de erro extraída.
 */
async function extractErrorMessage(res: Response): Promise<string> {
    try {
        const data = (await res.json()) as Record<string, unknown>;
        return String(data.message ?? data.error ?? res.statusText);
    } catch {
        return res.statusText;
    }
}
