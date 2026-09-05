import type { ReactNode } from "react"
import { BottomNav } from "@/components/bottom-nav"

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <div className="flex-1 pb-24">{children}</div>
      <BottomNav />
    </div>
  )
}
