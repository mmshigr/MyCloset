"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

import {
  type ClothingItem,
  type WearEntry,
} from "@/lib/closet-data"
import { supabase } from "@/lib/supabase"

interface ClosetContextValue {
  items: ClothingItem[]
  getItem: (id: string) => ClothingItem | undefined
  addItem: (item: Omit<ClothingItem, "id" | "wearHistory">) => Promise<string>
  updateItem: (
    id: string,
    item: Partial<Omit<ClothingItem, "id" | "wearHistory">>,
  ) => Promise<void>
  logWear: (id: string, entry: Omit<WearEntry, "id">) => Promise<void>
  deleteWear: (itemId: string, wearId: string) => Promise<void>
  markSold: (id: string, saleDate: string, salePrice: number) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

const ClosetContext = createContext<ClosetContextValue | null>(null)

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>([])

  // Supabaseから服一覧と着用履歴を取得
  useEffect(() => {
    async function loadItems() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
  
      // 未ログインならDBを取得しない
      if (!session) {
        return
      }
  
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false })
  
      if (itemError) {
        console.error("Failed to load items:", itemError)
        return
      }
  
      const { data: wearData, error: wearError } = await supabase
        .from("wear_entries")
        .select("*")
        .order("date", { ascending: false })
  
      if (wearError) {
        console.error("Failed to load wear entries:", wearError)
        return
      }
  
      const convertedItems: ClothingItem[] = (itemData ?? []).map((item) => ({
        id: String(item.id),
        name: item.name,
        brand: item.brand ?? "",
        productNumber: item.product_code ?? undefined,
        productUrl: item.product_url ?? undefined,
        description: item.description ?? undefined,
        categoryGroup: item.category_group,
        category: item.category_detail,
        color: item.color,
        image: item.image ?? "",
        purchasePrice: item.purchase_price ?? 0,
        purchaseDate: item.purchase_date ?? "",
        status: item.status,
        saleDate: item.sale_date ?? undefined,
        salePrice: item.sale_price ?? undefined,
        wearHistory: (wearData ?? [])
          .filter((wear) => String(wear.item_id) === String(item.id))
          .map((wear) => ({
            id: String(wear.id),
            date: wear.date,
            note: wear.note ?? undefined,
          })),
      }))
  
