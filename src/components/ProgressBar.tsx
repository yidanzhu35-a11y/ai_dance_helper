import { useRef, useState, useEffect } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  isABLoopActive: boolean;
  markerA: number;
  markerB: number;
  onMarkerAChange: (value: number) => void;
  onMarkerBChange: (value: number) => void;
  onProgressChange: (percent: number) => void;
  formatTime: (seconds: number) => string;
}

export function ProgressBar({
  currentTime,
  duration,
  isABLoopActive,
  markerA,
  markerB,
  onMarkerAChange,
  onMarkerBChange,
  onProgressChange,
  formatTime,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingA, setIsDraggingA] = useState(false);
  const [isDraggingB, setIsDraggingB] = useState(false);

  const getPercentFromEvent = (event: React.MouseEvent | React.TouchEvent) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    return percent;
  };

  const handleProgressMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    if (isDraggingA || isDraggingB) return;
    setIsDraggingProgress(true);
    const percent = getPercentFromEvent(event);
    onProgressChange(percent);
  };

  const handleMarkerAMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    setIsDraggingA(true);
  };

  const handleMarkerBMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    setIsDraggingB(true);
  };

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    if (isDraggingProgress) {
      onProgressChange(percent);
    } else if (isDraggingA) {
      onMarkerAChange(Math.min(percent, markerB - 1));
    } else if (isDraggingB) {
      onMarkerBChange(Math.max(percent, markerA + 1));
    }
  };

  const handleMouseUp = () => {
    setIsDraggingProgress(false);
    setIsDraggingA(false);
    setIsDraggingB(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => handleMouseMove(e);
    const handleUp = () => handleMouseUp();

    if (isDraggingProgress || isDraggingA || isDraggingB) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleUp);
      };
    }
  }, [isDraggingProgress, isDraggingA, isDraggingB]);

  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="relative h-2 bg-pink-100 rounded-full cursor-pointer"
        onMouseDown={handleProgressMouseDown}
        onTouchStart={handleProgressMouseDown}
      >
        {/* A-B Loop Range */}
        {isABLoopActive && (
          <div
            className="absolute h-full bg-pink-200/50 rounded-full"
            style={{
              left: `${markerA}%`,
              width: `${markerB - markerA}%`,
            }}
          />
        )}

        {/* Progress Fill */}
        <div
          className="absolute h-full bg-pink-300 rounded-full transition-all"
          style={{ width: `${currentPercent}%` }}
        />

        {/* Progress Dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-pink-400 rounded-full shadow-md transition-all"
          style={{ left: `${currentPercent}%`, transform: 'translate(-50%, -50%)' }}
        />

        {/* Marker A - Droplet Shape */}
        {isABLoopActive && (
          <div
            className="absolute bottom-full cursor-grab active:cursor-grabbing z-10"
            style={{ left: `${markerA}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMarkerAMouseDown}
            onTouchStart={handleMarkerAMouseDown}
          >
            <div className="relative">
              {/* Droplet SVG - Flipped to point downward */}
              <svg
                width="28"
                height="36"
                viewBox="0 0 28 36"
                className="drop-shadow-md rotate-180"
              >
                <path
                  d="M14 0C14 0 0 12 0 20C0 26.6274 6.37258 32 14 32C21.6274 32 28 26.6274 28 20C28 12 14 0 14 0Z"
                  className={`transition-colors ${
                    isDraggingA ? 'fill-pink-300' : 'fill-pink-500'
                  }`}
                />
              </svg>
              {/* Label */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold">
                A
              </span>
            </div>
          </div>
        )}

        {/* Marker B - Droplet Shape */}
        {isABLoopActive && (
          <div
            className="absolute bottom-full cursor-grab active:cursor-grabbing z-10"
            style={{ left: `${markerB}%`, transform: 'translateX(-50%)' }}
            onMouseDown={handleMarkerBMouseDown}
            onTouchStart={handleMarkerBMouseDown}
          >
            <div className="relative">
              {/* Droplet SVG - Flipped to point downward */}
              <svg
                width="28"
                height="36"
                viewBox="0 0 28 36"
                className="drop-shadow-md rotate-180"
              >
                <path
                  d="M14 0C14 0 0 12 0 20C0 26.6274 6.37258 32 14 32C21.6274 32 28 26.6274 28 20C28 12 14 0 14 0Z"
                  className={`transition-colors ${
                    isDraggingB ? 'fill-pink-300' : 'fill-pink-500'
                  }`}
                />
              </svg>
              {/* Label */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold">
                B
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-xs text-pink-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
