import { useState, useRef, useEffect } from 'react';
import { VideoUploadArea } from './components/VideoUploadArea';
import { FloatingControls } from './components/FloatingControls';
import { BottomControls } from './components/BottomControls';
import { ProgressBar } from './components/ProgressBar';
import { initializeVoiceInteraction, startVoiceInteraction, stopVoiceInteraction } from './voiceInteraction';

export default function App() {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isABLoopActive, setIsABLoopActive] = useState(false);
  const [markerA, setMarkerA] = useState(0);
  const [markerB, setMarkerB] = useState(100);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'recognizing'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // A-B loop logic
      if (isABLoopActive && duration > 0) {
        const timeA = (markerA / 100) * duration;
        const timeB = (markerB / 100) * duration;
        if (videoRef.current.currentTime >= timeB) {
          videoRef.current.currentTime = timeA;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setMarkerB(100);
    }
  };

  const handleProgressChange = (percent: number) => {
    if (videoRef.current && duration) {
      videoRef.current.currentTime = (percent / 100) * duration;
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  const toggleABLoop = () => {
    setIsABLoopActive(!isABLoopActive);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Initialize voice interaction system
  useEffect(() => {
    const controls = {
      play: () => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      restart: () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      },
      speedUp: () => {
        const speeds = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const nextSpeed = speeds[nextIndex];
        setPlaybackSpeed(nextSpeed);
        if (videoRef.current) {
          videoRef.current.playbackRate = nextSpeed;
        }
      },
      slowDown: () => {
        const speeds = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex - 1 + speeds.length) % speeds.length;
        const nextSpeed = speeds[nextIndex];
        setPlaybackSpeed(nextSpeed);
        if (videoRef.current) {
          videoRef.current.playbackRate = nextSpeed;
        }
      }
    };
    
    initializeVoiceInteraction(controls);
  }, [playbackSpeed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVoiceControl = () => {
    if (!isVoiceActive) {
      // Turn on voice control
      setIsVoiceActive(true);
      setVoiceStatus('listening');
      startVoiceInteraction();
    } else {
      // Turn off voice control
      setIsVoiceActive(false);
      setVoiceStatus('idle');
      stopVoiceInteraction();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[812px] bg-[#FFF5FA] relative flex flex-col">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Video Area */}
        <div className="flex-1 flex items-center justify-center px-4 pt-12 relative">
          {!videoFile ? (
            <VideoUploadArea onClick={handleUploadClick} />
          ) : (
            <>
              <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg">
                <video
                  ref={videoRef}
                  src={videoFile}
                  className="w-full h-full object-contain"
                  style={{
                    transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)',
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
              
              {/* Floating Controls */}
              <FloatingControls
                isABLoopActive={isABLoopActive}
                playbackSpeed={playbackSpeed}
                isMirrored={isMirrored}
                onABLoopToggle={toggleABLoop}
                onSpeedCycle={cycleSpeed}
                onMirrorToggle={toggleMirror}
              />
            </>
          )}
        </div>

        {/* Bottom Controls - only show when video is loaded */}
        {videoFile && (
          <div className="pb-8 px-4 space-y-4">
            <BottomControls
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onRewind={() => skipTime(-5)}
              onForward={() => skipTime(5)}
              isVoiceActive={isVoiceActive}
              onVoiceToggle={toggleVoiceControl}
              voiceStatus={voiceStatus}
            />
            
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              isABLoopActive={isABLoopActive}
              markerA={markerA}
              markerB={markerB}
              onMarkerAChange={setMarkerA}
              onMarkerBChange={setMarkerB}
              onProgressChange={handleProgressChange}
              formatTime={formatTime}
            />
          </div>
        )}
      </div>
    </div>
  );
}
