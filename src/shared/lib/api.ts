import Cookies from "js-cookie";
import { env } from "@/shared/config/env";

/**
 * Tipos de métodos HTTP aceitos.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiOptions extends Omit<RequestInit, "body"> {
    method?: HttpMethod;
    body?: unknown;
}

/**
 * Função universal para requisições HTTP padronizadas.
 *
 *   Em dev → usa token do .env.local ou localStorage
 *   Em produção → usa token do cookie `access_token`
 *   Sempre envia o header Authorization (nunca cookies)
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
 * Resolve o token de autenticação:
 *    Produção → lê do cookie `access_token`
 *    Dev → lê do localStorage ou do .env.local
 */
function resolveAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    const isProd = process.env.NODE_ENV === "production";

    // Produção: token vem do cookie
    if (isProd) {
        const token = Cookies.get("access_token");
        if (token) return token;
    }

    // Desenvolvimento: tenta localStorage → .env.local
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
 * Converte o corpo da requisição.
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
