"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, MapPin, Calendar, Search } from "lucide-react"
import Link from "next/link"

interface Graduate {
  id: number
  name: string
  photoUrl: string | null
  company: string
  position: string
  year: number
  testimonial: string
  country: string
}

export default function LulusanPage() {
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [filteredGraduates, setFilteredGraduates] = useState<Graduate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchGraduates() {
      try {
        const response = await fetch("/api/graduates?limit=100&sort=year&order=desc")
        if (!response.ok) throw new Error("Failed to fetch graduates")
        const data = await response.json()
        setGraduates(data)
        setFilteredGraduates(data)
      } catch (error) {
        console.error("Error fetching graduates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGraduates()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGraduates(graduates)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = graduates.filter(
        (graduate) =>
          graduate.name.toLowerCase().includes(query) ||
          graduate.company.toLowerCase().includes(query) ||
          graduate.position.toLowerCase().includes(query)
      )
      setFilteredGraduates(filtered)
    }
  }, [searchQuery, graduates])

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Kisah Sukses Lulusan
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Mereka telah membuktikan kesuksesan berkarir di Jepang dan menjadi inspirasi bagi generasi berikutnya
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="border-b bg-background py-6">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Cari berdasarkan nama, perusahaan, atau posisi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Graduates Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="mb-4 h-24 w-24 rounded-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredGraduates.length === 0 ? (
              <div className="rounded-lg border border-muted bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Tidak ada lulusan yang ditemukan untuk "${searchQuery}"`
                    : "Belum ada data lulusan yang tersedia."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <p className="text-muted-foreground">
                    Menampilkan {filteredGraduates.length} lulusan
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredGraduates.map((graduate) => (
                    <Card key={graduate.id} className="transition-shadow hover:shadow-lg">
                      <CardHeader>
                        <div
                          className="mb-4 h-24 w-24 rounded-full bg-cover bg-center"
                          style={{
                            backgroundImage: graduate.photoUrl
                              ? `url(${graduate.photoUrl})`
                              : "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80)",
                          }}
                        />
                        <CardTitle>{graduate.name}</CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Building2 size={14} />
                            <span>{graduate.company}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin size={14} />
                            <span>{graduate.position}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar size={14} />
                            <span>{graduate.country}</span>
                          </div>
                        </CardDescription>
                        <Badge variant="secondary" className="w-fit">
                          Angkatan {graduate.year}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm italic text-muted-foreground">
                            &ldquo;{graduate.testimonial}&rdquo;
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ingin Menjadi Seperti Mereka?</h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Bergabunglah dengan program kami dan wujudkan impian berkarir di Jepang
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/daftar">Daftar Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/program">Lihat Program</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
