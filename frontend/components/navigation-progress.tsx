"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export function NavigationProgress() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Start immediately on route change
    setIsNavigating(true)
    setProgress(70)

    // Quick completion
    const timer1 = setTimeout(() => setProgress(100), 150)
    const timer2 = setTimeout(() => {
      setIsNavigating(false)
      setProgress(0)
    }, 300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [pathname])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  )
}

