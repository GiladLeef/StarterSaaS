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
  // Determine if we should use light or dark text based on gradient color
  const lightGradients = ['lime', 'yellow', 'amber', 'orange']
  const useDarkText = lightGradients.includes(gradientFrom)
  
  const titleColor = useDarkText ? 'text-gray-900' : 'text-white'
  const descriptionColor = useDarkText ? 'text-gray-700' : 
    (gradientFrom === 'black' || gradientFrom === 'gray' ? 'text-gray-300' : `text-${gradientFrom}-100`)
  
  const buttonBgColor = buttonColor === 'white' ? 'bg-white' : `bg-${buttonColor}`
  const buttonTextColor = buttonColor === 'white' ? `text-${gradientFrom}-600` : 'text-white'
  const buttonHoverColor = buttonColor === 'white' ? 'hover:bg-gray-100' : `hover:bg-${buttonColor}-600`

  return (
    <div className={`border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-${gradientFrom}-600 to-${gradientTo}-800`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h4 className={`font-sans text-xl mb-2 ${titleColor}`}>{title}</h4>
      <p className={`text-sm ${descriptionColor} ${buttonText ? 'mb-4' : ''}`}>{description}</p>
      {buttonText && buttonHref && (
        <Button className={`w-full ${buttonBgColor} ${buttonTextColor} ${buttonHoverColor} rounded-full font-medium`} asChild>
          <a href={buttonHref}>{buttonText}</a>
        </Button>
      )}
    </div>
  )
}

