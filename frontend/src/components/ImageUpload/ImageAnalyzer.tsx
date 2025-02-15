import React, { useEffect, useRef, useState,useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { analyzeSkinTone, classifyFaceShape, detectGlasses } from '../../services/faceService';

export interface AnalysisResult {
  skinTone: string;
  expressions: Record<string, number>;
  landmarks: faceapi.Point[];
  faceShape: string;
  glasses: boolean;
  analysisId?: string;
}

interface ImageAnalyzerProps {
  image: string | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ image, setAnalysisResult }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
        const MODEL_URL = import.meta.env.BASE_URL + 'models';
        await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
    };
    loadModels();
  }, []);

const analyzeImage = useCallback(async () => {
  if (!imageRef.current || !isModelLoaded) return;
  const img = imageRef.current;
  try {
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions();
    if (!detection) return;

    const skinTone = await analyzeSkinTone(img, detection);
    const faceShape = classifyFaceShape(detection.landmarks);
    const glasses = await detectGlasses(img, detection.landmarks);

    const expressions = { ...detection.expressions };

    const analysisResult: AnalysisResult = {
      skinTone,
      expressions,
      landmarks: detection.landmarks.positions,
      faceShape,
      glasses,
    };

    setAnalysisResult(analysisResult);
  } catch (error) {
    console.error('Error analyzing image:', error);
  }
}, [isModelLoaded, setAnalysisResult, imageRef]);

  useEffect(() => {
    if (image) analyzeImage();
  }, [image,analyzeImage]);

  return <img ref={imageRef} src={image!} alt="Analyzed" style={{ maxWidth: '100%' }} />;
};

export default ImageAnalyzer;
