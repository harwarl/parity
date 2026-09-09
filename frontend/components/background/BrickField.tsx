"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * A layered brick field. Three parallax planes of running-bond brick, drawn
 * procedurally in a fragment shader — dark faces, darker mortar, a scattered few
 * lit green and breathing. Slow drift, pointer parallax between layers. The one
 * uniform the CPU touches is uIntensity, driven by page scroll.
 */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uScale;
  uniform float uMortar;
  uniform float uFade;
  uniform float uLit;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.31, 289.7))) * 43758.5453);
  }

  void main() {
    vec2 p = vUv * uScale;
    p.y += uTime * 0.18;
    float row = floor(p.y);
    p.x += mod(row, 2.0) * 0.5;
    vec2 cell = fract(p);
    vec2 id = vec2(floor(p.x), row);

    float edge = min(min(cell.x, 1.0 - cell.x), min(cell.y, 1.0 - cell.y));
    float face = smoothstep(0.0, uMortar, edge);

    float h = hash(id);
    float lit = step(1.0 - uLit, h) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 1.1 + h * 40.0)));

    vec3 mortar = vec3(0.03, 0.035, 0.033);
    vec3 brick = mix(vec3(0.12, 0.15, 0.135), vec3(0.0, 0.88, 0.49), lit * 0.94);
    vec3 col = mix(mortar, brick, face);

    // fade toward the frame edges so tiles dissolve rather than cut
    float vign = smoothstep(1.05, 0.3, length(vUv - 0.5) * 1.6);
    float alpha = (0.12 + face * 0.34 + lit * 0.85) * uIntensity * uFade * vign;
    gl_FragColor = vec4(col, alpha);
  }
`;

interface Layer {
  z: number;
  size: [number, number];
  scale: [number, number];
  mortar: number;
  fade: number;
  lit: number;
  parallax: number;
}

const LAYERS: Layer[] = [
  { z: 2.2, size: [46, 30], scale: [11, 8], mortar: 0.11, fade: 0.9, lit: 0.05, parallax: 1 },
  { z: -1.5, size: [60, 40], scale: [20, 15], mortar: 0.09, fade: 0.6, lit: 0.045, parallax: 0.55 },
  { z: -6, size: [90, 60], scale: [34, 26], mortar: 0.07, fade: 0.32, lit: 0.04, parallax: 0.28 },
];

export default function BrickField({
  intensityRef,
}: {
  intensityRef: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.ShaderMaterial | null)[]>([]);
  const pointer = useRef(new THREE.Vector2());
  const smooth = useRef(new THREE.Vector2());

  const uniforms = useMemo(
    () =>
      LAYERS.map((l, i) => ({
        uTime: { value: i * 17.3 },
        uIntensity: { value: 1 },
        uScale: { value: new THREE.Vector2(l.scale[0], l.scale[1]) },
        uMortar: { value: l.mortar },
        uFade: { value: l.fade },
        uLit: { value: l.lit },
      })),
    [],
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    pointer.current.copy(state.pointer);
    smooth.current.lerp(pointer.current, 1 - Math.pow(0.002, d));

    const target = intensityRef.current ?? 1;
    for (const m of mats.current) {
      if (!m) continue;
      m.uniforms.uTime.value += d;
      m.uniforms.uIntensity.value = THREE.MathUtils.damp(
        m.uniforms.uIntensity.value,
        target,
        3.5,
        d,
      );
    }

    if (group.current) {
      group.current.children.forEach((child, i) => {
        const l = LAYERS[i];
        child.position.x = THREE.MathUtils.damp(
          child.position.x,
          smooth.current.x * l.parallax * 1.6,
          5,
          d,
        );
        child.position.y = THREE.MathUtils.damp(
          child.position.y,
          smooth.current.y * l.parallax * 1.1 + Math.sin(t * 0.15 + i) * 0.15,
          5,
          d,
        );
      });
    }
  });

  return (
    <group ref={group}>
      {LAYERS.map((l, i) => (
        <mesh key={i} position={[0, 0, l.z]}>
          <planeGeometry args={l.size} />
          <shaderMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            uniforms={uniforms[i]}
            vertexShader={vert}
            fragmentShader={frag}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
