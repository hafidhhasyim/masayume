"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { OrganizationChart } from "@/components/OrganizationChart"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ProfileSection {
  id: number
  section: string
  title: string
  content: string
  imageUrl: string | null
}

type TabType = 'sejarah' | 'visi-misi' | 'nilai-nilai' | 'organisasi' | 'fasilitas' | 'sertifikat'

export default function ProfilPage() {
  const [sections, setSections] = useState<Record<string, ProfileSection>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('sejarah')

  useEffect(() => {
    async function fetchProfileSections() {
      try {
        const res = await fetch("/api/profile-sections")
        const data = await res.json()
        
        // Convert array to object keyed by section name
        const sectionsMap: Record<string, ProfileSection> = {}
        data.forEach((section: ProfileSection) => {
          sectionsMap[section.section] = section
        })
        
        setSections(sectionsMap)
      } catch (error) {
        console.error("Error fetching profile sections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileSections()
  }, [])

  const tabs = [
    { id: 'sejarah' as TabType, label: 'Sejarah', section: 'history' },
    { id: 'visi-misi' as TabType, label: 'Visi & Misi', section: 'vision-mission' },
    { id: 'nilai-nilai' as TabType, label: 'Nilai-nilai Pengajaran', section: 'values' },
    { id: 'organisasi' as TabType, label: 'Organisasi', section: 'organization' },
    { id: 'fasilitas' as TabType, label: 'Fasilitas', section: 'facilities' },
    { id: 'sertifikat' as TabType, label: 'Sertifikat', section: 'certificates' },
  ]

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab)
    if (!currentTab) return null

    const section = sections[currentTab.section]

    if (loading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      )
    }

    if (!section && activeTab !== 'organisasi') {
      return (
        <div className="text-center py-12 text-muted-foreground">
          Konten belum tersedia
        </div>
      )
    }

    // Special rendering for organization tab
    if (activeTab === 'organisasi') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {section?.title || "Struktur Organisasi"}
            </h2>
            <p className="text-muted-foreground">Tim profesional kami yang berpengalaman</p>
          </div>
          <OrganizationChart />
        </div>
      )
    }

    // Default content rendering
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{section.title}</h2>
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
            {section.content}
          </div>
        </div>
        {section.imageUrl && (
          <div className="mt-8">
            <img 
              src={section.imageUrl} 
              alt={section.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Profil LPK Masayume
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Lembaga Pelatihan Kerja terdepan yang berkomitmen mengembangkan SDM Indonesia berkualitas
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-background border-b sticky top-16 z-10 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                    border-b-2 hover:text-primary
                    ${activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="py-16 min-h-[500px]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {renderTabContent()}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Bergabunglah dengan Kami</h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Jadilah bagian dari keluarga besar masayume.id dan raih kesempatan berkarir di Jepang
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/program">
                  Lihat Program <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}