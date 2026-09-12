export type CategoryGroup =
  | "TOPS"
  | "BOTTOMS"
  | "OUTERWEAR"
  | "SHOES"
  | "BAGS"
  | "ACCESSORIES"

export type Category =
  // TOPS
  | "S/S T-Shirts"
  | "L/S T-Shirts"
  | "S/S Shirts"
  | "L/S Shirts"
  | "Knitwear"
  | "Sweatshirts"
  | "Hoodies"
  | "Polos"
  | "Tank Tops"
  // BOTTOMS
  | "Denim"
  | "Trousers"
  | "Chinos"
  | "Cargo Pants"
  | "Shorts"
  | "Other Pants"
  // OUTERWEAR
  | "Tailored Jackets"
  | "Blousons"
  | "Coats"
  | "Down & Insulated"
  | "Vests"
  | "Other Outerwear"
  // SHOES
  | "Sneakers"
  | "Leather Shoes"
  | "Boots"
  | "Sandals"
  | "Other Shoes"
  // BAGS
  | "Tote Bags"
  | "Shoulder Bags"
  | "Backpacks"
  | "Other Bags"
  // ACCESSORIES
  | "Headwear"
  | "Belts"
  | "Necklaces"
  | "Bracelets"
  | "Rings"
  | "Other Accessories"

export type ClothingColor =
  | "ホワイト"
  | "ブラック"
  | "グレー"
  | "ネイビー"
  | "ブルー"
  | "グリーン"
  | "ベージュ"
  | "ブラウン"
  | "イエロー"
  | "マルチ"
  | "その他"

export type ItemStatus = "所有中" | "売却済み"

export interface WearEntry {
  id: string
  date: string
  note?: string
}

export interface ClothingItem {
  id: string
  name: string
  brand: string
  productNumber?: string
  description?: string
  categoryGroup: CategoryGroup
  category: Category
  color: ClothingColor
  image: string
  purchasePrice: number
  purchaseDate: string
  status: ItemStatus
  saleDate?: string
  salePrice?: number
  wearHistory: WearEntry[]
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  "TOPS",
  "BOTTOMS",
  "OUTERWEAR",
  "SHOES",
  "BAGS",
  "ACCESSORIES",
]

export const CATEGORIES_BY_GROUP: Record<CategoryGroup, Category[]> = {
  TOPS: [
    "S/S T-Shirts",
    "L/S T-Shirts",
    "S/S Shirts",
    "L/S Shirts",
    "Knitwear",
    "Sweatshirts",
    "Hoodies",
    "Polos",
    "Tank Tops",
  ],
  BOTTOMS: [
    "Denim",
    "Trousers",
    "Chinos",
    "Cargo Pants",
    "Shorts",
    "Other Pants",
  ],
  OUTERWEAR: [
    "Tailored Jackets",
    "Blousons",
    "Coats",
    "Down & Insulated",
    "Vests",
    "Other Outerwear",
  ],
  SHOES: [
    "Sneakers",
    "Leather Shoes",
    "Boots",
    "Sandals",
    "Other Shoes",
  ],
  BAGS: [
    "Tote Bags",
    "Shoulder Bags",
    "Backpacks",
    "Other Bags",
  ],
  ACCESSORIES: [
    "Headwear",
    "Belts",
    "Necklaces",
    "Bracelets",
    "Rings",
    "Other Accessories",
  ],
}

export const CATEGORIES: Category[] = Object.values(CATEGORIES_BY_GROUP).flat()

export const COLORS: ClothingColor[] = [
  "ホワイト",
  "ブラック",
  "グレー",
  "ネイビー",
  "ブルー",
  "グリーン",
  "ベージュ",
  "ブラウン",
  "イエロー",
  "マルチ",
  "その他",
]

export const COLOR_SWATCH: Record<ClothingColor, string> = {
  ホワイト: "oklch(0.97 0 0)",
  ブラック: "oklch(0.22 0 0)",
  グレー: "oklch(0.72 0 0)",
  ネイビー: "oklch(0.35 0.06 260)",
  ブルー: "oklch(0.3 0.06 240)",
  グリーン: "oklch(0.35 0.06 120)",
  ベージュ: "oklch(0.86 0.03 80)",
  ブラウン: "oklch(0.5 0.07 55)",
  イエロー: "oklch(0.8 0.15 90)",
  マルチ: "oklch(0.7 0.05 0)",
  その他: "oklch(0.55 0.02 0)",
}

export function formatYen(value: number): string {
  return "¥" + value.toLocaleString("ja-JP")
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function formatDateShort(date: string): string {
  const d = new Date(date)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}