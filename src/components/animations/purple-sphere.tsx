"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const GlassMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float time;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vec3 pos = position;
      
      // Smoother wave animation with reduced frequency
      float noiseScale = 1.5; // Reduced from 2.0
      float noiseTime = time * 0.2; // Reduced from 0.3
      float noise = snoise(vec3(pos.x * noiseScale + noiseTime, pos.y * noiseScale + noiseTime, pos.z * noiseScale + noiseTime));
      float waves = sin(length(pos.xyz) * 2.0 + time * 0.8) * 0.08; // Reduced frequency and amplitude
      
      // Gentler secondary noise
      float secondaryNoise = snoise(vec3(pos.x * 2.0 + time * 0.3, pos.y * 2.0, pos.z * 2.0)) * 0.03;
      
      // Smoother vertex displacement
      pos += normal * (noise * 0.15 + waves + secondaryNoise);
      
      vPosition = pos;
      vNormal = normal;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      // Softer color palette
      vec3 baseColor = vec3(0.3, 0.1, 0.9); // Softer blue base
      vec3 accentColor = vec3(0.9, 0.8, 1.0); // Softer neon highlight
      vec3 glowColor = vec3(0.5, 0.2, 0.9); // Softer purple glow
      vec3 rimColor = vec3(0.2, 0.6, 1.0); // Softer cyan rim light
      
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vPosition);
      
      // Smoother Fresnel transition
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0); // Reduced power for smoother transition
      float rim = pow(1.0 - abs(dot(normal, viewDir)), 6.0);
      
      // Gentler swirling patterns
      float swirl = sin(length(vPosition.xyz) * 3.0 + time * 0.6) * 0.6;
      float waves = sin(vPosition.x * 3.0 + time * 0.7) * sin(vPosition.y * 3.0 + time * 0.7) * 0.5 + 0.5;
      float clouds = sin(swirl * 2.8 + time * 0.8) * 0.5 + 0.5;
      
      // Slower, smoother pulsing
      float pulse = sin(time * 0.3) * 0.1 + 0.9;
      float energyPulse = pow(sin(time * 0.5) * 0.5 + 0.5, 1.8);
      
      // Smoother color mixing
      vec3 shiftedColor = mix(baseColor, accentColor, clouds * waves * 0.8);
      shiftedColor += rimColor * rim * 0.6;
      
      // Softer specular highlights
      float specular = pow(max(0.0, 1.0 - length(viewDir)), 12.0) * 0.8;
      
      // Gentler color composition
      vec3 color = mix(shiftedColor * pulse, accentColor, fresnel * 0.6);
      color += glowColor * energyPulse * 0.2;
      color += rimColor * rim * energyPulse * 0.3;
      color += vec3(1.0) * specular;
      
      // Smoother transparency transitions
      float alpha = mix(0.7, 0.9, fresnel * pulse);
      alpha *= mix(0.85, 1.0, energyPulse);
      
      // Softer color grading
      color = pow(color, vec3(0.9)); // Reduced contrast
      color *= 1.1; // Slightly reduced brightness
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={true}
      uniforms={{
        time: { value: 0 },
      }}
    />
  );
};

const Sphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = 0.15;
  const bobSpeed = 0.3;
  const bobAmount = 0.25;

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      const time = clock.getElapsedTime();

      sphereRef.current.rotation.x = Math.sin(time * rotationSpeed) * 0.2;
      sphereRef.current.rotation.z = Math.cos(time * rotationSpeed * 0.6) * 0.2;
      sphereRef.current.position.x =
        Math.sin(time * bobSpeed * 0.4) * (bobAmount * 0.25);
    }
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[2, 256, 256]} />
      <GlassMaterial />
    </mesh>
  );
};

function PurpleSphere() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 65 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#4f00ff" />
        <Sphere />
      </Canvas>
    </div>
  );
}

export default PurpleSphere;
