"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Plus,
  ShoppingBag,
  Check,
  ExternalLink,
} from "lucide-react"

import { useCloset } from "@/components/closet-provider"
import { ColorDot } from "@/components/color-dot"
import { formatYen, formatDate, formatDateShort } from "@/lib/closet-data"

const today = () => new Date().toISOString().slice(0, 10)

export function ItemDetailView({ id }: { id: string }) {
  const router = useRouter()

  const { getItem, logWear, markSold, deleteItem } = useCloset()

  const item = getItem(id)

  const [wearOpen, setWearOpen] = useState(false)
  const [wearDate, setWearDate] = useState(today())
  const [wearNote, setWearNote] = useState("")

  const [sellOpen, setSellOpen] = useState(false)
  const [saleDate, setSaleDate] = useState(today())
  const [salePrice, setSalePrice] = useState("")

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  if (!item) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-sm text-muted-foreground">
          アイテムが見つかりません
        </p>

        <Link
          href="/"
          className="text-sm font-medium underline underline-offset-4"
        >
          クローゼットに戻る
        </Link>
      </div>
    )
  }

  const sold = item.status === "売却済み"

  const gainLoss =
    item.salePrice != null
      ? item.salePrice - item.purchasePrice
      : null

  const costPerWear =
    item.wearHistory.length > 0
      ? Math.round(item.purchasePrice / item.wearHistory.length)
      : null

  return (
    <div>
      <div className="relative">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            sizes="448px"
            className={`object-cover ${
              sold ? "opacity-70 grayscale" : ""
            }`}
            priority
          />
        </div>

        <button
          onClick={() => router.back()}
          aria-label="戻る"
          className="absolute left-4 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {item.brand}
          </p>

          <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs">
            <ColorDot
              color={item.color}
              className="h-2.5 w-2.5"
            />
            {item.color}
          </span>
        </div>

        <h1 className="mt-1 text-lg font-medium leading-snug text-foreground text-balance">
          {item.name}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-secondary px-2.5 py-0.5">
            {item.category}
          </span>

          {item.productNumber && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs">
              {item.productNumber}
            </span>
          )}

          {sold && (
            <span className="rounded-full bg-foreground px-2.5 py-0.5 text-background">
              売却済み
            </span>
          )}
        </div>

        {item.description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.productUrl && (
          <a
            href={item.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors active:bg-secondary"
          >
            <ExternalLink className="h-4 w-4" />
            商品ページを開く
          </a>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat
            label="購入価格"
            value={formatYen(item.purchasePrice)}
          />

          <Stat
            label="購入日"
            value={formatDateShort(item.purchaseDate)}
          />

          <Stat
            label="着用回数"
            value={`${item.wearHistory.length} 回`}
          />

          <Stat
            label="1回あたり"
            value={
              costPerWear != null
                ? formatYen(costPerWear)
                : "—"
            }
          />
        </div>

        {sold && (
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              売却情報
            </p>

            <div className="mt-2 grid grid-cols-2 gap-3">
              <Stat
                label="売却価格"
                value={
                  item.salePrice != null
                    ? formatYen(item.salePrice)
                    : "—"
                }
                inset
              />

              <Stat
                label="売却日"
                value={
                  item.saleDate
                    ? formatDateShort(item.saleDate)
                    : "—"
                }
                inset
              />
            </div>

            {gainLoss != null && (
              <p className="mt-3 text-sm">
                損益{" "}
                <span
                  className={
                    gainLoss >= 0
                      ? "font-medium text-foreground"
                      : "font-medium text-destructive"
                  }
                >
                  {gainLoss >= 0 ? "+" : "−"}
                  {formatYen(Math.abs(gainLoss))}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Wear history */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">
              着用履歴
            </h2>

            <button
              onClick={() => setWearOpen((o) => !o)}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors active:bg-secondary"
            >
              <Plus className="h-3.5 w-3.5" />
              記録
            </button>
          </div>

          {wearOpen && (
            <form
            onSubmit={async (e) => {
              e.preventDefault()
            
              try {
                await logWear(item.id, {
                  date: wearDate,
                  note: wearNote.trim() || undefined,
                })
            
                setWearNote("")
                setWearOpen(false)
              } catch (error) {
                console.error("Failed to log wear:", error)
                window.alert("着用記録の保存に失敗しました")
              }
            }}
              className="mt-3 space-y-3 rounded-xl border border-border bg-card p-4"
            >
              <Field label="着用日">
                <input
                  type="date"
                  value={wearDate}
                  onChange={(e) => setWearDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
                />
              </Field>

              <Field label="メモ（任意）">
                <input
                  value={wearNote}
                  onChange={(e) => setWearNote(e.target.value)}
                  placeholder="どこに着ていった？"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </Field>

              <button
                type="submit"
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground active:opacity-90"
              >
                <Check className="h-4 w-4" />
                記録する
              </button>
            </form>
          )}

          {item.wearHistory.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              まだ着用履歴がありません
            </p>
          ) : (
            <ul className="mt-3 space-y-0">
              {item.wearHistory.map((w, i) => (
                <li
                  key={w.id}
                  className="flex items-center gap-3 border-border py-3"
                  style={{
                    borderTopWidth: i === 0 ? 0 : 1,
                  }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(w.date)}
                    </p>

                    {w.note && (
                      <p className="truncate text-xs text-muted-foreground">
                        {w.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sell action */}
        {!sold && (
          <div className="mt-7">
            {!sellOpen ? (
              <button
                onClick={() => setSellOpen(true)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors active:bg-secondary"
              >
                <ShoppingBag className="h-4 w-4" />
                売却として記録
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()

                  markSold(
                    item.id,
                    saleDate,
                    Number(salePrice) || 0,
                  )

                  setSellOpen(false)
                }}
                className="space-y-3 rounded-xl border border-border bg-card p-4"
              >
                <p className="text-sm font-medium text-foreground">
                  売却情報を入力
                </p>

                <Field label="売却価格 (¥)">
                  <input
                    inputMode="numeric"
                    value={salePrice}
                    onChange={(e) =>
                      setSalePrice(
                        e.target.value.replace(/[^0-9]/g, ""),
                      )
                    }
                    placeholder="8000"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
                  />
                </Field>

                <Field label="売却日">
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) =>
                      setSaleDate(e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
                  />
                </Field>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSellOpen(false)}
                    className="h-10 flex-1 rounded-lg border border-border text-sm font-medium active:bg-secondary"
                  >
                    キャンセル
                  </button>

                  <button
                    type="submit"
                    className="h-10 flex-1 rounded-lg bg-primary text-sm font-medium text-primary-foreground active:opacity-90"
                  >
                    売却を記録
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Delete action */}
        <div className="mt-4">
          {!deleteOpen ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="h-11 w-full rounded-lg border border-destructive/30 text-sm font-medium text-destructive transition-colors active:bg-destructive/10"
            >
              アイテムを削除
            </button>
          ) : (
            <div className="rounded-xl border border-destructive/30 bg-card p-4">
              <p className="text-sm font-medium text-foreground">
                このアイテムを削除しますか？
              </p>

              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                削除すると、このアイテムの着用履歴も含めて完全に削除されます。
                この操作は取り消せません。
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleteLoading}
                  className="h-10 flex-1 rounded-lg border border-border text-sm font-medium text-foreground transition-colors active:bg-secondary disabled:opacity-50"
                >
                  キャンセル
                </button>

                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={async () => {
                    try {
                      setDeleteLoading(true)
                      await deleteItem(item.id)
                      router.push("/")
                    } catch (error) {
                      console.error(
                        "Failed to delete item:",
                        error,
                      )
                      window.alert("削除に失敗しました")
                      setDeleteLoading(false)
                    }
                  }}
                  className="h-10 flex-1 rounded-lg bg-destructive text-sm font-medium text-destructive-foreground transition-opacity active:opacity-90 disabled:opacity-50"
                >
                  {deleteLoading ? "削除中..." : "削除する"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  inset,
}: {
  label: string
  value: string
  inset?: boolean
}) {
  return (
    <div
      className={
        inset
          ? ""
          : "rounded-xl border border-border bg-card p-3.5"
      }
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-base font-medium text-foreground">
        {value}
      </p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      {children}
    </label>
  )
}
