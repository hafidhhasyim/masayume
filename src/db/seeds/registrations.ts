import { db } from '@/db';
import { registrations } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleRegistrations = [
        {
            registrationNumber: 'REG-2024-001',
            fullName: 'Andi Wijaya',
            email: 'andi.wijaya@email.com',
            phone: '+62812-3456-7890',
            dateOfBirth: '1998-05-12',
            education: 'High School Graduate',
            address: 'Jl. Merdeka No. 45, Jakarta Selatan, Jakarta 12160',
            programId: 1,
            status: 'pending',
            notes: null,
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-002',
            fullName: 'Sari Putri',
            email: 'sari.putri@email.com',
            phone: '+62813-9876-5432',
            dateOfBirth: '1997-08-20',
            education: 'Nursing Diploma',
            address: 'Jl. Sudirman No. 123, Bandung, Jawa Barat 40123',
            programId: 3,
            status: 'reviewed',
            notes: 'Strong candidate with nursing background. Pending JLPT N3 certification.',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-003',
            fullName: 'Rudi Hartono',
            email: 'rudi.hartono@email.com',
            phone: '+62821-5555-6666',
            dateOfBirth: '1996-03-15',
            education: 'Technical Vocational High School',
            address: 'Jl. Gatot Subroto No. 78, Surabaya, Jawa Timur 60275',
            programId: 4,
            status: 'accepted',
            notes: 'Accepted for April 2024 batch. Excellent JLPT N4 score. Technical background in mechanics.',
            createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-004',
            fullName: 'Dian Permata',
            email: 'dian.permata@email.com',
            phone: '+62822-7777-8888',
            dateOfBirth: '1999-11-08',
            education: 'Tourism and Hospitality Diploma',
            address: 'Jl. Diponegoro No. 56, Yogyakarta 55221',
            programId: 6,
            status: 'pending',
            notes: null,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-005',
            fullName: 'Bambang Sutrisno',
            email: 'bambang.sutrisno@email.com',
            phone: '+62823-4444-3333',
            dateOfBirth: '1995-07-22',
            education: 'Civil Engineering Diploma',
            address: 'Jl. Ahmad Yani No. 234, Semarang, Jawa Tengah 50123',
            programId: 5,
            status: 'accepted',
            notes: 'Accepted. 3 years construction experience. Safety certifications complete.',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-006',
            fullName: 'Hendra Kusuma',
            email: 'hendra.kusuma@email.com',
            phone: '+62814-2222-1111',
            dateOfBirth: '2006-02-10',
            education: 'Junior High School',
            address: 'Jl. Veteran No. 89, Medan, Sumatera Utara 20111',
            programId: 2,
            status: 'rejected',
            notes: 'Does not meet minimum age requirement (must be 18+). Advised to reapply next year.',
            createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-007',
            fullName: 'Fitri Rahayu',
            email: 'fitri.rahayu@email.com',
            phone: '+62815-9999-0000',
            dateOfBirth: '1997-09-30',
            education: 'University Graduate - Business Administration',
            address: 'Jl. Pahlawan No. 67, Malang, Jawa Timur 65111',
            programId: 1,
            status: 'reviewed',
            notes: 'Under review. Good Japanese language skills. Waiting for skills assessment results.',
            createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            registrationNumber: 'REG-2024-008',
            fullName: 'Novi Anggraini',
            email: 'novi.anggraini@email.com',
            phone: '+62816-3333-4444',
            dateOfBirth: '1998-12-05',
            education: 'Nursing School Graduate',
            address: 'Jl. Kartini No. 12, Denpasar, Bali 80234',
            programId: 3,
            status: 'pending',
            notes: null,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(registrations).values(sampleRegistrations);
    
    console.log('✅ Registrations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});