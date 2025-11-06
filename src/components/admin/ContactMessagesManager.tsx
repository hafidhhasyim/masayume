"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, RefreshCw, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function ContactMessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredMessages(
        messages.filter(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredMessages(messages)
    }
  }, [searchQuery, messages])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/contact-messages?limit=100")
      const data = await response.json()
      setMessages(data)
      setFilteredMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Gagal memuat pesan kontak")
    } finally {
      setLoading(false)
    }
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    setDialogOpen(true)

    // Mark as read if still new
    if (message.status === "new") {
      markAsRead(message.id)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/contact-messages?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      })
      fetchMessages()
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return

    try {
      const response = await fetch(`/api/contact-messages?id=${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete message")

      toast.success("Pesan berhasil dihapus")
      fetchMessages()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Gagal menghapus pesan")
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "new"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pesan Kontak</CardTitle>
              <CardDescription>Lihat dan kelola pesan dari pengunjung</CardDescription>
            </div>
            <Button onClick={fetchMessages} variant="outline" size="sm">
              <RefreshCw className="mr-2" size={16} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Cari nama, email, atau subjek..."
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
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subjek</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell>
                          {new Date(message.createdAt).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(message.status)}>
                            {message.status === "new" ? "Baru" : "Dibaca"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(message.id)}
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

      {/* Message Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pesan</DialogTitle>
            <DialogDescription>
              Pesan dari {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nama</p>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telepon</p>
                    <p>{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
                  <p>{new Date(selectedMessage.createdAt).toLocaleString("id-ID")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Subjek</p>
                <p className="font-semibold">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Pesan</p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg border bg-muted/50 p-4">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage.id)}
                >
                  Hapus Pesan
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Tutup</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
