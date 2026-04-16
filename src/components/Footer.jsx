import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Lipstick', path: '/category/lips' },
      { name: 'Face Products', path: '/category/face-products' },
      { name: 'Eye Makeup', path: '/category/eye-makeup' },
      { name: 'Skincare', path: '/category/skincare' }
    ],
    experience: [
      { name: 'Virtual Try-On', path: '/test-model' },
      { name: 'AI Beauty Assistant', path: '/ai-assistant' },
      { name: 'Interactive Studio', path: '/test-model' }
    ],
    support: [
      { name: 'Shipping Policy', path: '#' },
      { name: 'Returns & Exchanges', path: '#' },
      { name: 'Privacy Policy', path: '#' },
      { name: 'Contact Us', path: '#' }
    ]
  };

  return (
    <footer style={{ 
      marginTop: '5rem', 
      padding: '6rem 2rem 4rem',
      background: 'transparent',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>


      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ marginBottom: '1.5rem' }}>
              <svg width="240" height="180" viewBox="0 0 250 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 15px rgba(255,117,143,0.3))' }}>
                <defs>
                  <linearGradient id="goldGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="50%" stopColor="#FCF6BA" />
                    <stop offset="100%" stopColor="#B38728" />
                  </linearGradient>
                  <linearGradient id="pinkGradientFooter" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D52A62" />
                    <stop offset="100%" stopColor="#7E1538" />
                  </linearGradient>
                  {/* High clearance flatter curve for footer brand */}
                  <path id="footerBottomCurve" d="M 35,95 A 120,120 0 0,0 215,95" />
                </defs>

                <g transform="translate(75, 10)">
                  <circle cx="50" cy="50" r="45" stroke="url(#goldGradientFooter)" strokeWidth="1.5" fill="none" />
                  <path d="M 5 50 Q 50 5 95 50" stroke="url(#goldGradientFooter)" strokeWidth="1" fill="none" />
                  <path d="M 5 50 Q 50 95 95 50" stroke="url(#goldGradientFooter)" strokeWidth="1" fill="none" />
                  <path d="M 50 5 Q 5 50 50 95" stroke="url(#goldGradientFooter)" strokeWidth="1" fill="none" />
                  <path d="M 50 5 Q 95 50 50 95" stroke="url(#goldGradientFooter)" strokeWidth="1" fill="none" />
                  <path d="M 18 18 Q 50 50 82 82 M 18 82 Q 50 50 82 18" stroke="url(#goldGradientFooter)" strokeWidth="0.5" fill="none" />
                  
                  <path d="M 50 90 C 35 70, 20 60, 25 45 C 30 30, 45 35, 50 55 C 55 35, 70 30, 75 45 C 80 60, 65 70, 50 90 Z" stroke="url(#pinkGradientFooter)" strokeWidth="2.5" fill="none" />
                  <path d="M 50 75 C 40 60, 35 45, 40 35 C 45 25, 50 30, 50 45 C 50 30, 55 25, 60 35 C 65 45, 60 60, 50 75 Z" stroke="url(#pinkGradientFooter)" strokeWidth="2.5" fill="none" />
                  <path d="M 50 55 C 45 45, 45 35, 50 25 C 55 35, 55 45, 50 55 Z" stroke="url(#pinkGradientFooter)" strokeWidth="2.5" fill="none" />
                </g>

                <text fill="url(#goldGradientFooter)" style={{ fontFamily: "'Cinzel', serif", fontSize: '32px', fontWeight: 600, letterSpacing: '0.15em' }}>
                  <textPath xlinkHref="#footerBottomCurve" startOffset="50%" textAnchor="middle">
                    GLOWELLE
                  </textPath>
                </text>
              </svg>
            </div>
            <motion.p 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: 'var(--text-muted)', maxWidth: '350px', marginBottom: '2.5rem', lineHeight: 1.7, fontSize: '1.05rem' }}
            >
              Redefining luxury beauty with cinematic visual experiences and laboratory-refined formulas. Your glow, our science.
            </motion.p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[
                { 
                  name: 'Instagram', 
                  url: 'https://instagram.com',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                },
                { 
                  name: 'Twitter', 
                  url: 'https://twitter.com',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> 
                },
                { 
                  name: 'Facebook', 
                  url: 'https://facebook.com',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> 
                },
                { 
                  name: 'Youtube', 
                  url: 'https://youtube.com',
                  svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89 1 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-1-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg> 
                }
              ].map((item, i) => (
                <motion.a 
                  key={i}
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  initial={{ y: 0 }}
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 15,
                    color: 'var(--highlight-pink)',
                    opacity: 1
                  }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color: 'white', opacity: 0.7, transition: 'color 0.3s ease, border-color 0.3s ease', display: 'inline-block' }}
                >
                  <motion.div
                    whileHover={{ filter: 'drop-shadow(0 0 8px var(--highlight-pink))' }}
                  >
                    {item.svg}
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <div key={title}>
              <motion.h4 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
                style={{ color: 'white', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.2em', marginBottom: '2rem', opacity: 0.9 }}
              >
                {title}
              </motion.h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {links.map((link, i) => (
                  <motion.li 
                    key={i} 
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: (idx * 0.2) + (i * 0.1) }}
                    style={{ marginBottom: '1.2rem' }}
                  >
                    <Link 
                      to={link.path} 
                      style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-muted)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <motion.h4 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              style={{ color: 'white', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.2em', marginBottom: '2rem', opacity: 0.9 }}
            >
              Newsletter
            </motion.h4>
            <motion.p 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}
            >
              Join the collection for exclusive drops.
            </motion.p>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '1rem 1.2rem', 
                  borderRadius: '12px',
                  color: 'white',
                  outline: 'none'
                }} 
              />
              <button style={{ 
                position: 'absolute', 
                right: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--highlight-pink)', 
                cursor: 'pointer' 
              }}>
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar" style={{ 
          paddingTop: '3rem', 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.4)'
        }}>
          <p>© {currentYear} GLOWELLE COSMETICS. DESIGNED FOR EXTRAORDINARY BEAUTY.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>TERMS</span>
            <span>PRIVACY</span>
            <span>COOKIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
