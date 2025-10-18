"use client"

import { useRouter, usePathname } from "next/navigation"
import { useTransition } from "react"

export function useSmoothNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const navigate = (href: string) => {
    if (href === pathname) return
    
    startTransition(() => {
      router.push(href)
    })
  }

  return { navigate, isPending, currentPath: pathname }
}

