import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import PromoCarousel from './components/PromoCarousel';
import ProductCategoryCarousel from './components/ProductCategoryCarousel';
import NewsViral from './components/NewsViral';
import WhyChooseUs from './components/WhyChooseUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import About from './components/About';
import FloatingButtons from './components/FloatingButtons';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import NewsListPage from './pages/NewsListPage';
import NewsDetailPage from './pages/NewsDetailPage';
import { productCategories } from './data/products-updated';

const Home = () => (
  <>
    <Navbar />
    <HeroSlider />
    <PromoCarousel />
    {productCategories.map((category) => (
      <ProductCategoryCarousel key={category.id} categoryId={category.id} category={category} />
    ))}
    <WhyChooseUs />
    <About />
    <NewsViral />
    <ContactForm />
    <Footer />
    <FloatingButtons />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:slug" element={<ProductCategory />} />
      <Route path="/news" element={<NewsListPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
    </Routes>
  );
}

export default App;
