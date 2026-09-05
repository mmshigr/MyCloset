import Link from "next/link"
import Image from "next/image"
import { ColorDot } from "@/components/color-dot"
import type { ClothingItem } from "@/lib/closet-data"

export function ItemCard({ item }: { item: ClothingItem }) {
  const sold = item.status === "売却済み"

  return (
    <Link href={`/item/${item.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          sizes="(max-width: 448px) 50vw, 220px"
          className={`object-cover transition-transform duration-300 group-active:scale-[0.98] ${
            sold ? "opacity-60 grayscale" : ""
          }`}
        />
        {sold && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-medium tracking-wide text-background">
            売却済み
          </span>
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] text-foreground backdrop-blur-sm">
          <ColorDot color={item.color} className="h-2 w-2" />
          {item.color}
        </span>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {item.brand}
        </p>
        <h3 className="truncate text-sm font-medium leading-snug text-foreground">{item.name}</h3>
      </div>
    </Link>
  )
}
