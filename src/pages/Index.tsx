// src/pages/index.tsx

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Box, Camera, Zap, Sparkles } from "lucide-react";
import heroCube from "@/assets/hero-cube.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { scrollY } = useScroll();

  const backgroundOpacity = useTransform(scrollY, [0, 300], [0.2, 0.1]);
  const backgroundBlur = useTransform(scrollY, [0, 300], [2, 6]);

  const handleScanClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/scanner');
    }, 600);
  };

  return (
    <div className={`min-h-screen bg-background ${
      isTransitioning ? 'animate-scale-fade' : ''
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <motion.div 
          className="absolute inset-0 bg-gradient-cube opacity-10"
          style={{ opacity: backgroundOpacity }}
        />
        <motion.div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url(${heroCube})`,
            filter: `blur(${backgroundBlur}px)`
          }}
        />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"></div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 0, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Badge variant="secondary" className="mb-4 px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Solver
                </Badge>
              </motion.div>
            </div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Rubik's Cube
              <br />
              Solver
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Scan your scrambled cube with your camera and get step-by-step solving instructions in seconds
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={handleScanClick}
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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-primary text-primary-foreground py-20">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Solve Your Cube?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of cubers who've solved their puzzles with our AI-powered tool
          </p>
          <Button
            onClick={handleScanClick}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Solving Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;