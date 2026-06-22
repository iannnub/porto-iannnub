import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useDevicePerformanceTier } from '@/hooks/useDevicePerformanceTier';

function CyberSpider() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    // Idle bobbing
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    // Subtly rotate towards cursor (mouse parallax handled globally or locally)
    const targetX = (state.pointer.x * Math.PI) / 8;
    const targetY = (state.pointer.y * Math.PI) / 8;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.1;
    
    // Animate legs
    groupRef.current.children.forEach((child, i) => {
      // The first 4 children are abdomen, cephalothorax, eyes, eyes.
      // Legs start at index 4.
      if (i >= 4) {
        // Subtle wave/pulse on legs
        const legIndex = i - 4;
        const phaseOffset = legIndex * (Math.PI / 4);
        const wave = Math.sin(state.clock.elapsedTime * 5 + phaseOffset) * 0.1;
        // The leg group has rotation applied initially, we add the wave to the Z rotation
        // Actually, we should animate the inner meshes to simulate "breathing" or stepping.
        // Let's animate the second segment of the leg (index 1 of the leg group).
        if (child.children && child.children[1]) {
          child.children[1].rotation.z = -Math.PI / 6 + wave;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Abdomen */}
      <mesh position={[0, 0.2, -0.4]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#0A0A0F" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Cephalothorax */}
      <mesh position={[0, 0.1, 0.1]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#0A0A0F" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Glowing eyes */}
      <mesh position={[-0.1, 0.2, 0.25]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color="#E0282E" toneMapped={false} />
      </mesh>
      <mesh position={[0.1, 0.2, 0.25]}>
        <sphereGeometry args={[0.05, 4, 4]} />
        <meshBasicMaterial color="#E0282E" toneMapped={false} />
      </mesh>
      
      {/* Legs (geometric lines/tubes) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <group key={i} position={[0, 0.1, 0.1]} rotation={[0, -angle, 0]}>
            <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6]} />
              <meshStandardMaterial color="#2D6CDF" emissive="#2D6CDF" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0.8, -0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.015, 0.01, 0.8]} />
              <meshStandardMaterial color="#2D6CDF" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function GlowingWeb() {
  const webRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (webRef.current) {
      webRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (materialRef.current) {
      // Glow brighter near cursor
      const distance = new THREE.Vector2(state.pointer.x, state.pointer.y).length();
      materialRef.current.opacity = 0.3 + (1 - Math.min(distance, 1)) * 0.5;
    }
  });

  return (
    <group ref={webRef} position={[0, -0.5, 0]}>
      {/* Radial lines */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(angle) * 10, 0, Math.sin(angle) * 10)];
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive key={`rad-${i}`} object={new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0xE0282E, transparent: true, opacity: 0.4 }))} />
        );
      })}
      
      {/* Concentric rings */}
      {[...Array(4)].map((_, r) => {
        const radius = (r + 1) * 1.5;
        const pts = [];
        for (let i = 0; i <= 16; i++) {
          const angle = (i / 16) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive key={`ring-${r}`} object={new THREE.Line(geom)}>
            <lineBasicMaterial ref={r === 2 ? materialRef : undefined} attach="material" color={0x2D6CDF} transparent opacity={0.3} />
          </primitive>
        );
      })}
    </group>
  );
}

function CitySkyline() {
  const [buildings] = useState(() => {
    const list = [];
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = -10 - Math.random() * 20;
      const w = 1 + Math.random() * 2;
      const d = 1 + Math.random() * 2;
      const h = 2 + Math.random() * 10;
      list.push({ position: [x, h/2 - 2, z] as [number, number, number], scale: [w, h, d] as [number, number, number], wireframe: Math.random() > 0.8 });
    }
    return list;
  });

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} scale={b.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#050508" wireframe={b.wireframe} />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="#E0282E" transparent opacity={0.1} />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

function AmbientParticles() {
  const count = 150;
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  });

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#2D6CDF" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function CameraRig() {
  useFrame((state) => {
    // Smooth mouse parallax
    state.camera.position.x += (state.pointer.x * 2 - state.camera.position.x) * 0.05;
    state.camera.position.y += (state.pointer.y * 1 + 2 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function RoadScene() {
  const tier = useDevicePerformanceTier();

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0 z-0 pointer-events-auto"
    >
      <color attach="background" args={['#0A0A0F']} />
      <fog attach="fog" args={['#0A0A0F', 5, 20]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 0]} intensity={2} color="#E0282E" distance={10} />
      
      {tier === 'full' && <CitySkyline />}
      <GlowingWeb />
      <CyberSpider />
      {tier === 'full' && <AmbientParticles />}
      <CameraRig />
    </Canvas>
  );
}
