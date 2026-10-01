import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute, type Points } from "three";
import { color } from "../design/tokens";
import { usePrefersReducedMotion } from "../stage/hooks";

function Stars({ count, drift }: { count: number; drift: boolean }) {
  const ref = useRef<Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (!drift || !ref.current) return;
    ref.current.rotation.z += delta * 0.004;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={color.type}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </points>
  );
}

export function Starfield({ clearFace = false }: { clearFace?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const faceClass = clearFace ? " is-clear-face" : "";

  if (reduced) {
    return <div className={`stage-dots${faceClass}`} aria-hidden />;
  }

  return (
    <div className={`stage-starfield${faceClass}`} aria-hidden>
      <div className="stage-dots" />
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ position: "absolute", inset: 0 }}
        onCreated={({ gl }) => {
          gl.setClearColor(color.field, 0);
        }}
      >
        <Stars count={900} drift />
      </Canvas>
    </div>
  );
}
