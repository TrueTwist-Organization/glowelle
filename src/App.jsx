import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FloatingCart from './components/FloatingCart';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import InteractiveLipstick from './pages/InteractiveLipstick';
import ScrollExperience from './pages/ScrollExperience';
import ModelPage from './pages/ModelPage';
import Studio from './pages/Studio';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AIAssistant from './pages/AIAssistant';
import Footer from './components/Footer';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  React.useEffect(() => {
    if (!pathname.startsWith('/category/') && !pathname.startsWith('/product/')) {
      document.documentElement.style.setProperty('--dynamic-bg', 'var(--bg-gradient)');
    }
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh', marginTop: '20px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<ProductList />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/interactive-lipstick" element={<InteractiveLipstick />} />
            <Route path="/scroll-experience" element={<ScrollExperience />} />
            <Route path="/test-model" element={<Studio />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
          </Routes>
        </AnimatePresence>
      </main>
      <FloatingCart />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
