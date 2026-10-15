"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import {
  BufferGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  MathUtils,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three";

const GOLD = "#f4b71a";
const PAPER = "#fafaf8";
const BARS = [
  { x: -1.05, h: 0.8 },
  { x: -0.4, h: 1.3 },
  { x: 0.25, h: 1.85 },
  { x: 0.9, h: 2.45 },
];
const BASE_Y = -1.3;
const LAYER = 0.15; // vertical spacing of points in a column
const PITCH = 0.12; // horizontal spacing of points in a column
const ARC = Math.PI * 1.52;

type Pointer = { x: number; y: number };

const easeOut = (t: number) => 1 - Math.pow(1 - MathUtils.clamp(t, 0, 1), 4);

/** Places one instance per position in an InstancedMesh. */
function useInstances(ref: RefObject<InstancedMesh | null>, positions: Vector3[]) {
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [ref, positions]);
}

/** One bar of the mark: a hollow column of points that builds up layer by layer. */
function Column({ x, h, delay, dot, material }: { x: number; h: number; delay: number; dot: SphereGeometry; material: MeshBasicMaterial }) {
  const mesh = useRef<InstancedMesh>(null);
  const start = useRef<number | null>(null);
  const positions = useMemo(() => {
    const out: Vector3[] = [];
    const layers = Math.round(h / LAYER);
    for (let l = 0; l <= layers; l++)
      for (let i = -1; i <= 1; i++)
        for (let k = -1; k <= 1; k++) if (i !== 0 || k !== 0) out.push(new Vector3(x + i * PITCH, BASE_Y + l * LAYER, k * PITCH));
    return out;
  }, [x, h]);
  useInstances(mesh, positions);

  useFrame((state) => {
    if (!mesh.current) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    const p = easeOut((state.clock.elapsedTime - start.current - delay) / 1.2);
    // Reveal whole layers (8 points each) from the bottom up.
    mesh.current.count = Math.ceil((positions.length / 8) * p) * 8;
  });

  return <instancedMesh ref={mesh} args={[dot, material, positions.length]} count={0} frustumCulled={false} />;
}

function Mark({ pointer }: { pointer: RefObject<Pointer> }) {
  const group = useRef<Group>(null);
  const arcMesh = useRef<InstancedMesh>(null);
  const floorMesh = useRef<InstancedMesh>(null);
  const nodeMesh = useRef<InstancedMesh>(null);
  const tip = useRef<Group>(null);
  const start = useRef<number | null>(null);

  const assets = useMemo(() => {
    const dot = new SphereGeometry(0.022, 8, 6);
    const node = new SphereGeometry(0.055, 16, 12);
    const paper = new MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.88, toneMapped: false });
    const faint = new MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.22, toneMapped: false });
    const gold = new MeshBasicMaterial({ color: GOLD, toneMapped: false });

    // Crescent: points along an open arc, opening to the right like the logo's "C".
    const arc: Vector3[] = [];
    const ARC_POINTS = 84;
    for (let i = 0; i <= ARC_POINTS; i++) {
      const a = Math.PI * 0.24 + (i / ARC_POINTS) * ARC;
      arc.push(new Vector3(Math.cos(a) * 2.1, Math.sin(a) * 2.1, -0.15));
    }

    // Floor: a faint grid of points under the bars.
    const floor: Vector3[] = [];
    for (let i = 0; i <= 14; i++) for (let k = 0; k <= 4; k++) floor.push(new Vector3(-1.65 + i * 0.25, BASE_Y - 0.08, -0.5 + k * 0.25));

    // Trend line through the top of each bar, extended at both ends.
    const tops = BARS.map((b) => new Vector3(b.x, BASE_Y + Math.round(b.h / LAYER) * LAYER + 0.12, 0.3));
    const curve = new CatmullRomCurve3([new Vector3(-1.65, -0.85, 0.3), ...tops, new Vector3(1.45, 1.7, 0.3)], false, "catmullrom", 0.2);
    const linePoints = curve.getPoints(160);
    const line = new Line(new BufferGeometry().setFromPoints(linePoints), new LineBasicMaterial({ color: GOLD, toneMapped: false }));
    line.geometry.setDrawRange(0, 0);
    const end = linePoints[linePoints.length - 1];
    const dir = curve.getTangent(1).normalize();
    const tipRotation = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir);
    const cone = new ConeGeometry(0.07, 0.2, 20);

    return { dot, node, paper, faint, gold, arc, floor, tops, line, lineCount: linePoints.length, end, tipRotation, cone };
  }, []);

  useInstances(arcMesh, assets.arc);
  useInstances(floorMesh, assets.floor);
  useInstances(nodeMesh, assets.tops);

  useEffect(
    () => () => {
      assets.dot.dispose();
      assets.node.dispose();
      assets.cone.dispose();
      assets.paper.dispose();
      assets.faint.dispose();
      assets.gold.dispose();
      assets.line.geometry.dispose();
      (assets.line.material as LineBasicMaterial).dispose();
    },
    [assets],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;

    // Arc points appear in sequence around the crescent.
    if (arcMesh.current) arcMesh.current.count = Math.ceil(assets.arc.length * easeOut(since / 1.6));

    // The trend line draws itself once the columns are up, then its nodes and arrow appear.
    const lineP = easeOut((since - 1.1) / 1.1);
    assets.line.geometry.setDrawRange(0, Math.floor(assets.lineCount * lineP));
    if (nodeMesh.current) nodeMesh.current.count = Math.min(assets.tops.length, Math.floor(lineP * (assets.tops.length + 1)));
    if (tip.current) tip.current.scale.setScalar(Math.max(0.001, easeOut((since - 2) / 0.4)));

    if (group.current) {
      const { x, y } = pointer.current;
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, -0.36 + x * 0.34, 3, delta);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, 0.12 - y * 0.16, 3, delta);
      group.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={group} rotation={[0.12, -0.36, 0]}>
      <instancedMesh ref={floorMesh} args={[assets.dot, assets.faint, assets.floor.length]} frustumCulled={false} />
      <instancedMesh ref={arcMesh} args={[assets.dot, assets.gold, assets.arc.length]} count={0} frustumCulled={false} />
      {BARS.map((b, i) => (
        <Column key={b.x} x={b.x} h={b.h} delay={0.2 + i * 0.16} dot={assets.dot} material={assets.paper} />
      ))}
      <primitive object={assets.line} />
      <instancedMesh ref={nodeMesh} args={[assets.node, assets.gold, assets.tops.length]} count={0} frustumCulled={false} />
      <group ref={tip} position={assets.end} quaternion={assets.tipRotation} scale={0.001}>
        <mesh geometry={assets.cone} material={assets.gold} />
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
      dpr={[1, 2]}
      camera={{ position: [0, 0.15, 7], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden
    >
      <Mark pointer={pointer} />
    </Canvas>
  );
}
