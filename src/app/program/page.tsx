"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Program {
  id: number
  title: string
  description: string
  duration: string
  requirements: string
  benefits: string
  imageUrl: string | null
  isActive: boolean
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch("/api/programs?limit=100&is_active=true")
        if (!response.ok) throw new Error("Failed to fetch programs")
        const data = await response.json()
        setPrograms(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Program Pelatihan
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Pilih program yang sesuai dengan minat dan keahlianmu untuk memulai karir di Jepang
              </p>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="grid gap-6 lg:grid-cols-3">
                      <Skeleton className="h-64 lg:h-full" />
                      <div className="space-y-4 p-6 lg:col-span-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center">
                <p className="text-destructive">Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Coba Lagi
                </Button>
              </div>
            ) : programs.length === 0 ? (
              <div className="rounded-lg border border-muted bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">Belum ada program yang tersedia saat ini.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {programs.map((program) => (
                  <Card key={program.id} id={`program-${program.id}`} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="grid gap-6 lg:grid-cols-3">
                      {/* Image */}
                      <div
                        className="h-64 bg-cover bg-center lg:h-full"
                        style={{
                          backgroundImage: program.imageUrl
                            ? `url(${program.imageUrl})`
                            : "url(https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80)",
                        }}
                      />

                      {/* Content */}
                      <div className="space-y-6 p-6 lg:col-span-2">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Badge>Program Aktif</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock size={16} />
                              <span>{program.duration}</span>
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold">{program.title}</h2>
                        </div>

                        <div>
                          <h3 className="mb-2 font-semibold">Deskripsi Program</h3>
                          <p className="text-muted-foreground">{program.description}</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="mb-3 font-semibold">Persyaratan</h3>
                            <ul className="space-y-2">
                              {program.requirements.split(",").map((req, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="mt-0.5 shrink-0 text-primary" size={16} />
                                  <span>{req.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="mb-3 font-semibold">Benefit</h3>
                            <ul className="space-y-2">
                              {program.benefits.split(",").map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="mt-0.5 shrink-0 text-primary" size={16} />
                                  <span>{benefit.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button asChild>
                            <Link href="/daftar">
                              Daftar Program Ini <ArrowRight className="ml-2" size={16} />
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href="/kontak">Tanya Lebih Lanjut</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Masih Bingung Memilih Program?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Hubungi kami untuk konsultasi gratis dan dapatkan rekomendasi program yang sesuai
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/kontak">Konsultasi Sekarang</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/lulusan">Lihat Kisah Sukses Lulusan</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
