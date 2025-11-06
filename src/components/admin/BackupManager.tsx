"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Download, Upload, Loader2, AlertTriangle, Database, FileDown, FileUp, CheckCircle } from "lucide-react"

export function BackupManager() {
  const [downloading, setDownloading] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDownloadBackup = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/backup')
      
      if (!response.ok) {
        throw new Error('Gagal mengunduh backup')
      }

      const data = await response.json()
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      a.download = `backup-masayume-${timestamp}.json`
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Backup berhasil diunduh')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Gagal mengunduh backup')
    } finally {
      setDownloading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.json')) {
      toast.error('File harus berformat JSON')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 50MB')
      return
    }

    setSelectedFile(file)
    toast.success(`File "${file.name}" siap diupload`)
  }

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      toast.error('Pilih file backup terlebih dahulu')
      return
    }

    // Confirmation
    const confirmed = confirm(
      '⚠️ PERINGATAN: Proses restore akan menghapus semua data yang ada dan menggantinya dengan data dari backup.\n\n' +
      'Apakah Anda yakin ingin melanjutkan?'
    )

    if (!confirmed) return

    setRestoring(true)
    try {
      // Read file content
      const fileContent = await selectedFile.text()
      const backupData = JSON.parse(fileContent)

      // Validate backup format
      if (!backupData.data) {
        throw new Error('Format backup tidak valid')
      }

      // Send to API
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Gagal restore backup')
      }

      const result = await response.json()
      
      toast.success(`Data berhasil direstore! ${result.results?.length || 0} tabel dipulihkan`)
      setSelectedFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('backup-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Reload page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Restore error:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal restore backup')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Backup & Restore</h2>
        <p className="text-muted-foreground">Kelola backup data website</p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Penting:</strong> Backup mencakup semua data aplikasi termasuk program, berita, lulusan, galeri, pendaftaran, kontak, dan pengaturan. 
          Proses restore akan menghapus data yang ada dan menggantinya dengan data dari backup.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Download Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileDown className="text-primary" size={24} />
              <div>
                <CardTitle>Download Backup</CardTitle>
                <CardDescription>Unduh backup semua data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Database size={16} className="text-muted-foreground" />
                <span className="font-medium">Yang akan di-backup:</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Program pelatihan</li>
                <li>Berita & artikel</li>
                <li>Data lulusan</li>
                <li>Galeri foto</li>
                <li>Slider homepage</li>
                <li>Data pendaftaran</li>
                <li>Pesan kontak</li>
                <li>Profil organisasi</li>
                <li>Pengaturan website</li>
              </ul>
            </div>

            <Button 
              onClick={handleDownloadBackup} 
              disabled={downloading}
              className="w-full"
              size="lg"
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={20} />
                  Download Backup
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              File akan diunduh dalam format JSON dengan timestamp
            </p>
          </CardContent>
        </Card>

        {/* Restore Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileUp className="text-primary" size={24} />
              <div>
                <CardTitle>Restore Backup</CardTitle>
                <CardDescription>Pulihkan data dari backup</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-file">Pilih File Backup</Label>
              <Input
                id="backup-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={restoring}
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle size={16} />
                  <span>{selectedFile.name}</span>
                  <span className="text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Peringatan:</strong> Restore akan menghapus semua data yang ada. 
                Pastikan Anda sudah mendownload backup terbaru sebelum melakukan restore.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleRestoreBackup}
              disabled={!selectedFile || restoring}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              {restoring ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Restore Data
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Halaman akan reload otomatis setelah restore selesai
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Backup Rutin:</strong> Lakukan backup secara berkala, minimal 1x seminggu atau sebelum perubahan besar</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Simpan Aman:</strong> Simpan file backup di lokasi yang aman (Google Drive, cloud storage, atau hard drive eksternal)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Verifikasi:</strong> Setelah download, buka file JSON untuk memastikan isinya lengkap</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Testing:</strong> Test restore di environment development dulu sebelum di production</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
              <span><strong>Multiple Versions:</strong> Simpan beberapa versi backup dengan timestamp berbeda</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
