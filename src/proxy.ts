import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy universal para autenticação.
 *
 * Faz automaticamente:
 *  - Captura o token da URL (?token=xxx) e salva no cookie.
 *  - Injeta o header `Authorization: Bearer <token>` em todas as requisições.
 *  - Funciona tanto em localhost (JS pode ler) quanto em produção (HttpOnly seguro).
 */
export async function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const tokenFromUrl = url.searchParams.get("token");
    const tokenFromCookie = request.cookies.get("token")?.value;
    const isProd = process.env.NODE_ENV === "production";

    if (tokenFromUrl) {
        url.searchParams.delete("token");

        const response = NextResponse.redirect(url);
        response.cookies.set("token", tokenFromUrl, {
            httpOnly: isProd,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 2,
        });

        console.log(`[Proxy] Token capturado e salvo (${isProd ? "PROD" : "DEV"})`);
        return response;
    }

    const token = tokenFromCookie;
    if (token) {
        const requestHeaders = new Headers(request.headers);

        if (!requestHeaders.has("Authorization")) {
            requestHeaders.set("Authorization", `Bearer ${token}`);
        }

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    console.warn("[Proxy] Nenhum token encontrado — requisição sem autenticação.");
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};
