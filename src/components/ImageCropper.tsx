import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropConfirm: (croppedImageData: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const ImageCropper = ({ 
  image, 
  onCropConfirm, 
  onCancel, 
  isProcessing 
}: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cropBox, setCropBox] = useState({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    rotation: 0
  });

  useEffect(() => {
    drawCanvas();
  }, [image, cropBox]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image (scaled to fit)
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Draw crop overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clear crop area
      ctx.save();
      ctx.translate(cropBox.x + cropBox.width / 2, cropBox.y + cropBox.height / 2);
      ctx.rotate((cropBox.rotation * Math.PI) / 180);
      ctx.clearRect(-cropBox.width / 2, -cropBox.height / 2, cropBox.width, cropBox.height);
      ctx.restore();

      // Draw crop box border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

      // Draw corner handles
      const handleSize = 10;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cropBox.x - handleSize/2, cropBox.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropBox.x + cropBox.width - handleSize/2, cropBox.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropBox.x - handleSize/2, cropBox.y + cropBox.height - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropBox.x + cropBox.width - handleSize/2, cropBox.y + cropBox.height - handleSize/2, handleSize, handleSize);
    };
    img.src = image;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on handles (resize)
    const handleSize = 10;
    const handles = [
      { x: cropBox.x, y: cropBox.y },
      { x: cropBox.x + cropBox.width, y: cropBox.y },
      { x: cropBox.x, y: cropBox.y + cropBox.height },
      { x: cropBox.x + cropBox.width, y: cropBox.y + cropBox.height }
    ];

    for (const handle of handles) {
      if (
        x >= handle.x - handleSize/2 && 
        x <= handle.x + handleSize/2 &&
        y >= handle.y - handleSize/2 && 
        y <= handle.y + handleSize/2
      ) {
        setIsResizing(true);
        return;
      }
    }

    // Check if clicking inside crop box (drag)
    if (
      x >= cropBox.x && 
      x <= cropBox.x + cropBox.width &&
      y >= cropBox.y && 
      y <= cropBox.y + cropBox.height
    ) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || (!isDragging && !isResizing)) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      setCropBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(canvas.width - prev.width, x - prev.width / 2)),
        y: Math.max(0, Math.min(canvas.height - prev.height, y - prev.height / 2))
      }));
    }

    if (isResizing) {
      const centerX = cropBox.x + cropBox.width / 2;
      const centerY = cropBox.y + cropBox.height / 2;
      const newWidth = Math.abs(x - centerX) * 2;
      const newHeight = Math.abs(y - centerY) * 2;
      const size = Math.min(newWidth, newHeight, 250); // Keep it square and reasonable size

      setCropBox(prev => ({
        ...prev,
        width: size,
        height: size,
        x: centerX - size / 2,
        y: centerY - size / 2
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleRotate = (degrees: number) => {
    setCropBox(prev => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360
    }));
  };

  const handleConfirmCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropBox.width;
    croppedCanvas.height = cropBox.height;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return;

    // Copy the cropped area
    croppedCtx.drawImage(
      canvas,
      cropBox.x, cropBox.y, cropBox.width, cropBox.height,
      0, 0, cropBox.width, cropBox.height
    );

    // Convert to data URL
    const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 0.8);
    onCropConfirm(croppedImageData);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-muted/10">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            Adjust the square to frame the cube face perfectly
          </p>
        </div>
        
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg cursor-crosshair max-w-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Button
            onClick={() => handleRotate(-15)}
            variant="outline"
            size="sm"
          >
            ↺ -15°
          </Button>
          <Button
            onClick={() => handleRotate(15)}
            variant="outline"
            size="sm"
          >
            ↻ +15°
          </Button>
          <Button
            onClick={() => handleRotate(-90)}
            variant="outline"
            size="sm"
          >
            ↺ -90°
          </Button>
          <Button
            onClick={() => handleRotate(90)}
            variant="outline"
            size="sm"
          >
            ↻ +90°
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