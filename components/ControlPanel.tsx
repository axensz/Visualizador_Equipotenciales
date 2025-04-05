"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, RefreshCw, X } from "lucide-react"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface ControlPanelProps {
  barSeparation: number
  onBarSeparationChange: (value: number) => void
  equipotentialValues: number[]
  onEquipotentialValuesChange: (values: number[]) => void
  showFieldLines: boolean
  onShowFieldLinesChange: (show: boolean) => void
  showEquipotentialLines: boolean
  onShowEquipotentialLinesChange: (show: boolean) => void
  showFieldVectors: boolean
  onShowFieldVectorsChange: (show: boolean) => void
  fieldLineCount: number
  onFieldLineCountChange: (count: number) => void
  onAutoGenerateEquipotentialValues?: () => void
}

export default function ControlPanel({
  barSeparation,
  onBarSeparationChange,
  equipotentialValues,
  onEquipotentialValuesChange,
  showFieldLines,
  onShowFieldLinesChange,
  showEquipotentialLines,
  onShowEquipotentialLinesChange,
  showFieldVectors,
  onShowFieldVectorsChange,
  fieldLineCount,
  onFieldLineCountChange,
  onAutoGenerateEquipotentialValues,
}: ControlPanelProps) {
  const [newEquipotentialValue, setNewEquipotentialValue] = useState<string>("")

  const handleAddEquipotentialValue = () => {
    const value = Number.parseFloat(newEquipotentialValue)
    if (!isNaN(value)) {
      // Check if value already exists
      if (!equipotentialValues.includes(value)) {
        // Sort values when adding new one
        const newValues = [...equipotentialValues, value].sort((a, b) => a - b)
        onEquipotentialValuesChange(newValues)
        setNewEquipotentialValue("")
      }
    }
  }

  const handleRemoveEquipotentialValue = (index: number) => {
    const newValues = [...equipotentialValues]
    newValues.splice(index, 1)
    onEquipotentialValuesChange(newValues)
  }

  // Add a new function to handle clearing all equipotential values
  const handleClearAllEquipotentialValues = () => {
    onEquipotentialValuesChange([])
  }

  return (
    <TooltipProvider>
      <div className="w-full h-full">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Controles de Simulación</h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bar-separation">Separación de Barras</Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{barSeparation}px</span>
            </div>
            <Slider
              id="bar-separation"
              min={50}
              max={300}
              step={10}
              value={[barSeparation]}
              onValueChange={(values) => onBarSeparationChange(values[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="field-line-count">Número de Líneas de Campo</Label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{fieldLineCount}</span>
            </div>
            <Slider
              id="field-line-count"
              min={5}
              max={30}
              step={1}
              value={[fieldLineCount]}
              onValueChange={(values) => onFieldLineCountChange(values[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Opciones de Visualización</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="show-field-lines" checked={showFieldLines} onCheckedChange={onShowFieldLinesChange} />
                <Label htmlFor="show-field-lines">Mostrar Líneas de Campo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-equipotential-lines"
                  checked={showEquipotentialLines}
                  onCheckedChange={onShowEquipotentialLinesChange}
                />
                <Label htmlFor="show-equipotential-lines">Mostrar Líneas Equipotenciales</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-field-vectors" checked={showFieldVectors} onCheckedChange={onShowFieldVectorsChange} />
                <Label htmlFor="show-field-vectors">Mostrar Vectores de Campo</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Valores Equipotenciales</Label>
              <div className="flex gap-2">
                {equipotentialValues.length > 0 && (
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleClearAllEquipotentialValues}
                        aria-label="Borrar Todo"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Borrar Todo</p>
                    </TooltipContent>
                  </TooltipRoot>
                )}
                {onAutoGenerateEquipotentialValues && (
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={onAutoGenerateEquipotentialValues}
                        aria-label="Auto-generar"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auto-generar</p>
                    </TooltipContent>
                  </TooltipRoot>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Ingresar valor (V)"
                value={newEquipotentialValue}
                onChange={(e) => setNewEquipotentialValue(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddEquipotentialValue()
                  }
                }}
              />
              <Button onClick={handleAddEquipotentialValue}>Añadir</Button>
            </div>

            {equipotentialValues.length > 0 && (
              <div className="mt-4 border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Valor (V)</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead className="w-[80px]">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipotentialValues.map((value, index) => {
                      const normalizedIndex = index / (equipotentialValues.length - 1 || 1)
                      const hue = (1 - normalizedIndex) * 240 // 240 (blue) to 0 (red)
                      return (
                        <TableRow key={index}>
                          <TableCell>{value.toFixed(1)}</TableCell>
                          <TableCell>
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: `hsl(${hue}, 80%, 60%)` }}
                            />
                          </TableCell>
                          <TableCell>
                            <TooltipRoot>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveEquipotentialValue(index)}
                                  aria-label={`Eliminar ${value.toFixed(1)}V`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar {value.toFixed(1)}V</p>
                              </TooltipContent>
                            </TooltipRoot>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

