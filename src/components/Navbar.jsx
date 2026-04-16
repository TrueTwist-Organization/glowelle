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
        background: 'transparent',
        padding: scrolled ? '1rem 2rem' : '1.5rem 2.2rem',
        transition: 'all 0.4s ease',
        pointerEvents: 'none' // Allow clicks to pass through transparent areas
      }}>
        <div className="navbar-inner" style={{ 
          pointerEvents: 'auto', 
          display: 'flex', 
          width: '100%', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '1rem' 
        }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            flexShrink: 0,
            marginLeft: '-10px' // Pull closer to edge if needed
          }}>
            <svg 
              className="logo-svg"
              width="180" 
              height="100" 
              viewBox="0 0 250 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8)) drop-shadow(0 0 5px rgba(0,0,0,1))',
                maxWidth: '160px', // Slightly larger for better visibility
                height: 'auto'
              }}
            >
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BF953F" />
                  <stop offset="50%" stopColor="#FCF6BA" />
                  <stop offset="100%" stopColor="#B38728" />
                </linearGradient>
                <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D52A62" />
                  <stop offset="100%" stopColor="#7E1538" />
                </linearGradient>
                <path id="bottomCurve" d="M 35,95 A 120,120 0 0,0 215,95" />
              </defs>

              <g transform="translate(75, 10)">
                <circle cx="50" cy="50" r="45" stroke="url(#goldGradient)" strokeWidth="2.5" fill="none" />
                <path d="M 5 50 Q 50 5 95 50" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
                <path d="M 5 50 Q 50 95 95 50" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
                <path d="M 50 5 Q 5 50 50 95" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
                <path d="M 50 5 Q 95 50 50 95" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
                <path d="M 18 18 Q 50 50 82 82 M 18 82 Q 50 50 82 18" stroke="url(#goldGradient)" strokeWidth="1" fill="none" />
                
                <path d="M 50 90 C 35 70, 20 60, 25 45 C 30 30, 45 35, 50 55 C 55 35, 70 30, 75 45 C 80 60, 65 70, 50 90 Z" stroke="url(#pinkGradient)" strokeWidth="3.5" fill="none" />
                <path d="M 50 75 C 40 60, 35 45, 40 35 C 45 25, 50 30, 50 45 C 50 30, 55 25, 60 35 C 65 45, 60 60, 50 75 Z" stroke="url(#pinkGradient)" strokeWidth="3.5" fill="none" />
                <path d="M 50 55 C 45 45, 45 35, 50 25 C 55 35, 55 45, 50 55 Z" stroke="url(#pinkGradient)" strokeWidth="3.5" fill="none" />
              </g>

              <text fill="url(#goldGradient)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" style={{ fontFamily: "'Cinzel', serif", fontSize: '30px', fontWeight: 900, letterSpacing: '0.18em' }}>
                <textPath xlinkHref="#bottomCurve" startOffset="50%" textAnchor="middle">
                  GLOWELLE
                </textPath>
              </text>
            </svg>
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
                textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.8)'
              }}
              onMouseOver={(e) => e.target.style.color = '#fff'}
              onMouseOut={(e) => e.target.style.color = '#F5C6C6'}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: '#F5C6C6', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }}>
          <Link to="/cart" style={{ color: '#F5C6C6', display: 'flex', position: 'relative', textDecoration: 'none' }}>
            <ShoppingBag size={20} />
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#F5C6C6', color: '#1A1A1A', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '50%', fontWeight: '900', textShadow: 'none' }}>{getCartCount()}</span>
          </Link>
          <Link to="/wishlist" style={{ color: '#F5C6C6', display: 'flex', alignItems: 'center' }}>
            <Heart size={20} style={{ cursor: 'pointer' }} />
          </Link>
          <User size={20} style={{ cursor: 'pointer', color: '#F5C6C6' }} className="nav-links" />

          <div className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
            {isOpen ? <X size={28} color="#F5C6C6" /> : <Menu size={28} color="#F5C6C6" />}
          </div>
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
