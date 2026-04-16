import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  useTexture,
  Image as ImageDrei
} from '@react-three/drei';
import * as THREE from 'three';

// Import product images for 3D floating effect
import pRoseGoldLipstick from '../assets/products/Rose Gold Lipstick Premium.png';
import pSkinGlowSerum from '../assets/products/Glow Serum Drops.png';
import pFaceFoundation from '../assets/products/Glow Radiance Foundation.png';
import pEyePalette from '../assets/products/Smokey Eyeshadow Palette.png';
import pMetallicLipstick from '../assets/products/Metallic Lipstick.png';
import pTurquoiseMascara from '../assets/products/Turquoise Mascara Tube.png';
import pPrecisionEyeliner from '../assets/products/Precision Eyeliner Pen.png';
import pCrystalHighlighter from '../assets/products/Crystal Glow Highlighter.png';


const FloatingShapes = () => {
  return (
    <>
      <Float speed={5} rotationIntensity={0.5} floatIntensity={2}>
        <ImageDrei 
          url={pRoseGoldLipstick} 
          position={[4, 2, -2]} 
          scale={[1.5, 1.5]} 
          transparent 
          opacity={0.9}
        />
      </Float>
      
      <Float speed={4} rotationIntensity={0.3} floatIntensity={1.5}>
        <ImageDrei 
          url={pSkinGlowSerum} 
          position={[-5, 1.5, -1]} 
          scale={[1.8, 1.8]} 
          transparent 
          opacity={0.8}
        />
      </Float>

      <Float speed={3} rotationIntensity={0.4} floatIntensity={2}>
        <ImageDrei 
          url={pFaceFoundation} 
          position={[6, -2, -3]} 
          scale={[1.6, 1.6]} 
          transparent 
          opacity={0.9}
        />
      </Float>

      <Float speed={6} rotationIntensity={0.2} floatIntensity={1}>
        <ImageDrei 
          url={pEyePalette} 
          position={[-7, -3, -4]} 
          scale={[2.2, 2.2]} 
          transparent 
          opacity={0.7}
        />
      </Float>

      <Float speed={4} rotationIntensity={0.6} floatIntensity={1.2}>
        <ImageDrei 
          url={pMetallicLipstick} 
          position={[-3, -4, -2]} 
          scale={[1.2, 1.2]} 
          transparent 
          opacity={0.9}
        />
      </Float>

      <Float speed={5} rotationIntensity={0.4} floatIntensity={2.5}>
        <ImageDrei 
          url={pTurquoiseMascara} 
          position={[0, 4, -3]} 
          scale={[1.4, 1.4]} 
          transparent 
          opacity={0.85}
        />
      </Float>

      <Float speed={4.5} rotationIntensity={0.7} floatIntensity={1.8}>
        <ImageDrei 
          url={pPrecisionEyeliner} 
          position={[-8, 3, -2]} 
          scale={[1.1, 1.1]} 
          transparent 
          opacity={0.9}
        />
      </Float>

      <Float speed={5.5} rotationIntensity={0.8} floatIntensity={2}>
        <ImageDrei 
          url={pCrystalHighlighter} 
          position={[7, 3, -1]} 
          scale={[1.4, 1.4]} 
          transparent 
          opacity={0.9}
        />
      </Float>
    </>
  );
};

const Hero3D = ({ mousePos = { x: 0, y: 0 } }) => {
  return (
    <div className="hero-3d-container" style={{ 
      width: '100%', 
      height: '100%', 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      zIndex: 0, 
      pointerEvents: 'none',
      opacity: 1
    }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
        <Environment preset="city" />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        
        <FloatingShapes />
        
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.3} 
          scale={15} 
          blur={2.8} 
          far={5} 
        />
      </Canvas>
    </div>
  );
};

export default Hero3D;
