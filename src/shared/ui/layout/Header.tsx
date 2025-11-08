"use client";

import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";

/**
 * Cabeçalho fixo padrão, exibindo informações do usuário e ações globais.
 */
export function Header()
{
    return (
        <header className="flex h-16 w-full items-center justify-between border-b bg-background px-6">
            <h2 className="text-lg font-semibold text-foreground">
                Acompanhamento de Veículos
            </h2>

            <div className="flex items-center gap-3">
                <div className="flex flex-col text-right text-sm">
                    <span className="font-medium">Raimundos Marques Da Silva Neto</span>
                    <span className="text-muted-foreground text-xs">Auxiliar de TI</span>
                </div>

                <ThemeToggle/>
            </div>
        </header>
    );
}
