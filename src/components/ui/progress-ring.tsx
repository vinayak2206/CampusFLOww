"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.SVGProps<SVGSVGElement> {
  value?: number
  size?: number
  strokeWidth?: number
}

const Progress = React.forwardRef<SVGSVGElement, ProgressProps>(
  ({ className, value = 0, size = 100, strokeWidth = 10, ...props }, ref) => {
    const validValue = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
    const r = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * r
    const offset = circumference - (validValue / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn("-rotate-90", className)}
          {...props}
        >
          <circle
            className="text-muted"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={r}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={r}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.35s",
            }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {/* {Math.round(validValue)}% */}
        </span>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
