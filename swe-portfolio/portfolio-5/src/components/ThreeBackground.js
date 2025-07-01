import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedSphere = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <AnimatedSphere position={[-4, 2, -5]} color="#6366f1" speed={0.8} />
        <AnimatedSphere position={[4, -2, -3]} color="#8b5cf6" speed={1.2} />
        <AnimatedSphere position={[0, 0, -8]} color="#06b6d4" speed={0.6} />
        <AnimatedSphere position={[-2, -3, -6]} color="#ec4899" speed={1.5} />
        <AnimatedSphere position={[3, 3, -4]} color="#10b981" speed={0.9} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
