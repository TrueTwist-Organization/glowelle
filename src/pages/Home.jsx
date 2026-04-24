import React from 'react';
import { motion } from 'framer-motion';
import { categories, products } from '../data/products';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { Sparkles, Heart, Camera, Cpu, Zap } from 'lucide-react';

import Hero3D from '../components/Hero3D';
import WaveText from '../components/WaveText';

const Home = () => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [sectionBg, setSectionBg] = React.useState("https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2000&auto=format&fit=crop");
  const [sliderPos, setSliderPos] = React.useState(50);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2);
    const y = (clientY - innerHeight / 2);
    setMousePos({ x, y });
  };

  return (
    <div style={{ paddingBottom: '2rem' }} onMouseMove={handleMouseMove}>
      {/* Hero Section */}
      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1.5rem',
        perspective: '1000px'
      }}>


        <Hero3D />
        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.2,
                  delayChildren: 0.5
                }
              }
           }}
           style={{ zIndex: 1, maxWidth: '1000px', position: 'relative' }}
        >

          <motion.h1 
             className="premium-text"
             variants={{
               hidden: { opacity: 0, y: 30 },
               visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
             }}
             style={{ 
               fontSize: 'clamp(2.5rem, 15vw, 6rem)', 
               lineHeight: 1, 
               fontWeight: 900, 
               marginBottom: '2rem', 
               letterSpacing: '-0.06em',
               textAlign: 'center',
               perspective: '1000px'
             }}
          >
            <motion.div 
              animate={{ rotateX: [0, 180, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 0.55, 1] }}
              style={{ transformStyle: 'preserve-3d', cursor: 'default' }}
            >
              <div className="text-gold" style={{ backfaceVisibility: 'hidden' }}>GLOWING</div>
              <div className="text-lips" style={{ 
                position: 'absolute', inset: 0, transform: 'rotateX(180deg)', 
                backfaceVisibility: 'hidden', fontSize: '0.9em' 
              }}>GLOWING</div>
            </motion.div>

            <motion.div 
              animate={{ rotateX: [0, 180, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 0.55, 1], delay: 1 }}
              style={{ transformStyle: 'preserve-3d', cursor: 'default' }}
            >
              <div className="text-lips" style={{ backfaceVisibility: 'hidden' }}>FUTURE</div>
              <div className="text-gold" style={{ 
                position: 'absolute', inset: 0, transform: 'rotateX(180deg)', 
                backfaceVisibility: 'hidden', fontSize: '0.9em' 
              }}>FUTURE</div>
            </motion.div>
          </motion.h1>


          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 0.9, transition: { duration: 0.8, delay: 1.0 } }
            }}
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
              maxWidth: '650px', 
              margin: '0 auto 2.5rem', 
              lineHeight: 1.8,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0 0.3em'
            }}
          >
            {["Redefining", "beauty", "through", "cinematic", "visual", "experiences.", "Discover", "our", "laboratory-refined"].map((word, i) => (
              <span
                key={i}
                className="text-wave"
                style={{
                  display: 'inline-block',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '2.4s'
                }}
              >
                {word}
              </span>
            ))}
            {" "}
            <span
              className="text-wave"
              style={{
                color: 'white',
                fontWeight: 600,
                display: 'inline-block',
                animationDelay: `${9 * 0.15}s`,
                animationDuration: '2.4s'
              }}
            >
              luxury collection.
            </span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{ 
               display: 'flex', justifyContent: 'center', margin: '0 auto'
            }}
          >
             <div className="premium-button-wrap">
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.95 }}
                 className="premium-button-inner" 
                 onClick={() => window.location.href='/test-model'}
               >
                 💖 YOUR BEAUTY, YOUR WAY
               </motion.button>
             </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2.8, duration: 1 }}
           style={{
             position: 'absolute',
             bottom: '2.5rem',
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             gap: '1rem',
             fontSize: '0.75rem',
             fontWeight: 800,
             letterSpacing: '0.45em',
             opacity: 0.6
           }}
        >
          SCROLL
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '2px', height: '40px', background: 'linear-gradient(to bottom, white, transparent)', borderRadius: '10px' }}
          />
        </motion.div>
      </section>

      <section id="categories-section" style={{ marginBottom: 'clamp(5rem, 15vw, 10rem)', marginTop: '5rem', padding: 'clamp(4rem, 10vw, 6rem) 0', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <WaveText 
                text="Shop By Category" 
                style={{ 
                  fontSize: 'clamp(2rem, 10vw, 4rem)', 
                  fontWeight: 950, 
                  textAlign: 'center',
                  color: '#FF758F',
                  textShadow: '0 0 30px rgba(255, 117, 143, 0.6)',
                  letterSpacing: '0.05em'
                }} 
              />
            </motion.div>
         </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
        </div>
      </section>

      {/* AI Studio Feature Section */}
      <section style={{ 
        padding: 'clamp(2rem, 8vw, 4rem) 0', 
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 5vw, 3rem)', 
              borderRadius: '50px', 
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                  }
                }
              }}
              style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', 
                fontWeight: 950, 
                marginBottom: '1rem', 
                lineHeight: 1.1, 
                background: 'linear-gradient(90deg, #FF758F, #FF1493, #FFB3C1, #FFD700, #FF758F)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                textShadow: '0 0 50px rgba(255,20,147,0.3)',
                animation: 'gradientMove 3s linear infinite',
                textAlign: 'center',
                textTransform: 'uppercase',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0 0.2em'
              }}
            >
              {"BEAUTY IN ACTION".split(" ").map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'flex' }}>
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      variants={{
                        hidden: { opacity: 0, y: 15, rotateX: -60 },
                        visible: { 
                          opacity: 1, y: 0, rotateX: 0,
                          transition: { 
                            type: "spring", 
                            damping: 12, 
                            stiffness: 200,
                          }
                        }
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h2>
 
            {/* Premium Before/After Static Showcase */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '450px', 
              margin: '0 auto 2rem', 
              borderRadius: '30px', 
              overflow: 'hidden',
              aspectRatio: '0.85/1',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,117,143,0.15)',
              border: '4px solid rgba(255,255,255,0.05)',
              background: '#000',
              zIndex: 1
            }}>
              <img 
                src="/assets/before-after-main.png" 
                alt="Before After Transformation" 
                style={{ 
                  width: '100%',
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              
              {/* Premium Labels */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, color: 'white', letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>BEFORE</div>
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--primary-makeup)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900, color: 'white', letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>AFTER</div>

              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '15px', 
                background: 'rgba(0,0,0,0.6)', 
                backdropFilter: 'blur(10px)', 
                padding: '5px 12px', 
                borderRadius: '100px', 
                fontSize: '0.6rem', 
                fontWeight: 900, 
                color: 'white', 
                letterSpacing: '0.1em',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                NEURAL TRANSFORMATION
              </div>
            </div>
            
            <p style={{ fontSize: 'clamp(0.8rem, 3vw, 1rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Witness the power of precision. Our neural engine understands every curve of your face for a flawless transformation.
            </p>
 
            <div className="premium-button-wrap" style={{ margin: '0 auto', maxWidth: '300px' }}>
              <button 
                className="premium-button-inner"
                onClick={() => window.location.href='/test-model'}
                style={{ fontSize: '0.9rem', padding: '1rem 2rem' }}
              >
                OPEN AI STUDIO
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Section */}

      {/* Featured Collection Section */}
      <section id="products-section" style={{ 
        position: 'relative', 
        padding: 'clamp(4rem, 10vw, 6rem) 0',
        background: 'rgba(0,0,0,0.2)',
        marginTop: '5rem'
      }}>
         <div className="container" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem' }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <WaveText 
              text="Featured Collection" 
              style={{ 
                fontSize: 'clamp(2rem, 12vw, 5rem)', 
                fontWeight: 950, 
                textAlign: 'center', 
                marginBottom: '1rem',
                color: '#FFB3C1',
                textShadow: '0 0 50px rgba(255, 154, 139, 0.8), 0 0 20px rgba(255, 154, 139, 0.4)',
                letterSpacing: '-0.02em'
              }} 
            />
          </motion.div>
          <div style={{ maxWidth: '800px', display: 'flex', justifyContent: 'center' }}>
            <p
              style={{ 
                fontSize: '1.25rem', 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.9)', 
                letterSpacing: '0.08em',
                lineHeight: 1.8,
                fontWeight: 500,
                textTransform: 'uppercase'
              }}
            >
              Elevate your beauty routine with our most-loved products. <span style={{ color: '#FFD700', fontWeight: 900 }}>Meticulously crafted</span> for perfection.
            </p>
          </div>
        </div>
        
        <div className="container">
          <div className="responsive-grid">
            {/* Displaying a mix of products from different categories */}
            {Object.entries(products).flatMap(([type, list]) => list.slice(0, 3)).slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} type={product.category?.toLowerCase() === 'skincare' ? 'skincare' : 'makeup'} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section style={{ 
        marginTop: 'clamp(5rem, 15vw, 10rem)', 
        padding: 'clamp(4rem, 10vw, 8rem) 0', 
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        border: 'none'
      }}>
         <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'center' }}>
            <div>
               <h2 style={{ fontSize: '3.5rem', marginBottom: '2.5rem', fontWeight: 900 }}>Why <span style={{ background: 'linear-gradient(90deg, #FFB3C1, #FF758F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Glowelle?</span></h2>
               <div style={{ display: 'grid', gap: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                     <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                        <Sparkles size={28} color="var(--highlight-pink)" />
                     </div>
                     <div>
                        <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Vegan & Cruelty Free</h4>
                        <p>We believe in beauty without harm. All our products are 100% vegan.</p>
                     </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                     <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '20px' }}>
                        <Heart size={28} color="var(--highlight-pink)" />
                     </div>
                     <div>
                        <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Dermatologist Tested</h4>
                        <p>Safe for sensitive skin. Rigorously tested by skin experts.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div style={{ position: 'relative' }}>
               <img 
                 src="https://images.unsplash.com/photo-1512496011951-a6994413c2ca?q=80&w=800&auto=format&fit=crop" 
                 alt="Cosmetics" 
                 style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
               />
                <div className="glass-card" style={{ position: 'absolute', bottom: '-20px', left: '-10px', textAlign: 'center', minWidth: '120px', padding: '1rem' }}>
                  <p style={{ fontWeight: '900', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: 'white', marginBottom: '0' }}>10k+</p>
                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Happy Users</p>
                </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