      setItems(convertedItems)
    }
  
    loadItems()
  }, [])

  const getItem = useCallback(
    (id: string) => items.find((i) => i.id === id),
    [items],
  )

  const addItem = useCallback(
    async (item: Omit<ClothingItem, "id" | "wearHistory">) => {
      const { data, error } = await supabase
        .from("items")
        .insert({
          brand: item.brand,
          product_code: item.productNumber ?? null,
          name: item.name,
          category_group: item.categoryGroup,
          category_detail: item.category,
          color: item.color,
          image: item.image,
          purchase_price: item.purchasePrice,
          purchase_date: item.purchaseDate,
          status: item.status,
          description: item.description ?? null,
          product_url: item.productUrl ?? null,
        })
        .select("id")
        .single()

      if (error) {
        console.error("Failed to add item:", error)
        throw error
      }

      const newItem: ClothingItem = {
        ...item,
        id: String(data.id),
        wearHistory: [],
      }

      setItems((prev) => [newItem, ...prev])

      return String(data.id)
    },
    [],
  )

  const logWear = useCallback(
    async (id: string, entry: Omit<WearEntry, "id">) => {
      const { data, error } = await supabase
        .from("wear_entries")
        .insert({
          item_id: Number(id),
          date: entry.date,
          note: entry.note ?? null,
        })
        .select("id")
        .single()

      if (error) {
        console.error("Failed to log wear:", error)
        throw error
      }

      const newEntry: WearEntry = {
        ...entry,
        id: String(data.id),
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                wearHistory: [newEntry, ...item.wearHistory].sort(
                  (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime(),
                ),
              }
            : item,
        ),
      )
    },
    [],
  )

  const deleteWear = useCallback(
    async (itemId: string, wearId: string) => {
      const { error } = await supabase
        .from("wear_entries")
        .delete()
        .eq("id", Number(wearId))
        .eq("item_id", Number(itemId))

      if (error) {
        console.error("Failed to delete wear entry:", error)
        throw error
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                wearHistory: item.wearHistory.filter(
                  (entry) => entry.id !== wearId,
                ),
              }
            : item,
        ),
      )
    },
    [],
  )

  const markSold = useCallback(
    async (id: string, saleDate: string, salePrice: number) => {
      const { error } = await supabase
        .from("items")
        .update({
          status: "売却済み",
          sale_date: saleDate,
          sale_price: salePrice,
        })
        .eq("id", Number(id))

      if (error) {
        console.error("Failed to mark item as sold:", error)
        throw error
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "売却済み",
                saleDate,
                salePrice,
              }
            : item,
        ),
      )
    },
    [],
  )

  const updateItem = useCallback(
    async (
      id: string,
      updates: Partial<Omit<ClothingItem, "id" | "wearHistory">>,
    ) => {
      const dbUpdates: Record<string, unknown> = {}

      if (updates.brand !== undefined) {
        dbUpdates.brand = updates.brand
      }

      if (updates.productNumber !== undefined) {
        dbUpdates.product_code = updates.productNumber || null
      }

      if (updates.name !== undefined) {
        dbUpdates.name = updates.name
      }

      if (updates.categoryGroup !== undefined) {
        dbUpdates.category_group = updates.categoryGroup
      }
      
      if (updates.category !== undefined) {
        dbUpdates.category_detail = updates.category
      }

      if (updates.color !== undefined) {
        dbUpdates.color = updates.color
      }

      if (updates.image !== undefined) {
        dbUpdates.image = updates.image || null
      }

      if (updates.purchasePrice !== undefined) {
        dbUpdates.purchase_price = updates.purchasePrice
      }

      if (updates.purchaseDate !== undefined) {
        dbUpdates.purchase_date = updates.purchaseDate
      }

      if (updates.salePrice !== undefined) {
        dbUpdates.sale_price = updates.salePrice ?? null
      }

      if (updates.saleDate !== undefined) {
        dbUpdates.sale_date = updates.saleDate ?? null
      }

      if (updates.status !== undefined) {
        dbUpdates.status = updates.status
      }

      if (updates.productUrl !== undefined) {
        dbUpdates.product_url = updates.productUrl || null
      }

      if (updates.description !== undefined) {
        dbUpdates.description = updates.description || null
      }

      const { error } = await supabase
        .from("items")
        .update(dbUpdates)
        .eq("id", Number(id))

      if (error) {
        console.error("Failed to update item:", error)
        throw error
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
              }
            : item,
        ),
      )
    },
    [],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      // 削除対象のアイテムを取得
      const item = items.find((item) => item.id === id)
  
      if (!item) {
        throw new Error("Item not found")
      }
  
      // Storageに保存された画像がある場合は削除
      if (item.image) {
        try {
          const imageUrl = new URL(item.image)
          const marker = "/storage/v1/object/public/closet-images/"
  
          if (imageUrl.pathname.includes(marker)) {
            const filePath = imageUrl.pathname.split(marker)[1]
  
            if (filePath) {
              const decodedPath = decodeURIComponent(filePath)
  
              console.log("STORAGE DELETE PATH:", decodedPath)
  
              // Storage上のファイルを確認
              const folderPath = decodedPath.substring(
                0,
                decodedPath.lastIndexOf("/"),
              )
  
              const fileName = decodedPath.substring(
                decodedPath.lastIndexOf("/") + 1,
              )
  
              const { data: files, error: listError } =
                await supabase.storage
                  .from("closet-images")
                  .list(folderPath)
  
              console.log("STORAGE LIST RESULT:", files)
              console.log("STORAGE LIST ERROR:", listError)
  
              const targetFile = files?.find(
                (file) => file.name === fileName,
              )
  
              console.log("STORAGE TARGET FILE:", targetFile)
  
              if (targetFile) {
                const { data: deleteData, error: deleteError } =
                  await supabase.storage
                    .from("closet-images")
                    .remove([decodedPath])
  
                console.log(
                  "STORAGE DELETE RESULT:",
                  deleteData,
                )
                console.log(
                  "STORAGE DELETE ERROR:",
                  deleteError,
                )
  
                if (deleteError) {
                  console.error(
                    "Failed to delete image from Storage:",
                    deleteError,
                  )
                }
              } else {
                console.log(
                  "STORAGE FILE NOT FOUND:",
                  decodedPath,
                )
              }
            }
          }
        } catch (error) {
          console.error(
            "Failed to process image URL:",
            error,
          )
        }
      }
  
      // DBからアイテムを削除
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", Number(id))
  
      if (error) {
        console.error("Failed to delete item:", error)
        throw error
      }
  
      setItems((prev) =>
        prev.filter((item) => item.id !== id),
      )
    },
    [items],
  )
  
  return (
    <ClosetContext.Provider
    value={{
      items,
      getItem,
      addItem,
      updateItem,
      logWear,
      deleteWear,
      markSold,
      deleteItem,
    }}
    >
      {children}
    </ClosetContext.Provider>
  )
}

export function useCloset() {
  const ctx = useContext(ClosetContext)

  if (!ctx) {
    throw new Error("useCloset must be used within ClosetProvider")
  }

  return ctx
}