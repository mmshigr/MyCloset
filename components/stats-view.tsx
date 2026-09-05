"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { useCloset } from "@/components/closet-provider"
import { CATEGORIES, formatYen } from "@/lib/closet-data"

export function StatsView() {
  const { items } = useCloset()

  const stats = useMemo(() => {
    const owned = items.filter((i) => i.status === "所有中")
    const sold = items.filter((i) => i.status === "売却済み")
    const totalSpent = items.reduce((s, i) => s + i.purchasePrice, 0)
    const totalRecovered = sold.reduce((s, i) => s + (i.salePrice ?? 0), 0)
    const totalWears = items.reduce((s, i) => s + i.wearHistory.length, 0)

    const byCategory = CATEGORIES.map((c) => ({
      category: c,
      count: items.filter((i) => i.category === c).length,
    })).filter((c) => c.count > 0)
    const maxCat = Math.max(1, ...byCategory.map((c) => c.count))

    const mostWorn = [...items].sort((a, b) => b.wearHistory.length - a.wearHistory.length).slice(0, 3)

    return { owned, sold, totalSpent, totalRecovered, totalWears, byCategory, maxCat, mostWorn }
  }, [items])

  return (
    <div>
      <header className="px-5 pb-3 pt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Overview
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">統計</h1>
      </header>

      <div className="space-y-6 px-5 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <BigStat label="所有アイテム" value={`${stats.owned.length}`} unit="点" />
          <BigStat label="売却済み" value={`${stats.sold.length}`} unit="点" />
          <BigStat label="購入総額" value={formatYen(stats.totalSpent)} />
          <BigStat label="売却回収額" value={formatYen(stats.totalRecovered)} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            カテゴリ別
          </p>
          <div className="mt-4 space-y-3">
            {stats.byCategory.map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-foreground">{c.category}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{ width: `${(c.count / stats.maxCat) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            よく着ているアイテム
          </p>
          <div className="space-y-2">
            {stats.mostWorn.map((item, i) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 active:bg-secondary"
              >
                <span className="w-4 text-center text-lg font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.brand}</p>
                  <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                  {item.wearHistory.length}
                  <span className="text-xs text-muted-foreground"> 回</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <p className="pt-1 text-center text-xs text-muted-foreground">
          総着用回数 {stats.totalWears} 回
        </p>
      </div>
    </div>
  )
}

function BigStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-2xl font-medium leading-none text-foreground">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}
