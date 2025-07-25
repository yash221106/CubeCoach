import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Box, Camera, Zap, Sparkles } from "lucide-react";
import heroCube from "@/assets/hero-cube.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-cube opacity-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroCube})` }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Solver
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Rubik's Cube
              <br />
              Solver
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Scan your scrambled cube with your camera and get step-by-step solving instructions in seconds
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/scanner')}
                size="lg"
                className="bg-gradient-primary text-lg px-8 py-6 shadow-glow hover:shadow-cube transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
              
              <Button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Scan Your Cube</h3>
              <p className="text-muted-foreground">
                Upload photos of all six faces using our intelligent cropping tool. Our AI detects colors automatically.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Verify Colors</h3>
              <p className="text-muted-foreground">
                Review detected colors and make corrections if needed. Click any square to change its color.
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border hover:shadow-glow transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Solution</h3>
              <p className="text-muted-foreground">
                Receive step-by-step solving instructions with clear notation and optional 3D animation.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Solve Your Cube?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of cubers who've solved their puzzles with our AI-powered tool
          </p>
          <Button
            onClick={() => navigate('/scanner')}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Solving Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
