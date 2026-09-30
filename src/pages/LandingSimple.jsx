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
import ProductDetailPopup from '../components/landing/ProductDetailPopup';

const AUTO_POPUP_SESSION_KEY = 'landing_auto_popup_shown';

// Simple, light-only landing page: banner, category tabs, news, social, contact.
// Kept fully separate from the existing Home (App.jsx) sections/components.
const LandingSimple = () => {
    const [popup, setPopup] = useState({ open: false, productName: '' });
    // The detail popup stays mounted underneath while the quote form is open,
    // so closing the form returns the visitor to the vehicle they were reading.
    const [detailProduct, setDetailProduct] = useState(null);

    // Auto-show the quote popup shortly after landing, every time the page loads.
    useEffect(() => {
        const timer = setTimeout(() => {
            setPopup({ open: true, productName: '' });
        }, 1000);
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
            <LandingCategoryTabs onRequestQuote={handleRequestQuote} onOpenDetail={setDetailProduct} />
            <LandingNews />
            <LandingSocial />
            <LandingContact />
            <LandingFooter />
            <LandingFloatingContact />
            <ProductDetailPopup
                product={detailProduct}
                onClose={() => setDetailProduct(null)}
                onRequestQuote={handleRequestQuote}
            />
            <QuickQuotePopup open={popup.open} onClose={closePopup} productName={popup.productName} />
        </div>
    );
};

export default LandingSimple;
