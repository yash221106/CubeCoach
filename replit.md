# Rubik's Cube Solver

## Project Overview
A React-based web application that allows users to scan their Rubik's cube with a camera, detect colors using AI, and receive step-by-step solving instructions. The app uses computer vision for color detection and the CubeJS library for generating solutions.

## Recent Changes (Migration from Lovable to Replit)
- **2025-08-04**: Migrated from Lovable to Replit environment
  - Converted routing from React Router to Wouter for Replit compatibility
  - Added missing dependencies: react-router-dom, sonner, cubejs, axios
  - Created type declarations for cubejs library
  - Implemented sessionStorage-based state management for navigation between pages
  - Ensured secure client/server separation following Replit best practices

## UI Redesign and Improvements (Latest Session)
- **2025-08-04**: Complete UI transformation with cyberpunk aesthetic
  - Replaced fake claims (Neural Network Solver → Smart Cube Solver)
  - Removed exaggerated accuracy claims (99.9% → Honest descriptions)
  - Fixed app naming throughout application (CyberCube → Rubik's Cube Solver)
  - Doubled cube visualization size for better visibility
  - Improved layout spacing and symmetry across all components
  - Enhanced responsive design for mobile and desktop
  - Maintained modern dark theme with neon accents while being honest about capabilities

## Architecture
- **Frontend**: React with TypeScript, using Wouter for routing
- **Backend**: Express.js server with minimal API surface
- **State Management**: Custom hooks for cube state, sessionStorage for navigation
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Roboflow API for color detection
- **Solver**: CubeJS library for generating solution algorithms

## Key Features
1. **Camera-based scanning**: Upload images of each cube face
2. **AI color detection**: Automatic color recognition using Roboflow
3. **Manual verification**: Users can correct detected colors
4. **3D cube visualization**: Interactive cube display
5. **Step-by-step solutions**: Clear solving instructions
6. **Progress tracking**: Visual feedback for scan completion

## Technical Decisions
- **Wouter over React Router**: Better compatibility with Replit's environment
- **SessionStorage for state**: Enables navigation state persistence without complex routing state
- **Custom type declarations**: Created cubejs.d.ts for TypeScript compatibility
- **Express minimal backend**: Following guidelines to keep logic in frontend

## User Preferences
- None specified yet

## Security Considerations
- Client/server separation maintained
- No sensitive data stored in frontend
- API keys handled through environment variables
- Input validation on all user uploads