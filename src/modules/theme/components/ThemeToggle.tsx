"use client";

import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Botão de alternância de tema totalmente compatível com React 19.
 * Evita hydration mismatch sem violar regras de ESLint.
 */
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setIsReady(true));
    }, []);

    if (!isReady) {
        return (
            <Button variant="ghost" size="icon" aria-label="Alternar tema">
                <div className="h-5 w-5" />
            </Button>
        );
    }

    const nextTheme = resolvedTheme === "light" ? "dark" : "light";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(nextTheme)}
            aria-label="Alternar tema"
        >
            {resolvedTheme === "light" ? (
                <SunIcon className="h-5 w-5 text-foreground" />
            ) : (
                <MoonIcon className="h-5 w-5 text-foreground" />
            )}
        </Button>
    );
}
