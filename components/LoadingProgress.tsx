export function LoadingProgress() {
  return (
    <div className="absolute bottom-4 left-4 z-50 flex items-center gap-3 bg-[#050510]/90 border border-cyan-500/30 px-4 py-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
      <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-cyan-100 font-mono text-sm">Loading edges...</span>
    </div>
  );
}
