import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryTiles from './components/CategoryTiles';
import FeaturedProducts from './components/FeaturedProducts';
import WhyChooseUs from './components/WhyChooseUs';
import ServiceSteps from './components/ServiceSteps';
import Testimonials from './components/Testimonials';
import ShowroomMap from './components/ShowroomMap';
import NewsViral from './components/NewsViral';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { useApiData } from './hooks/useApiData';
import { getProducts } from './api/client';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminArticles from './pages/admin/AdminArticles';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminLeads from './pages/admin/AdminLeads';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Homepage section order matches the real kimlongmiennam.com layout:
// Navbar -> Hero -> Category tiles -> "Dòng Xe Nổi Bật Tháng 8" ->
// "Vì Sao Chọn Miền Nam Auto?" -> "Thương Hiệu Kim Long Motor" (+ CTA banner)
// -> "Kim Long Xe Khách" -> "Kim Long Xe Tải" -> "Kim Long Xe Điện" ->
// "Xưởng Dịch Vụ Chuyên Nghiệp" -> "Tin Tức Nổi Bật" -> "Đánh Giá Khách Hàng"
// -> "Showroom Kim Long" -> Footer.
const Home = () => {
  const { data: products } = useApiData(getProducts, []);
  const all = products || [];

  const byCategory = (cat) => all.filter((p) => p.category === cat);
  // "Dòng Xe Nổi Bật Tháng 8" is driven by the admin-controlled `featured`
  // flag (falls back to the full list if nothing is marked yet, so the
  // section still renders something sensible before an admin curates it).
  const featuredProducts = all.filter((p) => p.featured);

  return (
    <>
      <Navbar />
      <HeroSlider />
      <CategoryTiles />
      <FeaturedProducts
        id="noi-bat"
        title="Dòng Xe Nổi Bật Tháng 8"
        products={featuredProducts.length > 0 ? featuredProducts : all}
      />
      <WhyChooseUs />
      <FeaturedProducts
        id="thuong-hieu"
        title="Thương Hiệu Kim Long Motor"
        products={all.slice().reverse()}
        ctaBanner
      />
      <FeaturedProducts
        id="xe-khach"
        title="Kim Long Xe Khách"
        products={byCategory('xe-khach')}
      />
      <FeaturedProducts
        id="xe-tai"
        title="Kim Long Xe Tải"
        products={byCategory('xe-tai')}
      />
      <FeaturedProducts
        id="xe-dien"
        title="Kim Long Xe Điện"
        products={byCategory('xe-dien')}
      />
      <ServiceSteps />
      <NewsViral />
      <Testimonials />
      <ShowroomMap />
      <Footer />
      <FloatingButtons />
    </>
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
