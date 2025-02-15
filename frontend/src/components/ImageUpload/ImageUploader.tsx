import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

interface ImageUploaderProps {
  setImage: (img: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImage }) => {
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
    }
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const captured = webcamRef.current.getScreenshot();
      if (captured) setImage(captured);
    }
  }, [webcamRef, setImage]); 

  return (
    <div>
      <button onClick={() => setUseCamera(false)}>Upload Image</button>
      <button onClick={() => setUseCamera(true)}>Use Camera</button>
      {!useCamera && <input type="file" accept="image/*" onChange={handleFileChange} />}
      {useCamera && (
        <div>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          <button onClick={captureImage}>Capture Photo</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
