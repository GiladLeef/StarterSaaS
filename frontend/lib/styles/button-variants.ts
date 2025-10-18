// Consistent button styles used across the application

export const buttonVariants = {
  // Primary action buttons (match landing page style)
  primary: 'bg-black text-white hover:bg-gray-800 rounded-full shadow-xl hover:shadow-2xl transition-all',
  
  // Secondary action buttons
  secondary: 'border-gray-300 rounded-full hover:bg-gray-50',
  
  // Dashboard buttons
  dashboardPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  dashboardOutline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  
  // Danger/destructive buttons
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  
  // CTA buttons (Call to Action - large, prominent)
  cta: 'bg-black text-white hover:bg-gray-800 rounded-full px-10 h-16 text-lg shadow-xl hover:shadow-2xl transition-shadow',
  ctaOutline: 'border-gray-300 rounded-full px-10 h-16 text-lg hover:bg-gray-50',
  
  // Dark theme variants
  darkCTA: 'bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 text-base',
  darkOutline: 'border-white/20 text-white hover:bg-white/10 rounded-full px-8',
}

export const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

// Consistent spacing and sizing
export const spacing = {
  section: 'py-24',
  sectionLarge: 'py-32',
  container: 'max-w-7xl mx-auto px-6',
  gap: {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }
}

