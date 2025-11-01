import { FlipHorizontal2 } from 'lucide-react';

interface FloatingControlsProps {
  isABLoopActive: boolean;
  playbackSpeed: number;
  isMirrored: boolean;
  onABLoopToggle: () => void;
  onSpeedCycle: () => void;
  onMirrorToggle: () => void;
}

export function FloatingControls({
  isABLoopActive,
  playbackSpeed,
  isMirrored,
  onABLoopToggle,
  onSpeedCycle,
  onMirrorToggle,
}: FloatingControlsProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
      {/* A-B Loop Button */}
      <button
        onClick={onABLoopToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isABLoopActive
            ? 'bg-pink-400 text-white'
            : 'bg-pink-100 text-pink-400'
        }`}
      >
        <span className="text-sm">A–B</span>
      </button>

      {/* Speed Control Button */}
      <button
        onClick={onSpeedCycle}
        className="w-14 h-14 rounded-full bg-pink-100 text-pink-400 flex items-center justify-center shadow-lg hover:bg-pink-200 transition-all"
      >
        <span className="text-xs">×{playbackSpeed.toFixed(1)}</span>
      </button>

      {/* Mirror Button */}
      <button
        onClick={onMirrorToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isMirrored
            ? 'bg-pink-400 text-white'
            : 'bg-pink-100 text-pink-400'
        }`}
      >
        <FlipHorizontal2 className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
}
