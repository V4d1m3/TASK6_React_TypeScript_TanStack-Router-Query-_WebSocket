import { useState } from 'react'

type ProductGalleryProps = {
  images: string[]
  thumbnail: string
}

export function ProductGallery({ images, thumbnail }: ProductGalleryProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const galleryImages = images.length > 0 ? images : [thumbnail]
  const activeImage = galleryImages[imageIndex] ?? thumbnail

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-line bg-surface-muted">
        <img
          src={activeImage}
          alt=""
          className="aspect-square w-full object-cover"
        />
      </div>
      {galleryImages.length > 1 ? (
        <ul className="flex flex-wrap gap-2">
          {galleryImages.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => setImageIndex(index)}
                className={`overflow-hidden rounded-xl border-2 ${
                  index === imageIndex ? 'border-brand' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="h-16 w-16 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
