// src/components/ShipVisualization3D.jsx
// 3D maritime visualization using React Three Fiber
// Shows oil tanker vessel with AIS route and oil spill simulation

import { useRef, useState, useEffect, Suspense, Component, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ────────────────────────────────────────────
// Error boundary — catches WebGL / R3F failures
// ────────────────────────────────────────────
class ErrorBoundaryCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexDirection: 'column', gap: 8,
          color: '#64748b', fontSize: '0.82rem',
        }}>
          <div>3D visualization requires WebGL support</div>
          <div style={{ fontSize: '0.72rem' }}>Enable hardware acceleration in your browser settings</div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ────────────────────────────────────────────
// Ocean surface with animated vertices
// ────────────────────────────────────────────
function Ocean() {
  const meshRef = useRef();
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta * 0.3;
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(
        i,
        Math.sin(x * 0.5 + time.current) * 0.07 +
        Math.cos(z * 0.4 + time.current * 1.3) * 0.05
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[40, 40, 36, 36]} />
      <meshStandardMaterial color="#0a2a50" metalness={0.15} roughness={0.7} transparent opacity={0.95} />
    </mesh>
  );
}

// ────────────────────────────────────────────
// AIS route as a tube (robust alternative to Line)
// ────────────────────────────────────────────
function AISRouteTube() {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-10, 0.02, 1.5),
    new THREE.Vector3(-6, 0.02, 1),
    new THREE.Vector3(-2, 0.02, 0.5),
    new THREE.Vector3(2, 0.02, -0.5),
    new THREE.Vector3(6, 0.02, -1),
    new THREE.Vector3(10, 0.02, 0),
  ]), []);
  return (
    <mesh>
      <tubeGeometry args={[curve, 50, 0.04, 6, false]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.7} />
    </mesh>
  );
}

// ────────────────────────────────────────────
// Oil spill polygon (red ellipse behind ship)
// ────────────────────────────────────────────
function OilSpill({ shipX }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta * 0.6;
    if (outerRef.current) {
      outerRef.current.material.opacity = 0.45 + Math.sin(time.current) * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.material.opacity = 0.55 + Math.cos(time.current * 0.8) * 0.06;
    }
  });

  return (
    <group position={[shipX + 3.2, 0.01, 0]}>
      {/* Core spill — use circleGeometry scaled to look like ellipse */}
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.38, 1]}>
        <circleGeometry args={[3.2, 32]} />
        <meshStandardMaterial color="#7f0000" transparent opacity={0.55} />
      </mesh>
      {/* Outer fringe */}
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} scale={[1, 0.38, 1]}>
        <ringGeometry args={[3.0, 3.9, 32]} />
        <meshStandardMaterial color="#ef4444" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

// ────────────────────────────────────────────
// Ship model built from primitive geometries
// ────────────────────────────────────────────
function Ship({ position }) {
  return (
    <group position={position}>
      {/* Main hull */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.4, 0.28, 0.55]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Hull keel (darker underside) */}
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[2.3, 0.06, 0.56]} />
        <meshStandardMaterial color="#7f1d1d" />
      </mesh>
      {/* Bow taper */}
      <mesh position={[1.2, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.27, 0.5, 4]} />
        <meshStandardMaterial color="#162a48" metalness={0.5} />
      </mesh>
      {/* Superstructure */}
      <mesh position={[-0.5, 0.36, 0]}>
        <boxGeometry args={[0.75, 0.4, 0.45]} />
        <meshStandardMaterial color="#1a3055" metalness={0.4} roughness={0.7} />
      </mesh>
      {/* Bridge wings */}
      <mesh position={[-0.5, 0.62, 0]}>
        <boxGeometry args={[0.45, 0.22, 0.42]} />
        <meshStandardMaterial color="#1e4070" />
      </mesh>
      {/* Mast */}
      <mesh position={[-0.5, 0.88, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.55, 6]} />
        <meshStandardMaterial color="#2a4a70" />
      </mesh>
      {/* Cargo tanks */}
      {[-0.05, 0.35, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.19, 10]} />
          <meshStandardMaterial color="#172438" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}
      {/* Deck pipe line */}
      <mesh position={[0.3, 0.25, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#0f1f35" />
      </mesh>
    </group>
  );
}

