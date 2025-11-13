import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryProvider } from "@/shared/lib/react-query/provider";
import { ThemeProvider } from "@/shared/ui/theme-provider";
import { Sidebar } from "@/shared/ui/layout/Sidebar";
import { Header } from "@/shared/ui/layout/Header";
import { UserInitializer } from "@/modules/auth";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: [ "latin" ],
});

export default function RootLayout({ children }: React.PropsWithChildren)
{
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body className={ `${ geistSans.variable } ${ geistMono.variable } antialiased flex` }>

        {/* React Query global */ }
        <ReactQueryProvider>

            {/* Tema global */ }
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
