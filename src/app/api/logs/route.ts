import { NextRequest, NextResponse } from "next/server";

/**
 * Serve apenas para exibir no terminal um log com o token, em tempo de desenvolvimento.
 * @param req
 * @constructor
 */
export async function POST(req: NextRequest) {

    const { token } = await req.json();

    console.log("[Server] Token recebido:", token);

    return NextResponse.json({ ok: true });
}
