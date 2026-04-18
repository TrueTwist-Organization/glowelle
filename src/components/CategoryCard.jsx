import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const getCategoryGradient = (name) => {
  const n = name.toLowerCase();
  if (n.includes('lip')) return 'linear-gradient(90deg, #FF1F6D, #FF758F)';
  if (n.includes('face')) return 'linear-gradient(90deg, #FFD700, #FF9A8B)';
  if (n.includes('eye')) return 'linear-gradient(90deg, #B721FF, #21D4FD)';
  if (n.includes('skin')) return 'linear-gradient(135deg, #84fab0, #8fd3f4, #50C878)';
  return 'linear-gradient(90deg, #FF758F, #FFB3C1, #FFD700)';
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const gradient = getCategoryGradient(category.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/category/${category.id}`)}
    >
      <Tilt
        perspective={1000}
        glareEnable={false}
        scale={1.02}
        transitionSpeed={2500}
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        style={{
          width: '100%',
          height: 'min(600px, 60vh)',
          position: 'relative',
          background: 'transparent'
        }}
      >
        {/* Product Image with zoom on hover */}
        <div
          style={{ width: '100%', height: '85%', overflow: 'hidden' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={category.image}
            alt={category.name}
            style={{
              width: '80%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))',
              transform: isHovering ? 'scale(1.22) translateY(-6px)' : 'scale(1) translateY(0px)',
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              transformOrigin: 'center center'
            }}
          />
        </div>

        {/* Category Name — letter-by-letter wave */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '0.5rem',
          gap: '0.02em'
        }}>
          {category.name.split('').map((letter, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0, 8, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
              style={{
                display: 'inline-block',
                fontSize: '1.6rem',
                fontWeight: 950,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                textShadow: isHovering ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

      </Tilt>
    </motion.div>
  );
};

export default CategoryCard;
