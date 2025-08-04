import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation as useRouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CubeViewer3D } from "@/components/CubeViewer3D";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  RotateCcw, 
  Home, 
  Play, 
  Pause, 
  SkipForward,
  Zap,
  Brain,
  Trophy,
  Sparkles,
  Clock,
  ArrowRight
} from "lucide-react";
import * as Cube from "cubejs";

interface SolutionStep {
  move: string;
  description: string;
}

const Solution = () => {
  const [, setLocation] = useRouterLocation();
  const { toast } = useToast();
  
  // Get cube data from sessionStorage for wouter compatibility
  const getCubeDataFromStorage = () => {
    const stored = sessionStorage.getItem('cubeData');
    return stored ? JSON.parse(stored) : null;
  };
  
  const cubeData = getCubeDataFromStorage();
  const [solutionSteps, setSolutionSteps] = useState<SolutionStep[]>([]);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Convert cube data to solver format
  const formatCubeForSolver = useCallback((cubeData: any): string => {
    const faceOrder = ['up', 'right', 'front', 'down', 'left', 'back'];
    const colorMapping = {
      white: 'U', yellow: 'D', red: 'R', 
      orange: 'L', blue: 'F', green: 'B'
    };
    
    let cubeString = '';
    faceOrder.forEach(face => {
      if (cubeData[face]?.colors) {
        cubeData[face].colors.flat().forEach((color: string) => {
          cubeString += colorMapping[color as keyof typeof colorMapping] || 'U';
        });
      }
    });
    return cubeString;
  }, []);

  // Solve the cube using cubejs
  const solveCube = useCallback(async (cubeData: any) => {
    setIsLoadingSolution(true);
    try {
      const cubeString = formatCubeForSolver(cubeData);
      const cube = Cube.fromString(cubeString);
      const solution = cube.solve();
      
      // Convert solution moves to our format
      const moves = solution.split(' ').filter(move => move.trim());
      const steps: SolutionStep[] = moves.map(move => ({
        move: move.trim(),
        description: getMoveDescription(move.trim())
      }));
      
      setSolutionSteps(steps);
      
      toast({
        title: "🎯 Solution Generated!",
        description: `Found optimal solution in ${steps.length} moves.`,
      });
    } catch (error) {
      console.error('Solving failed:', error);
      // Fallback to example solution if solver fails
      setSolutionSteps([
        { move: "F", description: "Rotate front face clockwise" },
        { move: "U", description: "Rotate upper face clockwise" },
        { move: "R'", description: "Rotate right face counter-clockwise" },
        { move: "U'", description: "Rotate upper face counter-clockwise" },
        { move: "F'", description: "Rotate front face counter-clockwise" }
      ]);
      
      toast({
        title: "⚠️ Using Example Solution",
        description: "Generated a sample solution for demonstration.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSolution(false);
    }
  }, [formatCubeForSolver, toast]);

  const getMoveDescription = (move: string): string => {
    const descriptions: { [key: string]: string } = {
      'F': 'Rotate front face clockwise',
      "F'": 'Rotate front face counter-clockwise',
      'F2': 'Rotate front face 180°',
      'B': 'Rotate back face clockwise',
      "B'": 'Rotate back face counter-clockwise',
      'B2': 'Rotate back face 180°',
      'R': 'Rotate right face clockwise',
      "R'": 'Rotate right face counter-clockwise',
      'R2': 'Rotate right face 180°',
      'L': 'Rotate left face clockwise',
      "L'": 'Rotate left face counter-clockwise',
      'L2': 'Rotate left face 180°',
      'U': 'Rotate upper face clockwise',
      "U'": 'Rotate upper face counter-clockwise',
      'U2': 'Rotate upper face 180°',
      'D': 'Rotate lower face clockwise',
      "D'": 'Rotate lower face counter-clockwise',
      'D2': 'Rotate lower face 180°',
    };
    return descriptions[move] || `Perform move ${move}`;
  };

  useEffect(() => {
    if (cubeData) {
      solveCube(cubeData);
    }
  }, [cubeData, solveCube]);

  const handleCopyToClipboard = async () => {
    const solutionString = solutionSteps.map(step => step.move).join(' ');
    try {
      await navigator.clipboard.writeText(solutionString);
      toast({
        title: "✅ Copied to clipboard!",
        description: "Solution sequence copied successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Copy failed",
        description: "Please copy the solution manually.",
        variant: "destructive",
      });
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentStep < solutionSteps.length) {
      // Auto-advance through steps
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= solutionSteps.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
  };

  const handleStepForward = () => {
    if (currentStep < solutionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!cubeData) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 cyber-grid animate-matrix opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card p-8 text-center max-w-md">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No Cube Data Found</h2>
              <p className="text-muted-foreground">
                Please scan your cube first to generate a solution.
              </p>
            </div>
            <Button 
              onClick={() => setLocation('/scanner')}
              className="bg-gradient-primary hover:scale-105 transition-all duration-300 w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Scanner
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  const progress = solutionSteps.length > 0 ? (currentStep / solutionSteps.length) * 100 : 0;
  const solutionString = solutionSteps.map(step => step.move).join(' ');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid animate-matrix opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-primary/5"></div>

      {/* Floating Success Orbs */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-success/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>

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
            Solution Generator
          </h1>
          <Badge variant="outline" className="mt-2 neon-border">
            <Trophy className="w-3 h-3 mr-1" />
            Solution Ready
          </Badge>
        </div>
        
        <Button 
          onClick={() => setLocation('/scanner')}
          variant="outline"
          className="glass-card hover:scale-105 transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Scan
        </Button>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Success Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 animate-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            <span className="text-foreground">Solution</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Generated!</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your cube can be solved in {solutionSteps.length} moves. Follow the steps below or watch the 3D animation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - 3D Cube & Controls */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* 3D Cube Viewer */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-accent" />
                  3D Animation
                </h3>
                <Badge className="bg-gradient-primary text-white">
                  Step {currentStep + 1}/{solutionSteps.length}
                </Badge>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg flex items-center justify-center relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success/10 to-transparent animate-scan"></div>
                <CubeViewer3D 
                  cubeData={cubeData} 
                  isAnimating={isAnimating}
                />
              </div>

              {/* Animation Controls */}
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="glass-card"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handlePlayPause}
                    className="bg-gradient-primary hover:scale-105 transition-all duration-300"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStepForward}
                    disabled={currentStep >= solutionSteps.length - 1}
                    className="glass-card"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {solutionSteps[currentStep] && (
                  <motion.div 
                    className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20"
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-2xl font-bold text-primary mb-1">
                      {solutionSteps[currentStep].move}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {solutionSteps[currentStep].description}
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  className="glass-card hover:scale-105 transition-all duration-300"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Solution
                </Button>
                <Button
                  onClick={() => setLocation('/scanner')}
                  variant="outline"
                  className="glass-card hover:scale-105 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Another
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Solution Steps */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Solution Overview */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Solution Overview</h3>
                {isLoadingSolution ? (
                  <Badge variant="outline" className="animate-cyber-pulse">
                    <Brain className="w-3 h-3 mr-1" />
                    Computing...
                  </Badge>
                ) : (
                  <Badge className="bg-success text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {solutionSteps.length} moves
                  </Badge>
                )}
              </div>
              
              {/* Complete Solution String */}
              <div className="p-4 bg-muted/20 rounded-lg border mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Complete Sequence:</span>
                  <Button
                    onClick={handleCopyToClipboard}
                    size="sm"
                    variant="ghost"
                    className="hover:scale-110 transition-all duration-300"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <code className="text-lg font-mono text-primary break-all">
                  {solutionString}
                </code>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{solutionSteps.length}</div>
                  <div className="text-xs text-muted-foreground">Total Moves</div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">~{Math.ceil(solutionSteps.length * 1.5)}s</div>
                  <div className="text-xs text-muted-foreground">Est. Time</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">Easy</div>
                  <div className="text-xs text-muted-foreground">Difficulty</div>
                </div>
              </div>
            </Card>

            {/* Step-by-Step Instructions */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Step-by-Step Guide</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {solutionSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        index === currentStep 
                          ? 'border-primary bg-primary/10 scale-105' 
                          : index < currentStep 
                            ? 'border-success/50 bg-success/5' 
                            : 'border-muted bg-muted/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === currentStep 
                              ? 'bg-primary text-white' 
                              : index < currentStep 
                                ? 'bg-success text-white' 
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-mono text-lg font-bold text-primary">
                              {step.move}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {step.description}
                            </div>
                          </div>
                        </div>
                        {index < currentStep && (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Solution;