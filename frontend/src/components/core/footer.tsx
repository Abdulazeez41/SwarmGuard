export function Footer() {
  return (
    <footer className="mx-auto mt-28 w-full max-w-7xl px-4 pb-14 pt-10 text-sm text-slate-400 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-white">SwarmGuard</div>
          <p className="mt-2 max-w-xl leading-6 text-slate-300">
            The operating system for autonomous AI workforces: planning, recruiting, evaluating, paying, learning, and healing — from one command surface.
          </p>
        </div>
        <div className="text-slate-400">Built with Next.js, TypeScript, Tailwind, Framer Motion, React Flow, Recharts, TanStack Query, Zustand, and shadcn-style primitives.</div>
      </div>
    </footer>
  );
}
