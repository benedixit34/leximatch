/**
 * Geometry of the scrolling journey map. Level 1 is at the bottom and the path winds upward.
 * Everything is derived from the number of levels, so 5 or 500 levels both work.
 * Coordinates are in a fixed 390-wide design space; the map scales to the screen width.
 */

export const MAP_WIDTH = 390;
export const STEP = 190;       // vertical distance between two levels
export const PAD_TOP = 170;
export const PAD_BOTTOM = 230; // room under level 1 for the welcome sign

export interface Point { x: number; y: number }

export interface SceneryItem {
  kind: 'tree' | 'rock' | 'fern';
  x: number;      // centre, design px
  y: number;      // bottom of the item (its "ground" line)
  size: number;   // width in design px
  shade: number;  // 0..2, colour variation
  flip: boolean;
}

export interface MapLayout {
  width: number;
  height: number;
  nodes: Point[];
  /** Smooth path through all levels, with lead-in and lead-out */
  pathD: string;
  scenery: SceneryItem[];
}

/** Small deterministic random generator so the map looks the same on every load */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mapHeight(levels: number): number {
  return PAD_TOP + Math.max(levels - 1, 0) * STEP + PAD_BOTTOM;
}

/** Horizontal position of level `i`: a gentle zig-zag that stays clear of the screen edges */
export function nodeX(i: number): number {
  return MAP_WIDTH * (0.5 + 0.18 * Math.sin(i * 1.35 + 0.6));
}

export function nodeY(i: number, levels: number): number {
  return mapHeight(levels) - PAD_BOTTOM - i * STEP;
}

/** Catmull-Rom spline through the points, as an SVG cubic-Bezier path */
export function smoothPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function buildMapLayout(levels: number): MapLayout {
  const n = Math.max(levels, 1);
  const height = mapHeight(n);
  const nodes: Point[] = Array.from({ length: n }, (_, i) => ({ x: nodeX(i), y: nodeY(i, n) }));

  // lead-in below level 1 and lead-out above the last level so the path runs off both ends
  const pts: Point[] = [
    { x: nodes[0].x - 30, y: height + 20 },
    { x: nodes[0].x - 10, y: nodes[0].y + 110 },
    ...nodes,
    { x: nodes[n - 1].x + (nodes[n - 1].x > MAP_WIDTH / 2 ? -40 : 40), y: -30 },
  ];

  // Scenery: trees hug the side of the screen the path is NOT on
  const scenery: SceneryItem[] = [];
  for (let i = -1; i < n; i++) {
    const rand = mulberry32(1000 + i * 7919);
    const yTop = i < 0 ? nodes[0].y + 60 : nodes[i].y;
    const yBottom = i < 0 ? height : i === n - 1 ? -60 : nodes[i + 1].y;
    const pathX = i < 0 ? nodes[0].x : (nodes[i].x + (nodes[i + 1]?.x ?? nodes[i].x)) / 2;
    const side = pathX > MAP_WIDTH / 2 ? -1 : 1; // -1 = left, 1 = right

    const count = 2 + Math.floor(rand() * 2);
    for (let k = 0; k < count; k++) {
      const size = 78 + rand() * 78;
      const y = yBottom + (yTop - yBottom) * (0.2 + 0.7 * ((k + rand() * 0.6) / count));
      // keep clear of the path: centre may reach at most (pathX - 108) / (pathX + 108)
      const reach = side === -1 ? Math.max(pathX - 108, 18) : Math.min(pathX + 108, MAP_WIDTH - 18);
      const edge = side === -1 ? 18 + rand() * 30 : MAP_WIDTH - 18 - rand() * 30;
      const x = side === -1 ? Math.min(edge + rand() * 40, reach) : Math.max(edge - rand() * 40, reach);
      scenery.push({ kind: 'tree', x, y, size, shade: Math.floor(rand() * 3), flip: rand() > 0.5 });
    }
    // a few small things on the path's own side, kept near the screen edge
    if (rand() > 0.45) {
      const x = side === -1 ? MAP_WIDTH - 22 - rand() * 14 : 22 + rand() * 14;
      scenery.push({ kind: rand() > 0.5 ? 'rock' : 'fern', x, y: yBottom + (yTop - yBottom) * 0.5, size: 34 + rand() * 22, shade: 0, flip: rand() > 0.5 });
    }
  }
  // painter's order: things lower on the map are drawn on top
  scenery.sort((a, b) => a.y - b.y);

  return { width: MAP_WIDTH, height, nodes, pathD: smoothPath(pts), scenery };
}