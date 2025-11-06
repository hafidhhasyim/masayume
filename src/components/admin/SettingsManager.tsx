"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Upload, Save, Loader2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface Setting {
  key: string
  value: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'image' | 'radio'
  category: 'identity' | 'statistics' | 'social' | 'display' | 'other'
  description?: string
  options?: { value: string; label: string; description?: string }[]
}

const defaultSettings: Setting[] = [
  // Identity
  { key: 'site_name', value: 'masayume.id', label: 'Nama Website', type: 'text', category: 'identity' },
  { key: 'site_tagline', value: 'Jembatan Karirmu ke Jepang', label: 'Tagline', type: 'text', category: 'identity' },
  { key: 'organization_name', value: 'LPK Masayume Indonesia', label: 'Nama Organisasi', type: 'text', category: 'identity' },
  { key: 'logo_url', value: '', label: 'Logo Website', type: 'image', category: 'identity', description: 'Upload logo utama website' },
  { key: 'address', value: 'Jl. Contoh No. 123, Jakarta, Indonesia', label: 'Alamat', type: 'textarea', category: 'identity' },
  { key: 'phone', value: '+62 21 1234 5678', label: 'Nomor Telepon', type: 'text', category: 'identity' },
  { key: 'email', value: 'info@masayume.id', label: 'Email', type: 'text', category: 'identity' },
  { key: 'whatsapp', value: '+62 812 3456 7890', label: 'WhatsApp', type: 'text', category: 'identity' },
  
  // Display Preferences
  { 
    key: 'header_display_mode', 
    value: 'both', 
    label: 'Tampilan Header', 
    type: 'radio', 
    category: 'display',
    description: 'Pilih apa yang ditampilkan di header/navigasi',
    options: [
      { value: 'logo', label: 'Hanya Logo', description: 'Tampilkan logo saja tanpa teks' },
      { value: 'identity', label: 'Hanya Identitas', description: 'Tampilkan nama website saja tanpa logo' },
      { value: 'both', label: 'Logo & Identitas', description: 'Tampilkan logo dan nama website' }
    ]
  },
  
  // Statistics
  { key: 'stat_graduates', value: '500', label: 'Jumlah Lulusan Sukses', type: 'number', category: 'statistics' },
  { key: 'stat_companies', value: '50', label: 'Jumlah Perusahaan Partner', type: 'number', category: 'statistics' },
  { key: 'stat_experience', value: '10', label: 'Tahun Pengalaman', type: 'number', category: 'statistics' },
  { key: 'stat_success_rate', value: '95', label: 'Tingkat Keberhasilan (%)', type: 'number', category: 'statistics' },
  
  // Social Media
  { key: 'facebook_url', value: '', label: 'Facebook URL', type: 'text', category: 'social' },
  { key: 'instagram_url', value: '', label: 'Instagram URL', type: 'text', category: 'social' },
  { key: 'youtube_url', value: '', label: 'YouTube URL', type: 'text', category: 'social' },
  { key: 'twitter_url', value: '', label: 'Twitter/X URL', type: 'text', category: 'social' },
  { key: 'linkedin_url', value: '', label: 'LinkedIn URL', type: 'text', category: 'social' },
  
  // Other
  { key: 'footer_text', value: '© 2024 masayume.id. All rights reserved.', label: 'Footer Copyright Text', type: 'text', category: 'other' },
  { key: 'about_short', value: 'LPK terpercaya untuk program magang dan bekerja di Jepang', label: 'Deskripsi Singkat', type: 'textarea', category: 'other' },
]

export function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/site-settings?limit=100')
      const data = await response.json()
      
      const settingsMap: Record<string, string> = {}
      data.forEach((item: any) => {
        settingsMap[item.key] = item.value
      })
      
      // Merge with defaults
      const merged: Record<string, string> = {}
      defaultSettings.forEach(setting => {
        merged[setting.key] = settingsMap[setting.key] || setting.value
      })
      
      setSettings(merged)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Gagal memuat pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      setSettings(prev => ({
        ...prev,
        [key]: data.url
      }))
      
      toast.success('Logo berhasil diupload')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const promises = Object.entries(settings).map(async ([key, value]) => {
        // Check if setting exists
        const checkResponse = await fetch(`/api/site-settings?key=${key}`)
        const exists = checkResponse.ok

        if (exists) {
          // Update existing
          return fetch(`/api/site-settings?key=${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
          })
        } else {
          // Create new
          return fetch('/api/site-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value }),
          })
        }
      })

      await Promise.all(promises)
      toast.success('Pengaturan berhasil disimpan')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const renderField = (setting: Setting) => {
    if (setting.type === 'radio' && setting.options) {
      return (
        <div className="space-y-3">
          <Label>{setting.label}</Label>
          {setting.description && (
            <p className="text-sm text-muted-foreground">{setting.description}</p>
          )}
          <RadioGroup
            value={settings[setting.key] || setting.value}
            onValueChange={(value) => setSettings(prev => ({ ...prev, [setting.key]: value }))}
          >
            {setting.options.map(option => (
              <div key={option.value} className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={option.value} id={`${setting.key}-${option.value}`} />
                <div className="space-y-1 leading-none">
                  <Label
                    htmlFor={`${setting.key}-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    }

    if (setting.type === 'image') {
      return (
        <div className="space-y-2">
          <Label htmlFor={setting.key}>{setting.label}</Label>
          {setting.description && (
            <p className="text-xs text-muted-foreground">{setting.description}</p>
          )}
          
          {settings[setting.key] && (
            <div className="relative h-32 w-32 rounded-lg border overflow-hidden">
              <Image
                src={settings[setting.key]}
                alt={setting.label}
                fill
                className="object-contain"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              id={setting.key}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setting.key)}
              disabled={uploading}
              className="flex-1"
            />
            {uploading && <Loader2 className="animate-spin" size={20} />}
          </div>
          
          <Input
            placeholder="Atau masukkan URL gambar"
            value={settings[setting.key] || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
          />
        </div>
      )
    }

    if (setting.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label htmlFor={setting.key}>{setting.label}</Label>
          <Textarea
            id={setting.key}
            value={settings[setting.key] || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
            rows={3}
          />
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={setting.key}>{setting.label}</Label>
        <Input
          id={setting.key}
          type={setting.type}
          value={settings[setting.key] || ''}
          onChange={(e) => setSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  const categories = [
    { id: 'identity', title: 'Identitas & Kontak', description: 'Informasi organisasi dan kontak' },
    { id: 'display', title: 'Tampilan', description: 'Pengaturan tampilan website' },
    { id: 'statistics', title: 'Statistik', description: 'Angka statistik yang ditampilkan di homepage' },
    { id: 'social', title: 'Media Sosial', description: 'Link akun media sosial' },
    { id: 'other', title: 'Lainnya', description: 'Pengaturan tambahan' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Pengaturan Website</h2>
          <p className="text-muted-foreground">Kelola logo, identitas, dan informasi website</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2" size={16} />
              Simpan Semua
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map(category => {
          const categorySettings = defaultSettings.filter(s => s.category === category.id)
          if (categorySettings.length === 0) return null

          return (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySettings.map(setting => (
                  <div key={setting.key}>
                    {renderField(setting)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2" size={16} />
              Simpan Semua Pengaturan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}