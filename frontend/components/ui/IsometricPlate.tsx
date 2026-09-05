"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useInView } from "@/hooks/useInView";
import { ISO_PAPER, ISO_VOID } from "@/lib/isometric";
import type { FigureBuilder } from "@/lib/manifesto-figures";
import { cn } from "@/lib/cn";

interface IsometricPlateProps {
  build: FigureBuilder;
  size?: number;
  className?: string;
}

export function IsometricPlate({
  build,
  size = 300,
  className,
}: IsometricPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const renderRef = useRef<(() => void) | null>(null);
  const { ref: wrapperRef, inView } = useInView<HTMLDivElement>(0.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || size;
    const height = canvas.clientHeight || size;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(ISO_VOID, 1);
    renderer.setSize(width, height, false);

    const aspect = width / height;
    const d = 2.5;
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      0.1,
      100,
    );
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(ISO_PAPER, 0.4));
    const key = new THREE.DirectionalLight(ISO_PAPER, 1.4);
    key.position.set(5, 8, 4);
    scene.add(key);

    const group = new THREE.Group();
    build(group, new THREE.Vector2(width, height));
    group.rotation.y = 0.5;
    scene.add(group);
    groupRef.current = group;

    const renderOnce = () => renderer.render(scene, camera);
    renderRef.current = renderOnce;
    renderOnce();

    return () => {
      renderRef.current = null;
      groupRef.current = null;
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    };
  }, [build, size]);

  // One continuous render loop while visible — every tween (the settle-in
  // rotation, the hover-in pulse, the graceful hover-out return) just mutates
  // the scene graph and this loop paints whatever it finds, every frame.
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const loop = () => {
      renderRef.current?.();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => {
    if (!inView || !groupRef.current) return;
    const tween = gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 0.9,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [inView]);

  function setHover(hovering: boolean) {
    const onHover = groupRef.current?.userData.onHover as
      | ((h: boolean) => void)
      | undefined;
    onHover?.(hovering);
  }

  return (
    <div
      ref={wrapperRef}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={cn(
        "transition-all duration-[400ms] ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
