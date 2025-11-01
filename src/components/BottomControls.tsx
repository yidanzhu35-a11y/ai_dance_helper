import { RotateCcw, Play, Pause, RotateCw } from 'lucide-react';
import { VoiceInteractionButton } from './VoiceInteractionButton';

interface BottomControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRewind: () => void;
  onForward: () => void;
  isVoiceActive: boolean;
  onVoiceToggle: () => void;
  voiceStatus: 'idle' | 'listening' | 'recognizing';
}

export function BottomControls({
  isPlaying,
  onPlayPause,
  onRewind,
  onForward,
  isVoiceActive,
  onVoiceToggle,
  voiceStatus
}: BottomControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Rewind Button */}
      <button
        onClick={onRewind}
        className="w-16 h-16 rounded-2xl bg-pink-200/50 text-pink-400 flex items-center justify-center shadow-md hover:bg-pink-200 transition-all"
      >
        <RotateCcw className="w-6 h-6" strokeWidth={2} />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        className="w-20 h-20 rounded-2xl bg-pink-300 text-white flex items-center justify-center shadow-lg hover:bg-pink-400 transition-all"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" strokeWidth={2} fill="white" />
        ) : (
          <Play className="w-8 h-8 ml-1" strokeWidth={2} fill="white" />
        )}
      </button>

      {/* Forward Button */}
      <button
        onClick={onForward}
        className="w-16 h-16 rounded-2xl bg-pink-200/50 text-pink-400 flex items-center justify-center shadow-md hover:bg-pink-200 transition-all"
      >
        <RotateCw className="w-6 h-6" strokeWidth={2} />
      </button>
      
      {/* Voice Interaction Button */}
      <VoiceInteractionButton
        isVoiceActive={isVoiceActive}
        onToggle={onVoiceToggle}
        status={voiceStatus}
      />
    </div>
  );
}
