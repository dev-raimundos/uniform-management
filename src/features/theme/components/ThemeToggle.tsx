"use client";

import { useThemeStore } from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Button } from "@/shared/ui/button";

/**
 * Botão de alternância de tema, integrado com Zustand.
 * Usa ícones Radix e componentes do Shadcn.
 */
export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
        >
            {theme === "light" ? (
                <SunIcon className="h-5 w-5 text-foreground" />
            ) : (
                <MoonIcon className="h-5 w-5 text-foreground" />
            )}
        </Button>
    );
}
