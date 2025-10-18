import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthFormWrapperProps {
  title: string
  subtitle: string
  alternateText: string
  alternateLink: string
  alternateLinkText: string
  children: ReactNode
}

export function AuthFormWrapper({
  title,
  subtitle,
  alternateText,
  alternateLink,
  alternateLinkText,
  children
}: AuthFormWrapperProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          {title}
        </h1>
        <p className="text-gray-500">
          {subtitle}
        </p>
        <div className="mt-2">
          <span className="text-sm text-gray-600">{alternateText} </span>
          <Link href={alternateLink} className="text-sm font-medium text-black underline-offset-4 hover:underline">
            {alternateLinkText}
          </Link>
        </div>
      </div>

      {children}
    </div>
  )
}

