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
    for (let i = 0; i < 30; i++) {
      const z = -(i * 3) - 5;
      const x = (i % 2 === 0 ? 1 : -1) * (3 + Math.random() * 5);
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

// Pre-allocate reusable objects to avoid GC pressure in the render loop
const _lerpTarget = new THREE.Vector3();
const _lookAtTarget = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();

function PathCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    const targetZ = p * -100;
    const targetX = Math.sin(p * Math.PI * 4) * 2;
    const targetY = 2 + Math.sin(p * Math.PI * 2) * 1;
    
    _lerpTarget.set(targetX, targetY, targetZ);
    camera.position.lerp(_lerpTarget, 0.1);
    
    const lookAheadZ = targetZ - 10;
    const lookAheadX = Math.sin((p + 0.05) * Math.PI * 4) * 2;
    
    _lookAtTarget.set(lookAheadX, 2, lookAheadZ);
    _dummyObj.position.copy(camera.position);
    _dummyObj.lookAt(_lookAtTarget);
    camera.quaternion.slerp(_dummyObj.quaternion, 0.1);
  });
  
  return null;
}

export default function ExperienceRoadScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 0], fov: 60 }} gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}>
        <fog attach="fog" args={['#0A0A0F', 5, 25]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#2D6CDF" distance={20} />
        
        <CitySilhouettes />
        
        <PathCamera progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
