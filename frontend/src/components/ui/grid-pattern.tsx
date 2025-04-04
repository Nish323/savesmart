"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [[1, 1]],
  className,
  ...props
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: [number, number][];
  className?: string;
}) {
  let patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(white,transparent)]",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares.map(([x, y], index) => (
        <rect
          key={index}
          width={width - 1}
          height={height - 1}
          x={x * width + 0.5}
          y={y * height + 0.5}
          className="fill-gray-100/30 stroke-none"
        />
      ))}
    </svg>
  );
}