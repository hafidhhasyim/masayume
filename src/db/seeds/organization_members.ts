import { db } from '@/db';
import { organizationMembers } from '@/db/schema';

async function main() {
    const sampleMembers = [
        // LEVEL 0 - Top Management (1 person)
        {
            name: 'Dr. Ahmad Santoso, M.Ed',
            position: 'Direktur Utama',
            photoUrl: null,
            level: 0,
            order: 0,
            parentId: null,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        
        // LEVEL 1 - Department Heads (4 people under Director)
        {
            name: 'Ir. Sari Wulandari, M.T',
            position: 'Wakil Direktur Operasional',
            photoUrl: null,
            level: 1,
            order: 0,
            parentId: 1,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-02-01').toISOString(),
        },
        {
            name: 'Budi Pratama, S.Kom, M.Pd',
            position: 'Kepala Bidang Pelatihan & Kurikulum',
            photoUrl: null,
            level: 1,
            order: 1,
            parentId: 1,
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-05').toISOString(),
        },
        {
            name: 'Lisa Hartono, S.T',
            position: 'Kepala Bidang Kemitraan Internasional',
            photoUrl: null,
            level: 1,
            order: 2,
            parentId: 1,
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            name: 'Bambang Setiawan, S.E, Ak',
            position: 'Kepala Bidang Keuangan & Umum',
            photoUrl: null,
            level: 1,
            order: 3,
            parentId: 1,
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-02-15').toISOString(),
        },
        
        // LEVEL 2 - Staff Members (6 people under different departments)
        // Under Wakil Direktur (id 2)
        {
            name: 'Yuki Tanaka',
            position: 'Koordinator Instruktur Bahasa Jepang',
            photoUrl: null,
            level: 2,
            order: 0,
            parentId: 2,
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date('2024-03-01').toISOString(),
        },
        
        // Under Kepala Pelatihan (id 3)
        {
            name: 'Rina Kusuma, S.Pd',
            position: 'Staff Administrasi Pelatihan',
            photoUrl: null,
            level: 2,
            order: 0,
            parentId: 3,
            createdAt: new Date('2024-03-05').toISOString(),
            updatedAt: new Date('2024-03-05').toISOString(),
        },
        {
            name: 'Ahmad Fauzi, S.S',
            position: 'Koordinator Program Tokutei Ginou',
            photoUrl: null,
            level: 2,
            order: 1,
            parentId: 3,
            createdAt: new Date('2024-03-10').toISOString(),
            updatedAt: new Date('2024-03-10').toISOString(),
        },
        
        // Under Kepala Kemitraan (id 4)
        {
            name: 'Dewi Lestari, S.Sos',
            position: 'Koordinator Penempatan Kerja',
            photoUrl: null,
            level: 2,
            order: 0,
            parentId: 4,
            createdAt: new Date('2024-03-15').toISOString(),
            updatedAt: new Date('2024-03-15').toISOString(),
        },
        {
            name: 'Agus Wijaya, S.E',
            position: 'Staff Dokumentasi & Visa',
            photoUrl: null,
            level: 2,
            order: 1,
            parentId: 4,
            createdAt: new Date('2024-03-20').toISOString(),
            updatedAt: new Date('2024-03-20').toISOString(),
        },
        
        // Under Kepala Keuangan (id 5)
        {
            name: 'Maya Anggraini, S.E',
            position: 'Staff Keuangan & Akuntansi',
            photoUrl: null,
            level: 2,
            order: 0,
            parentId: 5,
            createdAt: new Date('2024-03-25').toISOString(),
            updatedAt: new Date('2024-03-25').toISOString(),
        },
    ];

    await db.insert(organizationMembers).values(sampleMembers);
    
    console.log('✅ Organization members seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});