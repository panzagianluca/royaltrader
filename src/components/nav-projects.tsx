import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({
  title = "Projects",
  projects,
  navigateTo,
}: {
  title?: string
  projects: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
  navigateTo: (page: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              data-active={item.isActive}
              tooltip={item.name}
              onClick={() => navigateTo(item.url)}
            >
              <a href="#">
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
