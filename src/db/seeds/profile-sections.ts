import { db } from "../index"
import { profileSections } from "../schema"

export async function seedProfileSections() {
  console.log("Seeding profile sections...")

  const sections = [
    {
      section: "history",
      title: "Sejarah LPK Masayume",
      content: `LPK Masayume didirikan pada tahun 2013 dengan visi menjadi lembaga pelatihan kerja terdepan dalam mempersiapkan tenaga kerja Indonesia untuk bekerja di Jepang. Berawal dari sebuah program kecil dengan hanya 20 peserta, kini kami telah meluluskan lebih dari 500 peserta yang sukses berkarir di berbagai perusahaan ternama di Jepang.

Perjalanan kami dimulai dengan kerjasama pertama bersama Toyota Motor Corporation, yang membuka jalan bagi kemitraan dengan perusahaan-perusahaan besar lainnya seperti Honda, Panasonic, dan Mitsubishi. Setiap tahun, kami terus meningkatkan kualitas pelatihan dan fasilitas untuk memastikan peserta kami mendapatkan persiapan terbaik.

Komitmen kami adalah memberikan pelatihan komprehensif yang mencakup bahasa Jepang, budaya kerja Jepang, keterampilan teknis, dan pembentukan karakter yang kuat. Kami percaya bahwa kesuksesan peserta adalah kesuksesan kami.`,
      imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80"
    },
    {
      section: "vision-mission",
      title: "Visi & Misi",
      content: `VISI:
Menjadi lembaga pelatihan kerja terkemuka di Indonesia yang menghasilkan tenaga kerja profesional dan berkualitas untuk pasar kerja internasional, khususnya Jepang.

MISI:
1. Menyelenggarakan program pelatihan yang komprehensif dan berkualitas tinggi sesuai standar industri Jepang
2. Membangun kemitraan strategis dengan perusahaan-perusahaan ternama di Jepang untuk memberikan kesempatan kerja terbaik bagi peserta
3. Mengembangkan karakter, disiplin, dan etos kerja peserta sesuai dengan budaya kerja Jepang
4. Memberikan pendampingan penuh mulai dari pelatihan hingga penempatan kerja di Jepang
5. Meningkatkan kesejahteraan tenaga kerja Indonesia melalui kesempatan berkarir di perusahaan internasional`,
      imageUrl: null
    },
    {
      section: "values",
      title: "Nilai-nilai Pengajaran",
      content: `Dalam setiap program pelatihan, kami menanamkan nilai-nilai fundamental yang menjadi fondasi kesuksesan peserta di Jepang:

1. DISIPLIN & TANGGUNG JAWAB
Kami menanamkan kedisiplinan tinggi dalam setiap aspek kehidupan, dari ketepatan waktu hingga penyelesaian tugas. Peserta diajarkan untuk bertanggung jawab penuh atas pekerjaan mereka.

2. KERJA KERAS & DEDIKASI
Etos kerja yang kuat adalah kunci kesuksesan. Kami melatih peserta untuk bekerja dengan dedikasi tinggi dan tidak mudah menyerah menghadapi tantangan.

3. INTEGRITAS & KEJUJURAN
Kejujuran dan integritas adalah nilai yang tidak dapat ditawar. Peserta diajarkan untuk selalu jujur dan menjaga kepercayaan yang diberikan.

4. TEAMWORK & KOMUNIKASI
Kemampuan bekerja dalam tim dan berkomunikasi efektif sangat penting dalam lingkungan kerja Jepang. Kami melatih kolaborasi dan komunikasi yang baik.

5. CONTINUOUS IMPROVEMENT (KAIZEN)
Filosofi perbaikan berkelanjutan ditanamkan dalam setiap peserta untuk selalu berusaha menjadi lebih baik setiap harinya.

6. RESPECT & HUMILITY
Menghormati orang lain dan bersikap rendah hati adalah nilai penting dalam budaya Jepang yang kami ajarkan kepada semua peserta.`,
      imageUrl: null
    },
    {
      section: "organization",
      title: "Struktur Organisasi",
      content: `Direktur Utama: Dr. Ahmad Santoso, M.Ed
- Wakil Direktur: Ir. Sari Wulandari, M.T
- Kepala Program Pelatihan: Budi Pratama, S.Kom, M.Pd
- Kepala Kemitraan Internasional: Lisa Hartono, S.T
  ├─ Koordinator Penempatan: Dewi Lestari, S.Sos
  ├─ Staff Administrasi: Agus Wijaya, S.E
  └─ Koordinator Alumni: Rina Kusuma, S.Pd
- Kepala Keuangan & Umum: Bambang Setiawan, S.E, Ak
  ├─ Staff Keuangan: Maya Anggraini, S.E
  └─ Staff Umum & Fasilitas: Dedi Kurniawan`,
      imageUrl: null
    },
    {
      section: "facilities",
      title: "Fasilitas Pelatihan",
      content: `LPK Masayume menyediakan fasilitas modern dan lengkap untuk mendukung proses pelatihan yang optimal:

RUANG KELAS & PELATIHAN:
- 8 ruang kelas ber-AC dengan kapasitas 25 peserta
- Laboratorium komputer dengan 40 unit PC
- Ruang praktik keterampilan teknis
- Perpustakaan dengan koleksi buku bahasa Jepang dan materi pelatihan
- Ruang audio-visual untuk pembelajaran multimedia

FASILITAS PENUNJANG:
- Asrama nyaman untuk 100 peserta dengan kamar ber-AC
- Kantin dengan menu bergizi seimbang
- Masjid dan ruang ibadah
- Lapangan olahraga dan gym
- Ruang kesehatan dengan tenaga medis
- Area parkir luas
- WiFi berkecepatan tinggi di seluruh area

SARANA LAINNYA:
- Aula serbaguna untuk berbagai kegiatan
- Ruang konseling dan bimbingan
- Area rekreasi dan taman
- Sistem keamanan 24 jam dengan CCTV`,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    },
    {
      section: "certificates",
      title: "Sertifikat & Legalitas",
      content: `LPK Masayume memiliki legalitas dan sertifikasi lengkap sebagai lembaga pelatihan kerja resmi:

LEGALITAS OPERASIONAL:
✓ Izin Operasional LPK dari Kementerian Ketenagakerjaan RI
✓ Nomor Induk Berusaha (NIB) yang aktif
✓ NPWP dan dokumen perpajakan lengkap
✓ Akreditasi "A" dari Badan Nasional Sertifikasi Profesi (BNSP)

SERTIFIKASI INTERNASIONAL:
✓ Kerjasama Resmi dengan Japan International Training Cooperation Organization (JITCO)
✓ Partner Resmi Technical Intern Training Program (TITP) Jepang
✓ Sertifikat ISO 9001:2015 untuk Sistem Manajemen Mutu
✓ Keanggotaan aktif di Asosiasi LPK Indonesia (APJATI)

SERTIFIKAT PROGRAM:
✓ Sertifikat JLPT (Japanese Language Proficiency Test) N5-N3
✓ Sertifikat Kompetensi Teknis dari BNSP
✓ Sertifikat Pre-Departure Training
✓ Sertifikat Budaya dan Etika Kerja Jepang

Semua peserta yang lulus akan mendapatkan sertifikat resmi yang diakui secara internasional dan menjadi syarat penting untuk penempatan kerja di Jepang.`,
      imageUrl: null
    }
  ]

  try {
    // Clear existing data
    await db.delete(profileSections)

    // Insert new data
    for (const section of sections) {
      await db.insert(profileSections).values(section)
    }

    console.log(`✓ Successfully seeded ${sections.length} profile sections`)
  } catch (error) {
    console.error("Error seeding profile sections:", error)
    throw error
  }
}
