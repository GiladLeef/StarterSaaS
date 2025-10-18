import { ReactNode } from 'react'

interface SplitAuthLayoutProps {
  children: ReactNode
  welcomeTitle: string
  welcomeSubtitle?: string
  highlightedWord?: string
}

export function SplitAuthLayout({ 
  children, 
  welcomeTitle,
  welcomeSubtitle,
  highlightedWord 
}: SplitAuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right side - Black panel with welcome message */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-center justify-center p-12 relative">
        {/* Logo in top left */}
        <div className="absolute top-12 left-12">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-2xl">S</span>
          </div>
        </div>

        {/* Welcome message */}
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6">
            {welcomeTitle}
          </h1>
          {welcomeSubtitle && (
            <p className="text-xl text-gray-400">
              {welcomeSubtitle.split(highlightedWord || '').map((part, idx, arr) => (
                <span key={idx}>
                  {part}
                  {idx < arr.length - 1 && highlightedWord && (
                    <span className="text-green-400 font-semibold">{highlightedWord}</span>
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

