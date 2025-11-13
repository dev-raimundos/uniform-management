"use client";

import { useEffect } from "react";
import { useCurrentUserQuery } from "@/modules/auth";
import { useUserStore } from "@/modules/auth";

export function UserInitializer() {
    const { data, error } = useCurrentUserQuery();
    const { setUser, clearUser, markLoaded, loaded } = useUserStore();

    // só roda 1 vez
    useEffect(() => {
        if (loaded) return;

        if (data) {
            setUser(data);
            markLoaded();
        } else if (error) {
            clearUser();
            markLoaded();
        }
    }, [data, error, loaded, setUser, clearUser, markLoaded]);

    return null;
}
