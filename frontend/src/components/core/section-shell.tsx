import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    // Changed max-w-7xl to max-w-[1600px] and increased side padding
    <section
      className={cn(
        "mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-12",
        className,
      )}
    >
      <div className="mb-8 max-w-3xl">
        <Badge className="border-teal-400/20 bg-teal-500/10 text-teal-200">
          {eyebrow}
        </Badge>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-gradient-primary sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300/80 sm:text-lg">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
