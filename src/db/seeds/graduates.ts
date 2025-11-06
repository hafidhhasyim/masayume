import { db } from '@/db';
import { graduates } from '@/db/schema';

async function main() {
    const sampleGraduates = [
        {
            name: 'Budi Santoso',
            company: 'Toyota Motor Corporation',
            position: 'Production Technician',
            year: 2021,
            country: 'Japan',
            testimonial: 'Working at Toyota has been a dream come true. The training I received at the LPK prepared me perfectly for the high standards expected here. I\'ve been promoted twice and now lead a small team. The salary is excellent and I\'m able to support my family back home while saving for the future. I\'m grateful for the opportunity.',
            photoUrl: '/images/graduates/budi-santoso.jpg',
            createdAt: new Date('2023-03-15').toISOString(),
            updatedAt: new Date('2023-03-15').toISOString(),
        },
        {
            name: 'Siti Nurhaliza',
            company: 'Tokyo Medical Center',
            position: 'Certified Caregiver',
            year: 2020,
            country: 'Japan',
            testimonial: 'Being a caregiver in Japan has taught me so much about compassion and professionalism. The patients and their families are very kind. The hospital provides continuous training and the working conditions are excellent. I\'ve obtained my Japanese nursing certification and plan to advance my career here. I\'m truly happy with my decision.',
            photoUrl: '/images/graduates/siti-nurhaliza.jpg',
            createdAt: new Date('2023-05-20').toISOString(),
            updatedAt: new Date('2023-05-20').toISOString(),
        },
        {
            name: 'Ahmad Rizki',
            company: 'Honda Motor Co., Ltd.',
            position: 'Assembly Line Supervisor',
            year: 2019,
            country: 'Japan',
            testimonial: 'I started as a production worker and through hard work and dedication, I was promoted to supervisor. Honda values skill and effort, regardless of nationality. The company culture is amazing and I\'ve learned so much about Japanese manufacturing excellence. My Japanese language skills have improved tremendously and I feel like I\'m part of the Honda family.',
            photoUrl: '/images/graduates/ahmad-rizki.jpg',
            createdAt: new Date('2023-07-10').toISOString(),
            updatedAt: new Date('2023-07-10').toISOString(),
        },
        {
            name: 'Dewi Lestari',
            company: 'Park Hyatt Tokyo',
            position: 'Front Desk Manager',
            year: 2020,
            country: 'Japan',
            testimonial: 'The hospitality industry in Japan sets the global standard for service excellence. Working at Park Hyatt has been an incredible learning experience. I\'ve grown from a front desk staff to a manager position. The hotel invested in my development with training programs and language courses. Tokyo is an amazing city to live and work in.',
            photoUrl: '/images/graduates/dewi-lestari.jpg',
            createdAt: new Date('2023-09-05').toISOString(),
            updatedAt: new Date('2023-09-05').toISOString(),
        },
        {
            name: 'Eko Prasetyo',
            company: 'Takenaka Corporation',
            position: 'Construction Foreman',
            year: 2018,
            country: 'Japan',
            testimonial: 'Construction work in Japan is very different from back home - the focus on safety and quality is incredible. I\'ve worked on several major projects including commercial buildings and infrastructure. The salary is good and I\'ve earned multiple Japanese construction certifications. I\'m proud of what I\'ve achieved and the skills I\'ve gained.',
            photoUrl: '/images/graduates/eko-prasetyo.jpg',
            createdAt: new Date('2023-11-12').toISOString(),
            updatedAt: new Date('2023-11-12').toISOString(),
        },
        {
            name: 'Rina Wijaya',
            company: 'Panasonic Corporation',
            position: 'Quality Control Specialist',
            year: 2021,
            country: 'Japan',
            testimonial: 'Panasonic has given me the opportunity to work in advanced electronics manufacturing. I ensure every product meets the highest quality standards. The work environment is excellent and the company truly cares about employee welfare. I\'ve made many Japanese friends and feel integrated into society here.',
            photoUrl: '/images/graduates/rina-wijaya.jpg',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            name: 'Agus Setiawan',
            company: 'Royal Park Hotel Kyoto',
            position: 'Sous Chef',
            year: 2019,
            country: 'Japan',
            testimonial: 'Working in a Japanese hotel restaurant has elevated my culinary skills to a new level. I\'ve learned traditional Japanese cuisine alongside international cooking. The head chef is an excellent mentor and the kitchen team is very professional. Kyoto is a beautiful city with rich culture. I\'m living my passion every day.',
            photoUrl: '/images/graduates/agus-setiawan.jpg',
            createdAt: new Date('2024-03-25').toISOString(),
            updatedAt: new Date('2024-03-25').toISOString(),
        },
        {
            name: 'Maya Kusuma',
            company: 'Sompo Care Inc.',
            position: 'Senior Care Specialist',
            year: 2020,
            country: 'Japan',
            testimonial: 'Caring for elderly Japanese patients has been incredibly rewarding. They are so kind and appreciative. Sompo Care provides excellent training and support for foreign staff. I\'ve learned so much about Japanese culture and traditions from the residents. The job is fulfilling and the compensation is fair. I plan to continue my career in elderly care.',
            photoUrl: '/images/graduates/maya-kusuma.jpg',
            createdAt: new Date('2024-05-08').toISOString(),
            updatedAt: new Date('2024-05-08').toISOString(),
        },
        {
            name: 'Doni Firmansyah',
            company: 'Denso Corporation',
            position: 'Production Engineer',
            year: 2019,
            country: 'Japan',
            testimonial: 'Denso is a world leader in automotive components. Working here has taught me precision engineering and Japanese manufacturing principles like Kaizen. I\'ve contributed to product improvement projects and received recognition for my ideas. The career progression opportunities are excellent and I\'m earning more than I ever imagined.',
            photoUrl: '/images/graduates/doni-firmansyah.jpg',
            createdAt: new Date('2024-07-14').toISOString(),
            updatedAt: new Date('2024-07-14').toISOString(),
        },
        {
            name: 'Lina Hartono',
            company: 'Ajinomoto Co., Inc.',
            position: 'Production Supervisor',
            year: 2021,
            country: 'Japan',
            testimonial: 'Ajinomoto is a great company with modern facilities and a supportive work environment. I started in food processing and was quickly promoted to supervisor due to my dedication and the skills I learned at the LPK. The company provides housing support and the salary is competitive. Japan has become my second home.',
            photoUrl: '/images/graduates/lina-hartono.jpg',
            createdAt: new Date('2024-09-22').toISOString(),
            updatedAt: new Date('2024-09-22').toISOString(),
        },
    ];

    await db.insert(graduates).values(sampleGraduates);
    
    console.log('✅ Graduates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});