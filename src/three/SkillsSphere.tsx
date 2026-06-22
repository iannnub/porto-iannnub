import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { skillsData } from '@/data/skills';

function CoreNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#E0282E" emissive="#E0282E" emissiveIntensity={1} wireframe />
    </mesh>
  );
}

function SkillNode({ position, label, color }: { position: [number, number, number], label: string, color: string }) {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y = state.clock.elapsedTime;
      const targetScale = hovered ? 1.5 : 1;
      nodeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Line
        points={[[0, 0, 0], [-position[0], -position[1], -position[2]]]}
        color={hovered ? "#E0282E" : color}
        transparent
        opacity={hovered ? 0.8 : 0.3}
        lineWidth={1}
      />
      <mesh
        ref={nodeRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={hovered ? "#E0282E" : color} emissive={hovered ? "#E0282E" : color} emissiveIntensity={hovered ? 1 : 0.5} />
      </mesh>
      {hovered && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.2}
          color="#F3F4F6"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function NodeCluster() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  const nodes = useMemo(() => {
    const list: Array<{ position: [number, number, number], label: string, color: string }> = [];
    const colors = ["#2D6CDF", "#5B9CFF", "#E0282E"];
    const allSkills = skillsData.flatMap(cat => cat.skills);
    
    // Golden spiral distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    const radius = 3;

    allSkills.forEach((skill, i) => {
      const y = 1 - (i / (allSkills.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      list.push({
        position: [x * radius, y * radius, z * radius],
        label: skill,
        color: colors[i % colors.length]
      });
    });

    return list;
  }, []);

  return (
    <group ref={groupRef}>
      <CoreNode />
      {nodes.map((node, i) => (
        <SkillNode key={i} {...node} />
      ))}
    </group>
  );
}

export default function SkillsSphere() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-[500px]">
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#E0282E" distance={5} />
      <NodeCluster />
    </Canvas>
  );
}
