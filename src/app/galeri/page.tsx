"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Image as ImageIcon } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  imageUrl: string
  description: string | null
  category: string
  createdAt: string
}

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const response = await fetch("/api/gallery?limit=100")
        if (!response.ok) throw new Error("Failed to fetch gallery")
        const data = await response.json()
        setGallery(data)
        setFilteredGallery(data)
      } catch (error) {
        console.error("Error fetching gallery:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  useEffect(() => {
    let filtered = gallery

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    setFilteredGallery(filtered)
  }, [searchQuery, selectedCategory, gallery])

  const categories = Array.from(new Set(gallery.map((item) => item.category)))

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Galeri Foto
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Dokumentasi kegiatan pelatihan, fasilitas, dan momen-momen berharga di masayume.id
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="border-b bg-background py-6">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="mx-auto max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    type="text"
                    placeholder="Cari foto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Semua
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : filteredGallery.length === 0 ? (
              <div className="rounded-lg border border-muted bg-muted/50 p-8 text-center">
                <ImageIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory
                    ? "Tidak ada foto yang ditemukan."
                    : "Belum ada foto yang tersedia."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <p className="text-muted-foreground">
                    Menampilkan {filteredGallery.length} foto
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGallery.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedImage(item)}
                      className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                    >
                      <div
                        className="h-64 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${item.imageUrl})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute bottom-0 p-4 text-left text-white">
                          <h3 className="mb-1 font-semibold">{item.title}</h3>
                          {item.description && (
                            <p className="line-clamp-2 text-sm text-white/80">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute right-4 top-4 text-4xl text-white hover:text-white/80"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <div className="max-h-[90vh] max-w-5xl">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-h-[80vh] w-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center text-white">
              <h3 className="mb-2 text-xl font-bold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-white/80">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
