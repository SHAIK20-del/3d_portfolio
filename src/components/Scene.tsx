import { useEffect, useRef, useState, Component } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Group, MathUtils } from "three";

function Sculpture({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      pointer.x * 0.35 + clock.elapsedTime * 0.075,
      3,
      delta,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      pointer.y * 0.15,
      3,
      delta,
    );
  });
  return (
    <group ref={group} rotation={[0, 0, -0.2]}>
      <Float
        speed={reduced ? 0 : 1.3}
        rotationIntensity={reduced ? 0 : 0.18}
        floatIntensity={reduced ? 0 : 0.5}
      >
        <mesh rotation={[0.3, 0.2, -0.3]}>
          <torusKnotGeometry args={[1.35, 0.44, 220, 40, 2, 3]} />
          <MeshDistortMaterial
            color="#a18ad5"
            metalness={0.88}
            roughness={0.22}
            distort={0.18}
            speed={reduced ? 0 : 1.3}
          />
        </mesh>
        <mesh rotation={[0.2, -0.3, 0.3]} scale={1.32}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial
            color="#a498cb"
            wireframe
            transparent
            opacity={0.11}
          />
        </mesh>
      </Float>
      <mesh rotation={[1.15, 0.25, -0.1]}>
        <torusGeometry args={[2.5, 0.014, 8, 180]} />
        <meshBasicMaterial color="#b2a0e3" transparent opacity={0.6} />
      </mesh>
      <mesh position={[2.43, -0.1, 0.4]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#e1d7ff" />
      </mesh>
      <Sparkles
        count={35}
        scale={8}
        size={1.3}
        speed={reduced ? 0 : 0.15}
        color="#bca9ed"
      />
    </group>
  );
}
function Fallback() {
  return (
    <div className="orb-fallback" aria-hidden="true">
      <div />
      <i />
    </div>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? <Fallback /> : this.props.children;
  }
}
export default function Scene() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { rootMargin: "100px" },
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const [lost, setLost] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  return (
    <div
      ref={container}
      className="scene"
      role="img"
      aria-label="An animated violet metallic knot, surrounded by an orbit and a geometric wireframe"
    >
      <SceneBoundary>
        {lost ? (
          <Fallback />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 7.8], fov: 43 }}
            dpr={[1, 1.5]}
            frameloop={!visible ? "never" : reduced ? "demand" : "always"}
            fallback={<Fallback />}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener(
                "webglcontextlost",
                (event) => {
                  event.preventDefault();
                  setLost(true);
                },
                { once: true },
              );
            }}
          >
            <ambientLight intensity={0.9} />
            <spotLight
              position={[3, 5, 5]}
              intensity={120}
              color="#f0e7ff"
              angle={0.6}
              penumbra={1}
            />
            <pointLight position={[-4, -1, 2]} intensity={50} color="#8060ff" />
            <pointLight position={[2, -3, -2]} intensity={60} color="#73e5df" />
            <directionalLight
              position={[0, 2, 4]}
              intensity={3}
              color="#d7c3ff"
            />
            <Sculpture reduced={reduced} />
          </Canvas>
        )}
      </SceneBoundary>
    </div>
  );
}
