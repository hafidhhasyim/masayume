"use client"

import { useEffect, useState, useRef } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Search, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface Slider {
  id: number
  title: string
  subtitle: string
  description: string | null
  imageUrl: string
  image2Url: string | null
  buttonText: string | null
  buttonLink: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function SlidersManager() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    image2Url: "",
    buttonText: "",
    buttonLink: "",
    order: 0,
    isActive: true,
  })

  const fileInput1Ref = useRef<HTMLInputElement>(null)
  const fileInput2Ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSliders()
  }, [])

  async function fetchSliders() {
    try {
      const res = await fetch("/api/sliders")
      const data = await res.json()
      setSliders(data)
    } catch (error) {
      console.error("Error fetching sliders:", error)
      toast.error("Gagal memuat data slider")
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(file: File, fieldName: 'imageUrl' | 'image2Url') {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, [fieldName]: data.url }))
      toast.success(`Gambar ${fieldName === 'imageUrl' ? '1' : '2'} berhasil diupload`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload gambar: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  function handleEdit(slider: Slider) {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      description: slider.description || "",
      imageUrl: slider.imageUrl,
      image2Url: slider.image2Url || "",
      buttonText: slider.buttonText || "",
      buttonLink: slider.buttonLink || "",
      order: slider.order,
      isActive: slider.isActive,
    })
    setDialogOpen(true)
  }

  function handleCloseDialog() {
    setDialogOpen(false)
    setEditingSlider(null)
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      image2Url: "",
      buttonText: "",
      buttonLink: "",
      order: 0,
      isActive: true,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingSlider
        ? `/api/sliders?id=${editingSlider.id}`
        : "/api/sliders"
      const method = editingSlider ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save slider")

      toast.success(
        editingSlider
          ? "Slider berhasil diperbarui"
          : "Slider berhasil ditambahkan"
      )
      handleCloseDialog()
      fetchSliders()
    } catch (error) {
      console.error("Error saving slider:", error)
      toast.error("Gagal menyimpan slider")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus slider ini?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/sliders?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete slider")

      toast.success("Slider berhasil dihapus")
      fetchSliders()
    } catch (error) {
      console.error("Error deleting slider:", error)
      toast.error("Gagal menghapus slider")
    } finally {
      setLoading(false)
    }
  }

  const filteredSliders = sliders.filter(
    (slider) =>
      slider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slider.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kelola Slider Hero</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleCloseDialog()}>
              <Plus className="mr-2" size={16} />
              Tambah Slider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlider ? "Edit Slider" : "Tambah Slider Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingSlider
                  ? "Perbarui informasi slider"
                  : "Tambahkan slider baru ke homepage"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Program Pelatihan Kerja Jepang"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Sub Judul *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  required
                  placeholder="Bergabunglah dengan program pelatihan komprehensif kami"
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Deskripsi singkat tentang program atau informasi tambahan..."
                />
              </div>

              {/* Image 1 Upload */}
              <div>
                <Label>Gambar 1 *</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      placeholder="URL gambar atau upload file"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInput1Ref.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} className="mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={fileInput1Ref}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'imageUrl')
                    }}
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                    <img
                      src={formData.imageUrl}
                      alt="Preview 1"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Image 2 Upload */}
              <div>
                <Label>Gambar 2 (Opsional)</Label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      value={formData.image2Url}
                      onChange={(e) =>
                        setFormData({ ...formData, image2Url: e.target.value })
                      }
                      placeholder="URL gambar kedua atau upload file"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInput2Ref.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} className="mr-2" />
                    Upload
                  </Button>
                  <input
                    ref={fileInput2Ref}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'image2Url')
                    }}
                  />
                </div>
                {formData.image2Url && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                    <img
                      src={formData.image2Url}
                      alt="Preview 2"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image2Url: "" })}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Gambar kedua akan ditampilkan di sebelah kanan gambar pertama
                </p>
              </div>

              <div>
                <Label htmlFor="buttonText">Teks Tombol</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                  placeholder="Lihat Program"
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Link Tombol</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonLink: e.target.value })
                  }
                  placeholder="/program"
                />
              </div>
              <div>
                <Label htmlFor="order">Urutan</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                  min={0}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Urutan tampilan slider (0 = pertama)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Aktifkan slider</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? "Menyimpan..." : uploading ? "Uploading..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Search className="text-muted-foreground" size={20} />
        <Input
          placeholder="Cari slider..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Urutan</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Subjudul</TableHead>
              <TableHead>Gambar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : filteredSliders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada slider
                </TableCell>
              </TableRow>
            ) : (
              filteredSliders.map((slider) => (
                <TableRow key={slider.id}>
                  <TableCell>{slider.order}</TableCell>
                  <TableCell className="font-medium">
                    {slider.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {slider.subtitle}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                        <img
                          src={slider.imageUrl}
                          alt="Preview 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {slider.image2Url && (
                        <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                          <img
                            src={slider.image2Url}
                            alt="Preview 2"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={slider.isActive ? "default" : "secondary"}>
                      {slider.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slider)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(slider.id)}
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