"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search, Upload, User } from "lucide-react"
import { toast } from "sonner"

interface OrganizationMember {
  id: number
  name: string
  position: string
  photoUrl: string | null
  parentId: number | null
  order: number
  level: number
  createdAt: string
  updatedAt: string
}

export function OrganizationMembersManager() {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photoUrl: "",
    parentId: "none",
    order: "0",
    level: "0",
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      const res = await fetch("/api/organization-members")
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching organization members:", error)
      toast.error("Gagal memuat data anggota organisasi")
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(member: OrganizationMember) {
    setEditingMember(member)
    setFormData({
      name: member.name,
      position: member.position,
      photoUrl: member.photoUrl || "",
      parentId: member.parentId?.toString() || "none",
      order: member.order.toString(),
      level: member.level.toString(),
    })
    setDialogOpen(true)
  }

  function handleCloseDialog() {
    setDialogOpen(false)
    setEditingMember(null)
    setFormData({
      name: "",
      position: "",
      photoUrl: "",
      parentId: "none",
      order: "0",
      level: "0",
    })
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB")
      return
    }

    setUploadingPhoto(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      setFormData((prev) => ({ ...prev, photoUrl: data.url }))
      toast.success("Foto berhasil diupload")
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast.error("Gagal upload foto")
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingMember
        ? `/api/organization-members?id=${editingMember.id}`
        : "/api/organization-members"
      const method = editingMember ? "PUT" : "POST"

      const payload: any = {
        name: formData.name,
        position: formData.position,
        photoUrl: formData.photoUrl || null,
        parentId: formData.parentId === "none" ? null : parseInt(formData.parentId),
        order: parseInt(formData.order),
        level: parseInt(formData.level),
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to save member")
      }

      toast.success(
        editingMember
          ? "Anggota berhasil diperbarui"
          : "Anggota berhasil ditambahkan"
      )
      handleCloseDialog()
      fetchMembers()
    } catch (error) {
      console.error("Error saving member:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan anggota")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/organization-members?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to delete member")
      }

      toast.success("Anggota berhasil dihapus")
      fetchMembers()
    } catch (error) {
      console.error("Error deleting member:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menghapus anggota")
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel =
      levelFilter === "all" || member.level.toString() === levelFilter
    return matchesSearch && matchesLevel
  })

  const getLevelBadge = (level: number) => {
    const badges = {
      0: { label: "Direktur", variant: "default" as const },
      1: { label: "Kepala", variant: "secondary" as const },
      2: { label: "Staff", variant: "outline" as const },
    }
    return badges[level as keyof typeof badges] || { label: "Unknown", variant: "outline" as const }
  }

  const getParentName = (parentId: number | null) => {
    if (!parentId) return "-"
    const parent = members.find((m) => m.id === parentId)
    return parent ? parent.name : "Unknown"
  }

  // Get available parents (exclude self and descendants)
  const getAvailableParents = () => {
    if (!editingMember) return members
    // For now, just exclude self
    return members.filter((m) => m.id !== editingMember.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Kelola Struktur Organisasi</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tambah dan kelola anggota tim dengan foto profil
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleCloseDialog()}>
              <Plus className="mr-2" size={16} />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Anggota Organisasi" : "Tambah Anggota Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingMember
                  ? "Perbarui informasi anggota organisasi"
                  : "Tambahkan anggota baru ke struktur organisasi"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <Label htmlFor="photo">Foto Profil</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2">
                    {formData.photoUrl ? (
                      <img
                        src={formData.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadingPhoto ? "Mengupload..." : "Maksimal 5MB (JPG, PNG, WebP)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Dr. Ahmad Santoso, M.Ed"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Jabatan *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Direktur Utama"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Level 0 - Direktur</SelectItem>
                      <SelectItem value="1">Level 1 - Kepala</SelectItem>
                      <SelectItem value="2">Level 2 - Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parentId">Atasan</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih atasan (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada (Top level)</SelectItem>
                      {getAvailableParents().map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name} - {member.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="order">Urutan</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Angka lebih kecil akan ditampilkan lebih dulu
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading || uploadingPhoto}>
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Search className="text-muted-foreground" size={20} />
          <Input
            placeholder="Cari nama atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            <SelectItem value="0">Level 0 - Direktur</SelectItem>
            <SelectItem value="1">Level 1 - Kepala</SelectItem>
            <SelectItem value="2">Level 2 - Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Atasan</TableHead>
              <TableHead>Urutan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Tidak ada anggota organisasi
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => {
                const badge = getLevelBadge(member.level)
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getParentName(member.parentId)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.order}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Total: {filteredMembers.length} anggota
      </div>
    </div>
  )
}