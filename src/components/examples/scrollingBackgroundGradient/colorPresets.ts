import * as THREE from 'three'

export interface ColorPalette {
  a: THREE.Vector3
  b: THREE.Vector3
  c: THREE.Vector3
  d: THREE.Vector3
}

export const gradientPresets: Record<string, ColorPalette> = {
  rainbow: {
    a: new THREE.Vector3(0.5, 0.5, 0.5),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.0, 0.33, 0.67),
  },
  sunset: {
    a: new THREE.Vector3(0.5, 0.5, 0.5),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.0, 0.10, 0.20),
  },
  neonDreams: {
    a: new THREE.Vector3(0.5, 0.5, 0.5),
    b: new THREE.Vector3(0.6, 0.6, 0.6),
    c: new THREE.Vector3(2.0, 1.0, 1.0),
    d: new THREE.Vector3(0.2, 0.0, 0.5),
  },
  oceanWaves: {
    a: new THREE.Vector3(0.1, 0.3, 0.5),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.1, 0.4, 0.8),
  },
  cosmicLatte: {
    a: new THREE.Vector3(0.8, 0.7, 0.6),
    b: new THREE.Vector3(0.3, 0.3, 0.3),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.4, 0.3, 0.2),
  },
  vaporwave: {
    a: new THREE.Vector3(0.8, 0.3, 0.7),
    b: new THREE.Vector3(0.4, 0.4, 0.4),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.0, 0.6, 0.8),
  },
  cyberpunk: {
    a: new THREE.Vector3(0.3, 0.8, 0.9),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(2.0, 1.0, 1.0),
    d: new THREE.Vector3(0.9, 0.1, 0.4),
  },
  northern: {
    a: new THREE.Vector3(0.1, 0.5, 0.3),
    b: new THREE.Vector3(0.4, 0.4, 0.4),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.0, 0.3, 0.2),
  },
  lavenderDream: {
    a: new THREE.Vector3(0.6, 0.4, 0.8),
    b: new THREE.Vector3(0.3, 0.3, 0.3),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.4, 0.0, 0.6),
  },
  goldHour: {
    a: new THREE.Vector3(0.8, 0.6, 0.2),
    b: new THREE.Vector3(0.4, 0.4, 0.4),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.6, 0.3, 0.0),
  },
  mintChocolate: {
    a: new THREE.Vector3(0.2, 0.8, 0.5),
    b: new THREE.Vector3(0.3, 0.3, 0.3),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.3, 0.2, 0.1),
  },
  galaxyPurple: {
    a: new THREE.Vector3(0.4, 0.0, 0.8),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(2.0, 1.0, 1.0),
    d: new THREE.Vector3(0.2, 0.0, 0.4),
  },
  electricBlue: {
    a: new THREE.Vector3(0.0, 0.5, 1.0),
    b: new THREE.Vector3(0.5, 0.5, 0.5),
    c: new THREE.Vector3(2.0, 1.0, 1.0),
    d: new THREE.Vector3(0.0, 0.2, 0.8),
  },
  desertSands: {
    a: new THREE.Vector3(0.9, 0.7, 0.4),
    b: new THREE.Vector3(0.3, 0.3, 0.3),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.6, 0.4, 0.2),
  },
  cherryBlossom: {
    a: new THREE.Vector3(1.0, 0.7, 0.8),
    b: new THREE.Vector3(0.3, 0.3, 0.3),
    c: new THREE.Vector3(1.0, 1.0, 1.0),
    d: new THREE.Vector3(0.8, 0.3, 0.5),
  },
}
