import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "Command Console", href: "#command-console" },
    { label: "Workforce Graph", href: "#workforce" },
    { label: "Evaluation Engine", href: "#evaluation" },
    { label: "Audit Trail", href: "#audit" },
  ],
  platform: [
    { label: "How it works", href: "#" },
    { label: "Trust scores", href: "#" },
    { label: "Self-healing", href: "#" },
    { label: "Swarm memory", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Terms of service", href: "#" },
    { label: "Privacy policy", href: "#" },
    { label: "Security", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

function FooterLogo() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 shadow-[0_8px_30px_rgba(45,212,191,0.3)] backdrop-blur-sm border border-white/10">
        <div className="absolute inset-0 rounded-xl bg-[linear-gradient(135deg,#2dd4bf,#fbbf24)] blur-xl opacity-40" />
        <span className="relative text-sm font-bold bg-gradient-to-br from-teal-300 to-amber-300 bg-clip-text text-transparent">
          SG
        </span>
      </div>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="SwarmGuard Logo"
      width={40}
      height={40}
      className="rounded-xl object-cover shadow-[0_8px_30px_rgba(45,212,191,0.3)]"
      onError={() => setUseFallback(true)}
      unoptimized
    />
  );
}

export function Footer() {
  return (
    <footer className="relative mt-32 w-full border-t border-white/8 bg-[#020c17]/60 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.4),rgba(251,191,36,0.3),transparent)]" />
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-10 pt-16 lg:px-12">
        <div className="grid gap-10 border-b border-white/8 pb-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <FooterLogo />
              <div>
                <div className="text-sm font-semibold text-white">
                  SwarmGuard
                </div>
                <div className="text-xs text-white/50">
                  Autonomous Workforce OS
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300/80">
              The operating system for autonomous AI workforces. Describe a
              mission once - SwarmGuard recruits, evaluates, pays, and heals
              your agent teams automatically.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1.5 text-xs text-emerald-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                All systems operational
              </span>
              <span className="text-xs text-white/40">v1.0.0</span>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-teal-500/8 via-amber-500/4 to-transparent p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-teal-200/80">
              Stay in the loop
            </div>
            <div className="mt-3 text-lg font-medium text-white">
              Get early access to new workforce capabilities.
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300/80">
              Join the waitlist for enterprise features, trust scoring updates,
              and integration guides.
            </p>
            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@company.com"
                className="h-11 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/20"
              />
              <button
                type="submit"
                className="h-11 rounded-full bg-[linear-gradient(135deg,#2dd4bf,#10b981)] px-5 text-sm font-medium text-white shadow-[0_12px_40px_rgba(45,212,191,0.25)] transition hover:brightness-110"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Product
            </div>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300/80 transition hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Platform
            </div>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300/80 transition hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Company
            </div>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300/80 transition hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Legal
            </div>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300/80 transition hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} SwarmGuard Labs, Inc. All rights
            reserved.
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="GitHub"
              className="text-white/40 transition hover:text-teal-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.7.82.58C20.56 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-white/40 transition hover:text-teal-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-white/40 transition hover:text-teal-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Discord"
              className="text-white/40 transition hover:text-teal-300"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.32 4.37A19.8 19.8 0 0 0 15.43 3c-.2.36-.43.84-.59 1.22a18.3 18.3 0 0 0-5.68 0A12.7 12.7 0 0 0 8.57 3a19.7 19.7 0 0 0-4.9 1.37C.54 9.05-.33 13.6.1 18.1A19.9 19.9 0 0 0 6.18 21c.47-.64.89-1.32 1.25-2.04a12.9 12.9 0 0 1-1.97-.95c.17-.12.33-.25.49-.38a14.2 14.2 0 0 0 12.1 0c.16.13.32.26.49.38-.63.37-1.29.69-1.97.95.36.72.78 1.4 1.25 2.04a19.9 19.9 0 0 0 6.08-2.9c.52-5.22-.84-9.74-3.58-13.73zM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.2 0 2.17 1.09 2.15 2.42 0 1.34-.95 2.42-2.15 2.42zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.2 0 2.17 1.09 2.15 2.42 0 1.34-.94 2.42-2.15 2.42z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
