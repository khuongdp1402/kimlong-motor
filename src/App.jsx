import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import VehicleCatalogSection from './components/VehicleCatalogSection';
import RealVideoSection from './components/RealVideoSection';
import AboutHongThuong from './components/AboutHongThuong';
import QuoteFormSection from './components/QuoteFormSection';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import VehicleModal from './components/VehicleModal';
import QuickQuoteModal from './components/QuickQuoteModal';

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-red-500 selection:text-white">
      {/* Header & Navigation */}
      <Navbar onOpenQuoteModal={() => handleOpenQuote(null)} />

      <main>
        {/* Hero Banner Slider */}
        <HeroSlider />

        {/* Vehicle Catalog with Tabs (Giường Nằm, Xe Ghế, Van Điện, Xe Tải, Đầu Kéo Điện) */}
        <VehicleCatalogSection
          onOpenDetail={handleOpenDetail}
          onOpenQuote={handleOpenQuote}
        />

        {/* Real Videos Section (YouTube & TikTok @thuongkimlong) */}
        <RealVideoSection />

        {/* About Hong Thuong Section */}
        <AboutHongThuong />

        {/* Quote Form & Price Table Section */}
        <QuoteFormSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (Hotline 0379.398.798, Zalo, TikTok, YouTube) */}
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
  return (
    <AdminAuthProvider>
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
