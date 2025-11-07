"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, RefreshCw, Trash2, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"


interface Registration {
  id: number
  registrationNumber: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  education: string
  address: string
  programId: number
  programTitle: string | null
  status: string
  notes: string | null
  createdAt: string
}

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  useEffect(() => {
    let filtered = registrations

    if (searchQuery) {
      filtered = filtered.filter(
        (reg) =>
          reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (reg.programTitle && reg.programTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((reg) => reg.status === statusFilter)
    }

    setFilteredRegistrations(filtered)
  }, [searchQuery, statusFilter, registrations])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations?limit=100")
      const data = await response.json()
      setRegistrations(data)
      setFilteredRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast.error("Gagal memuat data pendaftaran")
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const XLSX = await import("xlsx")
      // Fetch all registrations for export
      const response = await fetch("/api/registrations?limit=1000")
      const data = await response.json()

      // Prepare data for Excel
      const excelData = data.map((reg: Registration, index: number) => ({
        "No": index + 1,
        "No. Pendaftaran": reg.registrationNumber,
        "Nama Lengkap": reg.fullName,
        "Email": reg.email,
        "Telepon": reg.phone,
        "Tanggal Lahir": reg.dateOfBirth,
        "Pendidikan": reg.education,
        "Alamat": reg.address,
        "Program": reg.programTitle || "-",
        "Status": reg.status,
        "Catatan": reg.notes || "-",
        "Tanggal Daftar": new Date(reg.createdAt).toLocaleDateString("id-ID"),
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Set column widths
      ws["!cols"] = [
        { wch: 5 },  // No
        { wch: 18 }, // No. Pendaftaran
        { wch: 25 }, // Nama Lengkap
        { wch: 30 }, // Email
        { wch: 15 }, // Telepon
        { wch: 15 }, // Tanggal Lahir
        { wch: 20 }, // Pendidikan
        { wch: 40 }, // Alamat
        { wch: 30 }, // Program
        { wch: 12 }, // Status
        { wch: 30 }, // Catatan
        { wch: 15 }, // Tanggal Daftar
      ]

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Pendaftaran")

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `laporan-pendaftaran-masayume-${timestamp}.xlsx`

      // Export file
      XLSX.writeFile(wb, filename)

      toast.success("Data berhasil diexport ke Excel")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast.error("Gagal export data ke Excel")
    } finally {
      setExporting(false)
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/registrations?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Status berhasil diperbarui")
        await fetchRegistrations()
        setSelectedRegistration(null)
      } else {
        toast.error("Gagal memperbarui status")
      }
    } catch (error) {
      console.error("Error updating registration:", error)
      toast.error("Gagal memperbarui status")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteClick = (registration: Registration) => {
    setRegistrationToDelete(registration)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!registrationToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/registrations?id=${registrationToDelete.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Pendaftaran berhasil dihapus")
        await fetchRegistrations()
        setDeleteDialogOpen(false)
        setRegistrationToDelete(null)
      } else {
        const data = await response.json()
        toast.error(data.error || "Gagal menghapus pendaftaran")
      }
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast.error("Gagal menghapus pendaftaran")
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return variants[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kelola Pendaftaran</CardTitle>
              <CardDescription>Review dan update status pendaftaran peserta</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportExcel} 
                variant="outline" 
                size="sm"
                disabled={exporting || registrations.length === 0}
              >
                <FileSpreadsheet className="mr-2" size={16} />
                {exporting ? "Exporting..." : "Export Excel"}
              </Button>
              <Button onClick={fetchRegistrations} variant="outline" size="sm">
                <RefreshCw className="mr-2" size={16} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari nama, email, program, atau nomor pendaftaran..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Pendaftaran</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.registrationNumber}</TableCell>
                        <TableCell>{reg.fullName}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {reg.programTitle || "-"}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(reg.createdAt).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(reg.status)}>{reg.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRegistration(reg)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(reg)}
                              className="text-destructive hover:text-destructive"
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pendaftaran</DialogTitle>
            <DialogDescription>{selectedRegistration?.registrationNumber}</DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Nama Lengkap</Label>
                  <p className="text-sm">{selectedRegistration.fullName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label>Telepon</Label>
                  <p className="text-sm">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <Label>Tanggal Lahir</Label>
                  <p className="text-sm">{selectedRegistration.dateOfBirth}</p>
                </div>
                <div>
                  <Label>Pendidikan</Label>
                  <p className="text-sm">{selectedRegistration.education}</p>
                </div>
                <div>
                  <Label>Program</Label>
                  <p className="text-sm font-medium">{selectedRegistration.programTitle || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <Label>Alamat</Label>
                  <p className="text-sm">{selectedRegistration.address}</p>
                </div>
                {selectedRegistration.notes && (
                  <div className="md:col-span-2">
                    <Label>Catatan</Label>
                    <p className="text-sm">{selectedRegistration.notes}</p>
                  </div>
                )}
                <div>
                  <Label>Status Saat Ini</Label>
                  <Badge className={getStatusBadge(selectedRegistration.status)}>
                    {selectedRegistration.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select
                  onValueChange={(value) => handleUpdateStatus(selectedRegistration.id, value)}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status baru" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pendaftaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pendaftaran <strong>{registrationToDelete?.fullName}</strong> ({registrationToDelete?.registrationNumber})?
              <br /><br />
              Tindakan ini tidak dapat dibatalkan dan data akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
