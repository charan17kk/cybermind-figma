"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  logo?: React.ReactNode
  actionButtons?: React.ReactNode
}

export function NavBar({ items, className, logo, actionButtons }: NavBarProps) {
  const pathname = usePathname()

  // Find the active item based on current pathname
  const getActiveItem = () => {
    const activeItem = items.find(item => item.url === pathname)
    return activeItem ? activeItem.name : items[0].name
  }

  const activeTab = getActiveItem()

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-[80] pt-6 w-auto max-w-4xl",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-white border border-gray-100 py-3 px-5 rounded-full shadow-md min-w-fit hover:shadow-lg transition-shadow duration-200">
        {logo && (
          <div className="flex items-center justify-center mr-2">
            {logo}
          </div>
        )}
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-lg transition-all duration-300 overflow-hidden whitespace-nowrap",
                "text-foreground/80 hover:bg-white hover:shadow-lg hover:scale-102 hover:translate-x-0.5 hover:translate-y-0.5",
                isActive && "text-transparent bg-clip-text bg-gradient-to-b from-[#9A4AE8] via-[#8230DF] to-[#6B1BB3]",
              )}
            >
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          )
        })}
        {actionButtons && (
          <div className="ml-2">
            {actionButtons}
          </div>
        )}
      </div>
    </div>
  )
}
