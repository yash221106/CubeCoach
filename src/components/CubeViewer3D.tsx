import { useEffect, useRef } from "react";
import type { FaceData } from "@/pages/Scanner";

interface CubeViewer3DProps {
  cubeData: Record<string, FaceData>;
  isAnimating?: boolean;
}

export const CubeViewer3D = ({ cubeData, isAnimating = false }: CubeViewer3DProps) => {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a simplified 3D cube representation
    // In a real implementation, you might use Three.js for actual 3D rendering
    if (cubeRef.current) {
      cubeRef.current.style.animation = isAnimating 
        ? 'cube-rotate 3s linear infinite' 
        : 'cube-rotate 8s ease-in-out infinite';
    }
  }, [isAnimating]);

  const renderFace = (faceData: FaceData, faceClass: string) => (
    <div className={`cube-face ${faceClass}`}>
      <div className="grid grid-cols-3 gap-[2px] w-full h-full p-1">
        {faceData.colors.flat().map((color, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-sm
              ${color ? `bg-cube-${color}` : 'bg-muted/50'}
              border border-background/30
            `}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="cube-container perspective-1000 flex items-center justify-center h-full">
      <div 
        ref={cubeRef}
        className="cube relative w-48 h-48 transform-style-preserve-3d animate-cube-rotate"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-15deg) rotateY(-15deg)'
        }}
      >
        {/* Front Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'translateZ(96px)' }}
        >
          {renderFace(cubeData.front, 'front')}
        </div>

        {/* Back Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'rotateY(180deg) translateZ(96px)' }}
        >
          {renderFace(cubeData.back, 'back')}
        </div>

        {/* Right Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'rotateY(90deg) translateZ(96px)' }}
        >
          {renderFace(cubeData.right, 'right')}
        </div>

        {/* Left Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'rotateY(-90deg) translateZ(96px)' }}
        >
          {renderFace(cubeData.left, 'left')}
        </div>

        {/* Top Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'rotateX(90deg) translateZ(96px)' }}
        >
          {renderFace(cubeData.up, 'top')}
        </div>

        {/* Bottom Face */}
        <div 
          className="cube-face absolute w-full h-full bg-card/80 border border-border rounded-lg"
          style={{ transform: 'rotateX(-90deg) translateZ(96px)' }}
        >
          {renderFace(cubeData.down, 'bottom')}
        </div>
      </div>

    </div>
  );
};