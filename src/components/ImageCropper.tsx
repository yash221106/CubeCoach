import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { drawCroppedImage } from "@/utils/drawCroppedImage";

interface ImageCropperProps {
  image: string;
  onCropConfirm: (croppedImageData: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const ImageCropper = ({ image, onCropConfirm, onCancel, isProcessing }: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // State for crop box properties (position, size, rotation)
  const [crop, setCrop] = useState({ x: 50, y: 50, size: 200, rotation: 0 });
  
  // State for mouse interactions
  const [dragging, setDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize' | 'rotate' | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // State for the scale of the displayed image on the canvas
  const [scale, setScale] = useState(1);

  // Effect to draw the image and crop box whenever the image or crop state changes
  useEffect(() => {
    if (!image) return;
    drawCroppedImage(image, crop, canvasRef, (_, scaleValue) => {
      setScale(scaleValue);
    }, 500);
  }, [image, crop]);

  /**
   * Calculates the mouse position relative to the canvas, accounting for scaling.
   */
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  // Handles the start of a drag operation (move, resize, or rotate)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    const centerX = crop.x + crop.size / 2;
    const centerY = crop.y + crop.size / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Determine the drag type based on mouse position
    if (distance > crop.size / 2 - 15 && distance < crop.size / 2 + 15) {
      setDragType("rotate");
    } else if (x > crop.x + crop.size - 15 && y > crop.y + crop.size - 15) {
      setDragType("resize");
    } else if (x > crop.x && x < crop.x + crop.size && y > crop.y && y < crop.y + crop.size) {
      setDragType("move");
    } else {
      setDragType(null);
    }

    setDragging(true);
    setOffset({ x, y });
  };

  // Handles mouse movement during a drag operation
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging || !dragType) return;
    const { x, y } = getMousePos(e);
    const dx = x - offset.x;
    const dy = y - offset.y;
    setOffset({ x, y });

    setCrop((prev) => {
      switch (dragType) {
        case "move":
          return { ...prev, x: prev.x + dx, y: prev.y + dy };
        case "resize":
          const newSize = Math.max(50, prev.size + dx); // Ensure minimum size
          return { ...prev, size: newSize };
        case "rotate":
          const cx = prev.x + prev.size / 2;
          const cy = prev.y + prev.size / 2;
          const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
          return { ...prev, rotation: angle };
        default:
          return prev;
      }
    });
  };

  // Handles the end of a drag operation
  const handleMouseUp = () => {
    setDragging(false);
    setDragType(null);
  };

  const handleRotate = () => {
    setCrop(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  // Confirms the crop and sends the cropped image data to the parent component
  const handleConfirmCrop = () => {
    drawCroppedImage(image, crop, canvasRef, (canvas) => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = crop.size;
      tempCanvas.height = crop.size;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      // Translate and rotate to extract the cropped region correctly
      ctx.translate(crop.size / 2, crop.size / 2);
      ctx.rotate((crop.rotation || 0) * Math.PI / 180);
      
      // Draw the cropped part of the original canvas onto the temporary canvas
      ctx.drawImage(
        canvas,
        crop.x * scale,
        crop.y * scale,
        crop.size * scale,
        crop.size * scale,
        -crop.size / 2,
        -crop.size / 2,
        crop.size,
        crop.size
      );

      // Get the cropped image as a blob and pass it to the onConfirm callback
      tempCanvas.toBlob((blob) => {
        if (blob && onCropConfirm) {
          const croppedImageData = URL.createObjectURL(blob);
          onCropConfirm(croppedImageData);
        }
      }, "image/jpeg");
    }, 500);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/10">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Adjust Crop (Move, Resize ↘️, Rotate ⤾)
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg max-w-full"
            style={{
              cursor: dragging ? "grabbing" : "crosshair",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex justify-center mb-4">
          <Button
            onClick={handleRotate}
            variant="outline"
            size="sm"
          >
            🔄 Rotate 90°
          </Button>
        </div>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={onCancel}
          variant="outline"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmCrop}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Detecting Colors...
            </>
          ) : (
            'Confirm & Detect Colors'
          )}
        </Button>
      </div>
    </div>
  );
};