"use client" // Ensure it's a client component

import { useEffect, useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Environment } from "@react-three/drei"
import { motion } from "framer-motion-3d"
import * as THREE from "three"

interface BarProps {
  position: [number, number, number]
  height: number
  color: string
  label: string
  value: number
}

function Bar({ position, height, color, label, value }: BarProps) {
  const mesh = useRef<THREE.Mesh | null>(null); // Ensure nullability

  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, height, 0.1);
    }
  });

  return (
    <group position={position}>
      <motion.group ref={mesh}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={hovered ? "#ff9900" : color} metalness={0.5} roughness={0.5} />
        </mesh>
      </motion.group>
      <Text position={[0, -0.6, 0]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
        {label}
      </Text>
      <Text position={[0, height + 0.3, 0]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
        {value.toFixed(1)}
      </Text>
    </group>
  );
}


interface ThreeDChartProps {
  data: Array<{ label: string; value: number }>
  height?: number
}

export function ThreeDChart({ data, height = 300 }: ThreeDChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div style={{ height: height, textAlign: "center", color: "white" }}>Loading...</div>;

  const maxValue = Math.max(...data.map((item) => item.value), 1); // Avoid division by zero
  const normalizedData = data.map((item) => ({
    ...item,
    normalizedValue: (item.value / maxValue) * 5,
  }));

  return (
    <div style={{ height }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 75 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Environment preset="city" />

        {normalizedData.map((item, index) => (
          <Bar
            key={item.label}
            position={[(index - (normalizedData.length - 1) / 2) * 1.5, 0, 0]}
            height={item.normalizedValue}
            color="#4f46e5"
            label={item.label}
            value={item.value}
          />
        ))}

        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}

