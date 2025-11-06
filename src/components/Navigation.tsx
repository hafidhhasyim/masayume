"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap } from "lucide-react"
import Image from "next/image"

const menuItems = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Program", href: "/program" },
  { label: "Berita", href: "/berita" },
  { label: "Lulusan", href: "/lulusan" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
  { label: "Cek Pendaftaran", href: "/cek-pendaftaran" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "masayume.id",
    logo_url: "",
    header_display_mode: "both"
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/site-settings?limit=100')
        const data = await response.json()
        
        const settingsMap: Record<string, string> = {}
        data.forEach((item: any) => {
          settingsMap[item.key] = item.value
        })
        
        setSettings({
          site_name: settingsMap.site_name || "masayume.id",
          logo_url: settingsMap.logo_url || "",
          header_display_mode: settingsMap.header_display_mode || "both"
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])

  const displayMode = settings.header_display_mode || "both"
  const showLogo = displayMode === "logo" || displayMode === "both"
  const showIdentity = displayMode === "identity" || displayMode === "both"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          {showLogo && (
            settings.logo_url ? (
              <div className="relative h-16 w-16">
                <Image
                  src={settings.logo_url}
                  alt={settings.site_name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap size={32} />
              </div>
            )
          )}
          {showIdentity && (
            <div className="text-2xl font-bold text-primary">{settings.site_name}</div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/daftar">Daftar Sekarang</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-b bg-background md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="w-full" size="sm">
              <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                Daftar Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}