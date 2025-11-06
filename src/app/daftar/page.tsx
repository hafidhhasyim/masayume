"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Program {
  id: number
  title: string
}

export default function DaftarPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    education: "",
    address: "",
    programId: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch("/api/programs?limit=100&is_active=true")
        if (!response.ok) throw new Error("Failed to fetch programs")
        const data = await response.json()
        setPrograms(data)
      } catch (error) {
        console.error("Error fetching programs:", error)
        toast.error("Gagal memuat daftar program")
      } finally {
        setLoadingPrograms(false)
      }
    }

    fetchPrograms()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          programId: parseInt(formData.programId),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit registration")
      }

      const data = await response.json()
      setRegistrationNumber(data.registrationNumber)
      setSuccess(true)
      toast.success("Pendaftaran berhasil!")
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        education: "",
        address: "",
        programId: "",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success && registrationNumber) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="flex-1">
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl">
                <Card>
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle className="text-green-600" size={48} />
                      </div>
                    </div>
                    <CardTitle className="text-3xl">Pendaftaran Berhasil!</CardTitle>
                    <CardDescription>
                      Terima kasih telah mendaftar di masayume.id
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg bg-primary/10 p-6 text-center">
                      <p className="mb-2 text-sm text-muted-foreground">Nomor Pendaftaran Anda:</p>
                      <p className="text-3xl font-bold text-primary">{registrationNumber}</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Simpan nomor ini untuk mengecek status pendaftaran Anda
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg border p-4">
                      <h3 className="font-semibold">Langkah Selanjutnya:</h3>
                      <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                        <li>Tim kami akan meninjau pendaftaran Anda dalam 1-3 hari kerja</li>
                        <li>Anda akan dihubungi via email atau telepon untuk verifikasi data</li>
                        <li>Jika diterima, Anda akan mendapatkan informasi jadwal tes dan interview</li>
                        <li>Cek status pendaftaran Anda secara berkala</li>
                      </ol>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="flex-1">
                        <a href={`/cek-pendaftaran?reg=${registrationNumber}`}>
                          Cek Status Pendaftaran
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <a href="/">Kembali ke Beranda</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Formulir Pendaftaran
              </h1>
              <p className="text-lg text-primary-foreground/90 sm:text-xl">
                Isi formulir di bawah ini dengan lengkap dan benar untuk memulai proses pendaftaran
              </p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle>Data Calon Peserta</CardTitle>
                  <CardDescription>
                    Pastikan semua informasi yang Anda masukkan adalah benar dan sesuai dengan dokumen resmi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Sesuai KTP/Kartu Identitas"
                        disabled={loading}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Nomor Telepon/WhatsApp *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+62812-xxxx-xxxx"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="education">Pendidikan Terakhir *</Label>
                        <Input
                          id="education"
                          name="education"
                          type="text"
                          required
                          value={formData.education}
                          onChange={handleChange}
                          placeholder="Contoh: SMA, D3, S1"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        required
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Alamat sesuai KTP"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="programId">Program yang Diminati *</Label>
                      {loadingPrograms ? (
                        <div className="flex h-10 items-center justify-center rounded-md border">
                          <Loader2 className="animate-spin text-muted-foreground" size={16} />
                        </div>
                      ) : (
                        <Select
                          value={formData.programId}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, programId: value }))
                          }
                          required
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Tidak ada program tersedia
                              </SelectItem>
                            ) : (
                              programs.map((program) => (
                                <SelectItem key={program.id} value={program.id.toString()}>
                                  {program.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="rounded-lg border border-muted bg-muted/50 p-4">
                      <h3 className="mb-2 font-semibold">Catatan Penting:</h3>
                      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>Pastikan semua data yang diisi adalah benar dan valid</li>
                        <li>Anda akan menerima nomor pendaftaran setelah submit formulir ini</li>
                        <li>Tim kami akan menghubungi Anda dalam 1-3 hari kerja</li>
                        <li>Simpan nomor pendaftaran untuk mengecek status</li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button type="submit" className="flex-1" disabled={loading || loadingPrograms}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={16} />
                            Mengirim...
                          </>
                        ) : (
                          "Daftar Sekarang"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push("/")}
                        disabled={loading}
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}