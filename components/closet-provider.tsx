"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { INITIAL_ITEMS, type ClothingItem, type WearEntry } from "@/lib/closet-data"

interface ClosetContextValue {
  items: ClothingItem[]
  getItem: (id: string) => ClothingItem | undefined
  addItem: (item: Omit<ClothingItem, "id" | "wearHistory">) => string
  logWear: (id: string, entry: Omit<WearEntry, "id">) => void
  markSold: (id: string, saleDate: string, salePrice: number) => void
}

const ClosetContext = createContext<ClosetContextValue | null>(null)

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>(INITIAL_ITEMS)

  const getItem = useCallback((id: string) => items.find((i) => i.id === id), [items])

  const addItem = useCallback((item: Omit<ClothingItem, "id" | "wearHistory">) => {
    const id = crypto.randomUUID()
    setItems((prev) => [{ ...item, id, wearHistory: [] }, ...prev])
    return id
  }, [])

  const logWear = useCallback((id: string, entry: Omit<WearEntry, "id">) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              wearHistory: [{ ...entry, id: crypto.randomUUID() }, ...i.wearHistory].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
              ),
            }
          : i,
      ),
    )
  }, [])

  const markSold = useCallback((id: string, saleDate: string, salePrice: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "売却済み", saleDate, salePrice } : i)),
    )
  }, [])

  return (
    <ClosetContext.Provider value={{ items, getItem, addItem, logWear, markSold }}>
      {children}
    </ClosetContext.Provider>
  )
}

export function useCloset() {
  const ctx = useContext(ClosetContext)
  if (!ctx) throw new Error("useCloset must be used within ClosetProvider")
  return ctx
}
