import { cn } from '@/lib/utils'

interface IntegrationGridProps {
  integrations: string[]
  columns?: 4 | 6
  className?: string
}

export function IntegrationGrid({ 
  integrations, 
  columns = 6,
  className = ''
}: IntegrationGridProps) {
  const gridCols = {
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {integrations.map((tool, idx) => (
        <div
          key={idx}
          className="border border-white/10 rounded-xl p-6 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300"
        >
          <span className="text-lg font-medium">{tool}</span>
        </div>
      ))}
    </div>
  )
}

