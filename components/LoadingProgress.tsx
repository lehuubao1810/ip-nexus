interface LoadingProgressProps {
  current: number;
  estimated: number;
}

export default function LoadingProgress({ current, estimated }: LoadingProgressProps) {
  const percentage = Math.min((current / estimated) * 100, 100);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md rounded-lg p-4 min-w-[300px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-100 text-sm font-medium">Loading edges</span>
          <span className="text-cyan-400 text-sm font-mono">
            {current} / {estimated}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-cyan-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
