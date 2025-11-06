import { db } from '@/db';
import { sliders } from '@/db/schema';

async function main() {
    const sampleSliders = [
        {
            title: 'Program Pelatihan Kerja Jepang',
            subtitle: 'Bergabunglah dengan program pelatihan komprehensif kami',
            description: 'Bergabunglah dengan program pelatihan komprehensif kami dan raih kesempatan berkarir di Jepang dengan gaji hingga ¥300.000 per bulan.',
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
            image2Url: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80',
            buttonText: 'Lihat Program',
            buttonLink: '/program',
            order: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Wujudkan Mimpi Berkarir di Jepang',
            subtitle: 'Pelatihan Bahasa & Budaya Jepang',
            description: 'Dapatkan pelatihan bahasa Jepang intensif dari instruktur berpengalaman dan pelajari budaya kerja Jepang untuk kesuksesan karir Anda.',
            imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
            image2Url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
            buttonText: 'Daftar Sekarang',
            buttonLink: '/daftar',
            order: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(sliders).values(sampleSliders);
    
    console.log('✅ Sliders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});