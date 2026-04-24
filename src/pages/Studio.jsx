import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const StudioUI = ({ initialImage, onReset, initialMode = 'photo', incomingConfig }) => {
  const [mode, setMode] = useState(initialMode);
  const [image, setImage] = useState(initialImage);
  const [sourceImage, setSourceImage] = useState(initialImage); // Track original image for multiple try-ons
  const [activeTab, setActiveTab] = useState(incomingConfig ? incomingConfig.tab : 'lips');
  const [eyeshadowColor, setEyeshadowColor] = useState('transparent');
  const [blushColor, setBlushColor] = useState('transparent');
  const [skinGlow, setSkinGlow] = useState(0.2);

  const [selectedEyeshadowColor, setSelectedEyeshadowColor] = useState(incomingConfig && incomingConfig.tab === 'eyes' ? incomingConfig.hex : 'transparent');
  const [selectedBlushColor, setSelectedBlushColor] = useState(incomingConfig && incomingConfig.tab === 'face' ? incomingConfig.hex : 'transparent');
  const [selectedLipstickColor, setSelectedLipstickColor] = useState(incomingConfig && incomingConfig.tab === 'lips' ? incomingConfig.hex : 'transparent');

  // Isolated opacity settings - Start at 0
  const [lipsOpacity, setLipsOpacity] = useState(0); 
  const [eyesOpacity, setEyesOpacity] = useState(0);
  const [blushOpacity, setBlushOpacity] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [lipstickColor, setLipstickColor] = useState('transparent');
  const [loadingStage, setLoadingStage] = useState("");
  const [isCalibrating, setIsCalibrating] = useState(false);
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

  const autoTryOnFired = useRef(false);

  useEffect(() => {
    if (incomingConfig && incomingConfig.autoTryOn && modelsLoaded && pins && pins.length > 0 && !autoTryOnFired.current) {
      autoTryOnFired.current = true;
      handleAutoTryon(sourceImage);
    }
  }, [modelsLoaded, pins, incomingConfig, sourceImage]);

  const applyMakeupToCanvas = async (sourceUrl, config, landmarks) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = sourceUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // 1. Draw original image
        ctx.drawImage(img, 0, 0);
        
        // 2. Draw Makeup Overlays
        if (landmarks && landmarks.length > 0) {
          // LIPS
          if (config.lipstick && config.lipstick !== 'transparent') {
            ctx.beginPath();
            ctx.fillStyle = config.lipstick;
            ctx.globalAlpha = 0.7;
            ctx.filter = `blur(${img.width * 0.003}px)`;
            
            // Use all available landmarks for the lip path
            const lipPoints = landmarks.length === 68 ? landmarks.slice(48, 60) : landmarks; 
            ctx.moveTo((lipPoints[0].x / 100) * img.width, (lipPoints[0].y / 100) * img.height);
            lipPoints.forEach(p => ctx.lineTo((p.x / 100) * img.width, (p.y / 100) * img.height));
            ctx.closePath();
            ctx.fill();
          }
          
          // EYES (Only if 68 points)
          if (landmarks.length === 68 && config.eyes && config.eyes !== 'transparent') {
            ctx.fillStyle = config.eyes;
            ctx.globalAlpha = 0.35;
            ctx.filter = `blur(${img.width * 0.015}px)`;
            const le = landmarks[37];
            ctx.beginPath();
            ctx.arc((le.x / 100) * img.width, ((le.y - 2) / 100) * img.height, img.width * 0.04, 0, 2 * Math.PI);
            ctx.fill();
            const re = landmarks[44];
            ctx.beginPath();
            ctx.arc((re.x / 100) * img.width, ((re.y - 2) / 100) * img.height, img.width * 0.04, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
    });
  };

  const handleAutoTryon = async (targetImg) => {
    const finalSource = targetImg || sourceImage;
    if (!finalSource) return;
    try {
      setIsLoading(true);
      setLoadingStage("AI GENERATING...");

      const formData = new FormData();
      // Convert base64 to blob if needed
      let blob;
      if (finalSource.startsWith('data:')) {
        const res = await fetch(finalSource);
        blob = await res.blob();
      } else {
        // If it's a URL, fetch it first
        const res = await fetch(finalSource);
        blob = await res.blob();
      }

      formData.append('file', blob, 'image.jpg');
      formData.append('shade', selectedLipstickColor.startsWith('#') ? selectedLipstickColor.slice(1) : selectedLipstickColor);

      const res = await fetch("/api/lipstick", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: finalSource, // Sending base64 directly
          shade: selectedLipstickColor.startsWith('#') ? selectedLipstickColor.slice(1) : selectedLipstickColor
        })
      });

      if (res.ok) {
        const data = await res.json();
        const outputUrl = data.transformed_url || data.url || data.image;
        if (outputUrl) {
          setImage(outputUrl);
          setLoadingStage("SUCCESS!");
          setTimeout(() => setLoadingStage(""), 2000);
        }
      } else {
        setLoadingStage("SERVER ERROR");
      }
    } catch (err) {
      console.error("AI Tryon failed:", err);
      setLoadingStage("CONNECTION FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhook = async () => {
    // Keep EXPORT logic if needed, or call handleAutoTryon
    handleAutoTryon(selectedLipstickColor, mode === 'camera' ? webcamRef.current?.getScreenshot() : image);
  };

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
        { x: 30, y: 50 }, { x: 40, y: 45 }, { x: 47, y: 44 }, { x: 50, y: 48 },
        { x: 53, y: 44 }, { x: 60, y: 45 }, { x: 70, y: 50 }, { x: 65, y: 56 },
        { x: 55, y: 58 }, { x: 50, y: 58 }, { x: 45, y: 58 }, { x: 35, y: 56 }
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
    if (mode === 'camera') {
      const interval = setInterval(runDetection, 100); return () => clearInterval(interval);
    } else {
      runDetection(); // Single high-precision run for photos
    }
  }, [mode, image, runDetection]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', background: '#0a0a0a' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onReset} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><X size={20} /></button>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>AI Pro Studio</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Export button removed */}
        </div>
      </div>

      {/* Studio Viewport */}
      <div className="studio-ui-wrapper">

        {/* Main Workspace (Image/Webcam) */}
        <div className="studio-workspace" style={{ position: 'relative', display: 'flex', flex: 0.85, overflow: 'hidden', background: '#000', alignItems: 'center', justifyContent: 'center' }}>

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

            {mode === 'photo' && (
              <img
                src={image}
                className="main-model-image"
                alt="Model"
                onLoad={(e) => setNaturalDims({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 0 }}
              />
            )}

            {/* UNIFIED SVG RENDER BOX: Native mix-blend-mode */}
            <svg
              viewBox={`0 0 ${naturalDims.w || 100} ${naturalDims.h || 100}`}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                display: 'block',
                transform: mode === 'camera' ? 'scaleX(-1)' : 'none'
              }}
            >
              {/* <image href={image} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" /> */}

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
                  style={{ mixBlendMode: 'multiply' }}
                >
                  <path d={lipTopPath} fill={lipstickColor} />
                  <path d={lipBotPath} fill={lipstickColor} />
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
              <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ color: PRIMARY_COLOR, marginBottom: '20px' }}><RefreshCcw size={48} /></motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em' }}
                >
                  {loadingStage}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Controls Panel */}
        <div className="studio-ui-sidebar hide-scrollbar" style={{ padding: '15px' }}>

          {/* Nav Icons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
            {[
              { id: 'lips', icon: Heart, label: 'Lips' },
              { id: 'eyes', icon: Eye, label: 'Eyes' },
              { id: 'face', icon: Smile, label: 'Face' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', padding: '6px 0', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === tab.id ? PRIMARY_COLOR : 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }}>
                <tab.icon size={16} /><span style={{ fontSize: '0.6rem', fontWeight: 700, marginTop: '2px' }}>{tab.label}</span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '8px' }}>PALETTE</p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(30px, 1fr))', 
            gap: '6px', 
            marginBottom: '10px', 
            maxHeight: '180px', 
            overflowY: 'auto', 
            padding: '8px', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '16px' 
          }} className="hide-scrollbar">
            {(activeTab === 'lips' ?
              [
                'transparent',
                // REDS
                '#850000', '#B22222', '#C41E3A', '#FF0000', '#800020', '#3E0D10',
                // PINKS
                '#FB607F', '#FF69B4', '#FF1493', '#C71585', '#DA70D6', '#FF00FF',
                // NUDES/BROWNS
                '#E3BC9A', '#BC8F8F', '#CD853F', '#8B4513', '#A0522D', '#2A1A1A',
                // PLUMS/DARKERS
                '#4B0082', '#3D0158', '#5E2D79', '#673147', '#301934', '#000000'
              ] :
              activeTab === 'eyes' ?
                ['transparent', '#4a148c', '#311b92', '#1a237e', '#01579b', '#004d40', '#1b5e20', '#33691e', '#827717', '#f57f17', '#ff6f00', '#000000', '#2c3e50', '#34495e', '#7f8c8d'] :
                ['transparent', '#FFE0C4', '#FCD6B9', '#F5CBAC', '#E4B594', '#D5A17A', '#C68E63', '#B4784C', '#986036', '#734122', '#4A2511']
            ).map((color, index) => {
              const isSelected = (activeTab === 'lips' ? selectedLipstickColor : activeTab === 'eyes' ? selectedEyeshadowColor : selectedBlushColor) === color;
              return (
                <button
                  key={`lipstick-shade-${index}`}
                  onClick={() => {
                    if (activeTab === 'lips') {
                      setSelectedLipstickColor(color);
                      setLipstickColor(color);
                      setLipsOpacity(color === 'transparent' ? 0 : 0.8);
                    } else if (activeTab === 'eyes') {
                      setSelectedEyeshadowColor(color);
                      setEyesOpacity(color === 'transparent' ? 0 : 0.4);
                    } else {
                      setSelectedBlushColor(color);
                      setBlushOpacity(color === 'transparent' ? 0 : 0.4);
                    }
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    background: color === 'transparent' ? 'rgba(255,255,255,0.05)' : color,
                    border: isSelected ? '3px solid white' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 15px ${color === 'transparent' ? '#fff' : color}80, 0 4px 10px rgba(0,0,0,0.5)` : 'none',
                    position: 'relative',
                    zIndex: isSelected ? 2 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {color === 'transparent' && <X size={14} color="rgba(255,255,255,0.4)" />}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={() => {
                setLipstickColor(selectedLipstickColor);
                setEyeshadowColor(selectedEyeshadowColor);
                setBlushColor(selectedBlushColor);
                handleAutoTryon(sourceImage);
              }}
              style={{ width: '100%', height: '36px', marginTop: '10px', borderRadius: '12px', background: PRIMARY_COLOR, color: 'white', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              TRY ON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Studio() {
  const [session, setSession] = useState({ image: null, mode: 'photo' });
  const location = useLocation();
  const incomingConfig = location.state;

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setSession({ image: reader.result, mode: 'photo' });
    reader.readAsDataURL(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple: false });

  if (session.image) {
    return <StudioUI initialImage={session.image} initialMode={session.mode} onReset={() => setSession({ image: null, mode: 'photo' })} incomingConfig={incomingConfig} />;
  }

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
      <span className="badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>SECURED • PHOTOREALISTIC • FREE</span>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.06em' }}>AI Pro Studio</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '60px' }}>
        <button className="btn btn-primary" style={{ height: '64px', padding: '0 40px' }} onClick={() => setSession({ image: 'camera_active', mode: 'camera' })}><Camera size={24} style={{ marginRight: '10px' }} /> Launch Live Camera</button>
        

      </div>

      <div {...getRootProps()} className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 40px', border: isDragActive ? `4px dashed ${PRIMARY_COLOR}` : '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: '40px' }}>
        <input {...getInputProps()} />
        <Upload size={40} style={{ color: PRIMARY_COLOR, marginBottom: '24px' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Upload Photo for AI Try-On</h2>
        <p style={{ opacity: 0.6, marginTop: '10px' }}>or drag and drop here</p>
      </div>
    </div>
  );
}
