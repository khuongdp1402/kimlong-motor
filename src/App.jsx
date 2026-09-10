import React, { useState } from 'react';
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

function App() {
  // Modal state for Vehicle Details Popup ("CHỈ HIỆN POPUP CHỨ KO MỞ TRANG CHI TIẾT")
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
        <HeroSlider onOpenQuoteModal={() => handleOpenQuote(null)} />

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
}

export default App;
