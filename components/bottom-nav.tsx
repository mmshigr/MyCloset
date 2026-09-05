"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shirt, BarChart3, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "クローゼット", icon: Shirt },
  { href: "/stats", label: "統計", icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-background/90 backdrop-blur-md">
      <div className="grid grid-cols-3 items-center px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {tabs.slice(0, 1).map((tab) => (
          <NavItem key={tab.href} {...tab} active={pathname === tab.href} />
        ))}

        <div className="flex justify-center">
          <Link
            href="/add"
            aria-label="服を登録"
            className="flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/10 transition-transform active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </Link>
        </div>

        {tabs.slice(1).map((tab) => (
          <NavItem key={tab.href} {...tab} active={pathname === tab.href} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof Shirt
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 py-1 text-[10px] font-medium tracking-wide transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.7} />
      {label}
    </Link>
  )
}
