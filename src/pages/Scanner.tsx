import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CubeViewer } from "@/components/CubeViewer";
import { ImageCropper } from "@/components/ImageCropper";
import { ColorGrid } from "@/components/ColorGrid";
import { useToast } from "@/hooks/use-toast";
import { useCubeState } from "@/hooks/useCubeState";

export type CubeFace = 'front' | 'back' | 'up' | 'down' | 'left' | 'right';
export type CubeColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green';

export interface FaceData {
  colors: (CubeColor | null)[][];
  scanned: boolean;
}

const Scanner = () => {
  const navigate = useNavigate();
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

  // Color detection API integration point
  const detectColors = useCallback(async (croppedBlob: Blob): Promise<CubeColor[][]> => {
    // Replace this with your actual API call
    const formData = new FormData();
    formData.append('image', croppedBlob);
    
    // Example API call structure - replace with your actual endpoint
    // const response = await fetch('/api/detect-colors', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const result = await response.json();
    // return result.colors;
    
    // Mock response for now - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockColors: CubeColor[][] = [
      ['red', 'red', 'blue'],
      ['red', 'red', 'red'],
      ['white', 'red', 'red']
    ];
    return mockColors;
  }, []);

  const handleCropConfirm = useCallback(async (croppedImageData: string) => {
    setCroppedImage(croppedImageData);
    setIsProcessing(true);
    
    try {
      // Convert base64 to blob for API call
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
        description: "Please try again with a clearer image.",
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
    navigate('/solution', { state: { cubeData } });
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