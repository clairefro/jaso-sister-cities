// Quadratic Bezier arc between two [lon, lat] points, bowed toward the north.
export function arcCoordinates(from, to, steps = 64) {
  const [x1, y1] = from.map(Number)
  let [x2, y2] = to.map(Number)

  // Take the short way around the globe (e.g. across the Pacific).
  if (x2 - x1 > 180) x2 -= 360
  else if (x1 - x2 > 180) x2 += 360

  const dx = x2 - x1
  const dy = y2 - y1
  const bow = Math.hypot(dx, dy) * 0.25
  // Perpendicular to the chord, flipped so the control point is always north.
  const sign = dx >= 0 ? 1 : -1
  const cx = (x1 + x2) / 2 - sign * (dy / Math.hypot(dx, dy)) * bow
  const cy = (y1 + y2) / 2 + sign * (dx / Math.hypot(dx, dy)) * bow

  const points = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    points.push([
      u * u * x1 + 2 * u * t * cx + t * t * x2,
      u * u * y1 + 2 * u * t * cy + t * t * y2,
    ])
  }
  return points
}
