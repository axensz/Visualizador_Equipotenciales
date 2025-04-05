// Constants
export const COULOMB_CONSTANT = 8.99e9 // N·m²/C²

// Types
export interface ChargedBar {
  x: number
  y: number
  width: number
  height: number
  charge: number // positive or negative
}

export interface Vector {
  x: number
  y: number
}

export interface FieldPoint {
  position: Vector
  fieldVector: Vector
  potential: number
}

// Calculate electric field at a point due to a charged bar
export function calculateFieldFromBar(point: Vector, bar: ChargedBar): Vector {
  // Simplified model: treat the bar as a line of point charges
  const numSegments = 20
  const segmentCharge = bar.charge / numSegments
  const segmentLength = bar.height / numSegments

  let fieldX = 0
  let fieldY = 0

  for (let i = 0; i < numSegments; i++) {
    const segmentY = bar.y + i * segmentLength + segmentLength / 2
    const segmentX = bar.x + bar.width / 2

    const dx = point.x - segmentX
    const dy = point.y - segmentY
    const distanceSquared = dx * dx + dy * dy
    const distance = Math.sqrt(distanceSquared)

    if (distance < 1) continue // Avoid division by zero or very small values

    const forceMagnitude = (COULOMB_CONSTANT * Math.abs(segmentCharge)) / distanceSquared
    const directionX = dx / distance
    const directionY = dy / distance

    // Field points away from positive charges and toward negative charges
    const sign = Math.sign(segmentCharge)
    fieldX += sign * forceMagnitude * directionX
    fieldY += sign * forceMagnitude * directionY
  }

  return { x: fieldX, y: fieldY }
}

// Calculate electric potential at a point due to a charged bar
export function calculatePotentialFromBar(point: Vector, bar: ChargedBar): number {
  // Simplified model: treat the bar as a line of point charges
  const numSegments = 20
  const segmentCharge = bar.charge / numSegments
  const segmentLength = bar.height / numSegments

  let potential = 0

  for (let i = 0; i < numSegments; i++) {
    const segmentY = bar.y + i * segmentLength + segmentLength / 2
    const segmentX = bar.x + bar.width / 2

    const dx = point.x - segmentX
    const dy = point.y - segmentY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 1) continue // Avoid division by zero or very small values

    potential += (COULOMB_CONSTANT * segmentCharge) / distance
  }

  return potential
}

// Calculate total electric field at a point due to multiple charged bars
export function calculateTotalField(point: Vector, bars: ChargedBar[]): Vector {
  let totalFieldX = 0
  let totalFieldY = 0

  for (const bar of bars) {
    const field = calculateFieldFromBar(point, bar)
    totalFieldX += field.x
    totalFieldY += field.y
  }

  return { x: totalFieldX, y: totalFieldY }
}

// Calculate total electric potential at a point due to multiple charged bars
export function calculateTotalPotential(point: Vector, bars: ChargedBar[]): number {
  let totalPotential = 0

  for (const bar of bars) {
    totalPotential += calculatePotentialFromBar(point, bar)
  }

  return totalPotential
}

// Calculate field magnitude
export function calculateFieldMagnitude(field: Vector): number {
  return Math.sqrt(field.x * field.x + field.y * field.y)
}

// Normalize a vector to unit length
export function normalizeVector(vector: Vector): Vector {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  if (magnitude === 0) return { x: 0, y: 0 }
  return { x: vector.x / magnitude, y: vector.y / magnitude }
}

// Generate field points in a grid
export function generateFieldPoints(
  width: number,
  height: number,
  bars: ChargedBar[],
  gridSpacing: number,
): FieldPoint[] {
  const points: FieldPoint[] = []

  for (let x = 0; x < width; x += gridSpacing) {
    for (let y = 0; y < height; y += gridSpacing) {
      // Skip points inside the bars
      let insideBar = false
      for (const bar of bars) {
        if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
          insideBar = true
          break
        }
      }

      if (!insideBar) {
        const position = { x, y }
        const fieldVector = calculateTotalField(position, bars)
        const potential = calculateTotalPotential(position, bars)

        points.push({ position, fieldVector, potential })
      }
    }
  }

  return points
}

