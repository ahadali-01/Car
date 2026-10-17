import * as THREE from 'three';

/**
 * Creates procedural carbon fiber texture
 */
export function createCarbonFiberTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#101317';
  ctx.fillRect(0, 0, size, size);

  const step = 8;
  for (let x = 0; x < size; x += step) {
    for (let y = 0; y < size; y += step) {
      const isAlt = (x / step + y / step) % 2 === 0;
      ctx.fillStyle = isAlt ? '#1E232B' : '#0B0D10';
      ctx.fillRect(x, y, step, step);

      // Micro diagonal weave highlights
      ctx.strokeStyle = isAlt ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + step, y + step);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Creates procedural tire tread canvas texture
 */
export function createTireTreadTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const width = 256;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#121417';
  ctx.fillRect(0, 0, width, height);

  // Deep longitudinal grooves
  ctx.fillStyle = '#08090A';
  ctx.fillRect(0, 16, width, 6);
  ctx.fillRect(0, 42, width, 6);

  // Chevron lateral drainage sipes
  ctx.strokeStyle = '#050608';
  ctx.lineWidth = 3;
  for (let x = 0; x < width; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 10, 16);
    ctx.moveTo(x + 10, 48);
    ctx.lineTo(x, 64);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

/**
 * Creates procedural brake rotor slotted metal texture
 */
export function createBrakeDiscTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  // Steel base
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 120);
  grad.addColorStop(0, '#5A6578');
  grad.addColorStop(0.5, '#A0AEC0');
  grad.addColorStop(1, '#718096');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric friction lines
  for (let r = 40; r < 120; r += 4) {
    ctx.strokeStyle = r % 8 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Curved cooling slots
  ctx.strokeStyle = '#1A202C';
  ctx.lineWidth = 3;
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20, 60, angle - 0.2, angle + 0.4);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}
