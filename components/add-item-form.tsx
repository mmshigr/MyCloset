"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ImageIcon, Check, Sparkles, Loader2 } from "lucide-react"
import { useCloset } from "@/components/closet-provider"
import { ColorDot } from "@/components/color-dot"
import { supabase } from "@/lib/supabase"
import {
  CATEGORIES,
  COLORS,
  type Category,
  type ClothingColor,
} from "@/lib/closet-data"
import { cn } from "@/lib/utils"

type LookupState = "idle" | "loading" | "success" | "error"

export function AddItemForm() {
  const router = useRouter()
  const { addItem } = useCloset()

  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [productNumber, setProductNumber] = useState("")
  const [description, setDescription] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [category, setCategory] = useState<Category>("トップス")
  const [color, setColor] = useState<ClothingColor>("ホワイト")
  const [price, setPrice] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const [lookup, setLookup] = useState<LookupState>("idle")

  const canSubmit = name.trim() && brand.trim()
  const canLookup =
    brand.trim() &&
    productNumber.trim() &&
    lookup !== "loading"

  async function handleLookup() {
    if (!canLookup) return

    setLookup("loading")

    try {
      const response = await fetch("/api/product-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          productNumber,
        }),
      })

      if (!response.ok) {
        setLookup("error")
        return
      }

      const result = await response.json()

      setName(result.name)
      setCategory(result.category)
      setColor(result.color)
      setDescription(result.description)

      if (!price && result.suggestedPrice) {
        setPrice(String(result.suggestedPrice))
      }

      if (result.productUrl) {
        setProductUrl(result.productUrl)
      }

      if (result.image) {
        setImage(result.image)
      }

      setLookup("success")
    } catch (error) {
      console.error("Product lookup failed:", error)
      setLookup("error")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!canSubmit) return

    try {
      let imageUrl = image

      // スマホから選択した画像がある場合はStorageへアップロード
      if (imageFile) {
        const fileExtension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg"

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExtension}`

        const filePath = `items/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("closet-images")
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: false,
          })

        if (uploadError) {
          console.error("Failed to upload image:", uploadError)
          throw uploadError
        }

        const { data } = supabase.storage
          .from("closet-images")
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      await addItem({
        name: name.trim(),
        brand: brand.trim(),
        productNumber: productNumber.trim() || undefined,
        description: description.trim() || undefined,
        productUrl: productUrl.trim() || undefined,
        category,
        color,
        image: imageUrl,
        purchasePrice: Number(price) || 0,
        purchaseDate: date,
        status: "所有中",
      })

      router.push("/")
    } catch (error) {
      console.error("Failed to add item:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/90 px-5 pb-3 pt-6 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="戻る"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground active:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="font-serif text-2xl text-foreground">
          服を登録
        </h1>
      </header>

      <div className="space-y-6 px-5 pt-3">
        {/* Auto lookup by brand + product number */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-foreground" />
            <p className="text-sm font-medium text-foreground">
              商品情報を自動取得
            </p>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            ブランドと品番を入力すると、商品名・カテゴリ・説明・商品URLを自動で取得します。
          </p>

          <div className="mt-3 space-y-3">
            <Field label="ブランド">
              <input
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value)
                  if (lookup !== "idle") setLookup("idle")
                }}
                placeholder="例：COMOLI"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </Field>

            <Field label="品番">
              <input
                value={productNumber}
                onChange={(e) => {
                  setProductNumber(e.target.value)
                  if (lookup !== "idle") setLookup("idle")
                }}
                placeholder="例：V01-02001"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </Field>

            <button
              type="button"
              onClick={handleLookup}
              disabled={!canLookup}
              className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity active:opacity-90 disabled:opacity-40"
            >
              {lookup === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  取得中…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  商品情報を取得
                </>
              )}
            </button>

            {lookup === "success" && (
              <p className="flex items-center gap-1 text-xs text-foreground">
                <Check className="h-3.5 w-3.5" />
                商品情報を取得しました。内容を確認して調整できます。
              </p>
            )}

            {lookup === "error" && (
              <p className="text-xs text-destructive">
                該当する商品が見つかりませんでした。下記に手動で入力してください。
              </p>
            )}
          </div>
        </div>

        {/* Image picker */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            写真を選択
          </p>

          <label className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-border text-muted-foreground">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="選択した画像"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <ImageIcon className="h-7 w-7" />
                <span className="text-sm">
                  スマホから写真を選択
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
                setImage("")
              }}
            />
          </label>
        </div>

        <Field label="アイテム名">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：オックスフォード シャツ"
            className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        <Field label="商品説明">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="素材やディテールなど（自動取得すると入力されます）"
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-card px-3 py-2.5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        {/* Product URL */}
        <Field label="商品URL">
          <input
            type="url"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="https://..."
            className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </Field>

        <Field label="カテゴリ">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Selectable
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </Selectable>
            ))}
          </div>
        </Field>

        <Field label="カラー">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <Selectable
                key={c}
                active={color === c}
                onClick={() => setColor(c)}
              >
                <ColorDot
                  color={c}
                  className="h-2.5 w-2.5"
                />
                {c}
              </Selectable>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="購入価格 (¥)">
            <input
              inputMode="numeric"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value.replace(/[^0-9]/g, ""),
                )
              }
              placeholder="24200"
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </Field>

          <Field label="購入日">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus:border-ring"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity active:opacity-90 disabled:opacity-40"
        >
          <Check className="h-4 w-4" />
          クローゼットに追加
        </button>
      </div>
    </form>
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
      <span className="mb-2 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function Selectable({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  )
}