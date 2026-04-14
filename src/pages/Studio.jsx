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
  Heart
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
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
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
  const [lipstickColor, setLipstickColor] = useState('#e91e63');
  const [eyeshadowColor, setEyeshadowColor] = useState('#880e4f');
  const [blushColor, setBlushColor] = useState('#ff8a80');
  const [skinGlow, setSkinGlow] = useState(0.2);
  const [opacity, setOpacity] = useState(0.65);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isAiDetectionActive, setIsAiDetectionActive] = useState(true);
  const [naturalDims, setNaturalDims] = useState({ w: 100, h: 100 });
  
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
        const MODEL_URL = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model/';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
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

  const runDetection = useCallback(async () => {
    if (!modelsLoaded) return;
    const source = mode === 'camera' ? webcamRef.current?.video : document.getElementById('studio-image');
    if (!source || (mode === 'photo' && !source.complete)) return;

    const result = await faceapi.detectSingleFace(source).withFaceLandmarks();
    if (result) {
      const naturalW = source.naturalWidth || source.videoWidth || source.width;
      const naturalH = source.naturalHeight || source.videoHeight || source.height;
      setNaturalDims({ w: naturalW, h: naturalH });
      
      const landmarks = result.landmarks.positions;
      const getP = (i) => ({ x: landmarks[i].x, y: landmarks[i].y });

      // PROPER LIP DETECTION: Two completely independent solid loops
      // Pure Dlib 68-point native vertex sequences
      const upperPts = [48, 49, 50, 51, 52, 53, 54, 64, 63, 62, 61, 60];
      const lowerPts = [48, 60, 67, 66, 65, 64, 54, 55, 56, 57, 58, 59];

      // Smooth Catmull-Rom Spline generator for buttery flawless curves (like aimakeup.app)
      const svgSmoothPoly = (pointsArray) => {
        const pts = pointsArray.map(getP);
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length; i++) {
            const p0 = pts[(i - 1 + pts.length) % pts.length];
            const p1 = pts[i];
            const p2 = pts[(i + 1) % pts.length];
            const p3 = pts[(i + 2) % pts.length];
            
            // Generate Cubic Bezier control points for perfect curve hugging
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            
            d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return d + " Z";
      };

      setLipTopPath(svgSmoothPoly(upperPts));
      setLipBotPath(svgSmoothPoly(lowerPts));

      // EYES (36-41 for left, 42-47 for right)
      let elPath = `M ${getP(36).x} ${getP(36).y}`;
      for (let i = 37; i <= 41; i++) elPath += ` L ${getP(i).x} ${getP(i).y}`;
      elPath += " Z";
      setEyeLPath(elPath);

      let erPath = `M ${getP(42).x} ${getP(42).y}`;
      for (let i = 43; i <= 47; i++) erPath += ` L ${getP(i).x} ${getP(i).y}`;
      erPath += " Z";
      setEyeRPath(erPath);

      setCheekPins([getP(2), getP(14)]);
      setIsLoading(false);
    }
  }, [modelsLoaded, mode]);

  useEffect(() => {
    let interval;
    if (isAiDetectionActive) {
      interval = setInterval(runDetection, mode === 'camera' ? 100 : 2000);
    }
    return () => clearInterval(interval);
  }, [isAiDetectionActive, mode, runDetection]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={onReset} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>AI Pro Studio</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button style={{ background: PRIMARY_COLOR, border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14} /> EXPORT</button>
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="studio-ui-wrapper">
          
          {/* Main Workspace (Image/Webcam) */}
          <div className="studio-workspace" style={{ position: 'relative', display: 'flex', flex: 1, overflow: 'hidden', background: '#000' }}>
              
              {/* Full Bleed Image Container */}
              <div style={{ position: 'absolute', inset: 0 }}>
                  <img id="studio-image" src={image} alt="Model" onLoad={runDetection} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  
                  {/* SVG MAKEUP OVERLAY (Automatically geometrically matches object-fit: contain) */}
                  <svg viewBox={`0 0 ${naturalDims.w || 100} ${naturalDims.h || 100}`} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                    {/* Eyeshadow */}
                    <path d={eyeLPath} fill={eyeshadowColor} style={{ opacity: opacity * 0.5, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.01}px)` }} />
                    <path d={eyeRPath} fill={eyeshadowColor} style={{ opacity: opacity * 0.5, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.01}px)` }} />
                    
                    {/* Blush */}
                    {cheekPins.map((p, i) => <circle key={`cheek-${i}`} cx={p.x} cy={p.y} r={naturalDims.w * 0.05} fill={blushColor} style={{ opacity: opacity * 0.4, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.03}px)` }} />)}
                    
                    {/* ULTRA-REALISTIC LIPSTICK APPLICATION (Pro App Level) */}
                    <g style={{ opacity: opacity }}>
                      {/* Base Color & Uniform Vector Expansion (Stroke) to perfectly align with vermilion boundary */}
                      <path d={lipTopPath} fill={lipstickColor} stroke={lipstickColor} strokeWidth={naturalDims.w * 0.005} strokeLinejoin="round" style={{ mixBlendMode: 'color' }} />
                      <path d={lipBotPath} fill={lipstickColor} stroke={lipstickColor} strokeWidth={naturalDims.w * 0.005} strokeLinejoin="round" style={{ mixBlendMode: 'color' }} />
                      
                      {/* Multiply (Depth & Shadows) + Micro Feathering for skin blending */}
                      <path d={lipTopPath} fill={lipstickColor} stroke={lipstickColor} strokeWidth={naturalDims.w * 0.004} style={{ opacity: 0.6, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.002}px)` }} />
                      <path d={lipBotPath} fill={lipstickColor} stroke={lipstickColor} strokeWidth={naturalDims.w * 0.004} style={{ opacity: 0.6, mixBlendMode: 'multiply', filter: `blur(${naturalDims.w * 0.002}px)` }} />
                      
                      {/* Soft Light (Texture & Highlights) */}
                      <path d={lipTopPath} fill={lipstickColor} style={{ opacity: 0.5, mixBlendMode: 'soft-light' }} />
                      <path d={lipBotPath} fill={lipstickColor} style={{ opacity: 0.5, mixBlendMode: 'soft-light' }} />
                      
                      {/* Vividness Overlay */}
                      <path d={lipTopPath} fill={lipstickColor} style={{ opacity: 0.2, mixBlendMode: 'overlay' }} />
                      <path d={lipBotPath} fill={lipstickColor} style={{ opacity: 0.2, mixBlendMode: 'overlay' }} />
                    </g>
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

            <div style={{ marginBottom: '20px' }}>
              <div style={{ height: '36px', width: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}><Sun size={18} color="rgba(255,255,255,0.5)" /></div>
              <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 900, marginBottom: '12px' }}>{activeTab.toUpperCase()} KIT</h4>
              <button onClick={() => setIsCalibrating(!isCalibrating)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>EDIT</button>
            </div>

            <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '10px' }}>PALETTE</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
              {(activeTab === 'lips' ? ['#e91e63', '#c2185b', '#880e4f', '#f06292', '#8e24aa', '#d32f2f', '#ff5252', '#ff8a80', '#e65100', '#fb8c00'] : activeTab === 'eyes' ? ['#4a148c', '#311b92', '#1a237e', '#01579b', '#004d40', '#1b5e20', '#33691e', '#827717', '#f57f17', '#ff6f00'] : ['#ff8a80', '#ff80ab', '#ea80fc', '#b388ff', '#8c9eff', '#82b1ff', '#80d8ff', '#84ffff', '#a7ffeb', '#b9f6ca']).map(color => (
                <button key={color} onClick={() => { if(activeTab==='lips') setLipstickColor(color); else if(activeTab==='eyes') setEyeshadowColor(color); else setBlushColor(color); }} style={{ width: '100%', aspectRatio: '1/1', borderRadius: '50%', background: color, border: (activeTab === 'lips' ? lipstickColor : activeTab === 'eyes' ? eyeshadowColor : blushColor) === color ? '2px solid white' : 'none', cursor: 'pointer', transition: 'transform 0.2s', transform: (activeTab === 'lips' ? lipstickColor : activeTab === 'eyes' ? eyeshadowColor : blushColor) === color ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>INTENSITY</span>
                <span style={{ fontSize: '0.65rem', color: PRIMARY_COLOR, fontWeight: 900 }}>{Math.round(opacity * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} style={{ width: '100%', accentColor: PRIMARY_COLOR, cursor: 'pointer' }} />
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
           <button className="btn btn-primary" style={{ height: '64px', padding: '0 40px' }} onClick={() => setSession({ image: true, mode: 'camera' })}><Camera size={24} style={{ marginRight: '10px' }} /> Launch Live Camera</button>
        </div>
        <div {...getRootProps()} className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px', border: isDragActive ? `4px dashed ${PRIMARY_COLOR}` : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: '40px' }}><input {...getInputProps()} /><Upload size={40} style={{ color: PRIMARY_COLOR, marginBottom: '24px' }} /><h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Upload Photo for AI Try-On</h2></div>
    </div>
  );
}
