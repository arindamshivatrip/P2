"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ProjectCardContent } from "@/components/interactive-gallery/ProjectCardContent";
import type { GalleryProject } from "@/lib/interactive-gallery/projectAdapter";
import type { SpatialGestureTransform } from "@/lib/interactive-gallery/gestureMath";
import type { GalleryQualitySettings } from "@/lib/interactive-gallery/performance";

type ProjectCard3DProps = {
  project: GalleryProject;
  homePosition: [number, number, number];
  homeRotation: [number, number, number];
  variant?: "main" | "shelf";
  selected: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  gestureTransform: SpatialGestureTransform | null;
  qualitySettings: GalleryQualitySettings;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
  onManipulating?: (active: boolean) => void;
  onRotationChange?: (rotation: [number, number, number]) => void;
  onTransformChange?: (transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  }) => void;
};

export function ProjectCard3D({
  project,
  homePosition,
  homeRotation,
  variant = "main",
  selected,
  hovered,
  reducedMotion,
  gestureTransform,
  qualitySettings,
  onSelect,
  onHover,
  onManipulating,
  onRotationChange,
  onTransformChange
}: ProjectCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const positionVelocityRef = useRef(new THREE.Vector3());
  const rotationVelocityRef = useRef(new THREE.Vector3());
  const scaleVelocityRef = useRef(0);
  const lastTransformReportRef = useRef(0);
  const dragStartRef = useRef<{ x: number; y: number; position: THREE.Vector3 } | null>(null);
  const [dragOffset, setDragOffset] = useState<[number, number, number]>([0, 0, 0]);
  const [dragRotation, setDragRotation] = useState<[number, number, number]>([0, 0, 0]);

  const accentColor = useMemo(() => new THREE.Color(project.accent), [project.accent]);
  const isShelf = variant === "shelf";
  const cardSize: [number, number, number] = isShelf ? [0.75, 0.46, 0.05] : [1.7, 1.05, 0.12];
  const faceSize: [number, number] = isShelf ? [0.64, 0.36] : [1.5, 0.9];
  const distanceFactor = isShelf ? 1.15 : 1.8;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const idleFloat = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.75 + homePosition[0]) * 0.035;
    const targetPosition = new THREE.Vector3(...homePosition);
    const targetRotation = new THREE.Euler(...homeRotation);
    let targetScale = selected ? (isShelf ? 1.12 : 1.03) : hovered ? 1.04 : 1;

    if (selected && !isShelf) {
      targetPosition.z += 0.42;
      targetPosition.y += 0.06;
    }

    targetPosition.x += dragOffset[0];
    targetPosition.y += dragOffset[1] + idleFloat;
    targetPosition.z += dragOffset[2];

    if (gestureTransform) {
      targetPosition.set(...gestureTransform.position);
      targetRotation.set(...gestureTransform.rotation);
      targetScale = gestureTransform.scale;
    } else if (hovered && !reducedMotion) {
      targetRotation.x -= isShelf ? 0.04 : 0.1;
      targetRotation.y += isShelf ? 0.05 : 0.14;
    }

    targetRotation.x += dragRotation[0];
    targetRotation.y += dragRotation[1];
    targetRotation.z += dragRotation[2];

    if (reducedMotion) {
      group.position.lerp(targetPosition, 0.3);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotation.x, 0.3);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation.y, 0.3);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotation.z, 0.3);
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, 0.3));
    } else {
      const dt = Math.min(delta, 1 / 30);
      const stiffness = isShelf ? 130 : 160;
      const damping = isShelf ? 16 : 14;
      const currentRotation = new THREE.Vector3(group.rotation.x, group.rotation.y, group.rotation.z);
      const targetRotationVector = new THREE.Vector3(targetRotation.x, targetRotation.y, targetRotation.z);

      positionVelocityRef.current.add(targetPosition.clone().sub(group.position).multiplyScalar(stiffness * dt));
      positionVelocityRef.current.multiplyScalar(Math.exp(-damping * dt));
      group.position.add(positionVelocityRef.current.clone().multiplyScalar(dt));

      rotationVelocityRef.current.add(targetRotationVector.sub(currentRotation).multiplyScalar(stiffness * dt));
      rotationVelocityRef.current.multiplyScalar(Math.exp(-damping * dt));
      group.rotation.x += rotationVelocityRef.current.x * dt;
      group.rotation.y += rotationVelocityRef.current.y * dt;
      group.rotation.z += rotationVelocityRef.current.z * dt;

      scaleVelocityRef.current += (targetScale - group.scale.x) * stiffness * dt;
      scaleVelocityRef.current *= Math.exp(-damping * dt);
      group.scale.setScalar(group.scale.x + scaleVelocityRef.current * dt);
    }
    if (selected && !isShelf && state.clock.elapsedTime * 1000 - lastTransformReportRef.current >= qualitySettings.debugIntervalMs) {
      lastTransformReportRef.current = state.clock.elapsedTime * 1000;
      onRotationChange?.([group.rotation.x, group.rotation.y, group.rotation.z]);
      onTransformChange?.({
        position: [group.position.x, group.position.y, group.position.z],
        rotation: [group.rotation.x, group.rotation.y, group.rotation.z],
        scale: group.scale.x
      });
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onSelect(project.slug);
    if (isShelf) {
      return;
    }
    dragStartRef.current = {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
      position: new THREE.Vector3(...dragOffset)
    };
    onManipulating?.(true);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    onHover(project.slug);

    if (!dragStartRef.current || gestureTransform || isShelf) {
      return;
    }

    const deltaX = (event.nativeEvent.clientX - dragStartRef.current.x) / 82;
    const deltaY = (event.nativeEvent.clientY - dragStartRef.current.y) / 82;
    const depthDelta = event.nativeEvent.shiftKey ? -deltaY * 0.6 : 0;
    setDragOffset([
      THREE.MathUtils.clamp(dragStartRef.current.position.x + deltaX, -1.6, 1.6),
      THREE.MathUtils.clamp(dragStartRef.current.position.y - deltaY, -0.9, 0.9),
      THREE.MathUtils.clamp(dragStartRef.current.position.z + depthDelta + (selected ? 0.12 : 0), -0.35, 0.55)
    ]);
    setDragRotation([
      THREE.MathUtils.clamp(-deltaY * 0.34, -0.45, 0.45),
      THREE.MathUtils.clamp(deltaX * 0.44, -0.65, 0.65),
      THREE.MathUtils.clamp(deltaX * 0.16, -0.35, 0.35)
    ]);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    dragStartRef.current = null;
    onManipulating?.(false);
  };

  const handleWheel = (event: ThreeEvent<WheelEvent>) => {
    if (isShelf || !selected) {
      return;
    }

    event.stopPropagation();
    setDragOffset(([x, y, z]) => [x, y, THREE.MathUtils.clamp(z - event.deltaY / 760, -0.35, 0.55)]);
  };

  const resetTransform = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setDragOffset([0, 0, 0]);
    setDragRotation([0, 0, 0]);
    onManipulating?.(false);
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(project.slug);
      }}
      onPointerOut={() => onHover(null)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onDoubleClick={resetTransform}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(project.slug);
      }}
    >
      <RoundedBox
        args={cardSize}
        radius={isShelf ? 0.025 : 0.06}
        smoothness={qualitySettings.transmission ? 8 : 5}
        castShadow={qualitySettings.shadows && !isShelf}
        receiveShadow={false}
      >
        <meshPhysicalMaterial
          color="#f6f1e8"
          transparent
          opacity={isShelf ? 0.5 : 0.42}
          roughness={qualitySettings.transmission ? 0.18 : 0.28}
          metalness={0.02}
          clearcoat={qualitySettings.transmission ? 1 : 0.7}
          clearcoatRoughness={qualitySettings.transmission ? 0.13 : 0.32}
          transmission={qualitySettings.transmission ? 0.38 : 0}
          thickness={qualitySettings.transmission ? (isShelf ? 0.08 : 0.3) : 0}
          ior={1.32}
          attenuationColor={accentColor}
          attenuationDistance={2.8}
        />
      </RoundedBox>
      <mesh position={[0, 0, cardSize[2] / 2 + 0.01]}>
        <planeGeometry args={faceSize} />
        <meshPhysicalMaterial
          color="#fff8ed"
          transparent
          opacity={isShelf ? 0.16 : 0.2}
          roughness={0.32}
          clearcoat={0.8}
          clearcoatRoughness={0.16}
        />
      </mesh>
      <mesh position={[0, 0, cardSize[2] / 2 + 0.018]}>
        <planeGeometry args={[faceSize[0] * 0.98, faceSize[1] * 0.96]} />
        <meshBasicMaterial color={accentColor} transparent opacity={selected ? 0.13 : hovered ? 0.09 : 0.045} />
      </mesh>
      <mesh position={[0, cardSize[1] / 2 - (isShelf ? 0.04 : 0.065), cardSize[2] / 2 + 0.03]}>
        <boxGeometry args={[faceSize[0] * 0.9, isShelf ? 0.01 : 0.016, 0.025]} />
        <meshBasicMaterial color={accentColor} transparent opacity={selected ? 0.9 : 0.58} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cardSize[0], cardSize[1], cardSize[2])]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={selected ? 0.48 : 0.28} />
      </lineSegments>
      <Html
        transform
        occlude={false}
        position={[0, 0, cardSize[2] / 2 + 0.045]}
        distanceFactor={distanceFactor}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <ProjectCardContent project={project} active={selected || hovered} compact={isShelf} />
      </Html>
    </group>
  );
}
