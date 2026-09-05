import * as THREE from "three";
import type { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { gsap } from "gsap";
import { dimensionMark, ghostBox, hairlineBox } from "@/lib/isometric";

export type FigureBuilder = (group: THREE.Group, resolution: THREE.Vector2) => void;

const PLINTH_W = 3.4;
const PLINTH_D = 1.6;
const PLINTH_H = 0.2;
const PLINTH_TOP = PLINTH_H / 2;

const CASH_X = -1;
const TOKEN_X = 1;
const CASH_H = 2.0;
const TOKEN_H = 2.4;
const CASH_TOP = PLINTH_TOP + CASH_H;
const TOKEN_TOP = PLINTH_TOP + TOKEN_H;

function materialsOf(object: THREE.Object3D): LineMaterial[] {
  const materials: LineMaterial[] = [];
  object.traverse((child) => {
    const material = (child as THREE.Mesh).material as LineMaterial | undefined;
    if (material) materials.push(material);
  });
  return materials;
}

function plinth(resolution: THREE.Vector2): THREE.Group {
  const g = hairlineBox(PLINTH_W, PLINTH_H, PLINTH_D, resolution);
  g.position.set(0, PLINTH_TOP, 0);
  return g;
}

function cashTower(resolution: THREE.Vector2): THREE.Group {
  const g = hairlineBox(1, CASH_H, 1, resolution);
  g.position.set(CASH_X, PLINTH_TOP + CASH_H / 2, 0);
  return g;
}

/** FIG 0.1 — one name, two prices. Hover pulses the measured delta. */
export const buildMeasureFigure: FigureBuilder = (group, resolution) => {
  group.add(plinth(resolution));
  group.add(cashTower(resolution));

  const token = hairlineBox(1, TOKEN_H, 1, resolution);
  token.position.set(TOKEN_X, PLINTH_TOP + TOKEN_H / 2, 0);
  group.add(token);

  const mark = dimensionMark(TOKEN_X + 0.5, 0.5, CASH_TOP, TOKEN_TOP, resolution);
  group.add(mark);

  group.position.set(0, -1.3, 0);

  const markMaterials = materialsOf(mark);
  let tween: gsap.core.Tween | null = null;

  group.userData.onHover = (hovering: boolean) => {
    tween?.kill();
    if (hovering) {
      tween = gsap.to(markMaterials, {
        opacity: 0.15,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    } else {
      tween = gsap.to(markMaterials, {
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  };
};

/** FIG 0.2 — the gap getting shorter on purpose. Hover mills it further: the
 * shavings spread out and the removed ghost lifts away. */
export const buildHaircutFigure: FigureBuilder = (group, resolution) => {
  group.add(plinth(resolution));
  group.add(cashTower(resolution));

  const cutHeight = CASH_TOP + 0.2;
  const remainingH = cutHeight - PLINTH_TOP;
  const removedH = TOKEN_TOP - cutHeight;

  const tokenRemaining = hairlineBox(1, remainingH, 1, resolution);
  tokenRemaining.position.set(TOKEN_X, PLINTH_TOP + remainingH / 2, 0);
  group.add(tokenRemaining);

  const ghostBaseY = cutHeight + removedH / 2;
  const tokenGhost = ghostBox(1, removedH, 1, resolution);
  tokenGhost.position.set(TOKEN_X, ghostBaseY, 0);
  group.add(tokenGhost);

  const cuttingPlane = hairlineBox(1.3, 0.02, 1.3, resolution);
  cuttingPlane.position.set(TOKEN_X, cutHeight, 0);
  group.add(cuttingPlane);

  const waferX = 2.15;
  const waferSize = 1;
  const waferH = 0.08;
  const waferGap = 0.05;
  const wafers: THREE.Group[] = [];
  let y = PLINTH_TOP;
  for (let i = 0; i < 3; i++) {
    const wafer = hairlineBox(waferSize, waferH, waferSize, resolution);
    y += waferH / 2 + (i === 0 ? 0 : waferGap + waferH / 2);
    wafer.position.set(waferX, y, 0);
    wafers.push(wafer);
    group.add(wafer);
  }
  const waferBaseX = wafers.map((w) => w.position.x);

  const mark = dimensionMark(TOKEN_X + 0.5, 0.5, CASH_TOP, cutHeight, resolution);
  group.add(mark);

  group.position.set(0, -1.3, 0);

  const ghostMaterials = materialsOf(tokenGhost);
  let tl: gsap.core.Timeline | null = null;

  group.userData.onHover = (hovering: boolean) => {
    tl?.kill();
    tl = gsap.timeline();
    if (hovering) {
      wafers.forEach((wafer, i) => {
        tl!.to(
          wafer.position,
          { x: waferBaseX[i] + 0.35 + i * 0.12, duration: 0.8, ease: "power2.out" },
          0,
        );
      });
      tl.to(tokenGhost.position, { y: ghostBaseY + 0.3, duration: 0.8, ease: "power2.out" }, 0);
      tl.to(ghostMaterials, { opacity: 0.1, duration: 0.8, ease: "power2.out" }, 0);
    } else {
      wafers.forEach((wafer, i) => {
        tl!.to(wafer.position, { x: waferBaseX[i], duration: 0.7, ease: "power3.out" }, 0);
      });
      tl.to(tokenGhost.position, { y: ghostBaseY, duration: 0.7, ease: "power3.out" }, 0);
      tl.to(ghostMaterials, { opacity: 0.35, duration: 0.7, ease: "power3.out" }, 0);
    }
  };
};

/** FIG 0.3 — what's left after the mill becomes the thing you tap. Hover
 * breathes the TTL tab, like it's waiting on you. */
export const buildCardFigure: FigureBuilder = (group, resolution) => {
  const baseH = 0.4;
  const paneH = 0.16;
  const gap = 0.05;

  const base = hairlineBox(2.2, baseH, 1.4, resolution);
  base.position.set(0, baseH / 2, 0);
  group.add(base);

  const cashPane = hairlineBox(1.9, paneH, 1.15, resolution);
  const cashPaneY = baseH + gap + paneH / 2;
  cashPane.position.set(0, cashPaneY, 0);
  group.add(cashPane);

  const tokenPane = hairlineBox(1.9, paneH, 1.15, resolution);
  const tokenPaneY = cashPaneY + paneH / 2 + gap + paneH / 2;
  tokenPane.position.set(0, tokenPaneY, 0);
  group.add(tokenPane);

  const tabBaseY = tokenPaneY + paneH / 2 + 0.08;
  const tab = hairlineBox(0.28, 0.16, 0.28, resolution);
  tab.position.set(0.7, tabBaseY, 0.35);
  group.add(tab);

  group.position.set(0, -0.7, 0);

  let tween: gsap.core.Tween | null = null;

  group.userData.onHover = (hovering: boolean) => {
    tween?.kill();
    if (hovering) {
      tween = gsap.to(tab.position, {
        y: tabBaseY + 0.08,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    } else {
      tween = gsap.to(tab.position, {
        y: tabBaseY,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  };
};
