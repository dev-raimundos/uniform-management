import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

export function middleware(req: NextRequest)
{
    const url = req.nextUrl.clone();
    const tokenFromUrl = url.searchParams.get("token");
    const tokenFromCookie = req.cookies.get("access_token")?.value;

    if (tokenFromUrl) {
        const res = NextResponse.redirect(new URL(url.pathname, env.NEXT_PUBLIC_APP_URL));

        res.cookies.set("access_token", tokenFromUrl, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 2,
            path: "/",
        });

        return res;
    }

    if (!tokenFromCookie) {
        return NextResponse.redirect(`${ env.NEXT_PUBLIC_API_URL }/login`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [ "/((?!_next|api|favicon.ico).*)" ],
};