// Calculate the potential range in the field
export function calculatePotentialRange(
  width: number,
  height: number,
  bars: ChargedBar[],
  sampleCount = 1000,
): { min: number; max: number } {
  let minPotential = Number.POSITIVE_INFINITY
  let maxPotential = Number.NEGATIVE_INFINITY

  // Sample random points to find the potential range
  for (let i = 0; i < sampleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height

    // Skip points inside the bars
    let insideBar = false
    for (const bar of bars) {
      if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
        insideBar = true
        break
      }
    }

    if (!insideBar) {
      const potential = calculateTotalPotential({ x, y }, bars)
      minPotential = Math.min(minPotential, potential)
      maxPotential = Math.max(maxPotential, potential)
    }
  }

  return { min: minPotential, max: maxPotential }
}

// Generate suggested equipotential values based on the field
export function suggestEquipotentialValues(width: number, height: number, bars: ChargedBar[], count = 5): number[] {
  const { min, max } = calculatePotentialRange(width, height, bars)

  // Generate evenly spaced values between min and max
  const values: number[] = []
  const step = (max - min) / (count + 1)

  for (let i = 1; i <= count; i++) {
    const value = min + i * step
    // Round to 1 decimal place for cleaner values
    values.push(Math.round(value * 10) / 10)
  }

  return values
}

// Generate equipotential lines with improved algorithm
export function generateEquipotentialLines(
  width: number,
  height: number,
  bars: ChargedBar[],
  potentialValues: number[],
  resolution: number,
): Vector[][] {
  const lines: Vector[][] = []
  const step = Math.min(width, height) / resolution

  // Higher resolution for scanning
  const scanStep = step / 2

  for (const targetPotential of potentialValues) {
    const points: Vector[] = []

    // Scan horizontally with higher resolution
    for (let y = 0; y < height; y += scanStep) {
      let prevPotential: number | null = null
      let prevX: number | null = null

      for (let x = 0; x < width; x += scanStep) {
        const point = { x, y }

        // Skip points inside the bars
        let insideBar = false
        for (const bar of bars) {
          if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
            insideBar = true
            break
          }
        }

        if (!insideBar) {
          const potential = calculateTotalPotential(point, bars)

          // If we cross the target potential value, add a point
          if (prevPotential !== null && prevX !== null) {
            if (
              (prevPotential < targetPotential && potential > targetPotential) ||
              (prevPotential > targetPotential && potential < targetPotential)
            ) {
              // Linear interpolation to find the exact point
              const t = (targetPotential - prevPotential) / (potential - prevPotential)
              const interpX = prevX + t * scanStep

              // Add the interpolated point
              points.push({ x: interpX, y })
            }
          }

          prevPotential = potential
          prevX = x
        } else {
          prevPotential = null
          prevX = null
        }
      }
    }

    // Scan vertically with higher resolution
    for (let x = 0; x < width; x += scanStep) {
      let prevPotential: number | null = null
      let prevY: number | null = null

      for (let y = 0; y < height; y += scanStep) {
        const point = { x, y }

        // Skip points inside the bars
        let insideBar = false
        for (const bar of bars) {
          if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
            insideBar = true
            break
          }
        }

        if (!insideBar) {
          const potential = calculateTotalPotential(point, bars)

          // If we cross the target potential value, add a point
          if (prevPotential !== null && prevY !== null) {
            if (
              (prevPotential < targetPotential && potential > targetPotential) ||
              (prevPotential > targetPotential && potential < targetPotential)
            ) {
              // Linear interpolation to find the exact point
              const t = (targetPotential - prevPotential) / (potential - prevPotential)
              const interpY = prevY + t * scanStep

              // Add the interpolated point
              points.push({ x, y: interpY })
            }
          }

          prevPotential = potential
          prevY = y
        } else {
          prevPotential = null
          prevY = null
        }
      }
    }

    // If we have enough points, organize them into a line
    if (points.length > 5) {
      // Sort points to form a continuous line
      // This is a simplified approach - for complex equipotential lines,
      // a more sophisticated algorithm would be needed
      const organizedLine = organizePointsIntoLine(points)
      lines.push(organizedLine)
    }
  }

  return lines
}

