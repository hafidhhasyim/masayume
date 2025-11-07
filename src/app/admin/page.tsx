"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { 
  LogOut, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Image as ImageIcon, 
  Users, 
  Mail,
  Home,
  BarChart,
  Monitor,
  BookOpen,
  Network,
  KeyRound,
  Settings,
  Database
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Import CRUD components
import ProgramsManager from "@/components/admin/ProgramsManager"
import NewsManager from "@/components/admin/NewsManager"
import GraduatesManager from "@/components/admin/GraduatesManager"
import GalleryManager from "@/components/admin/GalleryManager"
import RegistrationsManager from "@/components/admin/RegistrationsManager"
import ContactMessagesManager from "@/components/admin/ContactMessagesManager"
import { SlidersManager } from "@/components/admin/SlidersManager"
import { ProfileSectionsManager } from "@/components/admin/ProfileSectionsManager"
import { OrganizationMembersManager } from "@/components/admin/OrganizationMembersManager"
import { SettingsManager } from "@/components/admin/SettingsManager"
import { BackupManager } from "@/components/admin/BackupManager"

type TabType = 'overview' | 'sliders' | 'profile' | 'organization' | 'programs' | 'news' | 'graduates' | 'gallery' | 'registrations' | 'messages' | 'settings' | 'backup'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [stats, setStats] = useState({
    programs: 0,
    news: 0,
    graduates: 0,
    gallery: 0,
    registrations: 0,
    messages: 0,
    sliders: 0,
    profileSections: 0,
    organizationMembers: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated")
    if (!authenticated) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      fetchStats()
    }
  }, [router])

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const [programs, news, graduates, gallery, registrations, messages, sliders, profileSections, organizationMembers] = await Promise.all([
        fetch("/api/programs?limit=1000").then(r => r.json()),
        fetch("/api/news?limit=1000").then(r => r.json()),
        fetch("/api/graduates?limit=1000").then(r => r.json()),
        fetch("/api/gallery?limit=1000").then(r => r.json()),
        fetch("/api/registrations?limit=1000").then(r => r.json()),
        fetch("/api/contact-messages?limit=1000").then(r => r.json()),
        fetch("/api/sliders?limit=1000").then(r => r.json()),
        fetch("/api/profile-sections?limit=1000").then(r => r.json()),
        fetch("/api/organization-members?limit=1000").then(r => r.json()),
      ])

      setStats({
        programs: Array.isArray(programs) ? programs.length : 0,
        news: Array.isArray(news) ? news.length : 0,
        graduates: Array.isArray(graduates) ? graduates.length : 0,
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        registrations: Array.isArray(registrations) ? registrations.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        sliders: Array.isArray(sliders) ? sliders.length : 0,
        profileSections: Array.isArray(profileSections) ? profileSections.length : 0,
        organizationMembers: Array.isArray(organizationMembers) ? organizationMembers.length : 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_password")
    router.push("/admin/login")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)

    // Get stored password or default
    const storedPassword = localStorage.getItem("admin_password") || "masayume2024"

    // Validate current password
    if (passwordForm.currentPassword !== storedPassword) {
      toast.error("Password saat ini salah")
      setChangingPassword(false)
      return
    }

    // Validate new password
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter")
      setChangingPassword(false)
      return
    }

    // Validate confirmation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok")
      setChangingPassword(false)
      return
    }

    // Save new password
    localStorage.setItem("admin_password", passwordForm.newPassword)
    
    toast.success("Password berhasil diubah")
    setPasswordDialogOpen(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setChangingPassword(false)
  }

  const menuItems = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart },
    { id: 'registrations' as TabType, label: 'Pendaftaran', icon: Users },
    { id: 'messages' as TabType, label: 'Pesan', icon: Mail },
    { id: 'programs' as TabType, label: 'Program', icon: Briefcase },
    { id: 'news' as TabType, label: 'Berita', icon: FileText },
    { id: 'gallery' as TabType, label: 'Galeri', icon: ImageIcon },
    { id: 'graduates' as TabType, label: 'Lulusan', icon: GraduationCap },
    { id: 'profile' as TabType, label: 'Profil', icon: BookOpen },
    { id: 'organization' as TabType, label: 'Organisasi', icon: Network },
    { id: 'sliders' as TabType, label: 'Slider', icon: Monitor },
    { id: 'settings' as TabType, label: 'Pengaturan', icon: Settings },
    { id: 'backup' as TabType, label: 'Backup & Restore', icon: Database },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">masayume.id</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setPasswordDialogOpen(true)}
          >
            <KeyRound className="mr-2" size={16} />
            Ubah Password
          </Button>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/">
              <Home className="mr-2" size={16} />
              Lihat Website
            </Link>
          </Button>
          <Button variant="destructive" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2" size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">Statistik konten website masayume.id</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hero Slider</CardTitle>
                    <Monitor className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.sliders}
                    </div>
                    <p className="text-xs text-muted-foreground">Slide terdaftar</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Konten Profil</CardTitle>
                    <BookOpen className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.profileSections}
                    </div>
                    <p className="text-xs text-muted-foreground">Seksi profil</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tim Organisasi</CardTitle>
                    <Network className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.organizationMembers}
                    </div>
                    <p className="text-xs text-muted-foreground">Anggota tim</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Program</CardTitle>
                    <Briefcase className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.programs}
                    </div>
                    <p className="text-xs text-muted-foreground">Program terdaftar</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Berita</CardTitle>
                    <FileText className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.news}
                    </div>
                    <p className="text-xs text-muted-foreground">Artikel terdaftar</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lulusan</CardTitle>
                    <GraduationCap className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.graduates}
                    </div>
                    <p className="text-xs text-muted-foreground">Alumni terdaftar</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Galeri</CardTitle>
                    <ImageIcon className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.gallery}
                    </div>
                    <p className="text-xs text-muted-foreground">Foto galeri</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendaftaran</CardTitle>
                    <Users className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : stats.registrations}
                    </div>
                    <p className="text-xs text-muted-foreground">Calon peserta</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Selamat Datang di Admin Dashboard</CardTitle>
                  <CardDescription>
                    Gunakan menu sidebar untuk mengelola konten website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• <strong>Pengaturan:</strong> Kelola logo, identitas, kontak, dan statistik website</p>
                    <p>• <strong>Slider:</strong> Kelola hero slider di halaman utama</p>
                    <p>• <strong>Profil:</strong> Edit konten Sejarah, Visi & Misi, dan sections lainnya</p>
                    <p>• <strong>Organisasi:</strong> Kelola struktur organisasi dengan foto</p>
                    <p>• <strong>Program:</strong> Kelola program pelatihan yang ditawarkan</p>
                    <p>• <strong>Berita:</strong> Publikasi dan edit artikel berita</p>
                    <p>• <strong>Lulusan:</strong> Tambah dan update kisah sukses alumni</p>
                    <p>• <strong>Galeri:</strong> Upload dan kelola foto galeri</p>
                    <p>• <strong>Pendaftaran:</strong> Review dan update status pendaftaran</p>
                    <p>• <strong>Pesan:</strong> Baca dan respon pesan dari pengunjung</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Management Tabs */}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'backup' && <BackupManager />}
          {activeTab === 'sliders' && <SlidersManager />}
          {activeTab === 'profile' && <ProfileSectionsManager />}
          {activeTab === 'organization' && <OrganizationMembersManager />}
          {activeTab === 'programs' && <ProgramsManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'graduates' && <GraduatesManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'registrations' && <RegistrationsManager />}
          {activeTab === 'messages' && <ContactMessagesManager />}
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Password Admin</DialogTitle>
            <DialogDescription>
              Masukkan password lama dan password baru Anda
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Password Saat Ini *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
                autoComplete="current-password"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Password Baru *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimal 6 karakter
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPasswordDialogOpen(false)
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }}
              >
                Batal
              </Button>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Menyimpan..." : "Ubah Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}