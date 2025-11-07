import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().refine((val) => {
        try {
            new URL(val);
            return true;
        } catch {
            return false;
        }
    }, "NEXT_PUBLIC_API_URL deve ser uma URL válida"),

    NEXT_PUBLIC_APP_URL: z.string().refine((val) => {
        try {
            new URL(val);
            return true;
        } catch {
            return false;
        }
    }, "NEXT_PUBLIC_APP_URL deve ser uma URL válida"),
});

export const env = envSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