// Helper function to organize scattered points into a continuous line
function organizePointsIntoLine(points: Vector[]): Vector[] {
  if (points.length <= 1) return points

  // Start with the leftmost point
  points.sort((a, b) => a.x - b.x)
  const organizedLine: Vector[] = [points[0]]
  const remainingPoints = points.slice(1)

  // Find the nearest point and add it to the line
  while (remainingPoints.length > 0) {
    const currentPoint = organizedLine[organizedLine.length - 1]
    let nearestIndex = 0
    let minDistance = Number.POSITIVE_INFINITY

    // Find the nearest point
    for (let i = 0; i < remainingPoints.length; i++) {
      const dx = remainingPoints[i].x - currentPoint.x
      const dy = remainingPoints[i].y - currentPoint.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        minDistance = distance
        nearestIndex = i
      }
    }

    // Add the nearest point to the line
    organizedLine.push(remainingPoints[nearestIndex])
    remainingPoints.splice(nearestIndex, 1)
  }

  return organizedLine
}

// Generate field lines starting from a charged bar
export function generateFieldLines(
  width: number,
  height: number,
  bars: ChargedBar[],
  numLines: number,
  maxSteps: number,
  stepSize: number,
): Vector[][] {
  const lines: Vector[][] = []

  // Start field lines from the positive bar
  const positiveBar = bars.find((bar) => bar.charge > 0)
  const negativeBar = bars.find((bar) => bar.charge < 0)

  if (!positiveBar || !negativeBar) return lines

  // Generate starting points along the positive bar
  const startPoints: Vector[] = []
  const lineSpacing = positiveBar.height / numLines

  for (let i = 0; i < numLines; i++) {
    const y = positiveBar.y + lineSpacing / 2 + i * lineSpacing
    startPoints.push({
      x: positiveBar.x + positiveBar.width,
      y,
    })
  }

  // Trace each field line
  for (const startPoint of startPoints) {
    const line: Vector[] = [{ ...startPoint }]
    let currentPoint = { ...startPoint }
    let reachedNegativeBar = false

    for (let step = 0; step < maxSteps && !reachedNegativeBar; step++) {
      const field = calculateTotalField(currentPoint, bars)
      const normalizedField = normalizeVector(field)

      // Move in the direction of the field
      currentPoint = {
        x: currentPoint.x + normalizedField.x * stepSize,
        y: currentPoint.y + normalizedField.y * stepSize,
      }

      // Check if we've reached the negative bar
      if (
        currentPoint.x >= negativeBar.x &&
        currentPoint.x <= negativeBar.x + negativeBar.width &&
        currentPoint.y >= negativeBar.y &&
        currentPoint.y <= negativeBar.y + negativeBar.height
      ) {
        reachedNegativeBar = true
      }

      // Check if we've gone out of bounds
      if (currentPoint.x < 0 || currentPoint.x > width || currentPoint.y < 0 || currentPoint.y > height) {
        break
      }

      line.push({ ...currentPoint })
    }

    if (line.length > 1) {
      lines.push(line)
    }
  }

  return lines
}

// Calculate the perpendicular vector to a field line at a given point
export function calculatePerpendicularVector(fieldVector: Vector): Vector {
  // The perpendicular vector is (-y, x)
  return { x: -fieldVector.y, y: fieldVector.x }
}

