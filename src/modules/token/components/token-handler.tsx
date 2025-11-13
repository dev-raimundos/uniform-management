"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveToken } from "@/modules/token";

export default function TokenHandler() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {

            saveToken(token);

            const cleanUrl = window.location.pathname;

            window.history.replaceState({}, "", cleanUrl);

            console.log("[TokenHandler] Token capturado e salvo:", token);
        }
    }, [searchParams]);

    return null;
}
