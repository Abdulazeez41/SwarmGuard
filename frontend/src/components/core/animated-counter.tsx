"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
export function AnimatedCounter({
  value,
  duration = 2,
}: {
  value: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    // Parse the numeric value from the string
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
    const hasPrefix = value.startsWith("$");
    const hasSuffix = value.endsWith("M") || value.endsWith("%");
    const suffix = value.endsWith("M") ? "M" : value.endsWith("%") ? "%" : "";

    const controls = animate(count, numericValue, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        let formatted = Math.round(latest).toLocaleString();
        if (hasPrefix) formatted = `$${formatted}`;
        if (hasSuffix) formatted = `${formatted}${suffix}`;
        setDisplayValue(formatted);
      },
    });

    return () => controls.stop();
  }, [value, count, duration]);
  return <motion.span>{displayValue}</motion.span>;
}
