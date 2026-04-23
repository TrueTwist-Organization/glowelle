import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Mail, MessageSquare, MapPin, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Support = () => {
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();

  const sections = {
    'shipping': {
      title: 'Shipping Policy',
      icon: <Truck size={40} />,
      content: (
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p>We provide complimentary express shipping on all orders over ₹2,000. Our logistics partners ensure that your luxury beauty products reach you in pristine condition.</p>
          <ul style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
            <li>• Standard Delivery: 3-5 Business Days</li>
            <li>• Express Delivery: 1-2 Business Days</li>
            <li>• International: 7-10 Business Days</li>
          </ul>
        </div>
      )
    },
    'returns': {
      title: 'Returns & Exchanges',
      icon: <RotateCcw size={40} />,
      content: (
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p>Your satisfaction is our priority. If you are not completely satisfied with your purchase, we offer a 14-day hassle-free return policy for unopened products.</p>
          <p style={{ marginTop: '1rem' }}>To initiate a return, please contact our support team with your order number and reason for return.</p>
        </div>
      )
    },
    'privacy': {
      title: 'Privacy Policy',
      icon: <ShieldCheck size={40} />,
      content: (
        <div style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
          <p>We value your privacy. Your data is encrypted and never shared with third parties. We only use your information to improve your shopping experience and provide personalized beauty recommendations.</p>
          <p style={{ marginTop: '1rem' }}>Our systems are SOC2 compliant and we adhere to global GDPR standards.</p>
        </div>
      )
    },
    'contact': {
      title: 'Contact Us',
      icon: <MessageSquare size={40} />,
      content: (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '1rem', color: 'var(--primary-makeup)' }}><Mail size={24} /></div>
            <div>
              <h4 style={{ fontWeight: 800 }}>Email Support</h4>
              <p style={{ color: 'var(--text-muted)' }}>support@glowelle.com</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '1rem', color: 'var(--primary-makeup)' }}><Phone size={24} /></div>
            <div>
              <h4 style={{ fontWeight: 800 }}>Phone</h4>
              <p style={{ color: 'var(--text-muted)' }}>+91 1800-GLOW-ELLE</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '1rem', color: 'var(--primary-makeup)' }}><MapPin size={24} /></div>
            <div>
              <h4 style={{ fontWeight: 800 }}>Headquarters</h4>
              <p style={{ color: 'var(--text-muted)' }}>Tech Park, Mumbai, India</p>
            </div>
          </div>
        </div>
      )
    }
  };

  const currentSection = sections[type] || sections['contact'];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ 
            padding: '2.5rem', 
            borderRadius: '40px', 
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ color: 'var(--primary-makeup)', marginBottom: '1.5rem' }}>
            {currentSection.icon}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>{currentSection.title}</h1>
          <div style={{ fontSize: '1rem' }}>
            {currentSection.content}
          </div>
        </motion.div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Need immediate help?</p>
          <button 
            className="premium-button" 
            onClick={() => window.location.href='/ai-assistant'}
            style={{ padding: '1rem 2.5rem', borderRadius: '100px', border: 'none', background: 'var(--primary-makeup)', color: 'white', fontWeight: 800, cursor: 'pointer' }}
          >
            Chat with AI Beauty Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;
