import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

/**
 * Proxy responsável por interceptar requisições e gerenciar autenticação via cookie ou token.
 *
 * - Em desenvolvimento, insere um token de teste definido em `.env.local` caso o cookie não exista.
 * - Caso a URL contenha `?token=`, grava o cookie e redireciona o usuário para a mesma rota sem o parâmetro.
 * - Caso não exista token válido, redireciona o usuário para a página de login.
 *
 * Essa configuração substitui o antigo `middleware.ts` nas versões recentes do Next.js (15+).
 */
export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const tokenFromUrl = url.searchParams.get("token");
    const tokenFromCookie = request.cookies.get("access_token")?.value;

    // Ambiente local: aplica token de teste caso não exista cookie
    if (process.env.NODE_ENV === "development" && !tokenFromCookie) {
        const testToken = env.NEXT_PUBLIC_TEST_TOKEN;
        if (testToken) {
            console.log("Proxy: usando token de teste do .env.local");
            const res = NextResponse.next();
            res.cookies.set("access_token", testToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 2, // 2h
                path: "/",
            });
            return res;
        }
    }

    // Token presente na URL — grava cookie e redireciona para limpar a query string
    if (tokenFromUrl) {
        const res = NextResponse.redirect(new URL(url.pathname, env.NEXT_PUBLIC_APP_URL));
        res.cookies.set("access_token", tokenFromUrl, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 2, // 2h
            path: "/",
        });
        return res;
    }

    // Sem cookie de autenticação — redireciona para a tela de login
    if (!tokenFromCookie) {
        return NextResponse.redirect(env.NEXT_PUBLIC_LOGIN_URL);
    }

    // Requisição autenticada — segue normalmente
    return NextResponse.next();
}

/**
 * Define quais rotas devem passar pelo proxy.
 * O padrão abaixo intercepta todas as rotas, exceto as internas do Next.js e API routes.
 */
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
