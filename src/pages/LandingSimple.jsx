import React, { useEffect, useState } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingBanner from '../components/landing/LandingBanner';
import LandingCategoryTabs from '../components/landing/LandingCategoryTabs';
import LandingNews from '../components/landing/LandingNews';
import LandingSocial from '../components/landing/LandingSocial';
import LandingContact from '../components/landing/LandingContact';
import LandingFooter from '../components/landing/LandingFooter';
import LandingFloatingContact from '../components/landing/LandingFloatingContact';
import QuickQuotePopup from '../components/landing/QuickQuotePopup';

const AUTO_POPUP_SESSION_KEY = 'landing_auto_popup_shown';

// Simple, light-only landing page: banner, category tabs, news, social, contact.
// Kept fully separate from the existing Home (App.jsx) sections/components.
const LandingSimple = () => {
    const [popup, setPopup] = useState({ open: false, productName: '' });

    // Auto-show the phone-only quote popup 5s after landing, once per tab session.
    useEffect(() => {
        let alreadyShown = false;
        try {
            alreadyShown = sessionStorage.getItem(AUTO_POPUP_SESSION_KEY) === '1';
        } catch { /* storage unavailable */ }
        if (alreadyShown) return undefined;

        const timer = setTimeout(() => {
            setPopup({ open: true, productName: '' });
            try { sessionStorage.setItem(AUTO_POPUP_SESSION_KEY, '1'); } catch { /* ignore */ }
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleRequestQuote = (product) => {
        setPopup({ open: true, productName: product?.name || '' });
    };

    const closePopup = () => setPopup((p) => ({ ...p, open: false }));

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <LandingHeader />
            <LandingBanner />
            <LandingCategoryTabs onRequestQuote={handleRequestQuote} />
            <LandingNews />
            <LandingSocial />
            <LandingContact />
            <LandingFooter />
            <LandingFloatingContact />
            <QuickQuotePopup open={popup.open} onClose={closePopup} productName={popup.productName} />
        </div>
    );
};

export default LandingSimple;
