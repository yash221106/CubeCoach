import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Scan, 
  Play, 
  ChevronRight
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
        <nav className="p-6 lg:p-8 flex justify-center items-center">
          <motion.div 
            className="text-2xl font-bold text-gradient-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Rubik's Cube Solver
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 lg:space-y-10 text-center lg:text-left"
            >
              <div className="space-y-6 lg:space-y-8">


                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <span className="text-foreground block">Solve Your</span>
                  <span className="text-gradient-primary block">
                    Rubik's Cube
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Upload photos of your cube faces and get step-by-step solving instructions. 
                  Features color detection and interactive 3D visualization.
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
                      <div className="grid grid-cols-3 gap-2 p-8">
                        {/* Simulate cube face - Bigger squares */}
                        {Array.from({ length: 9 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`w-16 h-16 rounded border-2 ${
                              i === 4 ? 'bg-cube-red border-red-400' : 
                              i % 2 === 0 ? 'bg-cube-blue border-blue-400' : 'bg-cube-yellow border-yellow-400'
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


              </div>
            </motion.div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Index;