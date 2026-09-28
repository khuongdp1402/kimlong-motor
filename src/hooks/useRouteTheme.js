import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Public pages use the Showroom Noir (dark) look; the admin area keeps its
// light UI. Toggles the `.dark` class Tailwind's `dark:` variant listens to.
export function useRouteTheme() {
    const { pathname } = useLocation();

    useEffect(() => {
        const isAdmin = pathname.startsWith('/admin');
        document.documentElement.classList.toggle('dark', !isAdmin);
    }, [pathname]);
}
