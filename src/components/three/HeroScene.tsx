"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { BoxGeometry, CatmullRomCurve3, Group, MathUtils, Mesh, Quaternion, TorusGeometry, TubeGeometry, Vector3 } from "three";

const GOLD = "#f4b71a";
const PAPER = "#f6f3ec";
const BARS = [
  { x: -1.0, h: 0.75 },
  { x: -0.42, h: 1.25 },
  { x: 0.16, h: 1.8 },
  { x: 0.74, h: 2.4 },
];
const BASE_Y = -1.25;

type Pointer = { x: number; y: number };

function Mark({ pointer }: { pointer: RefObject<Pointer> }) {
  const group = useRef<Group>(null);
  const bars = useRef<(Mesh | null)[]>([]);
  const arrow = useRef<Group>(null);
  const start = useRef<number | null>(null);

  const geometry = useMemo(() => {
    const unitBox = new BoxGeometry(0.4, 1, 0.4);
    unitBox.translate(0, 0.5, 0); // grow from the base
    const crescent = new TorusGeometry(2.05, 0.055, 24, 220, Math.PI * 1.52);
    const curve = new CatmullRomCurve3([
      new Vector3(-1.55, -0.35, 0.45),
      new Vector3(-0.4, 0.45, 0.45),
      new Vector3(0.55, 1.15, 0.45),
      new Vector3(1.25, 1.75, 0.45),
    ]);
    const tube = new TubeGeometry(curve, 96, 0.045, 12, false);
    const tip = curve.getPoint(1);
    const tangent = curve.getTangent(1);
    const tipRotation = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), tangent.normalize());
    return { unitBox, crescent, tube, tip, tipRotation };
  }, []);

  useEffect(
    () => () => {
      geometry.unitBox.dispose();
      geometry.crescent.dispose();
      geometry.tube.dispose();
    },
    [geometry],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;

    // Bars rise in sequence, then breathe very slightly.
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const p = MathUtils.clamp((since - 0.25 - i * 0.14) / 1.1, 0, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      bar.scale.y = Math.max(0.001, BARS[i].h * eased * (1 + Math.sin(t * 0.9 + i) * 0.012 * p));
    });

    if (arrow.current) {
      const p = MathUtils.clamp((since - 0.9) / 0.9, 0, 1);
      arrow.current.scale.setScalar(MathUtils.lerp(0.001, 1, 1 - Math.pow(1 - p, 3)));
    }

    if (group.current) {
      const { x, y } = pointer.current;
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, -0.32 + x * 0.32, 3, delta);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, 0.06 - y * 0.16, 3, delta);
      group.current.position.y = Math.sin(t * 0.6) * 0.06;
    }
  });

  return (
    <group ref={group} rotation={[0.06, -0.32, 0]}>
      <mesh geometry={geometry.crescent} rotation={[0, 0, Math.PI * 0.24]}>
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.28} emissive="#5a3d00" emissiveIntensity={0.35} />
      </mesh>
      {BARS.map((b, i) => (
        <mesh
          key={b.x}
          ref={(m) => {
            bars.current[i] = m;
          }}
          geometry={geometry.unitBox}
          position={[b.x, BASE_Y, 0]}
          scale={[1, 0.001, 1]}
        >
          <meshStandardMaterial color={PAPER} metalness={0.15} roughness={0.42} />
        </mesh>
      ))}
      <group ref={arrow} scale={0.001}>
        <mesh geometry={geometry.tube}>
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} emissive="#5a3d00" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={geometry.tip} quaternion={geometry.tipRotation}>
          <coneGeometry args={[0.14, 0.34, 24]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} emissive="#5a3d00" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

type HeroSceneProps = {
  active: boolean;
  pointer: RefObject<Pointer>;
  onReady: () => void;
};

export default function HeroScene({ active, pointer, onReady }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.1, 7.2], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <pointLight position={[-3, -1.5, 2.5]} intensity={22} color={GOLD} />
      <pointLight position={[2.5, 2, -3]} intensity={16} color="#7a78ff" />
      <Mark pointer={pointer} />
    </Canvas>
  );
}
