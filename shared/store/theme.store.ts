import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState
{
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

/**
 * Store global para controle do tema da aplicação.
 *
 * Uso:
 * ```tsx
 * const { theme, toggleTheme } = useThemeStore();
 * ```
 */
export const useThemeStore = create<ThemeState>(
    (set) => ({
        theme: "light",
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
            set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }));
