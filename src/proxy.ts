import { NextRequest, NextResponse } from "next/server";

import supertokens from "supertokens-node";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { backendConfig } from "@/shared/config/supertokens-backend";

// Inicializa SuperTokens no server runtime
supertokens.init(backendConfig);

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Rotas públicas
  if (
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  try {
    let session: any = null;

    await superTokensNextWrapper(
      async (next) => {
        session = await verifySession()(request as any, {} as any, next);
      },
      request,
      NextResponse.next()
    );

    return NextResponse.next();
  } catch (err) {
    console.warn("Proxy: sessão inválida → redirecionando para /auth");

    const redirectUrl = new URL("/auth", request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth).*)"],
};
