import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware responsável por capturar o token da URL (?token=xxx),
 * armazená-lo em um cookie e permitir que o front consuma normalmente.
 *
 * ---
 *
 * Em desenvolvimento:
 *   - Usa `httpOnly: false` e `secure: false`
 *   - Permite leitura via `js-cookie`
 *
 * Em produção:
 *   - Usa `httpOnly: true` e `secure: true`
 *   - Protege o cookie contra acesso via JavaScript
 *
 * ---
 *
 * O cookie tem duração de 2h e é propagado em todas as rotas.
 */
export async function proxy(request: NextRequest)
{
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

        console.log(`[Middleware] Token capturado e salvo (${ isProd ? "PROD" : "DEV" }):`, tokenFromUrl);
        return response;
    }

    if (!tokenFromCookie) {
        console.warn("[Middleware] Nenhum token encontrado — usuário não autenticado.");
    }

    return NextResponse.next();
}

/**
 * Aplica o middleware a todas as rotas,
 * exceto as internas do Next (_next, api, favicon).
 */
export const config = {
    matcher: [ "/((?!_next|api|favicon.ico).*)" ],
};
