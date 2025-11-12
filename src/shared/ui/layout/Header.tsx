"use client";

import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";
import { useUserStore } from "@/modules/auth";

/**
 * Cabeçalho fixo padrão, exibindo informações do usuário e ações globais.
 */
export function Header()
{

    const user = useUserStore((state) => state.user);

    return (
        <header className="flex h-16 w-full items-center justify-between border-b bg-background px-6">
            <h2 className="text-lg font-semibold text-foreground">
                Acompanhamento de Veículos
            </h2>

            <div className="flex items-center gap-3">
                <div className="flex flex-col text-right text-sm">
                    { user ? (
                        <>
                            <span className="font-medium">{ user.nome }</span>
                            <span className="text-muted-foreground text-xs">{ user.cargo }</span>
                        </>
                    ) : (
                        <>
              <span className="font-medium text-muted-foreground">
                Usuário desconhecido
              </span>
                            <span className="text-muted-foreground text-xs">—</span>
                        </>
                    ) }
                </div>

                <ThemeToggle/>
            </div>
        </header>
    );
}
