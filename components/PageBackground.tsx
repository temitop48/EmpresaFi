// components/PageBackground.tsx

/**
 * PageBackground creates the shared premium background used across EmpresaFi.
 *
 * It uses CSS gradients instead of image assets, keeping the interface
 * lightweight while still creating a distinct command-center atmosphere.
 */
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <div className="absolute left-[-10rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="absolute right-[-12rem] top-[10%] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute bottom-[-14rem] left-[35%] h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/10 blur-[160px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.3)_55%,rgba(5,8,22,0.95)_100%)]" />
    </div>
  );
}