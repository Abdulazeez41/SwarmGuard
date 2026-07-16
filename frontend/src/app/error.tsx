"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-white">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="text-sm uppercase tracking-[0.28em] text-white/46">SwarmGuard</div>
        <h1 className="mt-4 text-3xl font-semibold">Something interrupted the operating system.</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
          Try rebooting the interface. Backend integrations stay isolated behind the API client, so recovery should be immediate.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>Reboot Interface</Button>
        </div>
      </div>
    </main>
  );
}
