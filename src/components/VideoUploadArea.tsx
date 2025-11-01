import { Upload } from 'lucide-react';

interface VideoUploadAreaProps {
  onClick: () => void;
}

export function VideoUploadArea({ onClick }: VideoUploadAreaProps) {
  return (
    <button
      onClick={onClick}
      className="w-full aspect-[9/16] bg-white/50 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/70 transition-colors shadow-md"
    >
      <div className="w-24 h-24 rounded-full bg-gray-300/50 flex items-center justify-center">
        <Upload className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
      </div>
      <span className="text-pink-300">上传视频</span>
    </button>
  );
}
