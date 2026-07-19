export type ShapeName = "Circle" | "Square" | "Rectangle" | "Triangle";

export interface Prediction {
  shape: ShapeName;
  confidence: number;
  probabilities: Record<ShapeName, number>;
}

export function predictShape(points: { x: number; y: number }[]): Prediction {
  if (points.length < 8) {
    return {
      shape: "Circle",
      confidence: 0.4,
      probabilities: { Circle: 0.4, Square: 0.2, Rectangle: 0.2, Triangle: 0.2 },
    };
  }
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rAvg = (w + h) / 4;
  // circularity: how close points are to average radius
  const radii = points.map((p) => Math.hypot(p.x - cx, p.y - cy));
  const meanR = radii.reduce((a, b) => a + b, 0) / radii.length;
  const variance =
    radii.reduce((a, b) => a + (b - meanR) ** 2, 0) / radii.length;
  const circularity = 1 - Math.min(1, Math.sqrt(variance) / (meanR || 1));
  const aspect = w / h;
  // corner detection via direction changes
  const step = Math.max(1, Math.floor(points.length / 40));
  let corners = 0;
  for (let i = step; i < points.length - step; i += step) {
    const a = points[i - step];
    const b = points[i];
    const c = points[i + step];
    const v1x = b.x - a.x,
      v1y = b.y - a.y;
    const v2x = c.x - b.x,
      v2y = c.y - b.y;
    const dot =
      (v1x * v2x + v1y * v2y) /
      ((Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y)) || 1);
    if (dot < 0.25) corners++;
  }

  const scores: Record<ShapeName, number> = {
    Circle: circularity * 1.2 - Math.min(1, corners / 8),
    Triangle: 0.2 + (corners >= 2 && corners <= 4 ? 0.6 : 0) - Math.abs(aspect - 1) * 0.1,
    Square:
      0.2 +
      (corners >= 3 ? 0.5 : 0) +
      (1 - Math.min(1, Math.abs(aspect - 1))) * 0.5,
    Rectangle:
      0.2 +
      (corners >= 3 ? 0.4 : 0) +
      Math.min(1, Math.abs(aspect - 1)) * 0.6,
  };
  // normalize (softmax-ish)
  const vals = Object.values(scores).map((v) => Math.max(0.05, v));
  const sum = vals.reduce((a, b) => a + b, 0);
  const probs = Object.fromEntries(
    (Object.keys(scores) as ShapeName[]).map((k) => [k, Math.max(0.05, scores[k]) / sum]),
  ) as Record<ShapeName, number>;
  const shape = (Object.entries(probs) as [ShapeName, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
  void rAvg;
  return { shape, confidence: probs[shape], probabilities: probs };
}