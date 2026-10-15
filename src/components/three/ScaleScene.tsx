"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { CylinderGeometry, type Group, LatheGeometry, MathUtils, MeshStandardMaterial, Quaternion, SphereGeometry, Vector2, Vector3 } from "three";

type Pointer = { x: number; y: number };

const PIVOT_Y = 1.05;
const ARM = 1.45; // half the beam length
const CHAIN = 1.15; // pan hangs this far below the beam end
/** Rest angle: the right pan (signed clients) sits slightly lower. Negative z tips the right side down. */
const REST = -0.085;

/** A thin rod between two points (used for the pan chains). */
function Rod({ from, to, radius, material }: { from: Vector3; to: Vector3; radius: number; material: MeshStandardMaterial }) {
  const { position, quaternion, length } = useMemo(() => {
    const dir = new Vector3().subVectors(to, from);
    return {
      length: dir.length(),
      position: new Vector3().addVectors(from, to).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()),
    };
  }, [from, to]);
  const geometry = useMemo(() => new CylinderGeometry(radius, radius, length, 8), [radius, length]);
  return <mesh geometry={geometry} material={material} position={position} quaternion={quaternion} />;
}

/** One hanging pan: three chains from the hook down to a shallow dish. Kept level by counter-rotating its parent. */
function Pan({ dish, gold, chain, children }: { dish: LatheGeometry; gold: MeshStandardMaterial; chain: MeshStandardMaterial; children?: ReactNode }) {
  const hook = useMemo(() => new Vector3(0, 0, 0), []);
  const rim = useMemo(
    () => [0, 1, 2].map((i) => new Vector3(Math.cos((i / 3) * Math.PI * 2 + 0.5) * 0.5, -CHAIN, Math.sin((i / 3) * Math.PI * 2 + 0.5) * 0.5)),
    [],
  );
  return (
    <group>
      {rim.map((p, i) => (
        <Rod key={i} from={hook} to={p} radius={0.008} material={chain} />
      ))}
      <mesh geometry={dish} material={gold} position={[0, -CHAIN - 0.02, 0]} />
      {children}
    </group>
  );
}

function Scale({ pointer }: { pointer: RefObject<Pointer> }) {
  const root = useRef<Group>(null);
  const beam = useRef<Group>(null);
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const motion = useRef({ angle: 0.16, velocity: 0, start: -1 });

  const assets = useMemo(() => {
    const gold = new MeshStandardMaterial({ color: "#d6ad3b", metalness: 0.65, roughness: 0.28 });
    const goldBright = new MeshStandardMaterial({ color: "#e7c45f", metalness: 0.55, roughness: 0.22, emissive: "#6b4f0a", emissiveIntensity: 0.15 });
    const navy = new MeshStandardMaterial({ color: "#0f1f3d", metalness: 0.35, roughness: 0.45 });
    const chain = new MeshStandardMaterial({ color: "#b8922c", metalness: 0.7, roughness: 0.35 });
    // Shallow dish profile, revolved.
    const dish = new LatheGeometry([new Vector2(0, -0.13), new Vector2(0.3, -0.12), new Vector2(0.5, -0.04), new Vector2(0.56, 0.02), new Vector2(0.54, 0.03)], 48);
    const coin = new CylinderGeometry(0.13, 0.13, 0.035, 32);
    const knob = new SphereGeometry(0.06, 20, 16);
    return { gold, goldBright, navy, chain, dish, coin, knob };
  }, []);

  useFrame((state, delta) => {
    const m = motion.current;
    const t = state.clock.elapsedTime;
    if (m.start < 0) m.start = t;
    const { x, y } = pointer.current;

    // Spring toward the rest angle, nudged by the pointer and a slow idle sway.
    const target = REST - x * 0.12 + Math.sin(t * 0.7) * 0.015;
    const dt = Math.min(delta, 1 / 30);
    m.velocity += (target - m.angle) * 18 * dt;
    m.velocity *= Math.pow(0.12, dt);
    m.angle += m.velocity * dt;

    if (beam.current) beam.current.rotation.z = m.angle;
    if (left.current) left.current.rotation.z = -m.angle;
    if (right.current) right.current.rotation.z = -m.angle;
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, -0.25 + x * 0.35, 2.5, delta);
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, 0.06 - y * 0.08, 2.5, delta);
      root.current.position.y = Math.sin(t * 0.6) * 0.04 - 0.1;
    }
  });

  return (
    <group ref={root} rotation={[0.06, -0.25, 0]}>
      {/* Base and column */}
      <mesh material={assets.navy} position={[0, -1.72, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.16, 64]} />
      </mesh>
      <mesh material={assets.gold} position={[0, -1.58, 0]}>
        <cylinderGeometry args={[0.6, 0.72, 0.12, 64]} />
      </mesh>
      <mesh material={assets.gold} position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 2.6, 24]} />
      </mesh>
      <mesh material={assets.goldBright} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.15, 32, 24]} />
      </mesh>

      {/* Beam and pans */}
      <group ref={beam} position={[0, PIVOT_Y, 0]}>
        <mesh material={assets.gold} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, ARM * 2, 16]} />
        </mesh>
        <mesh geometry={assets.knob} material={assets.goldBright} />
        <mesh geometry={assets.knob} material={assets.goldBright} position={[-ARM, 0, 0]} />
        <mesh geometry={assets.knob} material={assets.goldBright} position={[ARM, 0, 0]} />
        <group ref={left} position={[-ARM, 0, 0]}>
          <Pan dish={assets.dish} gold={assets.gold} chain={assets.chain} />
        </group>
        <group ref={right} position={[ARM, 0, 0]}>
          <Pan dish={assets.dish} gold={assets.gold} chain={assets.chain}>
            {/* A small stack of gold "client" coins: the side the balance tips toward. */}
            {[0, 1, 2].map((i) => (
              <mesh key={i} geometry={assets.coin} material={assets.goldBright} position={[(i - 1) * 0.02, -CHAIN + 0.03 + i * 0.04, (i % 2) * 0.02]} />
            ))}
          </Pan>
        </group>
      </group>
    </group>
  );
}

type ScaleSceneProps = {
  active: boolean;
  pointer: RefObject<Pointer>;
  onReady: () => void;
};

/** Gold scales of justice that tip toward the "signed clients" pan and follow the pointer. */
export default function ScaleScene({ active, pointer, onReady }: ScaleSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.8], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#e3e8f5", 0.9]} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#ffffff" />
      <pointLight position={[0, -1, 3]} intensity={6} distance={8} color="#fbf1d6" />
      <Scale pointer={pointer} />
    </Canvas>
  );
}
