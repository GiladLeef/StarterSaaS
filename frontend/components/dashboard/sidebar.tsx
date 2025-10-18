"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: any
  items?: Array<{ title: string; url: string }>
}

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  title: string
  titleUrl: string
  icon: React.ReactNode
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: NavItem[]
  navSecondary: NavItem[]
}

export function DashboardSidebar({
  title,
  titleUrl,
  icon,
  user,
  navMain,
  navSecondary,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={titleUrl} prefetch={true}>
                {icon}
                <span className="text-base font-semibold">{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

