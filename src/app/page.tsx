"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { HeroSlider } from "@/components/HeroSlider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Users, Building2, Calendar, Award } from "lucide-react"

interface Program {
  id: number
  title: string
  description: string
  duration: string
  imageUrl: string | null
}

interface NewsItem {
  id: number
  title: string
  excerpt: string
  category: string
  imageUrl: string | null
  publishedAt: string | null
}

interface Graduate {
  id: number
  name: string
  company: string
  position: string
  year: number
  photoUrl: string | null
  testimonial: string
}

interface Stats {
  graduates: string
  companies: string
  experience: string
  successRate: string
}

export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [stats, setStats] = useState<Stats>({
    graduates: "500+",
    companies: "50+",
    experience: "10+",
    successRate: "95%"
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [programsRes, newsRes, graduatesRes, settingsRes] = await Promise.all([
          fetch("/api/programs?limit=3&is_active=true"),
          fetch("/api/news?limit=3&published=true"),
          fetch("/api/graduates?limit=3&sort=year&order=desc"),
          fetch("/api/site-settings?limit=100"),
        ])

        const [programsData, newsData, graduatesData, settingsData] = await Promise.all([
          programsRes.json(),
          newsRes.json(),
          graduatesRes.json(),
          settingsRes.json(),
        ])

        setPrograms(programsData)
        setNews(newsData)
        setGraduates(graduatesData)

        // Parse settings
        if (Array.isArray(settingsData)) {
          const settingsMap: Record<string, string> = {}
          settingsData.forEach((item: any) => {
            settingsMap[item.key] = item.value
          })

          setStats({
            graduates: settingsMap.stat_graduates ? `${settingsMap.stat_graduates}+` : "500+",
            companies: settingsMap.stat_companies ? `${settingsMap.stat_companies}+` : "50+",
            experience: settingsMap.stat_experience ? `${settingsMap.stat_experience}+` : "10+",
            successRate: settingsMap.stat_success_rate ? `${settingsMap.stat_success_rate}%` : "95%"
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Slider Section */}
        <HeroSlider />

        {/* Stats Section */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-card p-6 text-center shadow-sm">
                <Users className="mx-auto mb-2 text-primary" size={32} />
                <div className="text-3xl font-bold">{stats.graduates}</div>
                <div className="text-sm text-muted-foreground">Lulusan Sukses</div>
              </div>
              <div className="rounded-lg bg-card p-6 text-center shadow-sm">
                <Building2 className="mx-auto mb-2 text-primary" size={32} />
                <div className="text-3xl font-bold">{stats.companies}</div>
                <div className="text-sm text-muted-foreground">Perusahaan Partner</div>
              </div>
              <div className="rounded-lg bg-card p-6 text-center shadow-sm">
                <Calendar className="mx-auto mb-2 text-primary" size={32} />
                <div className="text-3xl font-bold">{stats.experience}</div>
                <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
              </div>
              <div className="rounded-lg bg-card p-6 text-center shadow-sm">
                <Award className="mx-auto mb-2 text-primary" size={32} />
                <div className="text-3xl font-bold">{stats.successRate}</div>
                <div className="text-sm text-muted-foreground">Tingkat Keberhasilan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Program Unggulan</h2>
              <p className="text-muted-foreground">
                Pilih program yang sesuai dengan minat dan keahlianmu
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 animate-pulse bg-muted" />
                    <CardHeader>
                      <div className="h-6 animate-pulse rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((program) => (
                  <Card key={program.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: program.imageUrl
                          ? `url(${program.imageUrl})`
                          : "url(https://images.unsplash.com/photo-1528164344705-47542687000d?w=500&q=80)",
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                      <CardDescription>Durasi: {program.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                        {program.description}
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/program#program-${program.id}`}>
                          Selengkapnya <ArrowRight className="ml-2" size={16} />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/program">Lihat Semua Program</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Mengapa Memilih Kami?</h2>
              <p className="text-muted-foreground">
                Keunggulan yang membuat kami berbeda
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Berpengalaman & Terpercaya</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lebih dari {stats.experience.replace('+', '')} tahun pengalaman mengirimkan peserta ke Jepang dengan tingkat keberhasilan tinggi.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Pelatihan Berkualitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Program pelatihan komprehensif meliputi bahasa Jepang, budaya, dan keterampilan teknis dari instruktur berpengalaman.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Partner Perusahaan Ternama</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Bekerja sama dengan perusahaan-perusahaan besar di Jepang seperti Toyota, Honda, dan lainnya.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Pendampingan Penuh</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Kami mendampingi peserta mulai dari pendaftaran, pelatihan, hingga penempatan kerja di Jepang.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Fasilitas Modern</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gedung pelatihan modern dengan ruang kelas ber-AC, laboratorium komputer, dan asrama nyaman.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="mb-2 text-primary" size={32} />
                  <CardTitle>Biaya Transparan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tidak ada biaya tersembunyi. Sistem pembayaran jelas dan dapat dicicil sesuai kemampuan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Kisah Sukses Lulusan</h2>
              <p className="text-muted-foreground">
                Mereka telah membuktikan kesuksesan berkarir di Jepang
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-20 w-20 animate-pulse rounded-full bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {graduates.map((graduate) => (
                  <Card key={graduate.id} className="transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <div
                        className="mb-4 h-20 w-20 rounded-full bg-cover bg-center"
                        style={{
                          backgroundImage: graduate.photoUrl
                            ? `url(${graduate.photoUrl})`
                            : "url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80)",
                        }}
                      />
                      <CardTitle>{graduate.name}</CardTitle>
                      <CardDescription>
                        {graduate.position} di {graduate.company}
                      </CardDescription>
                      <Badge variant="secondary">Angkatan {graduate.year}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-4 text-sm italic text-muted-foreground">
                        &ldquo;{graduate.testimonial}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/lulusan">Lihat Semua Lulusan</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Berita Terbaru</h2>
              <p className="text-muted-foreground">
                Informasi dan update terkini seputar program kami
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <div className="h-48 animate-pulse bg-muted" />
                    <CardHeader>
                      <div className="h-6 animate-pulse rounded bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: item.imageUrl
                          ? `url(${item.imageUrl})`
                          : "url(https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80)",
                      }}
                    />
                    <CardHeader>
                      <Badge className="mb-2 w-fit">{item.category}</Badge>
                      <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                      <CardDescription>
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID") : ""}
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
            )}

            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/berita">Lihat Semua Berita</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Siap Memulai Perjalanan Karirmu?</h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Daftarkan dirimu sekarang dan raih kesempatan bekerja di Jepang!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/daftar">
                  Daftar Sekarang <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/cek-pendaftaran">Cek Status Pendaftaran</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}