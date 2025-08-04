import { Card } from "@/components/ui/card";
import type { CubeFace, FaceData } from "@/pages/Scanner";

interface CubeViewerProps {
  selectedFace: CubeFace;
  onFaceSelect: (face: CubeFace) => void;
  cubeData: Record<CubeFace, FaceData>;
}

export const CubeViewer = ({ selectedFace, onFaceSelect, cubeData }: CubeViewerProps) => {
  const FaceComponent = ({ 
    face, 
    colors, 
    isSelected, 
    isScanned 
  }: { 
    face: CubeFace; 
    colors: (string | null)[][]; 
    isSelected: boolean; 
    isScanned: boolean; 
  }) => (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 hover:scale-105
        ${isSelected ? 'ring-2 ring-primary shadow-glow' : ''}
        ${isScanned ? 'bg-success/20' : 'bg-muted/20'}
      `}
      onClick={() => onFaceSelect(face)}
    >
      <div className="grid grid-cols-3 gap-[1px] p-2 rounded-lg border">
        {colors.flat().map((color, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-sm border-2 border-background/50
              ${color ? `bg-cube-${color}` : 'bg-muted'}
            `}
          />
        ))}
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold uppercase">
        {face}
      </div>
      {isScanned && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-success rounded-full flex items-center justify-center">
          <span className="text-xs text-white">✓</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="cube-net-container">
      {/* Unfolded cube net layout */}
      <div className="grid grid-cols-4 grid-rows-3 gap-4 max-w-md mx-auto">
        {/* Row 1 - UP face */}
        <div className="col-start-2">
          <FaceComponent
            face="up"
            colors={cubeData.up.colors}
            isSelected={selectedFace === 'up'}
            isScanned={cubeData.up.scanned}
          />
        </div>

        {/* Row 2 - LEFT, FRONT, RIGHT, BACK faces */}
        <div className="col-start-1">
          <FaceComponent
            face="left"
            colors={cubeData.left.colors}
            isSelected={selectedFace === 'left'}
            isScanned={cubeData.left.scanned}
          />
        </div>
        <div className="col-start-2">
          <FaceComponent
            face="front"
            colors={cubeData.front.colors}
            isSelected={selectedFace === 'front'}
            isScanned={cubeData.front.scanned}
          />
        </div>
        <div className="col-start-3">
          <FaceComponent
            face="right"
            colors={cubeData.right.colors}
            isSelected={selectedFace === 'right'}
            isScanned={cubeData.right.scanned}
          />
        </div>
        <div className="col-start-4">
          <FaceComponent
            face="back"
            colors={cubeData.back.colors}
            isSelected={selectedFace === 'back'}
            isScanned={cubeData.back.scanned}
          />
        </div>

        {/* Row 3 - DOWN face */}
        <div className="col-start-2">
          <FaceComponent
            face="down"
            colors={cubeData.down.colors}
            isSelected={selectedFace === 'down'}
            isScanned={cubeData.down.scanned}
          />
        </div>
      </div>
      
      <div className="text-center mt-8 text-sm text-muted-foreground">
        Click on a face to select it for scanning
      </div>
    </div>
  );
};