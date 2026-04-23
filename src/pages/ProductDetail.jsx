import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, categories } from '../data/products';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BenefitReveal from '../components/BenefitReveal';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const categoryBg = React.useMemo(() => {
    if (!product) return null;
    const categoryKey = Object.keys(products).find(key => 
      products[key].some(p => p.id === product.id)
    );
    return categories.find(c => c.id === categoryKey)?.pageBg;
  }, [product]);

  useEffect(() => {
    // Search for product in all categories
    let foundProduct = null;
    Object.values(products).forEach(category => {
      const p = category.find(p => p.id === parseInt(productId));
      if (p) foundProduct = p;
    });
    setProduct(foundProduct);
  }, [productId]);

  const handleWishlist = () => {
    if (product) toggleWishlist(product);
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${product.name} at Glowelle`,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  useEffect(() => {
    if (categoryBg) {
      document.documentElement.style.setProperty(
        '--dynamic-bg', 
        `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${categoryBg})`
      );
    }
    
    return () => {
      document.documentElement.style.setProperty('--dynamic-bg', 'var(--bg-gradient)');
    };
  }, [categoryBg]);



  if (!product) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Product not found</h2>
      <button className="btn" onClick={() => navigate('/')}>Return Home</button>
    </div>
  );

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      background: 'var(--dynamic-bg)', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '2rem', paddingBottom: '4rem' }}>
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{ 
            marginBottom: '1.5rem', 
            background: 'rgba(255,255,255,0.03)', 
            padding: '0.8rem 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem', 
            fontWeight: 800,
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowLeft size={18} style={{ color: 'var(--highlight-pink)' }} />
          </motion.div>
          <span>BACK TO COLLECTION</span>
        </motion.button>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'clamp(2rem, 8vw, 5rem)',
          alignItems: 'start'
        }}>
          {/* Product Image Section */}
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ 
               opacity: 1
             }}
             transition={{ 
               duration: 1
             }}
             style={{
              padding: '2rem',
              minHeight: '60dvh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              position: 'relative'
            }}
          >
            <motion.img 
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.2 }}
              animate={{ 
                scale: [1, 1.12, 1],
              }}
              transition={{ 
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                default: { type: 'spring', stiffness: 300, damping: 20 }
              }}
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
            />
          </motion.div>

          {/* Product Info Section */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
          >
            <div style={{ 
              display: 'inline-block', 
              color: 'var(--primary-makeup)', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              {product.category}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 8vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '1.1rem' }}>
                  <Star size={20} fill="#FFD700" stroke="#FFD700" />
                  4.9 <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(120+ Reviews)</span>
               </div>
               <div style={{ width: '1.5px', height: '20px', background: '#ddd' }}></div>
               <div style={{ color: '#22c55e', fontWeight: 700 }}>In Stock</div>
            </div>

            <div style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, color: 'var(--primary-makeup)', marginBottom: '2.5rem' }}>
               {product.price}
            </div>

            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '3rem' }}>
              {product.description}
            </p>


            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 'clamp(1rem, 5vw, 2.5rem)', alignItems: 'center', flexWrap: 'wrap' }}>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '1rem', 
                 padding: '0.6rem 0',
                 borderBottom: '1px solid #eee'
               }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
               </div>
               
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                    <button 
                      onClick={handleAddToCart} 
                      style={{ 
                        flex: 1,
                        background: addedToCart ? '#22c55e' : 'transparent', 
                        border: '2px solid var(--primary-makeup)', 
                        color: addedToCart ? 'white' : 'var(--primary-makeup)', 
                        fontSize: '1.1rem', 
                        fontWeight: 800, 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.8rem',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '100px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {addedToCart ? 'ADDED!' : 'ADD TO CART'} <ShoppingCart size={22} />
                    </button>

                    <button 
                      onClick={() => {
                        let hex = '#FF1493'; 
                        let tab = 'lips';

                        // Exact mapping by product ID
                        const idMap = {
                          // Lips
                          4: { tab: 'lips', hex: '#D2A679' }, // Soft Beige
                          5: { tab: 'lips', hex: '#C19A6B' }, // Nude Shade
                          6: { tab: 'lips', hex: '#8B0000' }, // Black Tube (Bold Red)
                          7: { tab: 'lips', hex: '#FF2400' }, // Red Smudge
                          8: { tab: 'lips', hex: '#DC143C' }, // Red Case
                          10: { tab: 'lips', hex: '#FF7F50' }, // Coral Shade
                          11: { tab: 'lips', hex: '#E3BC9A' }, // Nude Lipstick
                          12: { tab: 'lips', hex: '#B87333' }, // Metallic Lipstick
                          13: { tab: 'lips', hex: '#FF69B4' }, // Pink Case
                          17: { tab: 'lips', hex: '#B76E79' }, // Rose Gold
                          // Face
                          2: { tab: 'face', hex: '#FFE0C4' }, // Primer
                          3: { tab: 'face', hex: '#E4B594' }, // Liquid Foundation
                          16: { tab: 'face', hex: '#F5CBAC' }, // Compact Powder
                          18: { tab: 'face', hex: '#D5A17A' }, // Glow Radiance Foundation
                          19: { tab: 'face', hex: '#FCD6B9' }, // Silk Touch Compact
                          20: { tab: 'face', hex: '#C68E63' }, // HD Concealer
                          21: { tab: 'face', hex: '#FF80AB' }, // Blush Bloom
                          22: { tab: 'face', hex: '#FFFACD' }, // Highlighter
                          // Eyes
                          1: { tab: 'eyes', hex: '#3E2723' }, // Eyebrow pencil
                          14: { tab: 'eyes', hex: '#40E0D0' }, // Turquoise Mascara
                          15: { tab: 'eyes', hex: '#000000' }, // Eyeliner
                          23: { tab: 'eyes', hex: '#4A4A4A' }, // Smokey Eyeshadow
                          24: { tab: 'eyes', hex: '#000000' }, // Volume Mascara
                          25: { tab: 'eyes', hex: '#000000' }, // Precision Eyeliner
                          26: { tab: 'eyes', hex: '#4E342E' }  // Brow Sculpt
                        };

                        if (idMap[product.id]) {
                          tab = idMap[product.id].tab;
                          hex = idMap[product.id].hex;
                        }

                        navigate('/test-model', { state: { autoTryOn: true, tab, hex } });
                      }}
                      style={{ 
                        flex: 1,
                        background: 'var(--primary-makeup)', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1.1rem', 
                        fontWeight: 800, 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '0.8rem',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '100px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 20px rgba(255,20,147,0.3)'
                      }}
                    >
                      VIRTUAL TRY-ON
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', borderLeft: '1px solid #eee', paddingLeft: '1.5rem' }}>
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleWishlist}
                      style={{ padding: '0.5rem', color: isWishlisted ? 'var(--highlight-pink)' : 'var(--text-main)', cursor: 'pointer' }}
                    >
                      <Heart size={24} fill={isWishlisted ? 'var(--highlight-pink)' : 'none'} />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                      style={{ padding: '0.5rem', color: 'var(--text-main)', cursor: 'pointer' }}
                    >
                      <Share2 size={24} />
                    </motion.div>
                  </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.5rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', textAlign: 'center' }}>
                  <Truck size={22} color="var(--primary-makeup)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Free Express Shipping</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center', textAlign: 'center' }}>
                  <ShieldCheck size={22} color="var(--primary-makeup)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Premium Guarantee</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Benefit Reveal Component (Full Width Below Product) */}
        {product.details && (
          <div style={{ marginTop: '3rem', width: '100%' }}>
            <BenefitReveal benefits={product.details} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
