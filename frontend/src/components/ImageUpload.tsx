import React, { useState } from 'react';
import  ImageUploader from './ImageUpload/ImageUploader';
import ImageAnalyzer from './ImageUpload/ImageAnalyzer';
import DynamicAdvice from './ImageUpload/DynamicAdvice';
import { AnalysisResult } from './ImageUpload/ImageAnalyzer';
const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  return (
    <div className="container">
      <h1>Face Analysis & Dynamic Advice</h1>
      <ImageUploader setImage={setImage} />
      {image && <ImageAnalyzer image={image} setAnalysisResult={setAnalysisResult} />}
      {analysisResult && <DynamicAdvice analysisId={analysisResult.analysisId} />}
    </div>
  );
};

export default ImageUpload;
