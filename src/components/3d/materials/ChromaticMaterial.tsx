import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Vector2, Vector3 } from 'three'

const ChromaticMaterial = shaderMaterial(
  {
    uIorR: 1.15,
    uIorY: 1.16,
    uIorG: 1.17,
    uIorC: 1.18,
    uIorB: 1.19,
    uIorP: 1.20,
    uSaturation: 1.0,
    uChromaticAberration: 1.0,
    uRefractPower: 0.2,
    uFresnelPower: 2.0,
    uShininess: 40.0,
    uDiffuseness: 0.2,
    uLight: new Vector3(-1.0, 1.0, 1.0),
    winResolution: new Vector2(1, 1),
    uTexture: null,
  },
  // vertex shader
  `
    varying vec3 worldNormal;
    varying vec3 eyeVector;

    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vec4 mvPosition = viewMatrix * worldPos;
      gl_Position = projectionMatrix * mvPosition;
      worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      eyeVector = normalize(worldPos.xyz - cameraPosition);
    }
  `,
  // fragment shader
  `
    uniform float uIorR;
    uniform float uIorY;
    uniform float uIorG;
    uniform float uIorC;
    uniform float uIorB;
    uniform float uIorP;
    uniform float uSaturation;
    uniform float uChromaticAberration;
    uniform float uRefractPower;
    uniform float uFresnelPower;
    uniform float uShininess;
    uniform float uDiffuseness;
    uniform vec3 uLight;
    uniform vec2 winResolution;
    uniform sampler2D uTexture;

    varying vec3 worldNormal;
    varying vec3 eyeVector;

    vec3 sat(vec3 rgb, float adjustment) {
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      vec3 intensity = vec3(dot(rgb, W));
      return mix(intensity, rgb, adjustment);
    }

    float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
      float fresnelFactor = abs(dot(eyeVector, worldNormal));
      float inversefresnelFactor = 1.0 - fresnelFactor;
      return pow(inversefresnelFactor, power);
    }

    float specular(vec3 light, float shininess, float diffuseness) {
      vec3 normal = worldNormal;
      vec3 lightVector = normalize(-light);
      vec3 halfVector = normalize(eyeVector + lightVector);
      float NdotL = dot(normal, lightVector);
      float NdotH = dot(normal, halfVector);
      float kDiffuse = max(0.0, NdotL);
      float NdotH2 = NdotH * NdotH;
      float kSpecular = pow(NdotH2, shininess);
      return kSpecular + kDiffuse * diffuseness;
    }

    const int LOOP = 16;

    void main() {
      float iorRatioRed = 1.0/uIorR;
      float iorRatioGreen = 1.0/uIorG;
      float iorRatioBlue = 1.0/uIorB;

      vec2 uv = gl_FragCoord.xy / winResolution.xy;
      vec3 normal = worldNormal;
      vec3 color = vec3(0.0);

      for (int i = 0; i < LOOP; i++) {
        float slide = float(i) / float(LOOP) * 0.1;

        vec3 refractVecR = refract(eyeVector, normal, (1.0/uIorR));
        vec3 refractVecY = refract(eyeVector, normal, (1.0/uIorY));
        vec3 refractVecG = refract(eyeVector, normal, (1.0/uIorG));
        vec3 refractVecC = refract(eyeVector, normal, (1.0/uIorC));
        vec3 refractVecB = refract(eyeVector, normal, (1.0/uIorB));
        vec3 refractVecP = refract(eyeVector, normal, (1.0/uIorP));

        // Since we don't have a texture, we'll use a procedural pattern
        vec3 baseColor = vec3(
          0.5 + 0.5 * sin(uv.x * 10.0 + slide),
          0.5 + 0.5 * sin(uv.y * 10.0 + slide),
          0.5 + 0.5 * cos(uv.x * uv.y * 5.0 + slide)
        );

        color += baseColor;
        color = sat(color, uSaturation);
      }

      color /= float(LOOP);

      // Specular
      float specularLight = specular(uLight, uShininess, uDiffuseness);
      color += specularLight;

      // Fresnel
      float f = fresnel(eyeVector, normal, uFresnelPower);
      color.rgb += f * vec3(1.0);

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Extend the material
extend({ ChromaticMaterial })

// Add type declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      chromaticMaterial: any
    }
  }
}

export { ChromaticMaterial }
