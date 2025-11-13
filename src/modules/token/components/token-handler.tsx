"use client";

import { useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiInternal } from "@/shared/lib/api";
import { saveToken } from "@/modules/token";

export default function TokenHandler()
{
    const searchParams = useSearchParams();

    useLayoutEffect(() =>
        {

            const token = searchParams.get("token");

            if (token) {

                saveToken(token);

                // Serve apenas para gerar um log no seu terminal com o conteúdo do token
                void apiInternal("/api/logs", {
                    method: "POST",
                    body: { token },
                });

                const cleanUrl = window.location.pathname;

                window.history.replaceState({}, "", cleanUrl);

                document.title = "Sismonaco";
            }
        },
        [
            searchParams
        ]
    );

    return null;
}
