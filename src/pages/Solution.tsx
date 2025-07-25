import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CubeViewer3D } from "@/components/CubeViewer3D";
import { useToast } from "@/hooks/use-toast";
import { Copy, RotateCcw, Home } from "lucide-react";

interface SolutionStep {
  move: string;
  description: string;
}

const Solution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cubeData = location.state?.cubeData;
  
  // Mock solution - replace with actual cube solving algorithm
  const solutionSteps: SolutionStep[] = [
    { move: "F", description: "Front face clockwise" },
    { move: "U", description: "Upper face clockwise" },
    { move: "R'", description: "Right face counter-clockwise" },
    { move: "U'", description: "Upper face counter-clockwise" },
    { move: "F'", description: "Front face counter-clockwise" },
    { move: "R", description: "Right face clockwise" },
    { move: "U", description: "Upper face clockwise" },
    { move: "R'", description: "Right face counter-clockwise" },
    { move: "U'", description: "Upper face counter-clockwise" },
    { move: "R", description: "Right face clockwise" },
    { move: "U", description: "Upper face clockwise" },
    { move: "R'", description: "Right face counter-clockwise" }
  ];

  const solutionString = solutionSteps.map(step => step.move).join(" ");

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solutionString);
      toast({
        title: "Copied to clipboard!",
        description: "Solution sequence copied successfully.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the solution manually.",
        variant: "destructive",
      });
    }
  };

  const handleAnimateSolution = () => {
    setIsAnimating(true);
    // Simulate animation duration
    setTimeout(() => {
      setIsAnimating(false);
      toast({
        title: "Animation complete!",
        description: "Your cube should now be solved.",
      });
    }, solutionSteps.length * 500);
  };

  if (!cubeData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No cube data found</h2>
          <p className="text-muted-foreground mb-6">Please scan your cube first.</p>
          <Button onClick={() => navigate('/scanner')}>
            Go to Scanner
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Solution Ready! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Follow these steps to solve your cube
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - 3D Cube */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h2 className="text-2xl font-semibold mb-4 text-center">Your Cube</h2>
              <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center">
                <CubeViewer3D 
                  cubeData={cubeData} 
                  isAnimating={isAnimating}
                />
              </div>
              <div className="mt-6 flex gap-2 justify-center">
                <Button
                  onClick={handleAnimateSolution}
                  disabled={isAnimating}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
                  {isAnimating ? 'Animating...' : 'Animate Solution'}
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Solution to Clipboard
                </Button>
                <Button
                  onClick={() => navigate('/scanner')}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another Cube
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Solution Steps */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Solution Steps</h2>
                <Badge variant="secondary">{solutionSteps.length} moves</Badge>
              </div>
              
              {/* Solution String */}
              <div className="mb-6 p-4 bg-muted/20 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Complete Solution:</h3>
                  <Button
                    onClick={handleCopyToClipboard}
                    size="sm"
                    variant="ghost"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <code className="text-lg font-mono text-primary">{solutionString}</code>
              </div>

              {/* Step by Step */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {solutionSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/10 rounded-lg border hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <code className="text-lg font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          {step.move}
                        </code>
                        <span className="text-muted-foreground">{step.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legend */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold mb-4">Notation Legend</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">F</code>
                  <span>Front clockwise</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">F'</code>
                  <span>Front counter-clockwise</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">R</code>
                  <span>Right clockwise</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">U</code>
                  <span>Up clockwise</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">L</code>
                  <span>Left clockwise</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">D</code>
                  <span>Down clockwise</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solution;