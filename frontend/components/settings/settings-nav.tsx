import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { settingsSections } from '@/lib/data/settings-sections'

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {settingsSections.map((section) => {
        const isActive = pathname === section.href || pathname?.startsWith(section.href + '/')
        
        return (
          <Link
            key={section.id}
            href={section.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {section.icon}
            <div className="flex-1">
              <div className="font-medium">{section.title}</div>
              <div className="text-xs text-muted-foreground hidden md:block">
                {section.description}
              </div>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

