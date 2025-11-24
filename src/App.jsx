import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewsViral from './components/NewsViral';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <NewsViral />
    <ProductList />
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
