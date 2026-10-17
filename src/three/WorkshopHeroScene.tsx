import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildProceduralCar, CarRig } from './proceduralCar.js';
import { Eye, Layers, Palette, Camera, Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface HeroSceneProps {
  onExploreServices: () => void;
  onBookSlot: () => void;
}

const FINISHES = [
  { name: 'Cyber Cyan', hex: '#00F0FF', border: 'border-[#00F0FF]' },
  { name: 'Racing Crimson', hex: '#FF1E27', border: 'border-[#FF1E27]' },
  { name: 'Grigio Silver', hex: '#D1D5DB', border: 'border-zinc-300' },
  { name: 'Matte Stealth', hex: '#1C2127', border: 'border-zinc-600' },
  { name: 'Midnight Blue', hex: '#1E3A8A', border: 'border-blue-600' },
];

export const WorkshopHeroScene: React.FC<HeroSceneProps> = ({ onExploreServices, onBookSlot }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false);
  const [explodedVal, setExplodedVal] = useState(0);
  const [activeFinish, setActiveFinish] = useState(FINISHES[0].hex);
  const [activeCameraView, setActiveCameraView] = useState<'perspective' | 'front' | 'side' | 'top'>('perspective');

  // References to keep animation loop stable without restarting Three.js
  const stateRef = useRef({
    exploded: 0,
    targetExploded: 0,
    carRig: null as CarRig | null,
    targetCamPos: new THREE.Vector3(3.8, 2.2, 5.0),
    targetCamLookAt: new THREE.Vector3(0, 0.6, 0),
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    rotationVelocityX: 0,
    rotationVelocityY: 0,
    autoRotate: true,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
        setLoading(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      setLoading(false);
      return;
    }

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0f12);
    scene.fog = new THREE.FogExp2(0x0d0f12, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.8, 2.2, 5.0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isHeadless,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1.0 : Math.min(window.devicePixelRatio, 2.0));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Mandatory PMREM RoomEnvironment Reflection (Three.js skill directive)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnvTexture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    // 1. Key Directional light with shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 9, 5);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // 2. Cyan Rim / Back light
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 3.2);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // 3. Racing Red Accent Fill
    const accentFill = new THREE.PointLight(0xff1e27, 2.0, 15);
    accentFill.position.set(4, 1.2, -4);
    scene.add(accentFill);

    // 4. Cool Hemisphere ambient
    const hemiLight = new THREE.HemisphereLight(0x203040, 0x05080c, 1.2);
    scene.add(hemiLight);

    // Workshop Grid Floor with Coplanar Z-offset
    const gridHelper = new THREE.GridHelper(24, 24, 0x00f0ff, 0x1f2937);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Construct Procedural Vehicle Rig
    const carRig = buildProceduralCar(renderer, activeFinish);
    scene.add(carRig.root);
    stateRef.current.carRig = carRig;

    // Pre-warm shaders
    renderer.compile(scene, camera);
    setLoading(false);

    // Input handlers for 3D rotation & interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      stateRef.current.autoRotate = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      stateRef.current.rotationVelocityY = deltaX * 0.006;
      stateRef.current.rotationVelocityX = deltaY * 0.003;

      carRig.root.rotation.y += stateRef.current.rotationVelocityY;

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Render Loop with Silky Exponential Damping (Three.js directive)
    let animationFrameId: number;
    let lastTime = performance.now();
    const camCurrentLookAt = new THREE.Vector3(0, 0.6, 0);

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
      const elapsed = currentTime - lastTime;
      if (isHeadless && elapsed < 66) {
        return; // throttle to 15fps in headless CPU container
      }

      const delta = Math.min(elapsed / 1000, 0.1);
      lastTime = currentTime;

      const state = stateRef.current;

      // Auto rotation when idle
      if (state.autoRotate) {
        carRig.root.rotation.y += 0.004;
      } else {
        // Momentum damping
        carRig.root.rotation.y += state.rotationVelocityY;
        state.rotationVelocityY *= 0.92;
        state.rotationVelocityX *= 0.92;
      }

      // Smooth exploded-view kinematic damping
      state.exploded = THREE.MathUtils.damp(state.exploded, state.targetExploded, 8, delta);
      carRig.updateExploded(state.exploded);

      // Smooth camera position damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, state.targetCamPos.x, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, state.targetCamPos.y, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, state.targetCamPos.z, 4, delta);

      camCurrentLookAt.x = THREE.MathUtils.damp(camCurrentLookAt.x, state.targetCamLookAt.x, 4, delta);
      camCurrentLookAt.y = THREE.MathUtils.damp(camCurrentLookAt.y, state.targetCamLookAt.y, 4, delta);
      camCurrentLookAt.z = THREE.MathUtils.damp(camCurrentLookAt.z, state.targetCamLookAt.z, 4, delta);
      camera.lookAt(camCurrentLookAt);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      carRig.dispose();
      roomEnvTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update paint finish
  const handleColorChange = (hex: string) => {
    setActiveFinish(hex);
    if (stateRef.current.carRig) {
      stateRef.current.carRig.bodyMaterial.color.set(hex);
    }
  };

  // Update exploded view slider
  const handleExplodedSlider = (val: number) => {
    setExplodedVal(val);
    stateRef.current.targetExploded = val;
  };

  // Switch camera views
  const handleCameraPreset = (view: 'perspective' | 'front' | 'side' | 'top') => {
    setActiveCameraView(view);
    stateRef.current.autoRotate = false;
    if (view === 'perspective') {
      stateRef.current.targetCamPos.set(3.8, 2.2, 5.0);
      stateRef.current.targetCamLookAt.set(0, 0.6, 0);
    } else if (view === 'front') {
      stateRef.current.targetCamPos.set(0, 1.2, 5.8);
      stateRef.current.targetCamLookAt.set(0, 0.5, 0);
    } else if (view === 'side') {
      stateRef.current.targetCamPos.set(6.2, 1.4, 0);
      stateRef.current.targetCamLookAt.set(0, 0.6, 0);
    } else if (view === 'top') {
      stateRef.current.targetCamPos.set(0.1, 7.5, 0.5);
      stateRef.current.targetCamLookAt.set(0, 0, 0);
    }
  };

  const handleReset = () => {
    stateRef.current.autoRotate = true;
    handleCameraPreset('perspective');
    handleExplodedSlider(0);
  };

  return (
    <section className="relative w-full h-[640px] sm:h-[720px] lg:h-[840px] bg-[#0D0F12] overflow-hidden select-none">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF1E27]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Real Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full"
        aria-label="Interactive 3D Supercar Inspection Model"
      />

      {/* Fallback for WebGL failure */}
      {!webGlSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0F12] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-2">
            WebGL Hardware Acceleration Not Detected
          </h3>
          <p className="text-zinc-400 text-sm max-w-md mb-6">
            Rendering high-fidelity static telemetry preview. You can still access full workshop diagnostics, live pricing estimates, and slot reservations.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onBookSlot}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#00A3FF] text-[#090B0E] font-bold text-sm"
            >
              Book Workshop Slot
            </button>
          </div>
        </div>
      )}

      {/* Top Left: Headline & Developer Signature Badge (No occlusion of car center) */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20 pointer-events-none max-w-xl">
        {/* EXACT DEVELOPER SIGNATURE BADGE */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12161D]/90 border border-[#00F0FF]/30 text-[11px] font-mono text-zinc-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-3 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
          <span>Developed & Designed by <strong className="text-[#00F0FF]">Ahad Ali Nisar</strong></span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white uppercase leading-[1.05]">
          ENGINEERED FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#0099FF] glow-cyan">PERFORMANCE.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-md font-sans leading-relaxed">
          Precision diagnostics, expert restoration, and performance-focused automotive care.
        </p>

        {/* Hero CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3.5 pointer-events-auto">
          <button
            onClick={onBookSlot}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#00B4FF] hover:from-[#33F3FF] hover:to-[#0099FF] text-[#090B0E] font-heading font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Book Workshop Slot
          </button>
          <button
            onClick={onExploreServices}
            className="px-6 py-3 rounded-xl bg-[#12161E]/90 hover:bg-[#1A202A] border border-zinc-700 hover:border-[#00F0FF]/50 text-white font-heading font-semibold text-sm tracking-wider uppercase transition-all"
          >
            Explore Services
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && webGlSupported && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0D0F12]/80 z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase">
              Initializing 3D Telemetry Rig...
            </span>
          </div>
        </div>
      )}

      {/* Top Right: Telemetry Specs HUD Pill */}
      <div className="hidden md:flex absolute top-6 right-6 z-20 items-center gap-3 bg-[#10141A]/80 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-1.5 text-[#00F0FF]">
          <Eye className="w-3.5 h-3.5" />
          <span>3D METROLOGY</span>
        </div>
        <span className="text-zinc-600">|</span>
        <span>AEROKIT GT3</span>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-300">PBR RAYTRACED SHADING</span>
      </div>

      {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (Three.js skill directive: Zero Viewport Occlusion) */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 transition-transform duration-300 ${
          isZenMode ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Cinema / Zen Mode Drawer Tab */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#12161D] border border-b-0 border-zinc-800 hover:border-[#00F0FF]/40 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors shadow-lg"
            aria-label={isZenMode ? 'Expand 3D Controls' : 'Hide Controls for Cinema View'}
          >
            {isZenMode ? <ChevronUp className="w-3 h-3 text-[#00F0FF]" /> : <ChevronDown className="w-3 h-3 text-[#00F0FF]" />}
            <span>{isZenMode ? 'Show 3D Controls' : 'Hide Controls (Zen Mode)'}</span>
          </button>
        </div>

        {/* Solid / RGBA Glass Dock (No backdrop-filter over WebGL to avoid GPU stalling) */}
        <div className="bg-[#12161E]/95 border border-zinc-800/90 rounded-2xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 whitespace-nowrap">
                <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>EXPLODED:</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedVal}
                onChange={(e) => handleExplodedSlider(parseFloat(e.target.value))}
                className="w-28 sm:w-36 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                aria-label="Exploded View Separation Slider"
              />
              <span className="text-[11px] font-mono text-zinc-400 w-8">
                {Math.round(explodedVal * 100)}%
              </span>
            </div>

            {/* Finish Color Swatches */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 mr-1">
                <Palette className="w-3.5 h-3.5 text-[#FF1E27]" />
                <span className="hidden sm:inline">FINISH:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {FINISHES.map((f) => (
                  <button
                    key={f.hex}
                    onClick={() => handleColorChange(f.hex)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      activeFinish === f.hex ? `${f.border} scale-110 shadow-[0_0_10px_${f.hex}]` : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: f.hex }}
                    title={f.name}
                    aria-label={`Select ${f.name} Finish`}
                  />
                ))}
              </div>
            </div>

            {/* Camera View Pills & Reset */}
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-zinc-400 mr-1">
                <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
              </div>
              <button
                onClick={() => handleCameraPreset('perspective')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCameraView === 'perspective'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                3/4
              </button>
              <button
                onClick={() => handleCameraPreset('front')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCameraView === 'front'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => handleCameraPreset('side')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCameraView === 'side'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Side
              </button>
              <button
                onClick={() => handleCameraPreset('top')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCameraView === 'top'
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Top
              </button>
              <button
                onClick={handleReset}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-[#00F0FF] transition-colors ml-1"
                title="Reset Camera & Rotation"
                aria-label="Reset Camera Position"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
