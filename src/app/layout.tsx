import { ThemeProvider } from "@/shared/ui/theme-provider";
import { ReactQueryProvider } from "@/shared/lib/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/shared/ui/layout/Sidebar";
import { Header } from "@/shared/ui/layout/Header";
import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { useCurrentUser } from "@/modules/auth";

/**
 * Hook executor: garante que o /me seja chamado na inicialização da aplicação.
 * Esse componente é separado porque hooks não podem ser usados diretamente
 * dentro de arquivos de layout (Next.js exige componente client).
 */
function UserInitializer()
{
    useCurrentUser();
    return null;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: [ "latin" ],
});

export const metadata: Metadata = {
    title: "SisMônaco",
    description: "Sistema de acompanhamento de veículos",
};

export default function RootLayout({ children, }: { children: React.ReactNode; })
{
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body
            className={ `${ geistSans.variable } ${ geistMono.variable } antialiased flex` }
        >
        <ReactQueryProvider>

            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

                <UserInitializer/>

                <Sidebar/>

                <main className="flex-1 flex flex-col bg-background text-foreground">
                    <Header/>
                    <div className="p-6 flex-1 overflow-y-auto">
                        { children }
                    </div>
                </main>
            </ThemeProvider>

        </ReactQueryProvider>
        </body>
        </html>
    );
}
