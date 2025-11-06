"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

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
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

function RegistrationChecker() {
  const searchParams = useSearchParams()
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const regParam = searchParams.get("reg")
    if (regParam) {
      setRegistrationNumber(regParam)
      handleSearch(regParam)
    }
  }, [searchParams])

  const handleSearch = async (regNumber?: string) => {
    const numberToSearch = regNumber || registrationNumber
    if (!numberToSearch.trim()) {
      setError("Masukkan nomor pendaftaran")
      return
    }

    setLoading(true)
    setError(null)
    setRegistration(null)

    try {
      const response = await fetch(`/api/registrations?registration_number=${numberToSearch}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Nomor pendaftaran tidak ditemukan")
        } else {
          throw new Error("Failed to fetch registration")
        }
        return
      }

      const data = await response.json()
      setRegistration(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Sedang Diproses",
          icon: <Clock className="text-yellow-600" size={24} />,
          color: "bg-yellow-100 text-yellow-800",
          description: "Pendaftaran Anda sedang dalam proses review oleh tim kami."
        }
      case "reviewed":
        return {
          label: "Sudah Ditinjau",
          icon: <AlertCircle className="text-blue-600" size={24} />,
          color: "bg-blue-100 text-blue-800",
          description: "Pendaftaran Anda telah ditinjau. Kami akan segera menghubungi Anda."
        }
      case "accepted":
        return {
          label: "Diterima",
          icon: <CheckCircle className="text-green-600" size={24} />,
          color: "bg-green-100 text-green-800",
          description: "Selamat! Pendaftaran Anda telah diterima. Tim kami akan menghubungi Anda untuk langkah selanjutnya."
        }
      case "rejected":
        return {
          label: "Ditolak",
          icon: <XCircle className="text-red-600" size={24} />,
          color: "bg-red-100 text-red-800",
          description: "Mohon maaf, pendaftaran Anda tidak dapat diproses saat ini."
        }
      default:
        return {
          label: status,
          icon: <AlertCircle className="text-gray-600" size={24} />,
          color: "bg-gray-100 text-gray-800",
          description: "Status pendaftaran Anda."
        }
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Masukkan Nomor Pendaftaran</CardTitle>
              <CardDescription>
                Nomor pendaftaran diberikan saat Anda menyelesaikan formulir pendaftaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="registrationNumber">Nomor Pendaftaran</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="REG-2024-001"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Mencari..." : (
                    <>
                      <Search className="mr-2" size={16} />
                      Cek Status
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mt-6 border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <XCircle size={24} />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration Details */}
          {registration && (
            <div className="mt-6 space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Status Pendaftaran</CardTitle>
                    <Badge className={getStatusInfo(registration.status).color}>
                      {getStatusInfo(registration.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-3">
                      {getStatusInfo(registration.status).icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        {getStatusInfo(registration.status).description}
                      </p>
                      {registration.notes && (
                        <div className="mt-4 rounded-lg border border-muted bg-muted/50 p-3">
                          <p className="text-sm font-semibold">Catatan:</p>
                          <p className="text-sm text-muted-foreground">{registration.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detail Pendaftaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nomor Pendaftaran</p>
                        <p className="font-semibold">{registration.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tanggal Pendaftaran</p>
                        <p className="font-semibold">
                          {new Date(registration.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                        <p className="font-semibold">{registration.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-semibold">{registration.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Nomor Telepon</p>
                        <p className="font-semibold">{registration.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pendidikan</p>
                        <p className="font-semibold">{registration.education}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Tambahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {registration.status === "pending" && (
                      <>
                        <p>• Pendaftaran Anda sedang dalam proses review</p>
                        <p>• Tim kami akan menghubungi Anda dalam 1-3 hari kerja</p>
                        <p>• Pastikan nomor telepon dan email Anda aktif</p>
                      </>
                    )}
                    {registration.status === "reviewed" && (
                      <>
                        <p>• Pendaftaran Anda telah ditinjau oleh tim kami</p>
                        <p>• Kami akan menghubungi Anda segera untuk langkah selanjutnya</p>
                        <p>• Periksa email dan telepon Anda secara berkala</p>
                      </>
                    )}
                    {registration.status === "accepted" && (
                      <>
                        <p>• Selamat! Anda telah diterima dalam program kami</p>
                        <p>• Tim kami akan menghubungi Anda untuk informasi jadwal dan persyaratan</p>
                        <p>• Siapkan dokumen-dokumen yang diperlukan</p>
                      </>
                    )}
                    {registration.status === "rejected" && (
                      <>
                        <p>• Anda dapat mencoba mendaftar kembali di periode berikutnya</p>
                        <p>• Hubungi kami untuk informasi lebih lanjut</p>
                        <p>• Periksa persyaratan program yang Anda minati</p>
                      </>
                    )}
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="outline" className="flex-1">
                      <a href="/kontak">Hubungi Kami</a>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <a href="/program">Lihat Program</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function CekPendaftaranPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Cek Status Pendaftaran
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Masukkan nomor pendaftaran Anda untuk melihat status dan informasi terkini
              </p>
            </div>
          </div>
        </section>

        {/* Search Section with Suspense */}
        <Suspense fallback={
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl">
                <Card>
                  <CardHeader>
                    <div className="h-6 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-4 animate-pulse rounded bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-10 animate-pulse rounded bg-muted" />
                      <div className="h-10 animate-pulse rounded bg-muted" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        }>
          <RegistrationChecker />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}