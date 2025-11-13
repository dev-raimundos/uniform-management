/**
 * Tipos de métodos HTTP aceitos pela função {@link apiInternal}.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Parâmetros opcionais aceitos pela função {@link apiInternal}.
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
 * Função utilitária para chamadas de **rotas internas** do Next.js,
 * como **API Routes** (`/api/...`) ou **Server Actions** expostas via `fetch()`.
 *
 * ---
 *
 * ###  Comportamento
 *
 * - **Exige** que o caminho (`path`) comece com `"/api/"`.
 * - Usa `fetch()` diretamente no domínio atual (sem base externa).
 * - Define o header `Content-Type: application/json` por padrão.
 * - Converte automaticamente o corpo (`body`) para JSON.
 * - Remove cache de requisições (`cache: "no-store"`).
 * - Lança `Error` padronizado se a resposta não for bem-sucedida.
 *
 * ---
 *
 * ### Exemplos
 *
 * **POST — logar evento interno:**
 * ```ts
 * await apiInternal("/api/logs", {
 *   method: "POST",
 *   body: { message: "Token capturado com sucesso" },
 * });
 * ```
 *
 * **GET — buscar dados internos:**
 * ```ts
 * const stats = await apiInternal<AppStats>("/api/stats");
 * ```
 *
 * **PATCH — atualizar cache:**
 * ```ts
 * await apiInternal("/api/cache", {
 *   method: "PATCH",
 *   body: { key: "user-list" },
 * });
 * ```
 *
 * ---
 *
 * @template T Tipo esperado na resposta JSON.
 * @param path Caminho relativo do endpoint interno (ex: `"/api/logs"`).
 * @param options Opções adicionais da requisição (`method`, `body`, `headers`, etc.).
 * @returns Promise tipada com o corpo da resposta convertido em JSON.
 * @throws `Error` se o caminho não começar com `/api/` ou se a requisição falhar.
 */
export async function apiInternal<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T>
{
    if (!path.startsWith("/api/")) {
        throw new Error(`[apiInternal] Caminho inválido: "${ path }". Use "/api/...".`);
    }

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
    };

    const response = await fetch(path, {
        ...options,
        headers,
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
 * Extrai e padroniza uma mensagem de erro da resposta HTTP.
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
