import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useState } from 'react';

const baseBoxGeo = new THREE.BoxGeometry(1, 1, 1);
const edgesGeo = new THREE.EdgesGeometry(baseBoxGeo);
const boxMaterial = new THREE.MeshBasicMaterial({ color: "#050508" });
const lineMaterial = new THREE.LineBasicMaterial({ color: "#E0282E", transparent: true, opacity: 0.3 });

function CitySilhouettes() {
  const [buildings] = useState(() => {
    const list = [];
    for (let i = 0; i < 50; i++) {
      const z = -(i * 2) - 5; // Spread along Z
      const x = (i % 2 === 0 ? 1 : -1) * (3 + Math.random() * 5); // Left and right
      const w = 1 + Math.random() * 2;
      const h = 2 + Math.random() * 15;
      const d = 1 + Math.random() * 2;
      list.push({ position: [x, h/2 - 2, z] as [number, number, number], scale: [w, h, d] as [number, number, number] });
    }
    return list;
  });

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} scale={b.scale} geometry={baseBoxGeo} material={boxMaterial}>
          <lineSegments geometry={edgesGeo} material={lineMaterial} />
        </mesh>
      ))}
    </group>
  );
}

function PathCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current; // 0 to 1
    // Parabolic swing arc motion
    // Start at z=0, go deep into z=-100
    const targetZ = p * -100;
    // Swing x back and forth
    const targetX = Math.sin(p * Math.PI * 4) * 2;
    // Slight y bump
    const targetY = 2 + Math.sin(p * Math.PI * 2) * 1;
    
    // Lerp for smooth camera movement
    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
    
    // Look slightly ahead on the path
    const lookAheadZ = targetZ - 10;
    const lookAheadX = Math.sin((p + 0.05) * Math.PI * 4) * 2;
    
    const targetLookAt = new THREE.Vector3(lookAheadX, 2, lookAheadZ);
    // Create a dummy object to lerp the lookAt
    const dummy = new THREE.Object3D();
    dummy.position.copy(camera.position);
    dummy.lookAt(targetLookAt);
    camera.quaternion.slerp(dummy.quaternion, 0.1);
  });
  
  return null;
}

export default function ExperienceRoadScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 0], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={['#0A0A0F', 5, 30]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#2D6CDF" distance={20} />
        
        <CitySilhouettes />
        
        <PathCamera progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
