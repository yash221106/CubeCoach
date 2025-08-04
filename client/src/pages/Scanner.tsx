import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CubeViewer } from "@/components/CubeViewer";
import { ImageCropper } from "@/components/ImageCropper";
import { ColorGrid } from "@/components/ColorGrid";
import { useToast } from "@/hooks/use-toast";
import { useCubeState } from "@/hooks/useCubeState";
import axios from "axios";

export type CubeFace = 'front' | 'back' | 'up' | 'down' | 'left' | 'right';
export type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export interface FaceData {
  colors: (CubeColor | null)[][];
  scanned: boolean;
}

const Scanner = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Use custom hook for cube state management
  const {
    cubeState: cubeData,
    currentFace: selectedFace,
    setCurrentFace: setSelectedFace,
    updateFaceColors,
    getFaceColors,
    getAllFacesScanned,
    getScannedFacesCount
  } = useCubeState();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [detectedColors, setDetectedColors] = useState<CubeColor[][] | null>(null);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowColorGrid(false);
        setDetectedColors(null);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Roboflow API color mapping
  const colorMap = {
    biru: "blue",
    kuning: "yellow", 
    merah: "red",
    putih: "white",
    hijau: "green",
    oranye: "orange",
  } as const;

  // Grid sorting function from original code
  const getColorGrid = (predictions: any[]) => {
    // Sort by y-coordinate first, then x-coordinate to get row-by-row order
    const sorted = [...predictions].sort((a, b) => a.y - b.y || a.x - b.x);
    
    // Apply horizontal flip as per original logic
    const flipped = sorted.map((p, i, arr) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return arr[row * 3 + (2 - col)];
    });
    return [flipped.slice(0, 3), flipped.slice(3, 6), flipped.slice(6, 9)];
  };

  // Real Roboflow API integration
  const detectColors = useCallback(async (croppedBlob: Blob): Promise<CubeColor[][]> => {
    const formData = new FormData();
    formData.append("file", croppedBlob);
    
    try {
      const res = await axios.post(
        "https://detect.roboflow.com/rubik-color-detection-1wn9g/1?api_key=jLdnFo0BVFoFPQaf8n3F",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      let raw = res.data.predictions;
      // Pad with 'putih' to ensure there are always 9 squares
      while (raw.length < 9) {
        raw.push({ class: "putih", confidence: 1, x: 0, y: 0 });
      }

      // Sort into 3x3 grid and map colors
      const grid = getColorGrid(raw);
      return grid.map(row => 
        row.map(pred => colorMap[pred.class as keyof typeof colorMap] || 'white')
      );
    } catch (error) {
      console.error('Color detection failed:', error);
      throw new Error('Color detection failed. Please try again with a clearer image.');
    }
  }, []);

  const handleCropConfirm = useCallback(async (croppedImageData: string) => {
    setCroppedImage(croppedImageData);
    setIsProcessing(true);
    
    try {
      // Convert image URL to blob for API call
      const response = await fetch(croppedImageData);
      const blob = await response.blob();
      
      const colors = await detectColors(blob);
      setDetectedColors(colors);
      setShowColorGrid(true);
      
      toast({
        title: "Colors detected!",
        description: "Please verify and correct any mistakes.",
      });
    } catch (error) {
      console.error('Color detection failed:', error);
      toast({
        title: "Detection failed",
        description: error instanceof Error ? error.message : "Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [detectColors, toast]);

  const handleFaceConfirm = (colors: CubeColor[][]) => {
    updateFaceColors(selectedFace, colors);
    
    setUploadedImage(null);
    setCroppedImage(null);
    setDetectedColors(null);
    setShowColorGrid(false);
    
    toast({
      title: `${selectedFace.toUpperCase()} face saved!`,
      description: "Select another face to continue scanning.",
    });
  };

  const allFacesScanned = getAllFacesScanned();

  const handleSolveCube = () => {
    // Store cube data in sessionStorage for wouter navigation
    sessionStorage.setItem('cubeData', JSON.stringify(cubeData));
    setLocation('/solution');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Rubik's Cube Solver
          </h1>
          <p className="text-lg text-muted-foreground">
            Scan all six faces to get the solution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Cube Viewer */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-2xl font-semibold mb-4 text-center">Select Face to Scan</h2>
              <CubeViewer
                selectedFace={selectedFace}
                onFaceSelect={setSelectedFace}
                cubeData={cubeData}
              />
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Progress: {getScannedFacesCount()}/6 faces scanned
                </div>
                <div className="flex gap-1 justify-center">
                  {Object.entries(cubeData).map(([face, data]) => (
                    <div
                      key={face}
                      className={`w-3 h-3 rounded-full ${
                        data.scanned ? 'bg-success' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {allFacesScanned && (
              <Card className="p-6 bg-gradient-primary text-primary-foreground animate-pulse-glow">
                <h3 className="text-xl font-semibold mb-2">Ready to Solve!</h3>
                <p className="mb-4">All faces have been scanned. Get your solution now!</p>
                <Button 
                  onClick={handleSolveCube}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Solve My Cube! 🎯
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column - Scanner Interface */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Scanning: <span className="text-primary capitalize">{selectedFace}</span> Face
              </h2>
              
              {!uploadedImage ? (
                <div className="text-center">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
                    <div className="text-4xl mb-4">📷</div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button asChild size="lg">
                        <span>Upload Image for {selectedFace.toUpperCase()} Face</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground mt-4">
                      Take a clear photo of the {selectedFace} face of your cube
                    </p>
                  </div>
                </div>
              ) : (
                <ImageCropper
                  image={uploadedImage}
                  onCropConfirm={handleCropConfirm}
                  onCancel={() => setUploadedImage(null)}
                  isProcessing={isProcessing}
                />
              )}
            </Card>

            {showColorGrid && detectedColors && (
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">Verify Colors</h3>
                <ColorGrid
                  colors={detectedColors}
                  onConfirm={handleFaceConfirm}
                  onRescan={() => {
                    setShowColorGrid(false);
                    setDetectedColors(null);
                    setCroppedImage(null);
                  }}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;