"use client";

import { useState } from "react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { SuperTokensProvider } from "@/modules/auth/components/SuperTokensProvider";

export default function AuthPage() {
    return (
        <SuperTokensProvider>
            <AuthForm />
        </SuperTokensProvider>
    );
}

function AuthForm() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit() {
        setError("");

        try {
            if (mode === "signin") {
                const res = await EmailPassword.signIn({
                    formFields: [
                        { id: "email", value: email },
                        { id: "password", value: password },
                    ],
                });

                switch (res.status) {
                    case "OK":
                        window.location.href = "/dashboard";
                        return;

                    case "WRONG_CREDENTIALS_ERROR":
                        setError("Credenciais inválidas.");
                        return;

                    case "FIELD_ERROR":
                        setError(res.formFields[0]?.error ?? "Erro no formulário.");
                        return;

                    case "SIGN_IN_NOT_ALLOWED":
                        setError(res.reason);
                        return;
                }

            } else {
                const res = await EmailPassword.signUp({
                    formFields: [
                        { id: "email", value: email },
                        { id: "password", value: password },
                    ],
                });

                switch (res.status) {
                    case "OK":
                        window.location.href = "/dashboard";
                        return;

                    case "FIELD_ERROR":
                        setError(res.formFields[0]?.error ?? "Erro no formulário.");
                        return;

                    case "SIGN_UP_NOT_ALLOWED":
                        setError(res.reason);
                        return;
                }
            }

        } catch (err) {
            console.error(err);
            setError("Erro inesperado.");
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-20">
            <h1 className="text-xl font-bold mb-4">
                {mode === "signin" ? "Entrar" : "Criar conta"}
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
                type="email"
                className="border p-2 w-full mb-2"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="border p-2 w-full mb-4"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="bg-blue-600 text-white p-2 w-full"
                onClick={handleSubmit}
            >
                {mode === "signin" ? "Entrar" : "Registrar"}
            </button>

            <button
                className="text-sm text-blue-600 mt-3"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
                {mode === "signin" ? "Criar conta" : "Entrar"}
            </button>
        </div>
    );
}
