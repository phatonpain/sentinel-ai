export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing dot grid */}
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#00F0FF]"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                opacity: 0.3,
              }}
            />
          ))}
        </div>
        <span className="text-sm text-zinc-500 font-mono tracking-widest uppercase">
          Initializing Grid...
        </span>
      </div>
    </div>
  );
}
