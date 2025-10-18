import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardHeaderProps {
  title: string
  action?: React.ReactNode
}

export function DashboardHeader({ title, action }: DashboardHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-xl font-serif font-medium">{title}</h1>
        {action && <div className="ml-auto flex items-center gap-2">{action}</div>}
      </div>
    </header>
  )
}

