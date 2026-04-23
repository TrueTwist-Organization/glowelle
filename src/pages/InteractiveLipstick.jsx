import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Float
} from '@react-three/drei';
import { useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import * as THREE from 'three';

const Lipstick = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const capRef = useRef();
  const innerTubeRef = useRef();

  useFrame(() => {
    const progress = smoothProgress.get();
    
    // Lift: 0 to 0.6 of total scroll
    if (progress <= 0.6) {
      const liftProgress = progress / 0.6;
      capRef.current.position.y = liftProgress * 4;
      capRef.current.position.x = 0;
    } else {
      // Move to right: 0.6 to 1.0 of total scroll
      const shiftProgress = (progress - 0.6) / 0.4;
      capRef.current.position.y = 4 + shiftProgress * 1; // keep moving up bit
      capRef.current.position.x = shiftProgress * 3.5;
      capRef.current.rotation.z = -shiftProgress * 0.4;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* 1. Lipstick Base (Stationary) */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.6, 1.8, 64]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.1} 
            metalness={0.8} 
          />
        </mesh>
        
        {/* Bottom Gold Detail */}
        <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.61, 0.61, 0.2, 64]} />
          <meshStandardMaterial color="#ffccd5" roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Center Gold Detail */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.2, 64]} />
          <meshStandardMaterial color="#ffccd5" roughness={0.05} metalness={1} />
        </mesh>
      </group>

      {/* 2. Inner Golden Tube & Bullet (Stationary) */}
      <group position={[0, 1.4, 0]}>
        {/* Inner Gold Section */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.45, 1.2, 64]} />
          <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={1} />
        </mesh>
        
        {/* Matte Red Lipstick Bullet */}
        <mesh position={[0, 0.4, 0]} rotation={[0.4, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.8, 64]} />
          <meshStandardMaterial color="#b91c1c" roughness={1} metalness={0} />
        </mesh>
      </group>

      {/* 3. The Cap (Animated) */}
      <group ref={capRef} position={[0, 0, 0]}>
         {/* Offset to cover the base/bullet initially */}
         <group position={[0, 1.4, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.65, 0.65, 2.8, 64]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.7} />
            </mesh>
            {/* Cap Gold Ring */}
            <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.66, 0.66, 0.2, 64]} />
              <meshStandardMaterial color="#ffccd5" roughness={0.05} metalness={1} />
            </mesh>
         </group>
      </group>

      {/* Lighting Shadows */}
      <ContactShadows 
        position={[0, -0.9, 0]} 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={5} 
      />
    </group>
  );
};

const InteractiveLipstick = () => {
  return (
    <div style={{ height: '500vh', background: 'transparent', position: 'relative' }}>
      {/* Elegant Frame/Border */}
      <div style={{
        position: 'fixed',
        inset: '2.5rem',
        border: '1px solid rgba(0,0,0,0.08)',
        pointerEvents: 'none',
        zIndex: 50,
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.02)'
      }} />

      {/* Background Studio Light Hint */}
      <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1
      }} />
      
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 10
      }}>
        <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1, 8.5]} fov={30} />
          <Environment preset="studio" />
          
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, 10, -5]} intensity={1} />
          <directionalLight position={[0, 5, 5]} intensity={0.5} />

          <Lipstick />
        </Canvas>
      </div>

      <div style={{ height: '500vh' }}>
        {/* Scroll Content Space */}
      </div>

      {/* Branding / Scroll Indicator (Minimal) */}
      <div style={{
        position: 'fixed',
        bottom: '4rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        textAlign: 'center',
        opacity: 0.4
      }}>
        <p style={{ letterSpacing: '0.5em', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>SCROLL TO REVEAL</p>
      </div>
    </div>
  );
};

export default InteractiveLipstick;
