import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Scan, 
  Zap, 
  Brain, 
  Camera, 
  Play, 
  ChevronRight,
  Sparkles,
  Cpu,
  Eye,
  Target
} from "lucide-react";

const Index = () => {
  const [, setLocation] = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid animate-matrix opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-destructive/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <nav className="p-6 flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            CyberCube
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="outline" className="neon-border">
              <Cpu className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Badge className="bg-gradient-primary text-white px-4 py-2 text-sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Neural Network Solver
                  </Badge>
                </motion.div>

                <motion.h1 
                  className="text-6xl lg:text-8xl font-black leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <span className="text-foreground">Solve Your</span>
                  <br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent animate-glow">
                    Rubik's Cube
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-xl text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Advanced AI-powered computer vision analyzes your cube in seconds. 
                  Get step-by-step solutions with interactive 3D visualization.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:scale-105 transform transition-all duration-300 text-lg px-8 py-4 h-auto group"
                  onClick={() => setLocation('/scanner')}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Scan className={`w-5 h-5 mr-3 transition-all duration-300 ${isHovering ? 'animate-cyber-pulse' : ''}`} />
                  Start Scanning
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-card hover:scale-105 transform transition-all duration-300 text-lg px-8 py-4 h-auto"
                >
                  <Play className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Content - 3D Cube Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <div className="relative w-full max-w-lg mx-auto">
                {/* Main Cube Card */}
                <Card className="glass-card p-8 hover-lift-3d">
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Scan Line Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan"></div>
                    
                    {/* 3D Cube Representation */}
                    <div className="transform-3d animate-float">
                      <div className="grid grid-cols-3 gap-1 p-6">
                        {/* Simulate cube face */}
                        {Array.from({ length: 9 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-8 h-8 rounded border-2 ${
                              i === 4 ? 'bg-cube-red' : 
                              i % 2 === 0 ? 'bg-cube-blue' : 'bg-cube-yellow'
                            }`}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              duration: 0.6, 
                              delay: 0.8 + (i * 0.1),
                              type: "spring"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Floating Status Cards */}
                <motion.div
                  className="absolute -top-4 -right-4 glass-card p-3 rounded-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-accent" />
                    <span>AI Vision</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 glass-card p-3 rounded-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    <span>99.9% Accuracy</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div 
          className="px-6 pb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Camera,
                  title: "Computer Vision",
                  description: "Advanced AI analyzes cube patterns instantly"
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Get solutions in under 3 seconds"
                },
                {
                  icon: Sparkles,
                  title: "3D Visualization",
                  description: "Interactive cube with step-by-step guidance"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + (index * 0.2) }}
                >
                  <Card className="glass-card p-6 hover-lift-3d group">
                    <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;