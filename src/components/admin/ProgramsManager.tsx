"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, RefreshCw, Search, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface Program {
  id: number
  title: string
  description: string
  duration: string
  requirements: string
  benefits: string
  imageUrl: string | null
  isActive: boolean
  createdAt: string
}

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    requirements: "",
    benefits: "",
    imageUrl: "",
    isActive: true,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPrograms()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredPrograms(
        programs.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredPrograms(programs)
    }
  }, [searchQuery, programs])

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/programs?limit=100")
      const data = await response.json()
      setPrograms(data)
      setFilteredPrograms(data)
    } catch (error) {
      console.error("Error fetching programs:", error)
      toast.error("Gagal memuat data program")
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
      setFormData(prev => ({ ...prev, imageUrl: data.url }))
      toast.success('Gambar berhasil diupload')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Gagal mengupload gambar: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      requirements: "",
      benefits: "",
      imageUrl: "",
      isActive: true,
    })
    setEditingProgram(null)
  }

  const handleOpenDialog = (program?: Program) => {
    if (program) {
      setEditingProgram(program)
      setFormData({
        title: program.title,
        description: program.description,
        duration: program.duration,
        requirements: program.requirements,
        benefits: program.benefits,
        imageUrl: program.imageUrl || "",
        isActive: program.isActive,
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
      const url = editingProgram
        ? `/api/programs?id=${editingProgram.id}`
        : "/api/programs"
      const method = editingProgram ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save program")

      toast.success(editingProgram ? "Program berhasil diupdate" : "Program berhasil ditambahkan")
      setDialogOpen(false)
      resetForm()
      fetchPrograms()
    } catch (error) {
      console.error("Error saving program:", error)
      toast.error("Gagal menyimpan program")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return

    try {
      const response = await fetch(`/api/programs?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete program")

      toast.success("Program berhasil dihapus")
      fetchPrograms()
    } catch (error) {
      console.error("Error deleting program:", error)
      toast.error("Gagal menghapus program")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kelola Program</CardTitle>
              <CardDescription>Tambah, edit, dan hapus program pelatihan</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchPrograms} variant="outline" size="sm">
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </Button>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2" size={16} />
                Tambah Program
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari program..."
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
                    <TableHead>Gambar</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell>
                          {program.imageUrl && (
                            <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                              <img
                                src={program.imageUrl}
                                alt={program.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{program.title}</TableCell>
                        <TableCell>{program.duration}</TableCell>
                        <TableCell>
                          <Badge variant={program.isActive ? "default" : "secondary"}>
                            {program.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(program)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(program.id)}
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
            <DialogTitle>{editingProgram ? "Edit Program" : "Tambah Program Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi program di bawah ini
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Program *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Durasi *</Label>
              <Input
                id="duration"
                placeholder="Contoh: 3-5 Tahun"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Persyaratan *</Label>
              <Textarea
                id="requirements"
                rows={3}
                placeholder="Pisahkan dengan baris baru"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefit/Keuntungan *</Label>
              <Textarea
                id="benefits"
                rows={3}
                placeholder="Pisahkan dengan baris baru"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Gambar Program</Label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="URL gambar atau upload file"
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
              {formData.imageUrl && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
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
              <p className="text-xs text-muted-foreground mt-1">
                Upload gambar (max 5MB) atau masukkan URL gambar
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Status Program</Label>
                <div className="text-sm text-muted-foreground">
                  Program aktif akan ditampilkan di website
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
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