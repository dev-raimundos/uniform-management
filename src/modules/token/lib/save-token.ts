import Cookies from "js-cookie";

/**
 * Define onde e como o token será armazenado.
 * Usa `js-cookie` para salvar de forma consistente entre o cliente e o `apiExternal()`.
 */
export function saveToken(token: string)
{
    try {
        Cookies.set(
            "access_token",
            token,
            {
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                expires: 1 / 12, // 2h (1 dia / 12 = 2h)
            }
        );

        console.log("[TokenHandler] Token salvo via js-cookie:", token);

    } catch (err) {

        console.error("[TokenHandler] Falha ao salvar token:", err);
    }
}
