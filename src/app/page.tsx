"use client";
"use client";

import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";

export default function Home() {
    const { user, loading, error } = useCurrentUser();

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro: {(error as Error).message}</p>;
    if (!user) return <p>Nenhum usuário autenticado.</p>;

    return (
        <div>
            <h1>Bem-vindo, {user.cargo}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}
