"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      if (session) {
        setAuthenticated(true)
      } else if (pathname !== "/login") {
        router.replace("/login")
      }

      setLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      if (session) {
        setAuthenticated(true)
      } else if (pathname !== "/login") {
        setAuthenticated(false)
        router.replace("/login")
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pathname, router])

  if (loading) {
    return null
  }

  if (pathname === "/login") {
    return <>{children}</>
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}