import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, CheckCircle2, ChevronRight, ShoppingCart, User, RefreshCw, Star } from 'lucide-react';
import { products } from '../data/products';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-bg', 'var(--bg-gradient)');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let stream = null;

    const initCamera = async () => {
      if (showCamera) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError("Your browser doesn't support camera access.");
          setTimeout(() => {
            setShowCamera(false);
            setCameraError(null);
          }, 3000);
          return;
        }
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
          let errorMessage = "Could not access camera.";
          if (err.name === 'NotAllowedError') errorMessage = "Camera permission denied.";
          if (err.name === 'NotFoundError') errorMessage = "No camera found on this device.";
          setCameraError(errorMessage);
          setTimeout(() => {
            setShowCamera(false);
            setCameraError(null);
          }, 3000);
        }
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  const startCamera = () => {
    setCameraError(null);
    setShowCamera(true);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Mirror if using front camera (we applied transform: scaleX(-1) to video)
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
      setStep(2);
      setShowCamera(false);
    } catch (err) {
      console.error("Error capturing photo:", err);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const types = ['Oily', 'Dry', 'Combination', 'Normal'];
      const concernsList = [
        ['Acne', 'Dullness'],
        ['Uneven tone', 'Fine lines'],
        ['Dark spots', 'Dullness'],
        ['Enlarged pores', 'Uneven texture']
      ];
      
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomConcerns = concernsList[Math.floor(Math.random() * concernsList.length)];
      
      const recommendations = [];
      const allSkincare = products['skincare'];
      const allFace = products['face-products'];
      const allEyes = products['eye-makeup'];

      // Logic from requirements
      if (randomConcerns.includes('Dullness')) {
        recommendations.push(allSkincare.find(p => p.name === 'Vitamin C Face Serum'));
        recommendations.push(allSkincare.find(p => p.name === 'Glow Serum Drops'));
        recommendations.push(allFace.find(p => p.name === 'Crystal Glow Highlighter'));
      }
      
      if (randomType === 'Oily' || randomConcerns.includes('Acne')) {
        recommendations.push(allFace.find(p => p.name === 'Silk Touch Compact Powder'));
        recommendations.push(allFace.find(p => p.name === 'HD Flawless Concealer'));
        recommendations.push(allSkincare.find(p => p.name === 'Hydrating Face Mist'));
      }

      if (randomType === 'Dry') {
        recommendations.push(allSkincare.find(p => p.name === 'Night Repair Cream'));
        recommendations.push(allSkincare.find(p => p.name === 'Hydrating Face Mist'));
      }

      // Always include sunscreen
      recommendations.push(allSkincare.find(p => p.name === 'Sunscreen SPF 50 Glow Shield'));

      // Filter and unique
      const finalRecs = Array.from(new Set(recommendations.filter(Boolean))).slice(0, 5);

      setReport({
        type: randomType,
        concerns: randomConcerns.join(', '),
        recommendations: finalRecs
      });
      setIsAnalyzing(false);
      setStep(3);
    }, 3000);
  };

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '8rem', color: 'white' }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              textAlign: 'center', 
              maxWidth: '900px', 
              margin: '0 auto',
              background: 'rgba(0,0,0,0.35)',
              padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem)',
              borderRadius: 'clamp(20px, 5vw, 50px)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
            }}
          >
            <div className="badge" style={{ marginBottom: '2rem' }}>AI BEAUTY CONSULTANT</div>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
              marginBottom: '2rem', 
              fontWeight: 900, 
              lineHeight: 1.1,
              letterSpacing: '-0.04em'
            }}>
              Personalized <span className="text-skincare">Skincare</span> & <span className="text-lips">Makeup</span> Analysis
            </h1>
            <p style={{ 
              color: 'var(--text-muted)', 
              marginBottom: '4rem', 
              fontSize: '1.2rem', 
              maxWidth: '600px', 
              margin: '0 auto 4rem',
              lineHeight: 1.6
            }}>
              Our advanced AI analyzes your unique features to create a bespoke beauty routine tailored just for you.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2.5rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card" 
                style={{ 
                  cursor: 'pointer', 
                  padding: '4rem 2rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '40px'
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(132, 250, 176, 0.2), rgba(143, 211, 244, 0.2))',
                  width: '100px',
                  height: '100px',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Upload size={48} color="#84fab0" strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Upload Photo</h3>
                <p style={{ fontSize: '1rem', opacity: 0.6, marginTop: '0.8rem' }}>Choose from gallery</p>
                <input 
                  id="ai-assistant-upload"
                  name="ai-assistant-upload"
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </motion.div>

              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card" 
                style={{ 
                  cursor: 'pointer', 
                  padding: '4rem 2rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '40px'
                }}
                onClick={startCamera}
              >
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(183, 33, 255, 0.2), rgba(33, 212, 253, 0.2))',
                  width: '100px',
                  height: '100px',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Camera size={48} color="#B721FF" strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Take Selfie</h3>
                <p style={{ fontSize: '1rem', opacity: 0.6, marginTop: '0.8rem' }}>Use your camera</p>
              </motion.div>
            </div>

            {showCamera && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', 
                  zIndex: 2000, display: 'flex', flexDirection: 'column', 
                  alignItems: 'center', justifyContent: 'center', padding: '2rem',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '40px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                  {cameraError ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,50,50,0.1)' }}>
                      <RefreshCw size={48} className="text-lips" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                      <h3 style={{ marginBottom: '1rem' }}>Camera Error</h3>
                      <p style={{ opacity: 0.7 }}>{cameraError}</p>
                    </div>
                  ) : (
                    <>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} 
                      />
                      <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none', borderRadius: '40px', margin: '15px' }}></div>
                      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '10px', backdropFilter: 'blur(10px)', fontSize: '0.8rem', opacity: 0.7 }}>
                        Center your face in the frame
                      </div>
                    </>
                  )}
                </div>
                {!cameraError && (
                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', width: '100%', maxWidth: '400px' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ flex: 1, borderRadius: '20px' }} 
                      onClick={() => setShowCamera(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, borderRadius: '20px', background: 'var(--highlight-pink)', color: 'white' }} 
                      onClick={capturePhoto}
                    >
                      Capture ✨
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              textAlign: 'center', 
              maxWidth: '700px', 
              margin: '0 auto',
              background: 'rgba(0,0,0,0.35)',
              padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem)',
              borderRadius: 'clamp(20px, 5vw, 50px)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
            }}
          >
            <div className="badge">STEP 2: ANALYSIS</div>
            <h2 style={{ marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 900 }}>Ready for your scan?</h2>
            
            <div style={{ position: 'relative', margin: '0 auto 4rem', width: '100%', maxWidth: '320px', aspectRatio: '3/4', borderRadius: 'clamp(20px, 5vw, 40px)', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)' }}>
              <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="User" />
              {isAnalyzing && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ position: 'absolute', left: 0, width: '100%', height: '4px', background: 'var(--highlight-pink)', boxShadow: '0 0 30px var(--highlight-pink)', zIndex: 10 }}
                />
              )}
            </div>

            {isAnalyzing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <RefreshCw size={40} className="animate-spin text-skincare" />
                <p className="premium-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>Analyzing skin texture and concerns...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" style={{ flex: '1 1 120px', padding: '1rem 2rem' }} onClick={() => setStep(1)}>Retry</button>
                <button className="btn btn-primary" style={{ flex: '1 1 200px', padding: '1rem 2rem' }} onClick={analyzeImage}>Start Analysis ✨</button>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && report && (
          <motion.div 
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ 
              maxWidth: '1200px', 
              margin: '0 auto',
              background: 'rgba(0,0,0,0.35)',
              padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 4rem)',
              borderRadius: 'clamp(30px, 5vw, 60px)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div className="badge">ANALYSIS COMPLETE</div>
              <h1 style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>✨ Your Beauty Report</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
                <div className="glass-card" style={{ flex: '1 1 200px', padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 5vw, 3.5rem)', borderRadius: 'clamp(20px, 5vw, 30px)', background: 'rgba(255,255,255,0.03)' }}>
                  <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detected Skin Type</p>
                  <h3 className="text-skincare" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{report.type}</h3>
                </div>
                <div className="glass-card" style={{ flex: '1 1 200px', padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 5vw, 3.5rem)', borderRadius: 'clamp(20px, 5vw, 30px)', background: 'rgba(255,255,255,0.03)' }}>
                  <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Key concerns</p>
                  <h3 className="text-eye-makeup" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{report.concerns}</h3>
                </div>
              </div>
            </div>

            <h2 style={{ marginBottom: '3.5rem', textAlign: 'center', fontSize: '2.5rem', fontWeight: 900 }}>💄 Tailored For You</h2>
            
            <div className="responsive-grid" style={{ marginBottom: '5rem' }}>
              {report.recommendations.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: idx * 0.15 }}
                  className="glass-card"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    position: 'relative', 
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '40px',
                    padding: '2rem'
                  }}
                >
                  <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    <motion.img 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      src={product.image} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }} 
                    />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--highlight-pink)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.8rem' }}>
                      {product.category}
                    </p>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1.2rem', fontWeight: 800 }}>{product.name}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900 }}>{product.price}</span>
                    <Link to={`/product/${product.id}`} className="btn" style={{ padding: '0.8rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, borderRadius: '15px' }}>
                      SHOP NOW
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card" style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 5rem)', borderRadius: 'clamp(25px, 5vw, 50px)', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%', marginBottom: '2.5rem' }}>
                <CheckCircle2 size={48} className="text-skincare" />
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Unlock This Routine</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto 3.5rem', fontSize: '1.1rem', opacity: 0.7, lineHeight: 1.6 }}>
                Save this bespoke report and receive exclusive member-only discounts on your personalized collection.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" style={{ flex: '1 1 200px', padding: '1rem 2rem' }}>Export PDF</button>
                <button className="btn btn-primary" style={{ flex: '1 1 200px', padding: '1rem 2rem', background: 'white', color: 'black' }}>
                  Join & Shop ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistant;
