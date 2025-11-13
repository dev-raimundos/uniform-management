import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

/**
 * Proxy responsável por interceptar requisições e gerenciar autenticação via cookie ou token.
 *
 * Em produção:
 *   - Captura o token via URL (?token=xxx) e grava no cookie `access_token`.
 *
 * Em desenvolvimento:
 *   - Captura o token via URL (se existir);
 *   - Caso contrário, usa o token de teste (`NEXT_PUBLIC_TEST_TOKEN`) do .env.local
 *     para evitar redirecionamentos e permitir login automático local.
 *
 * Caso não haja nenhum token disponível, redireciona para a tela de login.
 */
export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const tokenFromUrl = url.searchParams.get("token");
    const tokenFromCookie = request.cookies.get("access_token")?.value;
    const isProd = process.env.NODE_ENV === "production";
    const isDev = process.env.NODE_ENV === "development";

    if (tokenFromUrl) {
        const redirectUrl = new URL(url.pathname, env.NEXT_PUBLIC_APP_URL);
        const res = NextResponse.redirect(redirectUrl);

        res.cookies.set("access_token", tokenFromUrl, {
            httpOnly: false,
            secure: isProd,
            sameSite: isProd ? "lax" : "none",
            maxAge: 60 * 60 * 2,
            path: "/",
        });

        console.log("[Proxy] Token capturado da URL e salvo como cookie.");
        return res;
    }

    if (isDev && !tokenFromCookie) {
        const testToken = env.NEXT_PUBLIC_TEST_TOKEN;
        if (testToken) {
            console.log("[Proxy] Dev mode: usando token de teste do .env.local");
            const res = NextResponse.next();
            res.cookies.set("access_token", testToken, {
                httpOnly: false,
                secure: false,
                sameSite: "none",
                maxAge: 60 * 60 * 2,
                path: "/",
            });
            return res;
        }
    }

    const token = tokenFromCookie ?? null;
    if (!token) {
        console.warn("[Proxy] Nenhum token encontrado — redirecionando para login.");
        //return NextResponse.redirect(env.NEXT_PUBLIC_LOGIN_URL);
    }

    return NextResponse.next();
}

/**
 * Define quais rotas passam pelo middleware.
 */
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
