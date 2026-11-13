export function CloudBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-bg-base pointer-events-none">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-base via-bg-base to-bg-card opacity-90" />

      {/* Cloud Blob 1 (Accent/Blue) */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-accent/20 blur-[100px] md:blur-[150px] animate-blob" />

      {/* Cloud Blob 2 (Purple/Pink-ish for premium feel) */}
      <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-purple-500/10 blur-[100px] md:blur-[130px] animate-blob animation-delay-2000" />

      {/* Cloud Blob 3 (Teal/Cyan) */}
      <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-teal-500/10 blur-[100px] md:blur-[150px] animate-blob animation-delay-4000" />

      {/* Mesh Grid Overlay (Optional, for that techy look) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
    </div>
  );
}