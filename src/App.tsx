import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, RotateCcw, Zap } from 'lucide-react';
import SpeedometerGauge from './components/SpeedometerGauge';
import CameraCapture from './components/CameraCapture';
import { analyzeBoredom } from './api/boredomAnalysis';

interface AnalysisResult {
  boredomPercentage: number;
  message: string;
  audioType: 'chill' | 'bruh' | 'coffin';
}

function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCameraCapture = useCallback((imageData: string) => {
    setCurrentImage(imageData);
    setShowCamera(false);
    setAnalysisResult(null);
  }, []);

  const analyzeImage = useCallback(async () => {
    if (!currentImage) return;

    setIsAnalyzing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await analyzeBoredom(currentImage);
      setAnalysisResult(result);
      
      // Play audio effect based on boredom level
      playAudioEffect(result.audioType);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentImage]);

  const playAudioEffect = (audioType: string) => {
    // In a real app, you'd load actual audio files
    // For demo purposes, we'll use Web Audio API to generate tones
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (audioType) {
      case 'chill':
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A note
        break;
      case 'bruh':
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A note (lower)
        break;
      case 'coffin':
        oscillator.frequency.setValueAtTime(110, audioContext.currentTime); // Very low note
        break;
    }

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const resetAnalysis = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setShowCamera(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #222 0px, #333 100%)'}}>
      {/* Wavy SVG Shape Top */}
      <svg className="absolute top-0 left-0 w-full h-32 opacity-40 pointer-events-none" viewBox="0 0 1440 320" fill="none">
        <path fill="#6EE7B7" fillOpacity="0.5" d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,122.7C672,107,768,85,864,101.3C960,117,1056,171,1152,186.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>
      {/* Wavy SVG Shape Bottom */}
      <svg className="absolute bottom-0 right-0 w-full h-32 opacity-40 pointer-events-none" viewBox="0 0 1440 320" fill="none">
        <path fill="#FBBF24" fillOpacity="0.5" d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,117.3C672,139,768,213,864,229.3C960,245,1056,203,1152,186.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
      {/* Emoji Overlay Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="emojis" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <text x="0" y="20" fontSize="20">😴</text>
            <text x="15" y="10" fontSize="20">🦥</text>
            <text x="10" y="28" fontSize="20">💀</text>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#emojis)" />
      </svg>
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.08) 0%, transparent 70%)'}} />
  <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            How Bored Are You in Class?
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-purple-200 animate-pulse">
            Are you bored by your teacher? Let's rate your being-bored skills! 🎯
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!showCamera && !currentImage && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-purple-100">
                Show Us Your Bored Face! 📸
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl border-2 border-transparent hover:border-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Upload className="w-12 h-12 group-hover:animate-bounce" />
                    <span className="text-xl font-semibold">Upload Image</span>
                    <span className="text-purple-200 text-center">
                      Got the perfect bored selfie? Upload it!
                    </span>
                  </div>
                </button>

                {/* Camera Button */}
                <button
                  onClick={() => setShowCamera(true)}
                  className="group relative p-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl border-2 border-transparent hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Camera className="w-12 h-12 group-hover:animate-pulse" />
                    <span className="text-xl font-semibold">Take Photo</span>
                    <span className="text-orange-200 text-center">
                      Strike a pose! Show us that bored energy!
                    </span>
                  </div>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Camera Component */}
          {showCamera && (
            <CameraCapture
              onCapture={handleCameraCapture}
              onClose={() => setShowCamera(false)}
            />
          )}

          {/* Image Preview and Analysis */}
          {currentImage && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Preview */}
                <div className="lg:w-1/2">
                  <div className="relative">
                    <img
                      src={currentImage}
                      alt="Your bored face"
                      className="w-full h-64 md:h-80 object-cover rounded-2xl border-4 border-purple-400/30 shadow-lg"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Analysis Section */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  {!analysisResult && !isAnalyzing && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4 text-purple-100">
                        Ready to Get Roasted? 🔥
                      </h3>
                      <button
                        onClick={analyzeImage}
                        className="group px-8 py-4 bg-gradient-to-r from-black to-blue-500 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center space-x-2">
                          <Zap className="w-6 h-6 group-hover:animate-spin" />
                          <span>Analyze My Boredom!</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-xl font-semibold text-purple-200 animate-pulse">
                        Analyzing your soul-crushing boredom... 🤖
                      </p>
                    </div>
                  )}

                  {analysisResult && (
                    <div className="text-center space-y-6">
                      <SpeedometerGauge percentage={analysisResult.boredomPercentage} />
                      <div className="bg-white/20 rounded-2xl p-6 border border-purple-400/30">
                        <p className="text-xl md:text-2xl font-bold text-purple-100 mb-2">
                          Boredom Level: {analysisResult.boredomPercentage}%
                        </p>
                        <p className="text-lg text-purple-200">
                          {analysisResult.message}
                        </p>
                      </div>
                      <button
                        onClick={resetAnalysis}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Try Again! 🔄
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-purple-300">
          <p className="text-lg">
            Made with 💜 for all the students suffering through boring lectures
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;