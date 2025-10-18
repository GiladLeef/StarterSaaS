import { ReactNode } from 'react'

interface MenuItemWithIcon {
  icon: ReactNode
  title: string
  desc: string
  href?: string
}

interface MenuItemSimple {
  title: string
  href: string
}

interface MenuColumnProps {
  title: string
  items: MenuItemWithIcon[] | MenuItemSimple[]
  variant?: 'icon' | 'simple'
}

function isIconItem(item: MenuItemWithIcon | MenuItemSimple): item is MenuItemWithIcon {
  return 'icon' in item
}

export function MenuColumn({ title, items, variant = 'icon' }: MenuColumnProps) {
  if (variant === 'simple') {
    return (
      <div>
        <h3 className="text-sm font-sans font-semibold text-black mb-4 uppercase tracking-wider">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx}>
              <a 
                href={(item as MenuItemSimple).href} 
                className="block p-2 rounded-lg hover:bg-gray-50 font-medium text-black transition-colors"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-sm font-sans font-semibold text-black mb-4 uppercase tracking-wider">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => {
          if (isIconItem(item)) {
            return (
              <li key={idx}>
                <a 
                  href={item.href || '#'} 
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 group-hover:text-black transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-black">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                  </div>
                </a>
              </li>
            )
          }
          return null
        })}
      </ul>
    </div>
  )
}

