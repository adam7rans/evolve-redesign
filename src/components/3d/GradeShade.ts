import * as THREE from 'three';
import { ExtendedMaterial } from 'three-extended-material';

// Add this code to test the import
console.log('ExtendedMaterial imported:', ExtendedMaterial !== undefined);

const gradeShadeExtension = {
  name: 'gradeShade',
  uniforms: {
    colorA: { value: new THREE.Color(0x000000) },
    colorB: { value: new THREE.Color(0xffffff) },
    gradientExponent: { value: 1.0 },
    noiseScale: { value: 10.0 },
    noiseStrength: { value: 0.1 },
    time: { value: 0 },
  },
  vertexShader: (shader: string) => {
    return `
      varying vec3 vPosition;
      ${shader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vPosition = position;
      `
    );
  },
  fragmentShader: (shader: string) => {
    return `
      uniform vec3 colorA;
      uniform vec3 colorB;
      uniform float gradientExponent;
      uniform float noiseScale;
      uniform float noiseStrength;
      uniform float time;
      varying vec3 vPosition;

      // Simple noise function
      float noise(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
      }

      ${shader}
    `.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>

      float gradientFactor = pow(clamp(vPosition.y * 0.5 + 0.5, 0.0, 1.0), gradientExponent);
      vec3 baseColor = mix(colorA, colorB, gradientFactor);

      // Add animated noise
      vec3 noiseInput = vPosition * noiseScale + time * 0.1;
      float noiseValue = noise(noiseInput) * 2.0 - 1.0;
      vec3 finalColor = mix(baseColor, vec3(1.0), noiseValue * noiseStrength);

      gl_FragColor = vec4(finalColor, 1.0);
      `
    );
  },
};

export class GradeShade extends ExtendedMaterial {
  constructor(parameters?: THREE.MeshStandardMaterialParameters) {
    super(THREE.MeshStandardMaterial, gradeShadeExtension, {
      ...parameters,
      colorA: new THREE.Color(0x000000),
      colorB: new THREE.Color(0xffffff),
      gradientExponent: 1.0,
      noiseScale: 10.0,
      noiseStrength: 0.1,
    });
  }

  update(time: number) {
    this.uniforms.time.value = time;
  }
}
