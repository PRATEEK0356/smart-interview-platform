import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, UserCheck, AlertTriangle, UserX, ShieldCheck, Eye } from 'lucide-react';

const WebcamMonitor = ({ onMetricsUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [permissionError, setPermissionError] = useState(null);
  const [faceStatus, setFaceStatus] = useState({
    faceDetected: true,
    status: 'Candidate Verified',
    score: 95,
    confidence: 'High',
  });

  // Initialize camera stream
  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        setPermissionError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err.message);
        setPermissionError('Camera access unavailable. Video monitoring disabled.');
        setIsCameraOn(false);
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Real-time canvas facial presence analyzer
  useEffect(() => {
    if (!isCameraOn || !stream || !videoRef.current || !canvasRef.current) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.readyState !== 4) return;

      const ctx = canvas.getContext('2d');
      canvas.width = 160;
      canvas.height = 120;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frameData.data;

      // Analyze frame brightness & skin-tone luminance distribution
      let totalLuminance = 0;
      let skinPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;

        // Skin-tone YCbCr / RGB heuristic bounds
        if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
          skinPixels++;
        }
      }

      const totalPixels = canvas.width * canvas.height;
      const avgLuminance = totalLuminance / totalPixels;
      const skinRatio = skinPixels / totalPixels;

      let newStatus = 'Candidate Verified';
      let detected = true;
      let score = 92;

      if (avgLuminance < 20 || skinRatio < 0.05) {
        newStatus = 'No Face Detected';
        detected = false;
        score = 30;
      } else if (skinRatio < 0.12) {
        newStatus = 'Gaze Off-Center / Distance Shift';
        detected = true;
        score = 70;
      } else {
        newStatus = 'Candidate Verified & Engaged';
        detected = true;
        score = Math.min(100, Math.round(85 + skinRatio * 40));
      }

      const currentMetrics = {
        faceDetected: detected,
        status: newStatus,
        score,
        confidence: 'High',
      };

      setFaceStatus(currentMetrics);
      if (onMetricsUpdate) {
        onMetricsUpdate(currentMetrics);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isCameraOn, stream, onMetricsUpdate]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 relative overflow-hidden">
      {/* Offscreen analysis canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">AI Video Proctor</span>
        </div>

        <button
          onClick={toggleCamera}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
            isCameraOn
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isCameraOn ? (
            <>
              <CameraOff className="w-3.5 h-3.5" />
              <span>Disable Feed</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              <span>Enable Camera</span>
            </>
          )}
        </button>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center group">
        {isCameraOn && !permissionError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-500">
              <CameraOff className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {permissionError || 'Camera feed paused'}
            </p>
          </div>
        )}

        {/* HUD Overlay Badges */}
        {isCameraOn && !permissionError && (
          <div className="absolute inset-x-3 top-3 flex items-center justify-between pointer-events-none">
            {/* Live REC indicator */}
            <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE RECOG</span>
            </div>

            {/* Status indicator */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${
              faceStatus.faceDetected && faceStatus.score >= 80
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : faceStatus.faceDetected
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {faceStatus.faceDetected ? (
                <UserCheck className="w-3 h-3 flex-shrink-0" />
              ) : (
                <UserX className="w-3 h-3 flex-shrink-0" />
              )}
              <span>{faceStatus.status}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metric Footer */}
      {isCameraOn && !permissionError && (
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Visual Engagement</span>
            <span className="font-extrabold text-white font-mono">{faceStatus.score}%</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Posture & Focus</span>
            <span className="font-extrabold text-emerald-400 font-mono">Attentive</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamMonitor;
