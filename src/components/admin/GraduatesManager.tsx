"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, RefreshCw, Search, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface Graduate {
  id: number
  name: string
  photoUrl: string | null
  company: string
  position: string
  year: number
  testimonial: string
  country: string
  createdAt: string
}

export default function GraduatesManager() {
  const [graduates, setGraduates] = useState<Graduate[]>([])
  const [filteredGraduates, setFilteredGraduates] = useState<Graduate[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGraduate, setEditingGraduate] = useState<Graduate | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    position: "",
    year: new Date().getFullYear(),
    testimonial: "",
    country: "Japan",
    photoUrl: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchGraduates()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredGraduates(
        graduates.filter(
          (g) =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.company.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredGraduates(graduates)
    }
  }, [searchQuery, graduates])

  const fetchGraduates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/graduates?limit=100")
      const data = await response.json()
      setGraduates(data)
      setFilteredGraduates(data)
    } catch (error) {
      console.error("Error fetching graduates:", error)
      toast.error("Gagal memuat data lulusan")
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(file: File) {
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
      setFormData(prev => ({ ...prev, photoUrl: data.url }))
      toast.success('Foto berhasil diupload')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload foto: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      position: "",
      year: new Date().getFullYear(),
      testimonial: "",
      country: "Japan",
      photoUrl: "",
    })
    setEditingGraduate(null)
  }

  const handleOpenDialog = (graduate?: Graduate) => {
    if (graduate) {
      setEditingGraduate(graduate)
      setFormData({
        name: graduate.name,
        company: graduate.company,
        position: graduate.position,
        year: graduate.year,
        testimonial: graduate.testimonial,
        country: graduate.country,
        photoUrl: graduate.photoUrl || "",
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
      const url = editingGraduate
        ? `/api/graduates?id=${editingGraduate.id}`
        : "/api/graduates"
      const method = editingGraduate ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save graduate")

      toast.success(editingGraduate ? "Lulusan berhasil diupdate" : "Lulusan berhasil ditambahkan")
      setDialogOpen(false)
      resetForm()
      fetchGraduates()
    } catch (error) {
      console.error("Error saving graduate:", error)
      toast.error("Gagal menyimpan lulusan")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus lulusan ini?")) return

    try {
      const response = await fetch(`/api/graduates?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete graduate")

      toast.success("Lulusan berhasil dihapus")
      fetchGraduates()
    } catch (error) {
      console.error("Error deleting graduate:", error)
      toast.error("Gagal menghapus lulusan")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kelola Lulusan</CardTitle>
              <CardDescription>Tambah, edit, dan hapus profil lulusan</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchGraduates} variant="outline" size="sm">
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </Button>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2" size={16} />
                Tambah Lulusan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari nama atau perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGraduates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGraduates.map((graduate) => (
                      <TableRow key={graduate.id}>
                        <TableCell>
                          {graduate.photoUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                              <img
                                src={graduate.photoUrl}
                                alt={graduate.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                {graduate.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{graduate.name}</TableCell>
                        <TableCell>{graduate.position}</TableCell>
                        <TableCell>{graduate.company}</TableCell>
                        <TableCell>{graduate.year}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(graduate)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(graduate.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGraduate ? "Edit Lulusan" : "Tambah Lulusan Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi lulusan di bawah ini
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Foto Profil</Label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={formData.photoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, photoUrl: e.target.value })
                    }
                    placeholder="URL foto atau upload file"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={16} className="mr-2" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
              </div>
              {formData.photoUrl && (
                <div className="mt-2 relative w-32 h-32 rounded-full overflow-hidden border mx-auto">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: "" })}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Upload foto (max 5MB) atau masukkan URL foto
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company">Perusahaan *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="position">Posisi *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="year">Tahun Kelulusan *</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="country">Negara *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial">Testimoni *</Label>
              <Textarea
                id="testimonial"
                rows={4}
                placeholder="Testimoni dari lulusan"
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {submitting ? "Menyimpan..." : uploading ? "Uploading..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}