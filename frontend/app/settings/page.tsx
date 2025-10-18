"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to profile settings by default
    router.push('/settings/profile')
  }, [router])

  return null
}

