"use client";

import Session from "supertokens-auth-react/recipe/session";

export function LogoutButton() {
    async function handleLogout() {
        await Session.signOut();
        window.location.href = "/auth";
    }

    return (
        <button onClick={handleLogout} className="text-red-500 ml-auto">
            Sair
        </button>
    );
}
