"use client"

import { useState, useEffect, useCallback } from "react"
import ElectricFieldCanvas from "@/components/ElectricFieldCanvas"
import ControlPanel from "@/components/ControlPanel"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useMobile } from "@/hooks/use-mobile"
import { suggestEquipotentialValues } from "@/utils/electric-field"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ElectricFieldSimulator() {
  const isMobile = useMobile()
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [barSeparation, setBarSeparation] = useState(150)
  const [equipotentialValues, setEquipotentialValues] = useState<number[]>([1, 2, 5, 10])
  const [showFieldLines, setShowFieldLines] = useState(true)
  const [showEquipotentialLines, setShowEquipotentialLines] = useState(true)
  const [showFieldVectors, setShowFieldVectors] = useState(false)
  const [fieldLineCount, setFieldLineCount] = useState(15)

  // Adjust canvas size based on window size
  useEffect(() => {
    const handleResize = () => {
      // Calculate available space
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate optimal canvas size to avoid scrollbars
      const headerHeight = 60 // Approximate height of header
      const controlPanelWidth = isMobile ? 0 : 320 // Control panel width on desktop

      let width, height

      if (isMobile) {
        // On mobile, use full width and adjust height to leave room for controls
        width = viewportWidth
        height = viewportHeight - headerHeight - 450 // Approximate height for controls
      } else {
        // On desktop, use available space minus control panel width
        width = viewportWidth - controlPanelWidth
        height = viewportHeight - headerHeight
      }

      setCanvasSize({ width, height })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobile])

  // Remove the auto-suggestion behavior when values are empty
  const handleSuggestedValues = useCallback((values: number[]) => {
    // Don't auto-populate values anymore
    // This prevents auto-generation when values are removed
  }, [])

  // Auto-generate equipotential values
  const handleAutoGenerateValues = useCallback(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      const barWidth = 10
      const barHeight = canvasSize.height * 0.6

      const positiveBar = {
        x: canvasSize.width / 2 - barSeparation / 2 - barWidth,
        y: canvasSize.height / 2 - barHeight / 2,
        width: barWidth,
        height: barHeight,
        charge: 1.0,
      }

      const negativeBar = {
        x: canvasSize.width / 2 + barSeparation / 2,
        y: canvasSize.height / 2 - barHeight / 2,
        width: barWidth,
        height: barHeight,
        charge: -1.0,
      }

      // Limit to 5 values instead of 8
      const suggestedValues = suggestEquipotentialValues(
        canvasSize.width,
        canvasSize.height,
        [positiveBar, negativeBar],
        5,
      )

      setEquipotentialValues(suggestedValues)
    }
  }, [canvasSize.width, canvasSize.height, barSeparation])

  return (
    <TooltipProvider>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-2 bg-background border-b">
          <h1 className="text-xl md:text-2xl font-bold">Visualizador de Líneas Equipotenciales y Campo Eléctrico</h1>
          <ThemeToggle />
        </div>

        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            <ElectricFieldCanvas
              width={canvasSize.width}
              height={canvasSize.height}
              barSeparation={barSeparation}
              equipotentialValues={equipotentialValues}
              showFieldLines={showFieldLines}
              showEquipotentialLines={showEquipotentialLines}
              showFieldVectors={showFieldVectors}
              fieldLineCount={fieldLineCount}
              onSuggestEquipotentialValues={handleSuggestedValues}
            />
          </div>

          <div className={`${isMobile ? "h-auto" : "w-80 border-l"} bg-background overflow-y-auto`}>
            <div className="p-2">
              <ControlPanel
                barSeparation={barSeparation}
                onBarSeparationChange={setBarSeparation}
                equipotentialValues={equipotentialValues}
                onEquipotentialValuesChange={setEquipotentialValues}
                showFieldLines={showFieldLines}
                onShowFieldLinesChange={setShowFieldLines}
                showEquipotentialLines={showEquipotentialLines}
                onShowEquipotentialLinesChange={setShowEquipotentialLines}
                showFieldVectors={showFieldVectors}
                onShowFieldVectorsChange={setShowFieldVectors}
                fieldLineCount={fieldLineCount}
                onFieldLineCountChange={setFieldLineCount}
                onAutoGenerateEquipotentialValues={handleAutoGenerateValues}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

