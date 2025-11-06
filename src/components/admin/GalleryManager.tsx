"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

interface GalleryItem {
  id: number
  title: string
  imageUrl: string
  description: string | null
  category: string
  createdAt: string
}

export default function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
    category: "",
  })

  useEffect(() => {
    fetchGallery()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredGallery(
        gallery.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredGallery(gallery)
    }
  }, [searchQuery, gallery])

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/gallery?limit=100")
      const data = await response.json()
      setGallery(data)
      setFilteredGallery(data)
    } catch (error) {
      console.error("Error fetching gallery:", error)
      toast.error("Gagal memuat data galeri")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      imageUrl: "",
      description: "",
      category: "",
    })
    setEditingItem(null)
  }

  const handleOpenDialog = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description || "",
        category: item.category,
      })
    } else {
      resetForm()
    }
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingItem ? `/api/gallery?id=${editingItem.id}` : "/api/gallery"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save gallery item")

      toast.success(editingItem ? "Galeri berhasil diupdate" : "Galeri berhasil ditambahkan")
      setDialogOpen(false)
      resetForm()
      fetchGallery()
    } catch (error) {
      console.error("Error saving gallery:", error)
      toast.error("Gagal menyimpan galeri")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item galeri ini?")) return

    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete gallery item")

      toast.success("Galeri berhasil dihapus")
      fetchGallery()
    } catch (error) {
      console.error("Error deleting gallery:", error)
      toast.error("Gagal menghapus galeri")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kelola Galeri</CardTitle>
              <CardDescription>Tambah, edit, dan hapus foto galeri</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchGallery} variant="outline" size="sm">
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </Button>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2" size={16} />
                Tambah Foto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari judul atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGallery.length === 0 ? (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  Tidak ada data
                </div>
              ) : (
                filteredGallery.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                      }}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Foto Galeri" : "Tambah Foto Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi foto di bawah ini
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">URL Gambar *</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Input
                id="category"
                placeholder="Contoh: Kegiatan, Fasilitas, Alumni"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Deskripsi foto (opsional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
