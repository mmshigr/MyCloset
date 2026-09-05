import { MobileShell } from "@/components/mobile-shell"
import { ItemDetailView } from "@/components/item-detail-view"

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <MobileShell>
      <ItemDetailView id={id} />
    </MobileShell>
  )
}
