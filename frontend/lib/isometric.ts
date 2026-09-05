import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

// Mirrors config/theme.ts — Three.js needs numeric hex, not CSS custom properties.
export const ISO_VOID = 0x070807;
export const ISO_PAPER = 0xf4f7f2;
export const ISO_PANEL = 0x101110; // lit face color — dark enough to blend, lifts under the key light

// WebGL's native line width is ignored by almost every browser (a GL core-profile
// limitation), so real hairline thickness needs Three's fat-line implementation —
// it draws lines as screen-space quads, which is why every line material here
// needs the canvas's pixel resolution.
const LINE_WIDTH = 2;

// Edges sit low-opacity now that lit faces carry the shape — accents, not blueprint lines.
function fatEdges(
  geometry: THREE.BufferGeometry,
  resolution: THREE.Vector2,
  opacity = 0.65,
): LineSegments2 {
  const edges = new THREE.EdgesGeometry(geometry);
  const positions = Array.from(edges.attributes.position.array as Float32Array);
  edges.dispose();

  const lineGeometry = new LineSegmentsGeometry().setPositions(positions);
  const material = new LineMaterial({
    color: ISO_PAPER,
    linewidth: LINE_WIDTH,
    resolution,
    transparent: true,
    opacity,
  });
  return new LineSegments2(lineGeometry, material);
}

/** A lit panel-color box with a faint hairline outline — sculpted out of the void
 * by the scene's key light rather than drawn as a flat blueprint fill. */
export function hairlineBox(
  width: number,
  height: number,
  depth: number,
  resolution: THREE.Vector2,
): THREE.Group {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(width, height, depth);

  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: ISO_PANEL, roughness: 1, metalness: 0 }),
  );
  group.add(fill);
  group.add(fatEdges(geometry, resolution));

  return group;
}

/** Edges only, no fill — the "ghost" of material that's been milled away. */
export function ghostBox(
  width: number,
  height: number,
  depth: number,
  resolution: THREE.Vector2,
): THREE.Group {
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(width, height, depth);
  group.add(fatEdges(geometry, resolution, 0.3));
  return group;
}

/** A single dashed dimension mark between two heights, with small tick caps. */
export function dimensionMark(
  x: number,
  z: number,
  yFrom: number,
  yTo: number,
  resolution: THREE.Vector2,
  tick = 0.12,
): THREE.Group {
  const group = new THREE.Group();

  const lineGeometry = new LineGeometry().setPositions([x, yFrom, z, x, yTo, z]);
  const line = new Line2(
    lineGeometry,
    new LineMaterial({
      color: ISO_PAPER,
      linewidth: LINE_WIDTH,
      resolution,
      dashed: true,
      dashSize: 0.07,
      gapSize: 0.05,
      transparent: true,
      opacity: 0.7,
    }),
  );
  line.computeLineDistances();
  group.add(line);

  for (const y of [yFrom, yTo]) {
    const tickGeometry = new LineSegmentsGeometry().setPositions([
      x - tick,
      y,
      z,
      x + tick,
      y,
      z,
    ]);
    group.add(
      new LineSegments2(
        tickGeometry,
        new LineMaterial({
          color: ISO_PAPER,
          linewidth: LINE_WIDTH,
          resolution,
          transparent: true,
          opacity: 0.7,
        }),
      ),
    );
  }

  return group;
}
