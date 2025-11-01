import { Mic, MicOff } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VoiceInteractionButtonProps {
  isVoiceActive: boolean;
  onToggle: () => void;
  status: 'idle' | 'listening' | 'recognizing';
}

export function VoiceInteractionButton({
  isVoiceActive,
  onToggle,
  status
}: VoiceInteractionButtonProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  // Request microphone permission when voice interaction is activated
  useEffect(() => {
    if (isVoiceActive && !permissionGranted) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setPermissionGranted(true);
        })
        .catch((error) => {
          console.error('Microphone permission denied:', error);
          // Turn off voice interaction if permission is denied
          onToggle();
        });
    }
  }, [isVoiceActive, permissionGranted, onToggle]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onToggle}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all ${
          isVoiceActive 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
        }`}
        aria-label={isVoiceActive ? "关闭语音控制" : "开启语音控制"}
      >
        {isVoiceActive ? (
          <Mic className="w-6 h-6" strokeWidth={2} />
        ) : (
          <MicOff className="w-6 h-6" strokeWidth={2} />
        )}
      </button>
      
      {/* Status indicator */}
      {isVoiceActive && (
        <div className="mt-2 text-xs text-center">
          {status === 'listening' && (
            <span className="text-blue-500 flex items-center">
              <span className="flex h-2 w-2 mr-1">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              监听中...
            </span>
          )}
          {status === 'recognizing' && (
            <span className="text-purple-500">识别中...</span>
          )}
        </div>
      )}
    </div>
  );
}