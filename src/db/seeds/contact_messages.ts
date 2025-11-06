import { db } from '@/db';
import { contactMessages } from '@/db/schema';

async function main() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const sampleContactMessages = [
        {
            name: 'Yudi Prasetya',
            email: 'yudi.prasetya@email.com',
            phone: '+62817-5555-6666',
            subject: 'Inquiry about Tokutei Ginou Program Requirements',
            message: 'Hello, I am interested in applying for the Tokutei Ginou program. Could you please provide more details about the JLPT N4 requirement? Is there any preparatory course available? Also, what is the duration of training before departure? Thank you.',
            status: 'new',
            createdAt: oneDayAgo.toISOString(),
        },
        {
            name: 'Retno Wulandari',
            email: 'retno.wulan@email.com',
            phone: '+62818-7777-8888',
            subject: 'Training Cost and Payment Options',
            message: 'Good afternoon, I would like to know about the total cost for the Nursing Care program including training fees, documentation, and visa processing. Are there any payment installment options available? I am very serious about joining this program. Looking forward to your response.',
            status: 'read',
            createdAt: threeDaysAgo.toISOString(),
        },
        {
            name: 'Ahmad Fauzi',
            email: 'ahmad.fauzi@email.com',
            phone: '+62819-1111-2222',
            subject: 'Next Batch Schedule for Manufacturing Program',
            message: 'Dear LPK Team, when will the next batch for the Manufacturing program start? I have completed my technical vocational high school and am ready to start training immediately. Please inform me about the registration deadline and required documents. Thank you very much.',
            status: 'replied',
            createdAt: fiveDaysAgo.toISOString(),
        },
        {
            name: 'Budi Santoso',
            email: 'budi.santoso.biz@email.com',
            phone: '+62821-3333-4444',
            subject: 'Partnership Opportunity for Corporate Training',
            message: 'Hello, I represent a manpower agency and am interested in potential partnership opportunities with your training center. We have clients looking for skilled workers for Japan. Could we schedule a meeting to discuss collaboration possibilities? Please contact me at your earliest convenience.',
            status: 'new',
            createdAt: twoDaysAgo.toISOString(),
        },
        {
            name: 'Dewi Lestari',
            email: 'dewi.lestari99@email.com',
            phone: '+62822-5555-6666',
            subject: 'Required Documents for Application',
            message: 'Hi, I want to apply for the Hospitality program but I\'m not sure about all the required documents. Do I need to have JLPT certification before applying or can I take the test during training? Also, is a recommendation letter required? Please advise. Thank you!',
            status: 'read',
            createdAt: fourDaysAgo.toISOString(),
        },
        {
            name: 'Rina Kusuma',
            email: 'rina.kusuma@email.com',
            phone: null,
            subject: 'Contact Information for Alumni Network',
            message: 'Good morning, I am a graduate from your 2019 batch and currently working in Tokyo. I would like to connect with other alumni and possibly contribute to sharing my experience with current trainees. Could you provide information about the alumni network or upcoming alumni events? Best regards.',
            status: 'new',
            createdAt: oneHourAgo.toISOString(),
        },
    ];

    await db.insert(contactMessages).values(sampleContactMessages);
    
    console.log('✅ Contact messages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});