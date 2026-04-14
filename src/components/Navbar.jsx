import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="navbar-container" style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: 1001,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled ? 'rgba(10, 10, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
        padding: scrolled ? '0.8rem 2rem' : '1.2rem 2.2rem',
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.png" alt="GLOWELLE Logo" style={{ height: '50px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255,117,143,0.3))' }} />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'Lips', path: '/category/lips' },
            { name: 'Face', path: '/category/face-products' },
            { name: 'Eyes', path: '/category/eye-makeup' },
            { name: 'Skincare', path: '/category/skincare' },
            { name: 'Try-On', path: '/test-model' },
            { name: 'AI Assistant', path: '/ai-assistant' }
          ].map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              style={{ 
                color: '#F5C6C6', 
                textDecoration: 'none', 
                transition: 'all 0.3s ease',
                textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.5)'
              }}
              onMouseOver={(e) => e.target.style.color = '#fff'}
              onMouseOut={(e) => e.target.style.color = '#F5C6C6'}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: '#F5C6C6' }}>
          <Link to="/cart" style={{ color: '#F5C6C6', display: 'flex', position: 'relative', textDecoration: 'none' }}>
            <ShoppingBag size={20} />
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#F5C6C6', color: '#1A1A1A', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '50%', fontWeight: '900' }}>{getCartCount()}</span>
          </Link>
          <Link to="/wishlist" style={{ color: '#F5C6C6', display: 'flex', alignItems: 'center' }}>
            <Heart size={20} style={{ cursor: 'pointer' }} />
          </Link>
          <User size={20} style={{ cursor: 'pointer', color: '#F5C6C6' }} className="nav-links" />

          <div className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
            {isOpen ? <X size={28} color="#F5C6C6" /> : <Menu size={28} color="#F5C6C6" />}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', 
              top: 0, 
              right: 0, 
              width: '100%', 
              height: '100vh',
              padding: '6rem 2rem 2rem',
              zIndex: 1000, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.2rem',
              textAlign: 'left',
              background: 'linear-gradient(135deg, #1A1A1A, #3A2E2E)',
              backdropFilter: 'blur(20px)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }} onClick={() => setIsOpen(false)}>
              <X size={32} color="white" cursor="pointer" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {[
                { name: 'Home', path: '/', color: '#F5C6C6' },
                { name: 'Lips', path: '/category/lips', color: '#F5C6C6' },
                { name: 'Face', path: '/category/face-products', color: '#F5C6C6' },
                { name: 'Eyes', path: '/category/eye-makeup', color: '#F5C6C6' },
                { name: 'Skincare', path: '/category/skincare', color: '#F5C6C6' },
                { name: 'Live Try-On', path: '/test-model', color: '#F5C6C6' },
                { name: 'AI Beauty Assistant', path: '/ai-assistant', color: '#F5C6C6' }
              ].map((link, idx) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: 900, 
                      color: link.color, 
                      textDecoration: 'none',
                      letterSpacing: '-0.04em' 
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
                <Heart size={20} />
                <ShoppingBag size={20} />
                <User size={20} />
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>© GLOWELLE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
