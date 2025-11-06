"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Twitter, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "masayume.id",
    about_short: "LPK terpercaya untuk program magang dan bekerja di Jepang. Wujudkan mimpi karirmu bersama kami.",
    address: "Jl. Gatot Subroto No. 123, Jakarta Pusat, DKI Jakarta 10270",
    phone: "+62-21-5555-1234",
    email: "info@masayume.id",
    footer_text: "© 2024 masayume.id. All rights reserved.",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    twitter_url: "",
    linkedin_url: ""
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
          about_short: settingsMap.about_short || "LPK terpercaya untuk program magang dan bekerja di Jepang. Wujudkan mimpi karirmu bersama kami.",
          address: settingsMap.address || "Jl. Gatot Subroto No. 123, Jakarta Pusat, DKI Jakarta 10270",
          phone: settingsMap.phone || "+62-21-5555-1234",
          email: settingsMap.email || "info@masayume.id",
          footer_text: settingsMap.footer_text || `© ${new Date().getFullYear()} masayume.id. All rights reserved.`,
          facebook_url: settingsMap.facebook_url || "",
          instagram_url: settingsMap.instagram_url || "",
          youtube_url: settingsMap.youtube_url || "",
          twitter_url: settingsMap.twitter_url || "",
          linkedin_url: settingsMap.linkedin_url || ""
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    
    fetchSettings()
  }, [])

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{settings.site_name}</h3>
            <p className="text-sm text-muted-foreground">
              {settings.about_short}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profil" className="text-muted-foreground hover:text-primary">Profil</Link></li>
              <li><Link href="/program" className="text-muted-foreground hover:text-primary">Program</Link></li>
              <li><Link href="/berita" className="text-muted-foreground hover:text-primary">Berita</Link></li>
              <li><Link href="/lulusan" className="text-muted-foreground hover:text-primary">Lulusan</Link></li>
              <li><Link href="/galeri" className="text-muted-foreground hover:text-primary">Galeri</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} className="shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} className="shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Media Sosial</h3>
            <div className="flex gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{settings.footer_text}</p>
        </div>
      </div>
    </footer>
  )
}