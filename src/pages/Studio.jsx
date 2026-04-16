import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import * as faceapi from '@vladmandic/face-api';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  ChevronDown,
  X,
  Palette,
  RefreshCcw,
  Eye,
  Smile,
  Sun,
  Heart,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const PRIMARY_COLOR = "#e91e63";

const DraggablePin = ({ x, y, onDrag, color, hidden }) => {
  const [isDragging, setIsDragging] = useState(false);
  if (hidden) return null;

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    // Find the SVG container by ID or ref
    const container = document.getElementById('studio-content-box');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;
    onDrag(Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
  }, [isDragging, onDrag]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '10px',
        height: '10px',
        background: color,
        border: '2px solid white',
        borderRadius: '50%',
        cursor: 'move',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        zIndex: 100,
        transition: 'transform 0.1s ease'
      }}
    />
  );
};

const StudioUI = ({ initialImage, onReset, initialMode = 'photo' }) => {
  const [mode, setMode] = useState(initialMode);
  const [image, setImage] = useState(initialImage);
  const [activeTab, setActiveTab] = useState('lips');
  const [eyeshadowColor, setEyeshadowColor] = useState('#673147'); // Default earth tone
  const [blushColor, setBlushColor] = useState('#ff8a80');
  const [skinGlow, setSkinGlow] = useState(0.2);
  
  // Isolated opacity settings
  const [lipsOpacity, setLipsOpacity] = useState(0.5); 
  const [eyesOpacity, setEyesOpacity] = useState(0.3);
  const [blushOpacity, setBlushOpacity] = useState(0.4);

  const [isLoading, setIsLoading] = useState(true);
  const [lipstickColor, setLipstickColor] = useState('#4B0082'); // Rich Deep Purple Default
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isAiDetectionActive, setIsAiDetectionActive] = useState(true);
  const [naturalDims, setNaturalDims] = useState({ w: 100, h: 100 });
  const [markupOffset, setMarkupOffset] = useState({ x: 0, y: 0 });
  const [domBounds, setDomBounds] = useState({ width: 100, height: 100, x: 0, y: 0 });
  
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [lipTopPath, setLipTopPath] = useState("");
  const [lipBotPath, setLipBotPath] = useState("");
  const [eyeLPath, setEyeLPath] = useState("");
  const [eyeRPath, setEyeRPath] = useState("");
  const [cheekPins, setCheekPins] = useState([]);
  const [pins, setPins] = useState([]); // For manual editing

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/model';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Neural core error:", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
      setPins([]); // Clear previous anchors to force fresh detection or fallback
      setMarkupOffset({ x: 0, y: 0 }); 
      setIsLoading(true);
    }
  }, [initialImage]);

  const runDetection = useCallback(async () => {
    if (!modelsLoaded) return;
    
    // Always use the latest image state
    const srcData = mode === 'camera' ? webcamRef.current?.getScreenshot() : image;
    if (!srcData) return;

    // 1. Get Intrinsic Source (Physical Pixels)
    const sourceImage = new Image();
    sourceImage.crossOrigin = 'anonymous'; // Prevent canvas taint issues
    sourceImage.src = srcData;
    await new Promise((resolve, reject) => {
      sourceImage.onload = resolve;
      sourceImage.onerror = reject;
    }).catch(err => {
      console.warn("Could not load image for face detection", err);
    });
    
    if (!sourceImage.width) return;

    const intrinsicW = sourceImage.width;
    const intrinsicH = sourceImage.height;
    setNaturalDims({ w: intrinsicW, h: intrinsicH });

    // 2. Detect with TinyFaceDetector
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.1 }); 
    const result = await faceapi.detectSingleFace(sourceImage, options).withFaceLandmarks();
    
    if (result) {
      const landmarks = result.landmarks.positions;
      // Store as percentages for the DraggablePin component
      const mapped = landmarks.map(p => ({ 
        x: (p.x / intrinsicW) * 100, 
        y: (p.y / intrinsicH) * 100 
      }));
      setPins(mapped);
      setIsLoading(false);
    } else if (pins.length === 0) {
      // PRO-FALLBACK: 12-point high-fidelity manual anchors
      const defaultMouth = [
        {x: 30, y: 50}, {x: 40, y: 45}, {x: 47, y: 44}, {x: 50, y: 48}, 
        {x: 53, y: 44}, {x: 60, y: 45}, {x: 70, y: 50}, {x: 65, y: 56}, 
        {x: 55, y: 58}, {x: 50, y: 58}, {x: 45, y: 58}, {x: 35, y: 56}
      ];
      setPins(defaultMouth);
      setIsLoading(false);
    }
  }, [modelsLoaded, mode, pins.length]);

  // Sync paths whenever pins move
  useEffect(() => {
    if (pins.length >= 8) {
      // Convert % back to intrinsic pixels for SVG path
      const getP = (i) => ({
        x: (pins[i].x / 100) * naturalDims.w,
        y: (pins[i].y / 100) * naturalDims.h
      });
      
      // CARDINAL SPLINE: Ensures the path passes EXACTLY through every point for perfect shape
      const smartPath = (pointsArray) => {
        const pts = pointsArray.map(getP);
        if (pts.length < 3) return "";
        
        let d = `M ${pts[0].x} ${pts[0].y}`;
        const tension = 0.35; // Professional tension for natural lip curvature
        
        for (let i = 0; i < pts.length; i++) {
          const p0 = pts[i === 0 ? pts.length - 1 : i - 1];
          const p1 = pts[i];
          const p2 = pts[(i + 1) % pts.length];
          const p3 = pts[(i + 2) % pts.length];
          
          const cp1x = p1.x + (p2.x - p0.x) * tension;
          const cp1y = p1.y + (p2.y - p0.y) * tension;
          const cp2x = p2.x - (p3.x - p1.x) * tension;
          const cp2y = p2.y - (p3.y - p1.y) * tension;
          
          d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d + " Z";
      };

      if (pins.length === 68) {
        // Precise split for 68-point model
        setLipTopPath(smartPath([48, 49, 50, 51, 52, 53, 54, 64, 63, 62, 61, 60]));
        setLipBotPath(smartPath([54, 55, 56, 57, 58, 59, 48, 60, 67, 66, 65, 64]));
        setEyeLPath(smartPath([17, 18, 19, 20, 21, 39, 38, 37, 36]));
        setEyeRPath(smartPath([22, 23, 24, 25, 26, 45, 44, 43, 42]));
        setCheekPins([getP(2), getP(14)]);
      } else {
        // Fallback: use all pins for both (simplifies logic for custom maps)
        const path = smartPath(pins.map((_, i) => i));
        setLipTopPath(path);
        setLipBotPath(path);
      }
    }
  }, [pins, naturalDims]);

  useEffect(() => {
    if (isAiDetectionActive) {
      if (mode === 'camera') {
        const interval = setInterval(runDetection, 100);
        return () => clearInterval(interval);
      } else {
        runDetection(); // Single high-precision run for photos
      }
    }
  }, [isAiDetectionActive, mode, image, runDetection]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={onReset} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>AI Pro Studio</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button onClick={() => setIsCalibrating(!isCalibrating)} style={{ background: isCalibrating ? PRIMARY_COLOR : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                {isCalibrating ? 'CLOSE CALIBRATION' : 'CALIBRATE AI'}
             </button>
             <button style={{ background: PRIMARY_COLOR, border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14} /> EXPORT</button>
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="studio-ui-wrapper">
          
          {/* Main Workspace (Image/Webcam) */}
          <div className="studio-workspace" style={{ position: 'relative', display: 'flex', flex: 1, overflow: 'hidden', background: '#000', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* 
                CONTENT-BOX: This is the 'Secret Sauce'. 
                We force the container to be the EXACT size of the image content.
                No pillars, no margins in this box.
              */}
              <div id="studio-content-box" key={image} style={{ 
                position: 'relative', 
                width: naturalDims.w > naturalDims.h ? 'min(100%, 1200px)' : 'auto',
                height: naturalDims.h >= naturalDims.w ? '100%' : 'auto',
                aspectRatio: `${naturalDims.w} / ${naturalDims.h}`,
                maxHeight: '100%',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                  {mode === 'camera' && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      mirrored={true} // Acts like a mirror
                      onUserMedia={() => setNaturalDims({ w: webcamRef.current?.video?.videoWidth || 640, h: webcamRef.current?.video?.videoHeight || 480 })}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                      videoConstraints={{ facingMode: "user" }}
                    />
                  )}

                  {/* UNIFIED SVG RENDER BOX: Native mix-blend-mode */}
                  <svg 
                    viewBox={`0 0 ${naturalDims.w || 100} ${naturalDims.h || 100}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'block',
                      transform: mode === 'camera' ? 'scaleX(-1)' : 'none'
                    }}
                  >
                    {mode === 'photo' && (
                      <image href={image} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
                    )}
                    
                    {/* Eyeshadow */}
                    <path d={eyeLPath} fill={eyeshadowColor} style={{ opacity: eyesOpacity, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.012}px)` }} />
                    <path d={eyeRPath} fill={eyeshadowColor} style={{ opacity: eyesOpacity, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.012}px)` }} />
                    
                    {/* Blush */}
                    {cheekPins.map((p, i) => <circle key={`cheek-${i}`} cx={p.x} cy={p.y} r={naturalDims.w * 0.06} fill={blushColor} style={{ opacity: blushOpacity, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.04}px)` }} />)}
                    
                    <defs>
                      <radialGradient id="lipGloss" cx="50%" cy="50%" r="50%" fx="50%" fy="30%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                      </radialGradient>
                      <filter id="naturalSoftEdge" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={naturalDims.w * 0.001} />
                      </filter>
                    </defs>

                    {/* ULTRA-REALISTIC GRADUAL APPLICATION ANIMATION */}
                    <AnimatePresence mode="wait">
                      <motion.g 
                        key={lipstickColor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: lipsOpacity }}
                        transition={{ duration: 0.6 }}
                        filter="url(#naturalSoftEdge)"
                      >
                        {/* Layer 1: Base Pigment (Normal) - Solid visibility */}
                        <path d={lipTopPath} fill={lipstickColor} style={{ opacity: 0.3 }} />
                        <path d={lipBotPath} fill={lipstickColor} style={{ opacity: 0.3 }} />

                        {/* Layer 2: Texture Integration (Soft-Light) */}
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                          d={lipTopPath} fill={lipstickColor} style={{ mixBlendMode: 'soft-light' }} 
                        />
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                          d={lipBotPath} fill={lipstickColor} style={{ mixBlendMode: 'soft-light' }} 
                        />
                        
                        {/* Layer 3: Depth & Gloss (Multiply & Screen) */}
                        <motion.path 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          d={lipTopPath} fill={lipstickColor} style={{ mixBlendMode: 'multiply' }} 
                        />
                        <motion.path 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.25 }}
                          transition={{ duration: 1, delay: 0.6 }}
                          d={lipTopPath} fill="url(#lipGloss)" style={{ mixBlendMode: 'screen' }} 
                        />
                      </motion.g>
                    </AnimatePresence>

                  {/* INTERACTIVE CALIBRATION PINS: Allows manual 'Proper Detection' */}
                  {isCalibrating && pins.map((p, i) => {
                    // Only show lip-relevant pins if 68-pt model, otherwise show all
                    if (pins.length === 68 && (i < 48 || i > 59)) return null;
                    
                    return (
                      <DraggablePin 
                        key={`pin-${i}`} 
                        x={p.x} y={p.y} 
                        color={PRIMARY_COLOR}
                        onDrag={(newX, newY) => {
                          const newPins = [...pins];
                          newPins[i] = { x: newX, y: newY };
                          setPins(newPins);
                        }} 
                      />
                    );
                  })}
                </svg>
              </div>
              {/* Loader Overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ color: PRIMARY_COLOR }}><RefreshCcw size={48} /></motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>

          {/* Right Controls Panel */}
          <div className="studio-ui-sidebar hide-scrollbar">
            
            {/* Nav Icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'lips', icon: Heart, label: 'Lips' },
                { id: 'eyes', icon: Eye, label: 'Eyes' },
                { id: 'face', icon: Smile, label: 'Face' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '8px 0', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === tab.id ? PRIMARY_COLOR : 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }}>
                  <tab.icon size={18} /><span style={{ fontSize: '0.6rem', fontWeight: 700, marginTop: '4px' }}>{tab.label}</span>
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>CALIBRATION</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[
                'https://images.unsplash.com/photo-1549233634-9388147d9673?auto=format&fit=crop&q=80&w=150&h=150',
                'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=150&h=150',
                'https://images.unsplash.com/photo-1498842812179-c81beecf902c?auto=format&fit=crop&q=80&w=150&h=150',
                'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=150&h=150'
              ].map((url, i) => (
                <button key={`model-${i}`} onClick={() => setImage(url)} style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: image === url ? `2px solid ${PRIMARY_COLOR}` : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: 0 }}>
                  <img src={url} alt="Model" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
              <label style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Plus size={16} color="white" />
                <input type="file" hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setImage(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }} />
              </label>
            </div>

            <AnimatePresence>
              {isCalibrating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '20px' }}>
                  <div className="glass-card" style={{ padding: '15px 12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '0.1em' }}>PRECISION CALIBRATION ACTIVE</p>
                    <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>Drag the pins on the face to refine the lip edges perfectly.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>PALETTE</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }} className="hide-scrollbar">
              {(activeTab === 'lips' ? 
                [
                  // REDS
                  '#4A0404', '#5C0000', '#7A0000', '#850000', '#990000', '#B22222', '#C41E3A', '#D4145A', '#E60000', '#FF0000', '#FF2400', '#B21807', '#930D0D', '#800020', '#660000', '#540E1B', '#3E0D10', '#6E2626', '#8F3939', '#5D2525',
                  // PINKS
                  '#FFB6C1', '#FFC0CB', '#FB607F', '#FF69B4', '#FF1493', '#C71585', '#E0115F', '#D02090', '#DA70D6', '#BA55D3', '#9370DB', '#8A2BE2', '#9400D3', '#9932CC', '#8B008B', '#800080', '#D8BFD8', '#DDA0DD', '#EE82EE', '#FF00FF',
                  // NUDES/BROWNS
                  '#E3BC9A', '#D2B48C', '#BC8F8F', '#F4A460', '#DAA520', '#CD853F', '#D2691E', '#B87333', '#8B4513', '#A0522D', '#D2691E', '#CD5C5C', '#E9967A', '#F08080', '#AF6E4D', '#855E42', '#6B4226', '#483C32', '#3B2F2F', '#2A1A1A',
                  // PLUMS/DARKERS
                  '#4B0082', '#3D0158', '#483D8B', '#2E0854', '#5E2D79', '#673147', '#722F37', '#58111A', '#3F000F', '#301934', '#1A1110', '#2B1B17', '#120A08', '#0D0806', '#120404', '#000000', '#1A1A1A', '#2F4F4F', '#000080', '#191970',
                  // CORALS/PEACH
                  '#FF4500', '#FF6347', '#FF7F50', '#FF8C00', '#FFA500', '#FFD700', '#FFB347', '#FF9966', '#FF8964', '#FF7F50', '#E9967A', '#F4A460', '#FA8072', '#E08080', '#D2691E', '#B22222', '#CD5C5C', '#F08080', '#FF7F50', '#FF4F00'
                ] : 
                activeTab === 'eyes' ? 
                ['#4a148c', '#311b92', '#1a237e', '#01579b', '#004d40', '#1b5e20', '#33691e', '#827717', '#f57f17', '#ff6f00', '#000000', '#2c3e50', '#34495e', '#7f8c8d'] : 
                ['#ff8a80', '#ff80ab', '#ea80fc', '#b388ff', '#8c9eff', '#82b1ff', '#80d8ff', '#84ffff', '#a7ffeb', '#b9f6ca', '#e57373', '#f06292', '#ba68c8']
              ).map(color => (
                <button 
                  key={color} 
                  onClick={() => { if(activeTab==='lips') setLipstickColor(color); else if(activeTab==='eyes') setEyeshadowColor(color); else setBlushColor(color); }} 
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1/1', 
                    borderRadius: '50%', 
                    background: color, 
                    border: (activeTab === 'lips' ? lipstickColor : activeTab === 'eyes' ? eyeshadowColor : blushColor) === color ? '2px solid white' : 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s ease', 
                    transform: (activeTab === 'lips' ? lipstickColor : activeTab === 'eyes' ? eyeshadowColor : blushColor) === color ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: (activeTab === 'lips' ? lipstickColor : activeTab === 'eyes' ? eyeshadowColor : blushColor) === color ? `0 4px 12px ${color}60` : 'none'
                  }} 
                />
              ))}
            </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>INTENSITY</span>
                  <span style={{ fontSize: '0.65rem', color: PRIMARY_COLOR, fontWeight: 900 }}>
                    {Math.round((activeTab === 'lips' ? lipsOpacity : activeTab === 'eyes' ? eyesOpacity : blushOpacity) * 100)}%
                  </span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={activeTab === 'lips' ? lipsOpacity : activeTab === 'eyes' ? eyesOpacity : blushOpacity} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (activeTab === 'lips') setLipsOpacity(val);
                    else if (activeTab === 'eyes') setEyesOpacity(val);
                    else setBlushOpacity(val);
                  }} 
                  style={{ width: '100%', accentColor: PRIMARY_COLOR, cursor: 'pointer' }} 
                />
              <button onClick={() => setIsAiDetectionActive(!isAiDetectionActive)} style={{ width: '100%', height: '40px', marginTop: '16px', borderRadius: '12px', background: isAiDetectionActive ? PRIMARY_COLOR : 'rgba(255,255,255,0.05)', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>{isAiDetectionActive ? "AI On" : "AI Off"}</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default function Studio() {
  const [session, setSession] = useState({ image: null, mode: 'photo' });
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setSession({ image: reader.result, mode: 'photo' });
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []}, multiple: false });

  if (session.image) {
    return <StudioUI initialImage={session.image} initialMode={session.mode} onReset={() => setSession({ image: null, mode: 'photo' })} />;
  }

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <span className="badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>SECURED • PHOTOREALISTIC • FREE</span>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.06em' }}>AI Pro Studio</h1>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
           <button className="btn btn-primary" style={{ height: '64px', padding: '0 40px' }} onClick={() => setSession({ image: 'camera_active', mode: 'camera' })}><Camera size={24} style={{ marginRight: '10px' }} /> Launch Live Camera</button>
        </div>
        <div {...getRootProps()} className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px', border: isDragActive ? `4px dashed ${PRIMARY_COLOR}` : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: '40px' }}><input {...getInputProps()} /><Upload size={40} style={{ color: PRIMARY_COLOR, marginBottom: '24px' }} /><h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Upload Photo for AI Try-On</h2></div>
    </div>
  );
}
