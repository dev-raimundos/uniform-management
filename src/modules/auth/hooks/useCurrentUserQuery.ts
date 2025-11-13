"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/modules/auth";

export function useCurrentUserQuery(enabled = true) {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: fetchCurrentUser,
        enabled,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}
