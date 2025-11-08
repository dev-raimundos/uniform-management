import type { Config } from "tailwindcss";

/**
 * Configuração principal do Tailwind CSS.
 * Define os caminhos que serão analisados para gerar classes
 * e permite personalizar tema, extensões e plugins.
 */
const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}" // procura classes em toda a pasta src
    ],
    theme: {
        extend: {}, // adicione aqui suas customizações de tema
    },
    plugins: [], // adicione plugins do Tailwind se precisar
};

export default config;
