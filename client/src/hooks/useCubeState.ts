import { useState, useCallback } from 'react';
import type { CubeFace, CubeColor, FaceData } from '@/pages/Scanner';

export type CubeState = Record<CubeFace, FaceData>;

export const useCubeState = () => {
  const [cubeState, setCubeState] = useState<CubeState>({
    front: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false },
    back: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false },
    up: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false },
    down: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false },
    left: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false },
    right: { colors: Array(3).fill(null).map(() => Array(3).fill(null)), scanned: false }
  });

  const [currentFace, setCurrentFace] = useState<CubeFace>('front');
  const [manualEdits, setManualEdits] = useState<Record<string, CubeColor[][]>>({});

  const updateFaceColors = useCallback((face: CubeFace, colors: CubeColor[][]) => {
    setCubeState(prev => ({
      ...prev,
      [face]: {
        colors,
        scanned: true
      }
    }));
    
    // Clear manual edits for this face
    setManualEdits(prev => {
      const newEdits = { ...prev };
      delete newEdits[face];
      return newEdits;
    });
  }, []);

  const setManualEdit = useCallback((face: CubeFace, row: number, col: number, color: CubeColor) => {
    setManualEdits(prev => {
      const faceEdits = prev[face] || Array(3).fill(null).map(() => Array(3).fill(null));
      const newFaceEdits = faceEdits.map((rowArray, rowIndex) =>
        rowArray.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? color : cell
        )
      );
      
      return {
        ...prev,
        [face]: newFaceEdits
      };
    });
  }, []);

  const getFaceColors = useCallback((face: CubeFace, originalColors?: CubeColor[][]): CubeColor[][] => {
    const edits = manualEdits[face];
    const base = originalColors || cubeState[face]?.colors || Array(3).fill(null).map(() => Array(3).fill(null));
    
    if (!edits) return base;
    
    return base.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        edits[rowIndex]?.[colIndex] || cell
      )
    );
  }, [cubeState, manualEdits]);

  const getAllFacesScanned = useCallback(() => {
    return Object.values(cubeState).every(face => face.scanned);
  }, [cubeState]);

  const getScannedFacesCount = useCallback(() => {
    return Object.values(cubeState).filter(face => face.scanned).length;
  }, [cubeState]);

  return {
    cubeState,
    currentFace,
    setCurrentFace,
    updateFaceColors,
    setManualEdit,
    getFaceColors,
    getAllFacesScanned,
    getScannedFacesCount,
    manualEdits
  };
};