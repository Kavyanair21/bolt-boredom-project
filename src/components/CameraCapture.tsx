import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip the image horizontally for selfie mode
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      setTimeout(() => {
        onCapture(imageData);
        stopCamera();
        setIsCapturing(false);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Strike a Bored Pose! 📸</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
            >
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Camera Preview */}
            <div className="relative mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-64 object-cover rounded-2xl bg-gray-900 transform scale-x-[-1]"
                style={{ filter: isCapturing ? 'brightness(1.5)' : 'none' }}
              />
              
              {isCapturing && (
                <div className="absolute inset-0 bg-white/50 rounded-2xl flex items-center justify-center">
                  <div className="animate-ping rounded-full h-16 w-16 bg-white"></div>
                </div>
              )}

              {/* Viewfinder overlay */}
              <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-2xl"></div>
            </div>

            {/* Instructions */}
            <p className="text-center text-purple-200 mb-6">
              Get ready to show us your most impressively bored expression! 😴
            </p>

            {/* Capture Button */}
            <div className="text-center">
              <button
                onClick={capturePhoto}
                disabled={isCapturing}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center space-x-2">
                  <Camera className={`w-6 h-6 ${isCapturing ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
                  <span>{isCapturing ? 'Capturing...' : 'Capture Boredom!'}</span>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraCapture;