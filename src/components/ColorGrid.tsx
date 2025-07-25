import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CubeColor } from "@/pages/Scanner";

interface ColorGridProps {
  colors: CubeColor[][];
  onConfirm: (colors: CubeColor[][]) => void;
  onRescan: () => void;
  onColorEdit?: (row: number, col: number, color: CubeColor) => void;
}

const cubeColors: CubeColor[] = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];

export const ColorGrid = ({ colors: initialColors, onConfirm, onRescan, onColorEdit }: ColorGridProps) => {
  const [colors, setColors] = useState<CubeColor[][]>(initialColors);
  const [selectedSquare, setSelectedSquare] = useState<{row: number, col: number} | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    setSelectedSquare({ row, col });
  };

  const handleColorSelect = (color: CubeColor) => {
    if (selectedSquare) {
      const newColors = colors.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === selectedSquare.row && colIndex === selectedSquare.col ? color : cell
        )
      );
      setColors(newColors);
      
      // Call parent's color edit handler if provided
      onColorEdit?.(selectedSquare.row, selectedSquare.col, color);
      
      setSelectedSquare(null);
    }
  };

  const getColorClass = (color: CubeColor) => {
    const colorMap = {
      white: 'bg-cube-white border-gray-300',
      yellow: 'bg-cube-yellow border-yellow-400',
      red: 'bg-cube-red border-red-400',
      orange: 'bg-cube-orange border-orange-400',
      blue: 'bg-cube-blue border-blue-400',
      green: 'bg-cube-green border-green-400'
    };
    return colorMap[color];
  };

  return (
    <div className="space-y-6">
      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2 mx-auto max-w-xs">
        {colors.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square rounded-lg border-4 cursor-pointer transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${getColorClass(color)}
                ${
                  selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                    ? 'ring-4 ring-primary shadow-glow scale-110'
                    : ''
                }
              `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>

      {/* Color Picker */}
      {selectedSquare && (
        <Card className="p-4 bg-muted/10 animate-fade-in">
          <h4 className="text-sm font-medium mb-3 text-center">
            Select color for square ({selectedSquare.row + 1}, {selectedSquare.col + 1})
          </h4>
          <div className="flex gap-2 justify-center flex-wrap">
            {cubeColors.map((color) => (
              <button
                key={color}
                className={`
                  w-12 h-12 rounded-lg border-2 transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  ${getColorClass(color)}
                  ${colors[selectedSquare.row][selectedSquare.col] === color ? 'ring-2 ring-primary' : ''}
                `}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
          <div className="text-center mt-3">
            <Button
              onClick={() => setSelectedSquare(null)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onRescan}
          variant="outline"
        >
          Re-scan Face
        </Button>
        <Button
          onClick={() => onConfirm(colors)}
          className="bg-gradient-primary"
        >
          Confirm Face ✓
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        Click on any square to change its color
      </div>
    </div>
  );
};