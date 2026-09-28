import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeModeContext, THEME_STORAGE_KEY, readStoredMode } from './themeMode';

// Holds the visitor's dark/light choice and applies it to <html>. The admin
// area always stays light regardless of the choice.
const ThemeModeProvider = ({ children }) => {
    const { pathname } = useLocation();
    const [mode, setMode] = useState(readStoredMode);

    useEffect(() => {
        // Admin and the (now light-only) landing homepage never get the dark class.
        const forceLight = pathname.startsWith('/admin') || pathname === '/';
        document.documentElement.classList.toggle('dark', !forceLight && mode === 'dark');
    }, [pathname, mode]);

    const toggleMode = useCallback(() => {
        setMode((prev) => {
            const next = prev === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* storage unavailable */ }
            return next;
        });
    }, []);

    const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);
    return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export default ThemeModeProvider;
