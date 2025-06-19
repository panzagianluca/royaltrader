"use client"

import * as React from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { Account } from "@/data/accounts";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
  dialogContent?: React.ReactNode
}

function NavMenuItems({ 
  items, 
  accounts,
  activeAccountId,
  onManageClick,
  onAccountClick,
}: { 
  items: NavItem[], 
  accounts: Account[],
  activeAccountId?: string,
  onManageClick?: () => void 
  onAccountClick?: (account: Account) => void
}) {
  return (
    <>
      {items.map((item) => {
        if (item.title === "Manage") {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} onClick={onManageClick}>
                <a href={item.url ?? "#"}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        const accountsToShow = accounts.filter(acc => acc.type === item.title.toLowerCase());

        const content = (
          <SidebarMenuButton asChild tooltip={item.title}>
            <a href={item.url ?? "#"}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        )

        if (item.dialogContent) {
          return (
            <SidebarMenuItem key={item.title}>
              <Dialog>
                <DialogTrigger asChild>{content}</DialogTrigger>
                <DialogContent>{item.dialogContent}</DialogContent>
              </Dialog>
            </SidebarMenuItem>
          )
        }

        return (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {content}
              {(item.items?.length || accountsToShow.length > 0) ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                      {accountsToShow.map((account) => (
                        <SidebarMenuSubItem key={account.id}>
                          <SidebarMenuSubButton 
                            data-cy={`account-item-${account.id}`}
                            className={account.id === activeAccountId ? "bg-muted text-accent-foreground" : ""}
                            onClick={() => onAccountClick?.(account)}>
                            <span>Account: {account.accountNumber}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        )
      })}
    </>
  )
}

export function NavMain({ 
  items, 
  accounts,
  activeAccountId,
  onManageClick,
  onAccountClick 
}: { 
  items: NavItem[], 
  accounts: Account[],
  activeAccountId?: string,
  onManageClick?: () => void,
  onAccountClick?: (account: Account) => void
}) {
  return (
    <SidebarGroup>
      {items.map((item) => (
        <React.Fragment key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarMenu>
            <NavMenuItems 
              items={item.items ?? []} 
              accounts={accounts}
              activeAccountId={activeAccountId}
              onManageClick={onManageClick} 
              onAccountClick={onAccountClick}
            />
          </SidebarMenu>
        </React.Fragment>
      ))}
    </SidebarGroup>
  )
}
