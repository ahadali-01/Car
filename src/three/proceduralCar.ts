import * as THREE from 'three';
import { createCarbonFiberTexture, createTireTreadTexture, createBrakeDiscTexture } from './proceduralTextures.js';

export interface CarRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  cockpitGroup: THREE.Group;
  engineGroup: THREE.Group;
  wheelsGroup: THREE.Group;
  wheelMeshes: THREE.Group[];
  bodyMaterial: THREE.MeshPhysicalMaterial;
  glowLights: THREE.MeshBasicMaterial[];
  updateExploded: (progress: number) => void;
  dispose: () => void;
}

export function buildProceduralCar(renderer: THREE.WebGLRenderer, initialColor: string = '#00F0FF'): CarRig {
  const root = new THREE.Group();
  root.name = 'AutoCraft3D_VehicleRig';

  const carbonTexture = createCarbonFiberTexture(renderer);
  const tireTexture = createTireTreadTexture(renderer);
  const brakeDiscTexture = createBrakeDiscTexture(renderer);

  // Reusable Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialColor),
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    map: carbonTexture,
    roughness: 0.4,
    metalness: 0.2,
  });

  const darkGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x10151c),
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.6,
    ior: 1.52,
    transparent: true,
    opacity: 0.92,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xe0e6ed),
    metalness: 0.95,
    roughness: 0.08,
  });

  const titaniumBurnMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x3a5a8a), // heat blued titanium
    metalness: 0.9,
    roughness: 0.2,
  });

  const redCaliperMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xff1e27),
    roughness: 0.3,
    metalness: 0.4,
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a1c20),
    bumpMap: tireTexture,
    bumpScale: 0.08,
    roughness: 0.85,
    metalness: 0.05,
  });

  const cyanLedMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x00f0ff),
  });

  const redLedMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xff1e27),
  });

  const glowLights: THREE.MeshBasicMaterial[] = [cyanLedMaterial, redLedMaterial];

  // 1. Aerodynamic Main Body Group
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'BodyGroup';

  // Main central hull
  const hullGeom = new THREE.BoxGeometry(2.1, 0.45, 4.4, 2, 2, 4);
  const hull = new THREE.Mesh(hullGeom, bodyMaterial);
  hull.position.y = 0.55;
  hull.castShadow = true;
  hull.receiveShadow = true;
  bodyGroup.add(hull);

  // Aerodynamic Sloped Hood
  const hoodGeom = new THREE.BufferGeometry();
  // Procedural wedge for front hood
  const hoodShape = new THREE.Shape();
  hoodShape.moveTo(-1.0, 0);
  hoodShape.lineTo(1.0, 0);
  hoodShape.lineTo(0.85, 1.8);
  hoodShape.lineTo(-0.85, 1.8);
  hoodShape.closePath();
  const hoodExtrudeSettings = { depth: 0.25, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.05 };
  const hoodGeometry = new THREE.ExtrudeGeometry(hoodShape, hoodExtrudeSettings);
  const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
  hood.rotation.x = Math.PI / 2 + 0.08;
  hood.position.set(0, 0.72, 0.5);
  hood.castShadow = true;
  bodyGroup.add(hood);

  // Front Carbon Aero Splitter
  const splitterGeom = new THREE.BoxGeometry(2.25, 0.06, 0.7);
  const splitter = new THREE.Mesh(splitterGeom, carbonMaterial);
  splitter.position.set(0, 0.24, 2.2);
  splitter.castShadow = true;
  bodyGroup.add(splitter);

  // Dual Cyan Headlight strips
  const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.15), cyanLedMaterial);
  headlightL.position.set(-0.75, 0.65, 2.15);
  const headlightR = headlightL.clone();
  headlightR.position.x = 0.75;
  bodyGroup.add(headlightL, headlightR);

  // Rear Carbon Diffuser
  const diffuserGeom = new THREE.BoxGeometry(2.15, 0.25, 0.6);
  const diffuser = new THREE.Mesh(diffuserGeom, carbonMaterial);
  diffuser.position.set(0, 0.35, -2.2);
  diffuser.castShadow = true;
  bodyGroup.add(diffuser);

  // Rear Continuous LED Taillight Blade
  const tailBlade = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.08), redLedMaterial);
  tailBlade.position.set(0, 0.78, -2.22);
  bodyGroup.add(tailBlade);

  // Rear GT Wing (Airfoil & Uprights)
  const wingDeckGeom = new THREE.BoxGeometry(2.3, 0.05, 0.45);
  const wingDeck = new THREE.Mesh(wingDeckGeom, carbonMaterial);
  wingDeck.position.set(0, 1.25, -1.95);
  wingDeck.castShadow = true;

  // Wing Endplates in racing red
  const endplateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.52), redCaliperMaterial);
  endplateL.position.set(-1.15, 1.25, -1.95);
  const endplateR = endplateL.clone();
  endplateR.position.x = 1.15;

  // Wing Uprights (Aluminum CNC)
  const pylonL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), chromeMaterial);
  pylonL.position.set(-0.55, 1.0, -1.95);
  const pylonR = pylonL.clone();
  pylonR.position.x = 0.55;

  bodyGroup.add(wingDeck, endplateL, endplateR, pylonL, pylonR);

  // Twin Titanium Exhaust Pipes
  const pipeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16, 1, true);
  const pipeL = new THREE.Mesh(pipeGeom, titaniumBurnMaterial);
  pipeL.rotation.x = Math.PI / 2;
  pipeL.position.set(-0.35, 0.48, -2.26);
  const pipeR = pipeL.clone();
  pipeR.position.x = 0.35;
  bodyGroup.add(pipeL, pipeR);

  // 2. Cockpit Canopy Group
  const cockpitGroup = new THREE.Group();
  cockpitGroup.name = 'CockpitGroup';

  const canopyShape = new THREE.Shape();
  canopyShape.moveTo(-0.85, 0);
  canopyShape.lineTo(0.85, 0);
  canopyShape.lineTo(0.65, 1.5);
  canopyShape.lineTo(-0.65, 1.5);
  canopyShape.closePath();
  const canopySettings = { depth: 0.55, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
  const canopyGeom = new THREE.ExtrudeGeometry(canopyShape, canopySettings);
  const canopy = new THREE.Mesh(canopyGeom, darkGlassMaterial);
  canopy.rotation.x = Math.PI / 2 + 0.25;
  canopy.position.set(0, 1.25, -0.6);
  cockpitGroup.add(canopy);

  // Roof Scoop (Carbon Intake)
  const scoopGeom = new THREE.BoxGeometry(0.4, 0.15, 0.5);
  const scoop = new THREE.Mesh(scoopGeom, carbonMaterial);
  scoop.position.set(0, 1.28, -0.4);
  cockpitGroup.add(scoop);

  // 3. Engine Bay / Powertrain Group (Mid-Engine V8 / Twin Turbo)
  const engineGroup = new THREE.Group();
  engineGroup.name = 'EngineGroup';

  // Billet Aluminum Engine Block
  const blockGeom = new THREE.BoxGeometry(1.0, 0.55, 0.9);
  const block = new THREE.Mesh(blockGeom, chromeMaterial);
  block.position.set(0, 0.65, -0.9);
  block.castShadow = true;
  engineGroup.add(block);

  // Red Cam Covers
  const camL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.85), redCaliperMaterial);
  camL.position.set(-0.38, 0.95, -0.9);
  const camR = camL.clone();
  camR.position.x = 0.38;
  engineGroup.add(camL, camR);

  // Carbon Intake Plenum
  const plenum = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16), carbonMaterial);
  plenum.rotation.x = Math.PI / 2;
  plenum.position.set(0, 1.05, -0.9);
  engineGroup.add(plenum);

  // Twin Turbos
  const turboGeom = new THREE.TorusGeometry(0.16, 0.06, 12, 24);
  const turboL = new THREE.Mesh(turboGeom, titaniumBurnMaterial);
  turboL.rotation.y = Math.PI / 2;
  turboL.position.set(-0.62, 0.65, -1.35);
  const turboR = turboL.clone();
  turboR.position.x = 0.62;
  engineGroup.add(turboL, turboR);

  // 4. Performance Wheel Assemblies
  const wheelsGroup = new THREE.Group();
  wheelsGroup.name = 'WheelsGroup';
  const wheelMeshes: THREE.Group[] = [];

  const wheelPositions = [
    { x: -1.15, y: 0.38, z: 1.35, isLeft: true },  // Front Left
    { x: 1.15, y: 0.38, z: 1.35, isLeft: false },  // Front Right
    { x: -1.18, y: 0.40, z: -1.35, isLeft: true }, // Rear Left
    { x: 1.18, y: 0.40, z: -1.35, isLeft: false }, // Rear Right
  ];

  wheelPositions.forEach((pos, idx) => {
    const wheelAssembly = new THREE.Group();
    wheelAssembly.name = `WheelAssembly_${idx}`;
    wheelAssembly.position.set(pos.x, pos.y, pos.z);

    // Tire
    const tireGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 32);
    const tire = new THREE.Mesh(tireGeom, tireMaterial);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelAssembly.add(tire);

    // Slotted Steel Brake Rotor Disc
    const discGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32);
    const discMat = new THREE.MeshStandardMaterial({
      map: brakeDiscTexture,
      metalness: 0.9,
      roughness: 0.2,
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.rotation.z = Math.PI / 2;
    wheelAssembly.add(disc);

    // Brembo Red Brake Caliper
    const caliperGeom = new THREE.BoxGeometry(0.1, 0.16, 0.18);
    const caliper = new THREE.Mesh(caliperGeom, redCaliperMaterial);
    caliper.position.set(pos.isLeft ? 0.04 : -0.04, 0.15, 0.15);
    wheelAssembly.add(caliper);

    // Lightweight 5-Spoke Forged Alloy Rim
    const rimCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.33, 16), chromeMaterial);
    rimCenter.rotation.z = Math.PI / 2;
    wheelAssembly.add(rimCenter);

    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const spokeGeom = new THREE.BoxGeometry(0.04, 0.26, 0.05);
      const spoke = new THREE.Mesh(spokeGeom, chromeMaterial);
      spoke.position.set(pos.isLeft ? -0.1 : 0.1, Math.cos(angle) * 0.18, Math.sin(angle) * 0.18);
      spoke.rotation.x = -angle;
      wheelAssembly.add(spoke);
    }

    wheelsGroup.add(wheelAssembly);
    wheelMeshes.push(wheelAssembly);
  });

  // Contact Shadow Plane Grounding (Three.js skill directive)
  const shadowPlaneGeom = new THREE.PlaneGeometry(3.6, 5.5);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d')!;
  const sGrad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
  sGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
  sGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
  sGrad.addColorStop(1, 'rgba(0,0,0,0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 128, 128);
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.02; // Offset by >0.02 to avoid coplanar Z-fight
  root.add(shadowPlane);

  root.add(bodyGroup);
  root.add(cockpitGroup);
  root.add(engineGroup);
  root.add(wheelsGroup);

  // Initial base positions for exploded interpolation
  const originalBodyY = bodyGroup.position.y;
  const originalCockpitY = cockpitGroup.position.y;
  const originalEngineY = engineGroup.position.y;

  const originalWheelPositions = wheelPositions.map(p => ({ x: p.x, y: p.y, z: p.z }));

  const updateExploded = (progress: number) => {
    // Progress is 0.0 (assembled) to 1.0 (fully exploded)
    bodyGroup.position.y = originalBodyY + progress * 0.95;
    cockpitGroup.position.y = originalCockpitY + progress * 1.5;
    cockpitGroup.position.z = progress * 0.3;
    engineGroup.position.y = originalEngineY + progress * 0.7;
    engineGroup.position.z = -progress * 0.6;

    wheelMeshes.forEach((wheel, idx) => {
      const orig = originalWheelPositions[idx];
      const xPush = orig.x > 0 ? progress * 0.75 : -progress * 0.75;
      wheel.position.x = orig.x + xPush;
    });
  };

  const dispose = () => {
    carbonTexture.dispose();
    tireTexture.dispose();
    brakeDiscTexture.dispose();
    shadowTex.dispose();
    root.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  };

  return {
    root,
    bodyGroup,
    cockpitGroup,
    engineGroup,
    wheelsGroup,
    wheelMeshes,
    bodyMaterial,
    glowLights,
    updateExploded,
    dispose,
  };
}
