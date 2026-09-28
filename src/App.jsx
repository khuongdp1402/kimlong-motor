import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import BrandIntro from './components/BrandIntro';
import VehicleShowcase from './components/VehicleShowcase';
import VehicleCatalogSection from './components/VehicleCatalogSection';
import RealVideoSection from './components/RealVideoSection';
import WhyKimLong from './components/WhyKimLong';
import Testimonials from './components/Testimonials';
import NewsViral from './components/NewsViral';
import QuoteFormSection from './components/QuoteFormSection';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import VehicleModal from './components/VehicleModal';
import QuickQuoteModal from './components/QuickQuoteModal';
import SeoJsonLd from './components/SeoJsonLd';
import SmoothScroll from './components/motion/SmoothScroll';
import { useRouteTheme } from './hooks/useRouteTheme';

import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminArticles from './pages/admin/AdminArticles';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminLeads from './pages/admin/AdminLeads';
import { AdminAuthProvider } from './context/AdminAuthContext';

const Home = () => {
  // Modal state for Vehicle Details Popup
  const [selectedCarForDetail, setSelectedCarForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Modal state for Quick Quote Popup
  const [selectedCarForQuote, setSelectedCarForQuote] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const handleOpenDetail = (car) => {
    setSelectedCarForDetail(car);
    setIsDetailModalOpen(true);
  };

  const handleOpenQuote = (car = null) => {
    setSelectedCarForQuote(car);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-noir-950 text-ink">
      {/* SEO: AutoDealer + AutomotiveBusiness structured data */}
      <SeoJsonLd />

      {/* Header & Navigation */}
      <Navbar onOpenQuoteModal={() => handleOpenQuote(null)} />

      <main>
        {/* Hero Banner Slider */}
        <HeroSlider />

        {/* Brand Introduction & Metrics */}
        <BrandIntro />

        {/* Scroll-Driven Video Showcase — Kim Long 99 */}
        <VehicleShowcase />

        {/* Vehicle Catalog with Curated Grid */}
        <VehicleCatalogSection
          onOpenDetail={handleOpenDetail}
          onOpenQuote={handleOpenQuote}
        />

        {/* 04 — Why Kim Long Motor */}
        <WhyKimLong />

        {/* Real Videos Section (YouTube & TikTok @thuongkimlong) */}
        <RealVideoSection />

        {/* Customer Testimonials (API-driven, returns null if no data) */}
        <Testimonials />

        {/* News Preview — Latest articles (API-driven, returns null if no data) */}
        <NewsViral />

        {/* Quote Form & Price Table Section */}
        <QuoteFormSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button — Expandable contact menu */}
      <FloatingButtons />

      {/* 1. Vehicle Detail Popup Modal */}
      <VehicleModal
        car={selectedCarForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenQuote={handleOpenQuote}
      />

      {/* 2. Quick Quote Popup Modal */}
      <QuickQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        defaultCar={selectedCarForQuote}
      />
    </div>
  );
};

function App() {
  useRouteTheme();

  return (
    <AdminAuthProvider>
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<ProductCategory />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
