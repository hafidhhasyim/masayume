"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react"
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

export default function BeritaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/news?id=${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("Berita tidak ditemukan")
          } else {
            throw new Error("Failed to fetch article")
          }
          return
        }
        const data = await response.json()
        setArticle(data)

        // Fetch related news
        if (data.category) {
          const relatedResponse = await fetch(`/api/news?category=${data.category}&limit=3`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            // Filter out current article
            setRelatedNews(relatedData.filter((item: NewsItem) => item.id !== data.id))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchArticle()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <Skeleton className="mb-8 h-8 w-32" />
                <Skeleton className="mb-4 h-12 w-3/4" />
                <Skeleton className="mb-8 h-6 w-48" />
                <Skeleton className="mb-8 h-96 w-full" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <h1 className="mb-4 text-3xl font-bold">Berita Tidak Ditemukan</h1>
                <p className="mb-8 text-muted-foreground">
                  Maaf, berita yang Anda cari tidak dapat ditemukan.
                </p>
                <Button onClick={() => router.push("/berita")}>
                  <ArrowLeft className="mr-2" size={16} />
                  Kembali ke Berita
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* Back Button */}
              <Button asChild variant="ghost" className="mb-8">
                <Link href="/berita">
                  <ArrowLeft className="mr-2" size={16} />
                  Kembali ke Berita
                </Link>
              </Button>

              {/* Article Header */}
              <div className="mb-8">
                <Badge className="mb-4">{article.category}</Badge>
                <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : new Date(article.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              {article.imageUrl && (
                <div className="mb-8 overflow-hidden rounded-lg">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-muted-foreground">{article.excerpt}</p>
                <div className="mt-6 whitespace-pre-line">{article.content}</div>
              </div>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="border-t bg-muted/50 py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-8 text-3xl font-bold">Berita Terkait</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedNews.map((item) => (
                    <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                      <Link href={`/berita/${item.id}`}>
                        <div
                          className="h-48 bg-cover bg-center"
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
                        <CardDescription>
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("id-ID")
                            : new Date(item.createdAt).toLocaleDateString("id-ID")}
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
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
