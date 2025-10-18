import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface FeatureBlockProps {
  icon: string
  title: string
  description: string
  buttonText?: string
  buttonHref?: string
  gradientFrom: string
  gradientTo: string
  buttonColor?: string
}

export function FeatureBlock({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
  gradientFrom,
  gradientTo,
  buttonColor = 'white'
}: FeatureBlockProps) {
  // Map gradient colors to appropriate text colors for visibility
  const colorMap: Record<string, { title: string; description: string; bg: string; buttonText: string }> = {
    'purple': { title: 'text-white', description: 'text-purple-100', bg: 'bg-gradient-to-br from-purple-600 to-purple-800', buttonText: 'text-purple-600' },
    'blue': { title: 'text-white', description: 'text-blue-100', bg: 'bg-gradient-to-br from-blue-600 to-blue-800', buttonText: 'text-blue-600' },
    'black': { title: 'text-white', description: 'text-gray-300', bg: 'bg-gradient-to-br from-black to-gray-800', buttonText: 'text-black' },
    'orange': { title: 'text-gray-900', description: 'text-orange-800', bg: 'bg-gradient-to-br from-orange-600 to-orange-800', buttonText: 'text-orange-600' },
    'pink': { title: 'text-white', description: 'text-pink-100', bg: 'bg-gradient-to-br from-pink-600 to-pink-800', buttonText: 'text-pink-600' },
    'indigo': { title: 'text-white', description: 'text-indigo-100', bg: 'bg-gradient-to-br from-indigo-600 to-indigo-800', buttonText: 'text-indigo-600' },
    'violet': { title: 'text-white', description: 'text-violet-100', bg: 'bg-gradient-to-br from-violet-600 to-violet-800', buttonText: 'text-violet-600' },
    'lime': { title: 'text-gray-900', description: 'text-lime-800', bg: 'bg-gradient-to-br from-lime-600 to-lime-800', buttonText: 'text-lime-600' },
    'green': { title: 'text-white', description: 'text-green-100', bg: 'bg-gradient-to-br from-green-600 to-green-800', buttonText: 'text-green-600' },
  }

  const colors = colorMap[gradientFrom] || colorMap['purple']
  const buttonBgColor = buttonColor === 'white' ? 'bg-white' : `bg-${buttonColor}`
  const buttonTextColor = buttonColor === 'white' ? colors.buttonText : 'text-white'
  const buttonHoverColor = buttonColor === 'white' ? 'hover:bg-gray-100' : `hover:bg-${buttonColor}-600`

  return (
    <div className={`border border-gray-200 rounded-xl p-6 ${colors.bg}`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className={`font-sans text-xl mb-2 ${colors.title}`}>{title}</h4>
      <p className={`text-sm ${colors.description} ${buttonText ? 'mb-4' : ''}`}>{description}</p>
      {buttonText && buttonHref && (
        <Button className={`w-full ${buttonBgColor} ${buttonTextColor} ${buttonHoverColor} rounded-full font-medium`} asChild>
          <a href={buttonHref}>{buttonText}</a>
        </Button>
      )}
    </div>
  )
}

