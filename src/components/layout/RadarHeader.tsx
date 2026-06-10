export default function RadarHeader() {
  return (
    <div className="absolute top-4 left-4 z-1000 flex items-center gap-3 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-lg">
      <span className="animate-ping h-1.5 w-1.5 rounded-full bg-indigo-500"></span>

      <h1 className="text-[11px] font-bold tracking-wider text-slate-200 font-mono">WWN</h1>
    </div>
  );
}
