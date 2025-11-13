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
export interface ApiOptions extends Omit<RequestInit, "body">
{
    /** Method HTTP (GET, POST, PUT, DELETE, PATCH). */
    method?: HttpMethod;
    /** Corpo da requisição — convertido automaticamente em JSON, exceto se for `FormData` ou `string`. */
    body?: unknown;
}

/**
 * Função universal para requisições HTTP padronizadas à API externa.
 *
 * ---
 *
 * ### Propósito
 * Centralizar todas as chamadas `fetch()` destinadas à API **externa** da aplicação
 * (definida pela variável `NEXT_PUBLIC_API_URL`).
 *
 * ---
 *
 * ###  Comportamento
 *
 * - Injeta automaticamente o token JWT salvo no cookie `access_token`
 *   via header `Authorization: Bearer <token>`.
 * - Define o header `Content-Type: application/json` (salvo se sobrescrito).
 * - Converte o corpo (`body`) para JSON automaticamente, exceto `FormData` e `string`.
 * - Desativa cache de requisições (`cache: "no-store"`).
 * - Lança um `Error` com a mensagem padronizada se a resposta HTTP não for bem-sucedida.
 *
 * ---
 *
 * ### Uso recomendado
 *
 * Use para todas as chamadas ao backend real (fora do domínio do Next.js),
 * enquanto chamadas internas devem usar {@link apiInternal}.
 *
 * ---
 *
 * ### Exemplos
 *
 * **GET — buscar dados:**
 * ```ts
 * const users = await apiExternal<User[]>("/users");
 * ```
 *
 * **POST — criar recurso:**
 * ```ts
 * const user = await apiExternal<User>("/users", {
 *   method: "POST",
 *   body: { name: "Lucas", email: "lucas@empresa.com" },
 * });
 * ```
 *
 * **PUT — atualizar recurso:**
 * ```ts
 * await apiExternal("/users/123", {
 *   method: "PUT",
 *   body: { active: true },
 * });
 * ```
 *
 * **DELETE — excluir recurso:**
 * ```ts
 * await apiExternal("/users/123", { method: "DELETE" });
 * ```
 *
 * **Upload (FormData):**
 * ```ts
 * const data = new FormData();
 * data.append("file", file);
 * await apiExternal("/upload", { method: "POST", body: data });
 * ```
 *
 * **Headers personalizados:**
 * ```ts
 * await apiExternal("/reports", {
 *   headers: { "X-App-Version": "2.1.0" },
 * });
 * ```
 *
 * ---
 *
 * @template T Tipo esperado na resposta JSON.
 * @param path Caminho relativo do endpoint (ex: `"/users"`, `"/auth/login"`).
 * @param options Opções adicionais (method, corpo, headers, etc.).
 * @returns Promise com o corpo da resposta convertido em JSON.
 * @throws `Error` se a requisição retornar status diferente de 2xx.
 */
export async function apiExternal<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T>
{
    const baseUrl = env.NEXT_PUBLIC_API_URL;
    const url = `${ baseUrl }${ path }`;
    const token = resolveAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${ token }` } : {}),
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
 * Resolve o token de autenticação atual a partir do cookie `access_token`.
 *
 * ---
 *
 * - Usa a biblioteca `js-cookie` para ler o cookie em ambiente cliente.
 * - Não utiliza `localStorage` nem variáveis `.env` como fallback.
 * - Caso o cookie não exista, retorna `null` e exibe um aviso no console.
 *
 * ---
 *
 * @returns O token JWT atual ou `null` se não existir.
 */
function resolveAccessToken(): string | null
{
    if (typeof window === "undefined") return null;

    const token = Cookies.get("access_token");
    if (token) return token;

    console.warn("[apiExternal] Nenhum token encontrado no cookie.");
    return null;
}

/**
 * Converte o corpo da requisição (`body`) para o formato apropriado.
 *
 * ---
 *
 * - Strings e `FormData` são mantidos como estão.
 * - Objetos são serializados em JSON.
 * - `undefined` e `null` são ignorados.
 *
 * ---
 *
 * @param body Corpo da requisição.
 * @returns Corpo formatado para envio via `fetch`.
 */
function formatBody(body: unknown): BodyInit | undefined
{
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Extrai e padroniza uma mensagem de erro a partir da resposta HTTP.
 *
 * ---
 *
 * - Se o corpo contiver um JSON com `message` ou `error`, usa esse valor.
 * - Caso contrário, retorna o `statusText` da resposta.
 *
 * ---
 *
 * @param res Resposta HTTP (`Response`).
 * @returns Mensagem de erro extraída.
 */
async function extractErrorMessage(res: Response): Promise<string>
{
    try {
        const data = (await res.json()) as Record<string, unknown>;
        return String(data.message ?? data.error ?? res.statusText);
    } catch {
        return res.statusText;
    }
}
