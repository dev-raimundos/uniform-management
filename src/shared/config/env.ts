import { z } from "zod";

/**
 * Valida e tipa as variáveis de ambiente públicas da aplicação.
 * Cada campo é validado para garantir que contenha uma URL válida.
 * O token de teste é opcional e usado apenas em ambiente de desenvolvimento.
 */
const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url("NEXT_PUBLIC_API_URL deve ser uma URL válida"),
    NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL deve ser uma URL válida"),
    NEXT_PUBLIC_LOGIN_URL: z.string().url("NEXT_PUBLIC_LOGIN_URL deve ser uma URL válida"),
    NEXT_PUBLIC_TEST_TOKEN: z.string().optional(),
});

/**
 * Exporta as variáveis de ambiente já validadas e tipadas.
 * Caso alguma esteja incorreta ou ausente, o app falha ao iniciar,
 * garantindo segurança e previsibilidade.
 */
export const env = envSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_LOGIN_URL: process.env.NEXT_PUBLIC_LOGIN_URL,
    NEXT_PUBLIC_TEST_TOKEN: process.env.NEXT_PUBLIC_TEST_TOKEN,
});
