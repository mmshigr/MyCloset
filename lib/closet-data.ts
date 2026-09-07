export type Category = "トップス" | "ボトムス" | "アウター" | "シューズ" | "アクセサリー"

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

export const CATEGORIES: Category[] = ["トップス", "ボトムス", "アウター", "シューズ", "アクセサリー"]

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

// Maps each wardrobe color name to a real swatch value for UI dots.
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

export const BRANDS: string[] = [
  "COMOLI",
  "AURALEE",
  "STUDIO NICHOLSON",
  "JOHN SMEDLEY",
  "Levi's",
  "LOOPWHEELER",
  "Paraboot",
  "Common Projects",
]

export const INITIAL_ITEMS: ClothingItem[] = [
  {
    id: "1",
    name: "コットン オックスフォード シャツ",
    brand: "COMOLI",
    productNumber: "V01-02001",
    description:
      "強撚コットンを高密度に織り上げたオックスフォード生地を使用したレギュラーカラーシャツ。程よい光沢とハリのある質感で、一枚でもレイヤードでも活躍する定番の一着。",
    category: "トップス",
    color: "ホワイト",
    image: "/items/oxford-shirt.png",
    purchasePrice: 24200,
    purchaseDate: "2024-03-12",
    status: "所有中",
    wearHistory: [
      { id: "w1", date: "2024-09-02" },
      { id: "w2", date: "2024-08-18" },
      { id: "w3", date: "2024-07-25" },
      { id: "w4", date: "2024-06-30", note: "友人の結婚式" },
    ],
  },
  {
    id: "2",
    name: "ワイド ウールトラウザー",
    brand: "AURALEE",
    category: "ボトムス",
    color: "ブラック",
    image: "/items/black-trousers.png",
    purchasePrice: 38500,
    purchaseDate: "2024-01-20",
    status: "所有中",
    wearHistory: [
      { id: "w5", date: "2024-08-28" },
      { id: "w6", date: "2024-08-05" },
      { id: "w7", date: "2024-05-14" },
    ],
  },
  {
    id: "3",
    name: "ウール オーバーコート",
    brand: "STUDIO NICHOLSON",
    category: "アウター",
    color: "ベージュ",
    image: "/items/beige-coat.png",
    purchasePrice: 96800,
    purchaseDate: "2023-11-08",
    status: "所有中",
    wearHistory: [
      { id: "w8", date: "2024-02-11" },
      { id: "w9", date: "2024-01-15" },
      { id: "w10", date: "2023-12-24", note: "クリスマスデート" },
    ],
  },
  {
    id: "4",
    name: "メリノウール クルーネックニット",
    brand: "JOHN SMEDLEY",
    productNumber: "A3607",
    description:
      "極薄ながら保温性に優れた30ゲージのメリノウールニット。上品な光沢と滑らかな肌触りが魅力で、ジャケットのインナーにも最適です。",
    category: "トップス",
    color: "ネイビー",
    image: "/items/navy-sweater.png",
    purchasePrice: 28600,
    purchaseDate: "2023-10-30",
    status: "所有中",
    wearHistory: [
      { id: "w11", date: "2024-03-20" },
      { id: "w12", date: "2024-02-28" },
    ],
  },
  {
    id: "5",
    name: "トラッカー デニムジャケット",
    brand: "Levi's",
    category: "アウター",
    color: "ブルー",
    image: "/items/denim-jacket.png",
    purchasePrice: 15400,
    purchaseDate: "2022-04-16",
    status: "売却済み",
    saleDate: "2024-05-02",
    salePrice: 8000,
    wearHistory: [
      { id: "w13", date: "2023-10-08" },
      { id: "w14", date: "2023-09-15" },
      { id: "w15", date: "2023-05-20" },
    ],
  },
  {
    id: "6",
    name: "吊り編み パーカー",
    brand: "LOOPWHEELER",
    category: "トップス",
    color: "グレー",
    image: "/items/gray-hoodie.png",
    purchasePrice: 19800,
    purchaseDate: "2024-02-14",
    status: "所有中",
    wearHistory: [
      { id: "w16", date: "2024-09-01" },
      { id: "w17", date: "2024-08-22" },
      { id: "w18", date: "2024-08-11" },
      { id: "w19", date: "2024-07-30" },
      { id: "w20", date: "2024-07-12" },
    ],
  },
  {
    id: "7",
    name: "ペニー ローファー",
    brand: "Paraboot",
    category: "シューズ",
    color: "ブラウン",
    image: "/items/leather-loafers.png",
    purchasePrice: 63800,
    purchaseDate: "2023-09-02",
    status: "所有中",
    wearHistory: [
      { id: "w21", date: "2024-08-15" },
      { id: "w22", date: "2024-04-10" },
    ],
  },
  {
    id: "8",
    name: "アキレス ロー スニーカー",
    brand: "Common Projects",
    category: "シューズ",
    color: "ホワイト",
    image: "/items/white-sneakers.png",
    purchasePrice: 52800,
    purchaseDate: "2024-05-18",
    status: "所有中",
    wearHistory: [
      { id: "w23", date: "2024-09-03" },
      { id: "w24", date: "2024-08-25" },
      { id: "w25", date: "2024-08-09" },
    ],
  },
]

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

