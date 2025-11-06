import { db } from '@/db';
import { siteSettings } from '@/db/schema';

async function main() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const initialSetupDate = sixMonthsAgo.toISOString();

    const sampleSettings = [
        {
            key: 'site_name',
            value: 'LPK Sukses Jaya - Japan Work Program Training Center',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'site_tagline',
            value: 'Your Gateway to Professional Career Opportunities in Japan',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'contact_email',
            value: 'info@lpksuksesjaya.com',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'contact_phone',
            value: '+62-21-5555-1234',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'office_address',
            value: 'Jl. Gatot Subroto No. 123, Jakarta Pusat, DKI Jakarta 10270, Indonesia',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'whatsapp_number',
            value: '+62-812-3456-7890',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'office_hours',
            value: 'Monday - Friday: 08:00 - 17:00 WIB, Saturday: 08:00 - 14:00 WIB, Sunday: Closed',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
        {
            key: 'social_media',
            value: '{"facebook":"https://facebook.com/lpksuksesjaya","instagram":"https://instagram.com/lpksuksesjaya","youtube":"https://youtube.com/@lpksuksesjaya","tiktok":"https://tiktok.com/@lpksuksesjaya"}',
            createdAt: initialSetupDate,
            updatedAt: initialSetupDate,
        },
    ];

    await db.insert(siteSettings).values(sampleSettings);
    
    console.log('✅ Site settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});