import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { CubeViewer } from "@/components/CubeViewer";
import { ImageCropper } from "@/components/ImageCropper";
import { ColorGrid } from "@/components/ColorGrid";
import { useToast } from "@/hooks/use-toast";
import { useCubeState } from "@/hooks/useCubeState";
import axios from "axios";
import { 
  Upload, 
  Camera, 
  Scan, 
  Check, 
  ArrowRight, 
  Zap,
  Eye,
  Brain,
  Sparkles,
  Home
} from "lucide-react";

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
  const [scanAnimation, setScanAnimation] = useState(false);

  const faceNames = {
    front: "Front Face",
    back: "Back Face", 
    up: "Top Face",
    down: "Bottom Face",
    left: "Left Face",
    right: "Right Face"
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setShowColorGrid(false);
        setDetectedColors(null);
        setCroppedImage(null);
        setScanAnimation(true);
        setTimeout(() => setScanAnimation(false), 2000);
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

  // Grid sorting function
  const getColorGrid = (predictions: any[]) => {
    const sorted = [...predictions].sort((a, b) => a.y - b.y || a.x - b.x);
    const flipped = sorted.map((p, i, arr) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return arr[row * 3 + (2 - col)];
    });
    
    const grid: CubeColor[][] = [];
    for (let i = 0; i < 3; i++) {
      grid[i] = [];
      for (let j = 0; j < 3; j++) {
        const prediction = flipped[i * 3 + j];
        const detectedColor = colorMap[prediction?.class as keyof typeof colorMap] || "white";
        grid[i][j] = detectedColor;
      }
    }
    return grid;
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const base64Data = imageData.split(',')[1];
      const response = await axios.post('https://detect.roboflow.com/rubiks-cube-lv5h9/2', base64Data, {
        params: { api_key: 'rf_p5EGJkLdCdkQhm5t9SQaM6EiQlF3' },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data?.predictions?.length >= 9) {
        const grid = getColorGrid(response.data.predictions);
        setDetectedColors(grid);
        setShowColorGrid(true);
        
        toast({
          title: "🎯 Colors detected successfully!",
          description: "AI has analyzed your cube face. Review and confirm the colors.",
        });
      } else {
        throw new Error('Insufficient color squares detected');
      }
    } catch (error) {
      console.error('Color detection failed:', error);
      setDetectedColors(Array(3).fill(null).map(() => Array(3).fill("white")));
      setShowColorGrid(true);
      
      toast({
        title: "⚠️ Detection incomplete",
        description: "Please manually adjust the colors if needed.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCropComplete = (croppedImageData: string) => {
    setCroppedImage(croppedImageData);
    processImage(croppedImageData);
  };

  const handleConfirmColors = () => {
    if (detectedColors) {
      updateFaceColors(selectedFace, detectedColors);
      setUploadedImage(null);
      setCroppedImage(null);
      setDetectedColors(null);
      setShowColorGrid(false);
      
      toast({
        title: "✅ Face scanned successfully!",
        description: `${faceNames[selectedFace]} has been saved.`,
      });
    }
  };

  const handleSolve = () => {
    sessionStorage.setItem('cubeData', JSON.stringify(cubeData));
    setLocation('/solution');
  };

  const progress = (getScannedFacesCount() / 6) * 100;
  const allScanned = getAllFacesScanned();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid animate-matrix opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5"></div>

      {/* Header */}
      <motion.nav 
        className="p-6 flex justify-between items-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="glass-card hover:scale-105 transition-all duration-300"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Neural Cube Scanner
          </h1>
          <Badge variant="outline" className="mt-2 neon-border">
            <Brain className="w-3 h-3 mr-1" />
            AI Vision Active
          </Badge>
        </div>
        
        <div className="w-[140px]"></div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Progress Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Scanning Progress</h2>
              <Badge className={`${allScanned ? 'bg-gradient-primary' : 'bg-secondary'} text-white`}>
                <Scan className="w-3 h-3 mr-1" />
                {getScannedFacesCount()}/6 Faces
              </Badge>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="grid grid-cols-6 gap-2">
              {Object.keys(faceNames).map((face) => (
                <motion.button
                  key={face}
                  onClick={() => setSelectedFace(face as CubeFace)}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                    selectedFace === face 
                      ? 'border-primary bg-primary/20 scale-105' 
                      : cubeData[face as CubeFace]?.scanned 
                        ? 'border-success bg-success/20' 
                        : 'border-muted bg-muted/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xs font-medium">
                    {faceNames[face as CubeFace]}
                  </div>
                  {cubeData[face as CubeFace]?.scanned && (
                    <Check className="w-4 h-4 mx-auto mt-1 text-success" />
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Scanning Interface */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-primary" />
                Scan {faceNames[selectedFace]}
              </h3>

              {!uploadedImage ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                      animate={{ x: [-100, 300] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground mb-4">
                      Upload an image of your cube's {faceNames[selectedFace].toLowerCase()}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      asChild 
                      className="bg-gradient-primary hover:scale-105 transition-all duration-300"
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Camera className="w-4 h-4 mr-2" />
                        Choose Image
                      </label>
                    </Button>
                  </div>
                </div>
              ) : !croppedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    {scanAnimation && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent z-10"
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 1, repeat: 2 }}
                      />
                    )}
                    <ImageCropper
                      src={uploadedImage}
                      onCropComplete={handleCropComplete}
                    />
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {showColorGrid && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Eye className="w-4 h-4 mr-2 text-accent" />
                          AI Detection Results
                        </h4>
                        {isProcessing && (
                          <Badge className="animate-cyber-pulse">
                            <Brain className="w-3 h-3 mr-1" />
                            Processing...
                          </Badge>
                        )}
                      </div>
                      
                      {detectedColors && (
                        <ColorGrid
                          colors={detectedColors}
                          onColorsChange={setDetectedColors}
                          face={selectedFace}
                        />
                      )}
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleConfirmColors}
                          className="flex-1 bg-gradient-primary hover:scale-105 transition-all duration-300"
                          disabled={isProcessing}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Colors
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setUploadedImage(null);
                            setCroppedImage(null);
                            setShowColorGrid(false);
                            setDetectedColors(null);
                          }}
                          className="glass-card"
                        >
                          Retake
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </Card>

            {/* Solve Button */}
            <AnimatePresence>
              {allScanned && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="glass-card p-6 border-primary/50">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-glow" />
                      </div>
                      <h3 className="text-xl font-semibold">Ready to Solve!</h3>
                      <p className="text-muted-foreground">
                        All faces scanned successfully. Generate your solution now.
                      </p>
                      <Button 
                        onClick={handleSolve}
                        size="lg"
                        className="bg-gradient-primary hover:scale-110 transform transition-all duration-300 w-full text-lg py-4"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Solution
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column - 3D Cube Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glass-card p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-accent" />
                3D Cube Preview
              </h3>
              <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-scan"></div>
                <CubeViewer 
                  cubeData={cubeData} 
                  selectedFace={selectedFace}
                  onFaceSelect={setSelectedFace}
                />
              </div>
              
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Face:</span>
                  <Badge variant="outline" className="capitalize">
                    {faceNames[selectedFace]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={cubeData[selectedFace]?.scanned ? 'bg-success' : 'bg-muted'}>
                    {cubeData[selectedFace]?.scanned ? 'Scanned' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;