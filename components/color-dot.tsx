import { COLOR_SWATCH, type ClothingColor } from "@/lib/closet-data"
import { cn } from "@/lib/utils"

export function ColorDot({ color, className }: { color: ClothingColor; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-3 w-3 rounded-full ring-1 ring-inset ring-black/10", className)}
      style={{ backgroundColor: COLOR_SWATCH[color] }}
    />
  )
}
