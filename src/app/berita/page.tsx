"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl: string | null
  publishedAt: string | null
  createdAt: string
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news?limit=100&published=true")
        if (!response.ok) throw new Error("Failed to fetch news")
        const data = await response.json()
        setNews(data)
        setFilteredNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    let filtered = news

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.excerpt.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    setFilteredNews(filtered)
  }, [searchQuery, selectedCategory, news])

  const categories = Array.from(new Set(news.map((item) => item.category)))

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Berita & Informasi
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Update terbaru seputar program, kegiatan, dan informasi penting lainnya
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
                    placeholder="Cari berita..."
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
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48" />
                    <CardHeader>
                      <Skeleton className="mb-2 h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="rounded-lg border border-muted bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory
                    ? "Tidak ada berita yang ditemukan."
                    : "Belum ada berita yang tersedia."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <p className="text-muted-foreground">
                    Menampilkan {filteredNews.length} berita
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNews.map((item) => (
                    <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                      <Link href={`/berita/${item.id}`}>
                        <div
                          className="h-48 bg-cover bg-center transition-transform hover:scale-105"
                          style={{
                            backgroundImage: item.imageUrl
                              ? `url(${item.imageUrl})`
                              : "url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80)",
                          }}
                        />
                      </Link>
                      <CardHeader>
                        <Badge className="mb-2 w-fit">{item.category}</Badge>
                        <Link href={`/berita/${item.id}`}>
                          <CardTitle className="line-clamp-2 hover:text-primary">
                            {item.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {item.publishedAt
                              ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                          {item.excerpt}
                        </p>
                        <Button asChild variant="link" className="p-0">
                          <Link href={`/berita/${item.id}`}>
                            Baca Selengkapnya <ArrowRight className="ml-1" size={16} />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
