import { useParams } from '@tanstack/react-router'
import { PageShell } from '@/shared/ui/PageShell'

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })

  return (
    <PageShell
      title={`Product #${productId}`}
      description="Product details will be fetched from DummyJSON by id."
    />
  )
}
