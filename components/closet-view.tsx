"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useCloset } from "@/components/closet-provider"
import { ItemCard } from "@/components/item-card"
import { ColorDot } from "@/components/color-dot"
import { CATEGORIES, COLORS, type Category, type ClothingColor } from "@/lib/closet-data"
import { cn } from "@/lib/utils"

type StatusFilter = "所有中" | "売却済み"

export function ClosetView() {
  const { items } = useCloset()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category | null>(null)
  const [colors, setColors] = useState<ClothingColor[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [status, setStatus] = useState<StatusFilter>("所有中")
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = colors.length + brands.length + (status !== "所有中" ? 1 : 0)

  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((item) => item.brand.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, "ja"))
  }, [items])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (query && !`${item.name} ${item.brand}`.toLowerCase().includes(query.toLowerCase()))
        return false
      if (category && item.category !== category) return false
      if (colors.length && !colors.includes(item.color)) return false
      if (brands.length && !brands.includes(item.brand)) return false
      // Sold items only appear when the "売却済み" status is explicitly selected.
      if (item.status !== status) return false
      return true
    })
  }, [items, query, category, colors, brands, status])

  function toggle<T>(value: T, list: T[], setList: (v: T[]) => void) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  function clearAll() {
    setColors([])
    setBrands([])
    setStatus("所有中")
  }

  return (
    <div>
      <header className="sticky top-0 z-30 bg-background/90 px-5 pb-3 pt-6 backdrop-blur-md">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              My Wardrobe
            </p>
            <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-foreground">
              CLOSET
            </h1>
          </div>
          <p className="pb-1 text-sm text-muted-foreground">
            <span className="text-lg font-medium text-foreground">{filtered.length}</span> 点
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="服・ブランドを検索"
              className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            aria-label="絞り込み"
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
              showFilters || activeCount
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-foreground",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] text-background ring-2 ring-background">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <div className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            すべて
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </header>

      {showFilters && (
        <div className="mx-5 mb-2 space-y-4 rounded-xl border border-border bg-card p-4">
          <FilterGroup label="ステータス">
            {(["所有中", "売却済み"] as StatusFilter[]).map((s) => (
              <Chip key={s} small active={status === s} onClick={() => setStatus(s)}>
                {s}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="カラー">
            {COLORS.map((c) => (
              <Chip key={c} small active={colors.includes(c)} onClick={() => toggle(c, colors, setColors)}>
                <ColorDot color={c} className="h-2.5 w-2.5" />
                {c}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="ブランド">
            {availableBrands.map((b) => (
              <Chip
                key={b}
                small
                active={brands.includes(b)}
                onClick={() => toggle(b, brands, setBrands)}
              >
                {b}
              </Chip>
            ))}
          </FilterGroup>

          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            >
              <X className="h-3 w-3" /> 絞り込みをクリア
            </button>
          )}
        </div>
      )}

      <div className="px-5 pt-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-muted-foreground">条件に合う服がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
  small,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors",
        small ? "px-3 py-1.5 text-xs" : "px-3.5 py-1.5 text-sm",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
