// Global theme configuration for consistent styling

export const themeConfig = {
  // Color schemes
  colors: {
    light: {
      background: 'bg-white',
      text: 'text-black',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
    },
    dark: {
      background: 'bg-black',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-white/10',
      hover: 'hover:bg-white/5',
    }
  },

  // Typography
  typography: {
    h1: 'text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] tracking-tight font-serif',
    h2: 'text-4xl md:text-5xl font-serif',
    h3: 'text-2xl font-serif',
    h4: 'text-xl font-serif',
    body: 'text-base',
    bodyLarge: 'text-xl md:text-2xl',
    small: 'text-sm',
  },

  // Spacing
  spacing: {
    section: 'py-24',
    sectionSmall: 'py-16',
    sectionLarge: 'py-32',
    container: 'max-w-7xl mx-auto px-6',
  },

  // Component styles
  components: {
    card: {
      default: 'border border-gray-200 rounded-2xl p-8 hover:border-black/20 hover:shadow-lg transition-all duration-300',
      dark: 'border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors',
    },
    badge: {
      light: 'bg-black/5 border-gray-200',
      dark: 'bg-white/5 border-white/10',
    },
  },

  // Grid configurations
  grids: {
    2: 'grid gap-6 md:grid-cols-2',
    3: 'grid gap-8 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid gap-6 grid-cols-2 md:grid-cols-4',
    6: 'grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
  }
}

// Helper function to get theme classes
export function getThemeClasses(variant: 'light' | 'dark') {
  return themeConfig.colors[variant]
}

