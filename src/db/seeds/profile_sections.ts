import { db } from '@/db';
import { profileSections } from '@/db/schema';

async function main() {
    const sampleProfileSections = [
        {
            section: 'history',
            title: 'Sejarah Kami',
            content: 'Berdiri sejak 2010, masayume.id telah menjadi lembaga pelatihan kerja Jepang terpercaya dengan track record yang solid. Kami telah meluluskan lebih dari 500 peserta yang kini sukses berkarir di berbagai perusahaan ternama di Jepang. Komitmen kami adalah memberikan pelatihan berkualitas tinggi dan pendampingan penuh kepada setiap peserta.',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'vision-mission',
            title: 'Visi & Misi',
            content: 'VISI: Menjadi lembaga pelatihan kerja Jepang terdepan di Indonesia yang menghasilkan tenaga kerja profesional dan berkualitas tinggi.\n\nMISI:\n1. Memberikan pelatihan bahasa dan budaya Jepang berkualitas tinggi\n2. Menyediakan program pelatihan yang komprehensif dan aplikatif\n3. Membangun kemitraan dengan perusahaan-perusahaan terkemuka di Jepang\n4. Mendampingi peserta hingga sukses berkarir di Jepang',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'organization',
            title: 'Struktur Organisasi',
            content: 'DIREKTUR UTAMA\nBambang Susanto, S.Pd., M.Ed.\n\nMANAGER OPERASIONAL\nSiti Nurhaliza, S.S.\n\nKEPALA BIDANG PELATIHAN\nYuki Tanaka (Native Speaker)\n\nKEPALA BIDANG PENEMPATAN\nRudi Hartono, S.Sos.\n\nSTAF ADMINISTRASI & KEUANGAN\nDewi Lestari, S.E.\n\nINSTRUKTUR BAHASA JEPANG\n- Takeshi Yamamoto (Native)\n- Akiko Sato (Native)\n- Ahmad Fauzi, S.S. (Bahasa)\n- Rina Kusuma, S.Pd. (Budaya)',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'facilities',
            title: 'Fasilitas Kami',
            content: 'Kami menyediakan fasilitas modern dan nyaman untuk mendukung proses pembelajaran:\n\n✓ Ruang kelas ber-AC dengan kapasitas 20-30 orang\n✓ Laboratorium bahasa multimedia\n✓ Perpustakaan dengan koleksi buku bahasa Jepang lengkap\n✓ Ruang praktik budaya Jepang\n✓ Asrama peserta yang nyaman dan aman\n✓ Kantin dengan menu halal\n✓ Area olahraga dan rekreasi\n✓ WiFi high-speed di seluruh area\n✓ Musholla\n✓ Ruang konseling',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            section: 'certificates',
            title: 'Sertifikat & Legalitas',
            content: 'Lembaga kami telah memiliki izin resmi dan sertifikasi dari berbagai instansi:\n\n✓ Izin Operasional LPK dari Dinas Tenaga Kerja\n✓ Sertifikasi ISO 9001:2015 untuk Manajemen Mutu\n✓ Terakreditasi A dari Kementerian Ketenagakerjaan RI\n✓ Terdaftar di Japan International Training Cooperation Organization (JITCO)\n✓ Anggota Asosiasi LPK Pengirim Pekerja Indonesia\n✓ Kerjasama resmi dengan 50+ perusahaan di Jepang\n\nSetiap peserta yang lulus akan mendapatkan:\n- Sertifikat Kelulusan dari LPK masayume.id\n- Sertifikat JLPT (Japanese Language Proficiency Test)\n- Sertifikat Keterampilan Teknis',
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(profileSections).values(sampleProfileSections);
    
    console.log('✅ Profile sections seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});