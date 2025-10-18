"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 transition-all duration-300 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }

