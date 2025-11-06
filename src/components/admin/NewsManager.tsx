"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, RefreshCw, Search, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface NewsItem {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  imageUrl: string | null
  category: string
  publishedAt: string | null
  createdAt: string
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    publishedAt: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredNews(
        news.filter(
          (n) =>
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredNews(news)
    }
  }, [searchQuery, news])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/news?limit=100")
      const data = await response.json()
      setNews(data)
      setFilteredNews(data)
    } catch (error) {
      console.error("Error fetching news:", error)
      toast.error("Gagal memuat data berita")
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
      content: "",
      excerpt: "",
      category: "",
      imageUrl: "",
      publishedAt: "",
    })
    setEditingNews(null)
  }

  const handleOpenDialog = (newsItem?: NewsItem) => {
    if (newsItem) {
      setEditingNews(newsItem)
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        excerpt: newsItem.excerpt,
        category: newsItem.category,
        imageUrl: newsItem.imageUrl || "",
        publishedAt: newsItem.publishedAt || "",
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
      const url = editingNews ? `/api/news?id=${editingNews.id}` : "/api/news"
      const method = editingNews ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save news")

      toast.success(editingNews ? "Berita berhasil diupdate" : "Berita berhasil ditambahkan")
      setDialogOpen(false)
      resetForm()
      fetchNews()
    } catch (error) {
      console.error("Error saving news:", error)
      toast.error("Gagal menyimpan berita")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return

    try {
      const response = await fetch(`/api/news?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete news")

      toast.success("Berita berhasil dihapus")
      fetchNews()
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("Gagal menghapus berita")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kelola Berita</CardTitle>
              <CardDescription>Tambah, edit, dan hapus artikel berita</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchNews} variant="outline" size="sm">
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </Button>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2" size={16} />
                Tambah Berita
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari berita..."
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
                    <TableHead>Kategori</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNews.map((newsItem) => (
                      <TableRow key={newsItem.id}>
                        <TableCell>
                          {newsItem.imageUrl && (
                            <div className="w-16 h-10 rounded overflow-hidden bg-muted">
                              <img
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{newsItem.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{newsItem.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={newsItem.publishedAt ? "default" : "outline"}>
                            {newsItem.publishedAt ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {newsItem.publishedAt
                            ? new Date(newsItem.publishedAt).toLocaleDateString("id-ID")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(newsItem)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(newsItem.id)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
            <DialogDescription>
              Lengkapi informasi berita di bawah ini
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
              <Label htmlFor="category">Kategori *</Label>
              <Input
                id="category"
                placeholder="Contoh: Pengumuman, Info, Event"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                rows={2}
                placeholder="Ringkasan singkat berita"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Konten *</Label>
              <Textarea
                id="content"
                rows={8}
                placeholder="Konten lengkap berita"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Gambar Berita</Label>
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

            <div>
              <Label htmlFor="publishedAt">Tanggal Publish</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Kosongkan untuk menyimpan sebagai draft
              </p>
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