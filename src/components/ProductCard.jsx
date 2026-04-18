import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Returns gradient colors based on product category
const getCategoryStyle = (category = '', type = '') => {
  const cat = (category + type).toLowerCase();
  
  // Defaulting to the requested dark chocolate color #3B2A1F for all products
  const primaryColor = '#3B2A1F';
  
  if (cat.includes('lip') || cat.includes('lipstick') || cat.includes('liquid lip'))
    return {
      nameColor: primaryColor,
      priceColor: primaryColor,
      badgeColor: '#FF758F',
      glow: 'rgba(59, 42, 31, 1)'
    };
  if (cat.includes('face') || cat.includes('foundation') || cat.includes('primer') || cat.includes('compact') || cat.includes('powder') || cat.includes('blush') || cat.includes('concealer') || cat.includes('highlighter'))
    return {
      nameColor: primaryColor,
      priceColor: primaryColor,
      badgeColor: '#FFD700',
      glow: 'rgba(59, 42, 31, 1)'
    };
  if (cat.includes('eye') || cat.includes('mascara') || cat.includes('eyeliner') || cat.includes('eyebrow') || cat.includes('brow') || cat.includes('shadow') || cat.includes('palette'))
    return {
      nameColor: primaryColor,
      priceColor: primaryColor,
      badgeColor: '#21D4FD',
      glow: 'rgba(59, 42, 31, 1)'
    };
  if (cat.includes('skin') || cat.includes('serum') || cat.includes('mist') || cat.includes('cream') || cat.includes('sunscreen'))
    return {
      nameColor: primaryColor,
      priceColor: primaryColor,
      badgeColor: '#84fab0',
      glow: 'rgba(59, 42, 31, 1)'
    };
    
  return {
    nameColor: primaryColor,
    priceColor: primaryColor,
    badgeColor: primaryColor,
    glow: 'rgba(59, 42, 31, 1)'
  };
};

const ProductCard = ({ product, type }) => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);

  const hasFrames = product.frames && product.frames.length > 0;
  const style = getCategoryStyle(product.category, type);

  const handleMouseMove = (e) => {
    if (!hasFrames) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const frameIndex = Math.floor(percentage * (product.frames.length - 1));
    setCurrentFrame(frameIndex);
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div
      layout
      variants={containerVariants}
      initial="hidden"
      animate="show"
      viewport={{ once: true, margin: "-10px" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentFrame(0);
      }}
      onMouseMove={handleMouseMove}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        padding: '0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        transform: isHovering ? 'translateY(-10px)' : 'translateY(0px)',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Layered Inner Glow (The '2nd image' effect) */}
        <div style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: style.badgeColor,
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: isHovering ? 0.3 : 0.15,
          transition: 'opacity 0.8s ease'
        }} />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <img
            src={hasFrames && isHovering ? product.frames[currentFrame] : product.image}
            alt={product.name}
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              transform: isHovering ? 'scale(1.2)' : 'scale(1)',
              transition: hasFrames && isHovering ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: isHovering ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
            }}
          />
        </motion.div>
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Category badge */}
        <motion.p 
          variants={itemVariants}
          animate={{ y: [0, -3, 0] }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: style.badgeColor,
            marginBottom: '0.3rem',
            fontWeight: 700,
            filter: `drop-shadow(0 0 6px ${style.badgeColor}60)`
          }}
        >
          {product.category || "Luxury Collection"}
        </motion.p>

        {/* Product name with gradient */}
        <motion.h3 
          variants={itemVariants}
          animate={{ y: [0, -4, 0] }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
          }}
          style={{
            fontSize: '1.45rem',
            marginBottom: '0.4rem',
            textAlign: 'center',
            fontWeight: 900,
            color: style.nameColor,
            transition: 'all 0.3s ease',
            textShadow: isHovering ? `0 0 15px ${style.glow}` : 'none'
          }}
        >
          {product.name}
        </motion.h3>

        {/* Price with category color */}
        <motion.p 
          variants={itemVariants}
          animate={{ y: [0, -3, 0] }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
          }}
          style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: style.priceColor,
            opacity: 1,
            filter: `drop-shadow(0 0 12px ${style.priceColor}80)`,
            letterSpacing: '0.05em'
          }}
        >
          {product.price || "₹45.00"}
        </motion.p>
      </div>

    </motion.div>
  );
};

export default ProductCard;
