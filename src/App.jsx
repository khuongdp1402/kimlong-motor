import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryGrid from './components/CategoryGrid';
import NewsViral from './components/NewsViral';
import ProductList from './components/ProductList';
import WhyChooseUs from './components/WhyChooseUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import ProductCategory from './pages/ProductCategory';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';

const Home = () => (
  <>
    <Navbar />
    <HeroSlider />
    <CategoryGrid />
    <ProductList />
    <WhyChooseUs />
    <NewsViral />
    <ContactForm />
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/category/:slug" element={<ProductCategory />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
