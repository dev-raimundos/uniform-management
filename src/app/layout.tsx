import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/shared/ui/layout/Sidebar";
import { Header } from "@/shared/ui/layout/Header";
import { ThemeProvider } from "@/shared/ui/theme-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SisMônaco",
    description: "Sistema de acompanhamento de veículos",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Sidebar />
            <main className="flex-1 flex flex-col bg-background text-foreground">
                <Header />
                <div className="p-6 flex-1 overflow-y-auto">{children}</div>
            </main>
        </ThemeProvider>
        </body>
        </html>
    );
}
