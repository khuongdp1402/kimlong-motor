import { createContext, useContext } from 'react';

export const THEME_STORAGE_KEY = 'theme';

// { mode: 'dark' | 'light', toggleMode: () => void }
export const ThemeModeContext = createContext({ mode: 'dark', toggleMode: () => {} });

export const useThemeMode = () => useContext(ThemeModeContext);

// Showroom Noir is the primary look, so dark is the default.
export function readStoredMode() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
}
