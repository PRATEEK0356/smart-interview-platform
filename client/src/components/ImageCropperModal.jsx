import React, { useState, useRef, useEffect } from 'react';
import { Crop, ZoomIn, ZoomOut, Check, X, RotateCcw } from 'lucide-react';

const ImageCropperModal = ({ imageSrc, onCropComplete, onCancel }) => {
  const [zoom, setZoom] = useState(1.0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [imageObj, setImageObj] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageObj(img);
      setZoom(1.0);
      setOffsetX(0);
      setOffsetY(0);
    };
  }, [imageSrc]);

  // Live Canvas Preview
  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const canvasWidth = 280;
    const canvasHeight = 280;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate scaled dimensions
    const scaledWidth = imageObj.width * zoom;
    const scaledHeight = imageObj.height * zoom;

    // Center image + offsets
    const drawX = (canvasWidth - scaledWidth) / 2 + offsetX;
    const drawY = (canvasHeight - scaledHeight) / 2 + offsetY;

    ctx.drawImage(imageObj, drawX, drawY, scaledWidth, scaledHeight);

    // Draw circular mask overlay
    ctx.save();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2 - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Darken outer bounds
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.arc(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2 - 8, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.restore();
  }, [imageObj, zoom, offsetX, offsetY]);

  const handleSaveCrop = () => {
    if (!imageObj) return;

    // Generate clean 300x300 cropped avatar JPEG
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 300;
    finalCanvas.height = 300;
    const ctx = finalCanvas.getContext('2d');

    const canvasWidth = 280;
    const canvasHeight = 280;

    const scaledWidth = imageObj.width * zoom;
    const scaledHeight = imageObj.height * zoom;

    const drawX = (canvasWidth - scaledWidth) / 2 + offsetX;
    const drawY = (canvasHeight - scaledHeight) / 2 + offsetY;

    // Map 280px preview canvas scale to 300px final avatar scale
    const scaleFactor = 300 / canvasWidth;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 300);

    ctx.drawImage(
      imageObj,
      drawX * scaleFactor,
      drawY * scaleFactor,
      scaledWidth * scaleFactor,
      scaledHeight * scaleFactor
    );

    const croppedDataUri = finalCanvas.toDataURL('image/jpeg', 0.90);
    onCropComplete(croppedDataUri);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white border-2 border-blue-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <div className="p-1.5 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-600">
              <Crop className="w-4 h-4" />
            </div>
            <span>Crop & Adjust Profile Photo</span>
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Crop Preview Area */}
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 border-blue-500 rounded-2xl overflow-hidden bg-slate-100 shadow-sm relative">
            <canvas ref={canvasRef} width={280} height={280} className="block cursor-move" />
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-2">
            Adjust sliders below to zoom and position your photo inside the circle.
          </p>
        </div>

        {/* Sliders & Controls */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span className="flex items-center space-x-1">
                <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Zoom Level</span>
              </span>
              <span className="font-mono text-blue-600">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="3.0"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Position Horizontal Pan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Position Horizontal (Pan Left / Right)</span>
              <span className="font-mono text-blue-600">{offsetX}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="2"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Position Vertical Pan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
              <span>Position Vertical (Pan Up / Down)</span>
              <span className="font-mono text-blue-600">{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-200"
              max="200"
              step="2"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setZoom(1.0);
                setOffsetX(0);
                setOffsetY(0);
              }}
              className="text-xs font-extrabold text-slate-600 hover:text-blue-600 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Adjustments</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="w-1/2 bg-white hover:bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl border-2 border-slate-200 transition-colors text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveCrop}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl border-2 border-blue-700 shadow-md flex items-center justify-center space-x-2 transition-all text-sm"
          >
            <Check className="w-4 h-4" />
            <span>Crop & Save Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
