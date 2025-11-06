"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react"
import { toast } from "sonner"

interface ProfileSection {
  id: number
  section: string
  title: string
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export function ProfileSectionsManager() {
  const [sections, setSections] = useState<ProfileSection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<ProfileSection | null>(null)
  const [formData, setFormData] = useState({
    section: "",
    title: "",
    content: "",
    imageUrl: "",
  })

  useEffect(() => {
    fetchSections()
  }, [])

  async function fetchSections() {
    try {
      const res = await fetch("/api/profile-sections")
      const data = await res.json()
      setSections(data)
    } catch (error) {
      console.error("Error fetching profile sections:", error)
      toast.error("Gagal memuat data seksi profil")
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(section: ProfileSection) {
    setEditingSection(section)
    setFormData({
      section: section.section,
      title: section.title,
      content: section.content,
      imageUrl: section.imageUrl || "",
    })
    setDialogOpen(true)
  }

  function handleCloseDialog() {
    setDialogOpen(false)
    setEditingSection(null)
    setFormData({
      section: "",
      title: "",
      content: "",
      imageUrl: "",
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingSection
        ? `/api/profile-sections?id=${editingSection.id}`
        : "/api/profile-sections"
      const method = editingSection ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save profile section")

      toast.success(
        editingSection
          ? "Seksi profil berhasil diperbarui"
          : "Seksi profil berhasil ditambahkan"
      )
      handleCloseDialog()
      fetchSections()
    } catch (error) {
      console.error("Error saving profile section:", error)
      toast.error("Gagal menyimpan seksi profil")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus seksi profil ini?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/profile-sections?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete profile section")

      toast.success("Seksi profil berhasil dihapus")
      fetchSections()
    } catch (error) {
      console.error("Error deleting profile section:", error)
      toast.error("Gagal menghapus seksi profil")
    } finally {
      setLoading(false)
    }
  }

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.section.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSectionBadge = (section: string) => {
    const badges: { [key: string]: string } = {
      history: "Sejarah",
      "vision-mission": "Visi & Misi",
      values: "Nilai-nilai",
      organization: "Organisasi",
      facilities: "Fasilitas",
      certificates: "Sertifikat",
    }
    return badges[section] || section
  }

  const getSectionHint = (sectionSlug: string) => {
    const hints: { [key: string]: string } = {
      history: "Sejarah dan perjalanan LPK Masayume",
      "vision-mission": "Visi dan misi organisasi",
      values: "Nilai-nilai pengajaran yang dianut",
      organization: "Format: Posisi: Nama\\n- Posisi: Nama\\n  ├─ Posisi: Nama",
      facilities: "Fasilitas pelatihan yang tersedia",
      certificates: "Sertifikat dan legalitas",
    }
    return hints[sectionSlug] || ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kelola Konten Profil</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola 6 section: Sejarah, Visi & Misi, Nilai-nilai, Organisasi, Fasilitas, Sertifikat
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleCloseDialog()}>
              <Plus className="mr-2" size={16} />
              Tambah Seksi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection ? "Edit Seksi Profil" : "Tambah Seksi Profil Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingSection
                  ? "Perbarui informasi seksi profil"
                  : "Tambahkan seksi profil baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="section">Nama Seksi * (slug)</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  placeholder="history, vision-mission, values, organization, facilities, certificates"
                  required
                  disabled={!!editingSection}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Gunakan: history, vision-mission, values, organization, facilities, certificates
                </p>
              </div>
              <div>
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Sejarah Masayume.id"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Konten *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={15}
                  className="font-mono text-sm"
                  placeholder={
                    formData.section === "organization"
                      ? "Direktur: Dr. Ahmad Santoso\n- Manager: Budi Pratama\n  ├─ Staff: Dewi Lestari\n  └─ Staff: Agus Wijaya"
                      : "Konten teks untuk section ini..."
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getSectionHint(formData.section) || "Isi konten untuk section ini"}
                </p>
              </div>
              <div>
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="text-muted-foreground" size={20} />
        <Input
          placeholder="Cari seksi profil..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seksi</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Konten</TableHead>
              <TableHead>Terakhir Diperbarui</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : filteredSections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Tidak ada seksi profil
                </TableCell>
              </TableRow>
            ) : (
              filteredSections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {getSectionBadge(section.section)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {section.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText size={16} />
                      <span>{section.content.length} karakter</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(section.updatedAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(section)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(section.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}