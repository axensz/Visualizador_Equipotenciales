"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  type ChargedBar,
  generateFieldPoints,
  calculateFieldMagnitude,
  generateEquipotentialLines,
  generateFieldLines,
  normalizeVector,
} from "../utils/electric-field"

interface ElectricFieldCanvasProps {
  width: number
  height: number
  barSeparation: number
  equipotentialValues: number[]
  showFieldLines: boolean
  showEquipotentialLines: boolean
  showFieldVectors: boolean
  fieldLineCount: number
  onSuggestEquipotentialValues?: (values: number[]) => void
}

export default function ElectricFieldCanvas({
  width,
  height,
  barSeparation,
  equipotentialValues,
  showFieldLines,
  showEquipotentialLines,
  showFieldVectors,
  fieldLineCount,
  onSuggestEquipotentialValues,
}: ElectricFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bars, setBars] = useState<ChargedBar[]>([])
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Set up the charged bars
  useEffect(() => {
    if (width <= 0 || height <= 0) return

    const barWidth = 10
    const barHeight = height * 0.6
    const positiveBar: ChargedBar = {
      x: width / 2 - barSeparation / 2 - barWidth,
      y: height / 2 - barHeight / 2,
      width: barWidth,
      height: barHeight,
      charge: 1.0, // positive charge
    }

    const negativeBar: ChargedBar = {
      x: width / 2 + barSeparation / 2,
      y: height / 2 - barHeight / 2,
      width: barWidth,
      height: barHeight,
      charge: -1.0, // negative charge
    }

    setBars([positiveBar, negativeBar])

    // Only suggest equipotential values on initial load, not when they're removed
    if (onSuggestEquipotentialValues && width > 0 && height > 0) {
      // We'll let the parent component handle this now
      // This prevents auto-generation when values are removed
    }
  }, [width, height, barSeparation, onSuggestEquipotentialValues])

  // Render the electric field
  useEffect(() => {
    if (!canvasRef.current || bars.length !== 2 || width <= 0 || height <= 0) return

    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#f8f9fa"
    ctx.fillRect(0, 0, width, height)

    // Draw equipotential lines if enabled
    if (showEquipotentialLines && equipotentialValues.length > 0) {
      const equipotentialLines = generateEquipotentialLines(
        width,
        height,
        bars,
        equipotentialValues,
        150, // Higher resolution for smoother lines
      )

      // Create a color gradient for the equipotential lines
      const colorStops = equipotentialValues.length

      for (let i = 0; i < equipotentialLines.length; i++) {
        const line = equipotentialLines[i]
        if (line.length < 5) continue

        // Use a color from a gradient based on the potential value
        // This creates a rainbow effect from blue (low) to red (high)
        const normalizedIndex = i / (colorStops - 1 || 1)
        const hue = (1 - normalizedIndex) * 240 // 240 (blue) to 0 (red)

        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`
        ctx.lineWidth = 2.5
        ctx.beginPath()

        ctx.moveTo(line[0].x, line[0].y)
        for (let j = 1; j < line.length; j++) {
          ctx.lineTo(line[j].x, line[j].y)
        }

        ctx.stroke()

        // Add labels to the equipotential lines
        // Find good positions for labels that don't overlap
        if (line.length > 10) {
          // Place labels at different positions along different lines to avoid overlap
          const labelPositionIndex = Math.floor(line.length * (0.3 + (i % 3) * 0.2))
          const labelPoint = line[labelPositionIndex]

          // Create a background for the label
          const labelText = `${equipotentialValues[i].toFixed(1)}V`
          ctx.font = "12px Arial"
          const textMetrics = ctx.measureText(labelText)
          const padding = 4
          const labelWidth = textMetrics.width + padding * 2
          const labelHeight = 16 + padding

          // Draw label background
          ctx.fillStyle = isDarkMode ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"
          ctx.fillRect(labelPoint.x - labelWidth / 2, labelPoint.y - labelHeight / 2, labelWidth, labelHeight)

          // Draw label border
          ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 1)`
          ctx.lineWidth = 1
          ctx.strokeRect(labelPoint.x - labelWidth / 2, labelPoint.y - labelHeight / 2, labelWidth, labelHeight)

          // Draw label text
          ctx.fillStyle = isDarkMode ? `hsla(${hue}, 80%, 70%, 1)` : `hsla(${hue}, 80%, 40%, 1)`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(labelText, labelPoint.x, labelPoint.y)
        }
      }
    }

    // Draw electric field lines if enabled
    if (showFieldLines) {
      const fieldLines = generateFieldLines(width, height, bars, fieldLineCount, 1000, 5)

      for (const line of fieldLines) {
        if (line.length < 2) continue

        ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(line[0].x, line[0].y)

        for (let i = 1; i < line.length; i++) {
          ctx.lineTo(line[i].x, line[i].y)

          // Draw arrowheads along the field line
          if (i % 10 === 0 && i < line.length - 1) {
            const dx = line[i].x - line[i - 1].x
            const dy = line[i].y - line[i - 1].y
            const angle = Math.atan2(dy, dx)

            const headLength = 5
            const arrowX = line[i].x
            const arrowY = line[i].y

            ctx.moveTo(arrowX, arrowY)
            ctx.lineTo(
              arrowX - headLength * Math.cos(angle - Math.PI / 6),
              arrowY - headLength * Math.sin(angle - Math.PI / 6),
            )
            ctx.moveTo(arrowX, arrowY)
            ctx.lineTo(
              arrowX - headLength * Math.cos(angle + Math.PI / 6),
              arrowY - headLength * Math.sin(angle + Math.PI / 6),
            )
            ctx.moveTo(arrowX, arrowY)
          }
        }

        ctx.stroke()
      }
    }

    // Draw field vectors if enabled
    if (showFieldVectors) {
      const gridSpacing = 20
      const fieldPoints = generateFieldPoints(width, height, bars, gridSpacing)

      for (const point of fieldPoints) {
        const { position, fieldVector } = point
        const magnitude = calculateFieldMagnitude(fieldVector)

        // Skip very weak fields
        if (magnitude < 0.1) continue

        // Normalize and scale the field vector for visualization
        const normalizedField = normalizeVector(fieldVector)
        const arrowLength = Math.min(10, 5 + (15 * Math.log(1 + magnitude)) / Math.log(10))

        // Calculate arrow endpoint
        const endX = position.x + normalizedField.x * arrowLength
        const endY = position.y + normalizedField.y * arrowLength

        // Calculate field strength for color gradient (from blue to red)
        const fieldStrength = Math.min(1, Math.log(1 + magnitude) / Math.log(100))
        const r = Math.floor(220 * fieldStrength)
        const g = Math.floor(220 * (1 - fieldStrength))
        const b = Math.floor(255 * (1 - fieldStrength))
        const alpha = 0.7 + 0.3 * fieldStrength

        // Draw the arrow
        ctx.beginPath()
        ctx.moveTo(position.x, position.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw arrowhead
        const headLength = 3
        const angle = Math.atan2(normalizedField.y, normalizedField.x)

        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6))
        ctx.closePath()
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()
      }
    }

    // Draw the charged bars
    for (const bar of bars) {
      ctx.fillStyle = bar.charge > 0 ? "#dc2626" : "#2563eb"
      ctx.fillRect(bar.x, bar.y, bar.width, bar.height)

      // Add + or - symbols to indicate charge
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const symbol = bar.charge > 0 ? "+" : "−"
      const centerX = bar.x + bar.width / 2

      // Draw multiple symbols along the bar
      const symbolCount = Math.floor(bar.height / 20)
      for (let i = 0; i < symbolCount; i++) {
        const y = bar.y + (i + 0.5) * (bar.height / symbolCount)
        ctx.fillText(symbol, centerX, y)
      }
    }

    // Draw a legend
    const legendBgColor = isDarkMode ? "rgba(30, 30, 30, 0.8)" : "rgba(255, 255, 255, 0.8)"
    const legendTextColor = isDarkMode ? "#e5e5e5" : "#333"

    ctx.fillStyle = legendBgColor
    ctx.fillRect(10, 10, 200, 110)
    ctx.strokeStyle = isDarkMode ? "#555" : "#333"
    ctx.strokeRect(10, 10, 200, 110)

    ctx.fillStyle = legendTextColor
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    ctx.fillText("Leyenda:", 20, 25)

    // Positive bar
    ctx.fillStyle = "#dc2626"
    ctx.fillRect(20, 40, 15, 15)
    ctx.fillStyle = legendTextColor
    ctx.fillText("Carga Positiva", 45, 47)

    // Negative bar
    ctx.fillStyle = "#2563eb"
    ctx.fillRect(20, 65, 15, 15)
    ctx.fillStyle = legendTextColor
    ctx.fillText("Carga Negativa", 45, 72)

    // Equipotential lines
    if (showEquipotentialLines) {
      ctx.strokeStyle = "hsla(240, 80%, 60%, 0.8)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(20, 90)
      ctx.lineTo(35, 90)
      ctx.stroke()

      ctx.fillStyle = legendTextColor
      ctx.fillText("Líneas Equipotenciales", 45, 90)
    }
  }, [
    width,
    height,
    bars,
    equipotentialValues,
    showFieldLines,
    showEquipotentialLines,
    showFieldVectors,
    fieldLineCount,
    isDarkMode,
  ])

  return <canvas ref={canvasRef} width={width} height={height} className="max-w-full max-h-full shadow-md" />
}