export interface ProductLookupResult {
  name: string
  category: Category
  color: ClothingColor
  description: string
  suggestedPrice: number
  image?: string
  productUrl?: string
}

// Dummy "product catalog" keyed by BRAND + product number.
// In production this would call an external product-info API.
const PRODUCT_CATALOG: Record<string, ProductLookupResult> = {
  "COMOLI|V01-02001": {
    name: "コットン オックスフォード シャツ",
    category: "トップス",
    color: "ホワイト",
    description:
      "強撚コットンを高密度に織り上げたオックスフォード生地を使用したレギュラーカラーシャツ。程よい光沢とハリのある質感で、一枚でもレイヤードでも活躍する定番の一着。",
    suggestedPrice: 24200,
    image: "/items/oxford-shirt.png",
  },
  "AURALEE|A23AP01WT": {
    name: "ウール マックス ワイドトラウザー",
    category: "ボトムス",
    color: "ブラック",
    description:
      "オーストラリア産ウールを使用したワイドシルエットのトラウザー。とろみのある落ち感と美しいドレープが特徴で、上品なリラックス感を演出します。",
    suggestedPrice: 38500,
    image: "/items/black-trousers.png",
  },
  "JOHNSMEDLEY|A3607": {
    name: "メリノウール クルーネックニット",
    category: "トップス",
    color: "ネイビー",
    description:
      "英国製シーアイランドコットンに並ぶ名品、30ゲージのメリノウールニット。極薄ながら保温性に優れ、上品な光沢と滑らかな肌触りが魅力です。",
    suggestedPrice: 28600,
    image: "/items/navy-sweater.png",
  },
}

const FALLBACK_TEMPLATES: Array<{ category: Category; color: ClothingColor; name: string; description: string }> = [
  {
    category: "トップス",
    color: "ホワイト",
    name: "スタンダード シャツ",
    description: "上質な素材を使用したベーシックなアイテム。シンプルで着回しやすく、様々なスタイルに馴染みます。",
  },
  {
    category: "アウター",
    color: "ベージュ",
    name: "テーラード コート",
    description: "きれいめにもカジュアルにも合わせられる汎用性の高いアウター。丁寧な縫製と上品なシルエットが特徴です。",
  },
  {
    category: "シューズ",
    color: "ブラウン",
    name: "レザー シューズ",
    description: "履き込むほどに味が出る上質なレザーを使用。長く愛用できる普遍的なデザインです。",
  },
]

// Simulates an async lookup against an external product-info service.
export function lookupProduct(brand: string, productNumber: string): Promise<ProductLookupResult | null> {
  const key = `${brand.replace(/\s+/g, "").toUpperCase()}|${productNumber.replace(/\s+/g, "").toUpperCase()}`
  return new Promise((resolve) => {
    setTimeout(() => {
      if (PRODUCT_CATALOG[key]) {
        resolve(PRODUCT_CATALOG[key])
        return
      }
      if (!brand.trim() || !productNumber.trim()) {
        resolve(null)
        return
      }
      // Deterministic fallback so the same inputs always yield the same result.
      const seed = (brand.length + productNumber.length) % FALLBACK_TEMPLATES.length
      const t = FALLBACK_TEMPLATES[seed]
      resolve({
        name: `${brand.trim()} ${t.name}`,
        category: t.category,
        color: t.color,
        description: t.description,
        suggestedPrice: 10000 + ((productNumber.length * 3200) % 40000),
      })
    }, 900)
  })
}