// ────────────────────────────────────────────
// Grid lines on ocean (lat/lon grid feel)
// ────────────────────────────────────────────
function OceanGrid() {
  const geo = useMemo(() => {
    const positions = [];
    for (let i = -20; i <= 20; i += 5) {
      positions.push(-20, 0.01, i,  20, 0.01, i);
      positions.push(i, 0.01, -20,  i, 0.01, 20);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#0d3358" transparent opacity={0.3} />
    </lineSegments>
  );
}

// ────────────────────────────────────────────
// WebGL detection helper
// ────────────────────────────────────────────
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────
// 2D fallback when WebGL is not available
// ────────────────────────────────────────────
function Fallback2D({ progress }) {
  const lat = (19.05 + progress * 0.38).toFixed(4);
  const lng = (69.28 - progress * 1.36).toFixed(4);
  const pct = progress * 100;
  const shipLeft = `${8 + pct * 0.76}%`;

  return (
    <div style={{
      flex: 1, height: 380, borderRadius: 12, overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(180deg, #010a16 0%, #041320 55%, #061e38 100%)',
    }}>
      {/* Grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <line x1={`${i * 11}%`} y1="0" x2={`${i * 11}%`} y2="100%" stroke="#0ea5e9" strokeWidth="0.5" />
            <line x1="0" y1={`${i * 13}%`} x2="100%" y2={`${i * 13}%`} stroke="#0ea5e9" strokeWidth="0.5" />
          </g>
        ))}
      </svg>
      {/* Oil Spill */}
      <div style={{
        position: 'absolute', bottom: '32%',
        left: `calc(${shipLeft} + 32px)`,
        width: 120, height: 50, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(127,0,0,0.7) 0%, rgba(239,68,68,0.2) 70%, transparent 100%)',
        border: '1px solid rgba(239,68,68,0.35)',
        transition: 'left 0.08s linear',
      }} />
      {/* AIS route dotted line */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <line x1="5%" y1="38%" x2="95%" y2="38%" stroke="#0ea5e9" strokeWidth="1.5"
          strokeDasharray="8,6" opacity="0.6" />
      </svg>
      {/* Ship icon */}
      <div style={{
        position: 'absolute', bottom: 'calc(32% + 2px)', left: shipLeft,
        fontSize: '28px', transition: 'left 0.08s linear',
        filter: 'drop-shadow(0 0 6px rgba(14,165,233,0.5))',
        transform: 'scaleX(-1)',
      }}>🚢</div>
      {/* Labels */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 14, fontSize: '0.68rem' }}>
        <span style={{ color: '#0ea5e9' }}>─── AIS Track</span>
        <span style={{ color: '#ef4444' }}>■ Oil Slick</span>
        <span style={{ color: '#f59e0b' }}>🚢 Vessel</span>
      </div>
      <div style={{ position: 'absolute', top: 8, left: 12, fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
        [DEMO SIMULATION — 2D FALLBACK — WebGL not available]
      </div>
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>MT ARABIAN STAR</div>
        <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>{lat}°N, {lng}°E</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Main 3D scene
// ────────────────────────────────────────────
function Scene({ progress }) {
  const shipX = THREE.MathUtils.lerp(8, -8, progress);
  return (
    <>
      <ambientLight intensity={0.25} color="#b0c8ff" />
      <directionalLight position={[6, 12, 4]} intensity={0.9} />
      <pointLight position={[0, 4, -8]} intensity={0.3} color="#0369a1" />

      <OceanGrid />
      <Ocean />
      <AISRouteTube />
      <Ship position={[shipX, 0, 0]} />
      <OilSpill shipX={shipX} />
    </>
  );
}

// ────────────────────────────────────────────
// Exported component with info panel
// ────────────────────────────────────────────
export default function ShipVisualization3D() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(true);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const DURATION = 24000; // 24 s loop
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      setProgress(((ts - startRef.current) % DURATION) / DURATION);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running]);

  // Derived AIS-style readouts
  const lat = (19.05 + progress * 0.38).toFixed(4);
  const lng = (69.28 - progress * 1.36).toFixed(4);
  const speed = Math.max(10.8, 12.4 - progress * 1.6).toFixed(1);

  const [webgl] = useState(() => isWebGLAvailable());

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* 3D Canvas OR 2D Fallback */}
      {!webgl ? (
        <Fallback2D progress={progress} />
      ) : (
      <div style={{
        flex: 1, height: 380, borderRadius: 12, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(180deg, #010a16 0%, #041320 60%, #010a16 100%)',
        boxShadow: '0 0 24px rgba(14,165,233,0.08)',
      }}>
        {/* Demo watermark */}
        <div style={{
          position: 'absolute', top: 8, left: 12, fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.18)', fontFamily: 'monospace', zIndex: 10,
          pointerEvents: 'none',
        }}>
          [DEMO SIMULATION — NOT A REAL VESSEL OR REAL-TIME FEED]
        </div>
        {/* Play/Pause */}
        <div style={{ position: 'absolute', top: 8, right: 12, zIndex: 10 }}>
          <button
            onClick={() => { setRunning(r => !r); if (!running) startRef.current = null; }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.7rem', padding: '3px 10px' }}
          >
            {running ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
        {/* R3F Canvas */}
        <ErrorBoundaryCanvas>
          <Canvas
            camera={{ position: [0, 5.5, 11], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
          >
            <Suspense fallback={null}>
              <Scene progress={progress} />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minPolarAngle={0.15}
                maxPolarAngle={Math.PI / 2.1}
                minDistance={5}
                maxDistance={22}
              />
            </Suspense>
          </Canvas>
        </ErrorBoundaryCanvas>
        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          display: 'flex', gap: 14, fontSize: '0.68rem', zIndex: 10,
          pointerEvents: 'none',
        }}>
          <span style={{ color: '#0ea5e9' }}>● AIS Route</span>
          <span style={{ color: '#ef4444' }}>● Oil Slick</span>
          <span style={{ color: '#1e3a5f' }}>● Vessel</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>Drag to rotate · Scroll to zoom</span>
        </div>
      </div>
      )}

      {/* Info sidebar */}
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        {/* Vessel card */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Vessel — DEMO
          </div>
          {[
            ['Name', 'MT ARABIAN STAR'],
            ['Type', 'Oil Tanker'],
            ['Flag', 'Panama'],
            ['AIS Status', 'Active'],
            ['Speed', `${speed} kts`],
            ['Course', '247°'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 5, marginBottom: 5 }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{label}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Position card */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Simulated Position
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e8f1ff', marginBottom: 2 }}>{lat}°N</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e8f1ff', marginBottom: 10 }}>{lng}°E</div>
          {/* Progress bar */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(to right, #0369a1, #0ea5e9)', borderRadius: 2, transition: 'width 0.1s linear' }} />
          </div>
          <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: 4 }}>AIS track progress</div>
        </div>

        {/* Spill detected card */}
        <div className="card" style={{ padding: 14, borderLeft: '3px solid var(--red-500)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Spill Detected
          </div>
          <div style={{ fontSize: '1rem', color: '#f87171', fontWeight: 800, marginBottom: 4 }}>YES</div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.5 }}>
            Red region = simulated detected oil slick trailing the vessel route.
          </div>
          <div style={{ fontSize: '0.62rem', color: '#334155', marginTop: 6, fontStyle: 'italic' }}>
            Prototype demo only
          </div>
        </div>

        {/* Attribution */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Attribution Score
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: 4 }}>87%</div>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>XGBoost + SHAP</div>
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-red" style={{ fontSize: '0.6rem' }}>Potential Responsible Vessel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
