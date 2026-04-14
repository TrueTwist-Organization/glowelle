import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getCartCount } = useCart();

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
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '0.8rem 2rem',
        transition: 'all 0.4s ease'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.png" alt="GLOWELLE Logo" style={{ height: '50px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255,117,143,0.3))' }} />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links" style={{ display: 'flex', gap: '1.2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/category/lips" style={{ color: '#FF758F', textDecoration: 'none' }}>Lips</Link>
          <Link to="/category/face-products" style={{ color: '#FF9A8B', textDecoration: 'none' }}>Face</Link>
          <Link to="/category/eye-makeup" style={{ color: '#B721FF', textDecoration: 'none' }}>Eyes</Link>
          <Link to="/category/skincare" style={{ color: '#84fab0', textDecoration: 'none' }}>Skincare</Link>
          <Link to="/test-model" style={{ color: 'white', opacity: 0.9, textDecoration: 'none' }}>Try-On</Link>
          <Link to="/ai-assistant" style={{ color: '#FF758F', fontWeight: '900', textDecoration: 'none' }}>AI Assistant</Link>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: 'white' }}>
          <Link to="/cart" style={{ color: 'white', display: 'flex', position: 'relative', textDecoration: 'none' }}>
            <ShoppingBag size={20} />
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary-makeup)', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold' }}>{getCartCount()}</span>
          </Link>
          <Link to="/wishlist" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <Heart size={20} style={{ cursor: 'pointer' }} />
          </Link>
          <User size={20} style={{ cursor: 'pointer', color: 'white' }} className="nav-links" />

          <div className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
            {isOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
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
              background: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ position: 'absolute', top: '2rem', right: '2rem' }} onClick={() => setIsOpen(false)}>
              <X size={32} color="white" cursor="pointer" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {[
                { name: 'Home', path: '/', color: 'white' },
                { name: 'Lips', path: '/category/lips', color: '#FF758F' },
                { name: 'Face', path: '/category/face-products', color: '#FF9A8B' },
                { name: 'Eyes', path: '/category/eye-makeup', color: '#B721FF' },
                { name: 'Skincare', path: '/category/skincare', color: '#84fab0' },
                { name: 'Live Try-On', path: '/test-model', color: 'white' },
                { name: 'AI Beauty Assistant', path: '/ai-assistant', color: '#FF758F' }
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
