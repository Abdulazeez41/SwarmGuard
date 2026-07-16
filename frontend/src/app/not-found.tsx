import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-white">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="text-sm uppercase tracking-[0.28em] text-white/46">404</div>
        <h1 className="mt-4 text-3xl font-semibold">This route is outside the swarm perimeter.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">Return to the command console and launch the operating system again.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm text-white transition hover:bg-white/12">
          Back to SwarmGuard
        </Link>
      </div>
    </main>
  );
}
