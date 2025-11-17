"use client";

import SuperTokensReact from "supertokens-auth-react";
import { supertokensConfig } from "@/shared/config/supertokens";
import { ReactNode } from "react";

// Inicializa apenas no browser
if (typeof window !== "undefined") {
    SuperTokensReact.init(supertokensConfig);
}

export function SuperTokensProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
