import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy universal para autenticação.
 *
 * Responsável por:
 *  - Capturar o token JWT da URL (?token=xxx);
 *  - Armazenar o token em um cookie acessível ao front (`js-cookie`);
 *  - Limpar a URL após o redirecionamento;
 *  - Funcionar de forma idêntica em desenvolvimento e produção.
 *
 * ---
 *
 * Em desenvolvimento:
 *   - `httpOnly: false`, `secure: false`
 *   - Permite leitura pelo JS via `js-cookie`
 *
 * Em produção:
 *   - `httpOnly: false`, `secure: true`
 *   - Usa HTTPS, mas o JS ainda consegue ler o cookie (intranet controlada)
 *
 * ---
 *
 * O cookie `token` tem duração de 2h e é propagado globalmente (`path: "/"`).
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
            httpOnly: false,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 2,
        });

        console.log(`[Proxy] Token capturado e salvo no cookie (${ isProd ? "PROD" : "DEV" }):`, tokenFromUrl);
        return response;
    }

    if (!tokenFromCookie) {
        console.warn("[Proxy] Nenhum token encontrado — usuário não autenticado.");
    }

    return NextResponse.next();
}

/**
 * Define onde o proxy será aplicado:
 * todas as rotas, exceto as internas do Next.js.
 */
export const config = {
    matcher: [ "/((?!_next|api|favicon.ico).*)" ],
};
