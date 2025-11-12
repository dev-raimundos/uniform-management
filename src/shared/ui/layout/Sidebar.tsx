"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/utils/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/modules/theme/components/ThemeToggle";

const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Torre de Controle", href: "/torre-de-controle" },
    { name: "Configurações", href: "/configuracoes" },
];

/**
 * Sidebar fixa lateral, com integração de tema e menu dinâmico.
 */
export function Sidebar()
{
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-background p-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-semibold">SisMônaco</h1>
            </div>

            <nav className="flex-1 space-y-2">
                { menu.map((item) => (
                    <Link
                        key={ item.href }
                        href={ item.href }
                        className={ cn(
                            "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground"
                        ) }
                    >
                        { item.name }
                    </Link>
                )) }
            </nav>

            <div className="mt-auto pt-4 border-t">
                <ThemeToggle/>
            </div>
        </aside>
    );
}
