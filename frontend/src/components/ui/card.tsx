import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border border-white/12 bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(34,211,238,0.04),rgba(255,255,255,0.02))] shadow-[0_28px_80px_rgba(5,8,22,0.6)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:border before:border-white/8 before:content-['']",
        "hover:border-white/18 transition-colors duration-300",
        className,
      )}
      {...props}
    />
  );
}
