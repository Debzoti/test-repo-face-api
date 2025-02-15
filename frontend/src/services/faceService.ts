// frontend/src/services/faceService.ts
import * as faceapi from 'face-api.js';

// Analyze skin tone using canvas sampling
export const analyzeSkinTone = async (
  img: HTMLImageElement,
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  const points = detection.landmarks.positions;
  const samples = [points[0], points[30], points[40]]; // e.g. forehead, nose tip, cheek
  
  let r = 0, g = 0, b = 0;
  samples.forEach(point => {
    const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
    r += pixel[0];
    g += pixel[1];
    b += pixel[2];
  });
  
  r = Math.round(r / samples.length);
  g = Math.round(g / samples.length);
  b = Math.round(b / samples.length);
  
  return categorizeSkinTone(r, g, b);
};

const categorizeSkinTone = (r: number, g: number, b: number): string => {
  const brightness = (r + g + b) / 3;
  if (brightness > 200) return 'Very Light';
  if (brightness > 150) return 'Light';
  if (brightness > 100) return 'Medium';
  if (brightness > 50) return 'Dark';
  return 'Very Dark';
};

// Classify face shape using landmarks (simplistic example)
export const classifyFaceShape = (landmarks: faceapi.FaceLandmarks68): string => {
  const points = landmarks.positions;
  const jawWidth = points[16].x - points[0].x;
  const faceHeight = points[8].y - points[24].y;
  const ratio = jawWidth / faceHeight;
  if (ratio > 1.3) return 'Square';
  if (ratio > 1.1) return 'Oval';
  if (ratio < 0.9) return 'Round';
  return 'Oblong';
};

// Enhanced glasses detection (see previous implementation)
export const detectGlasses = async (
  img: HTMLImageElement,
  landmarks: faceapi.FaceLandmarks68
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Cannot get canvas context'));
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
  
    const getBoundingBox = (points: faceapi.Point[]) => {
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      return {
        minX: Math.min(...xs),
        maxX: Math.max(...xs),
        minY: Math.min(...ys),
        maxY: Math.max(...ys),
      };
    };
  
    const expandBox = (box: { minX: number; maxX: number; minY: number; maxY: number }, padding: number) => ({
      minX: Math.max(0, box.minX - padding),
      maxX: box.maxX + padding,
      minY: Math.max(0, box.minY - padding),
      maxY: box.maxY + padding,
    });
  
    const leftBox = expandBox(getBoundingBox(leftEye), 5);
    const rightBox = expandBox(getBoundingBox(rightEye), 5);
  
    const leftEyeData = ctx.getImageData(
      leftBox.minX,
      leftBox.minY,
      leftBox.maxX - leftBox.minX,
      leftBox.maxY - leftBox.minY
    );
    const rightEyeData = ctx.getImageData(
      rightBox.minX,
      rightBox.minY,
      rightBox.maxX - rightBox.minX,
      rightBox.maxY - rightBox.minY
    );
  
    const computeEdgeScore = (imageData: ImageData): number => {
      const { data, width, height } = imageData;
      let score = 0, count = 0;
      for (let y = 0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          const idxRight = (y * width + (x + 1)) * 4;
          const idxDown = ((y + 1) * width + x) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          const intensityRight = (data[idxRight] + data[idxRight + 1] + data[idxRight + 2]) / 3;
          const intensityDown = (data[idxDown] + data[idxDown + 1] + data[idxDown + 2]) / 3;
          const dx = Math.abs(intensity - intensityRight);
          const dy = Math.abs(intensity - intensityDown);
          const gradient = Math.sqrt(dx * dx + dy * dy);
          score += gradient;
          count++;
        }
      }
      return count > 0 ? score / count : 0;
    };
  
    const leftEdgeScore = computeEdgeScore(leftEyeData);
    const rightEdgeScore = computeEdgeScore(rightEyeData);
    const averageEdgeScore = (leftEdgeScore + rightEdgeScore) / 2;
    const threshold = 15;
    resolve(averageEdgeScore > threshold);
  });
};
