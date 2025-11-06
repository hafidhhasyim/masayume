import { db } from '@/db';
import { news } from '@/db/schema';

async function main() {
    const sampleNews = [
        {
            title: 'New Batch Recruitment - April 2024 Intake Now Open',
            slug: 'new-batch-recruitment-april-2024',
            category: 'Recruitment',
            excerpt: 'We are now accepting applications for our April 2024 batch. Limited slots available for all programs including Tokutei Ginou and Nursing Care.',
            content: 'We are excited to announce that registration for the April 2024 batch is now open! We are accepting applications for all our major programs including Tokutei Ginou, Technical Intern Training, Nursing Care, Manufacturing, Construction, and Hospitality programs. This batch will undergo comprehensive Japanese language training, cultural orientation, and technical skills development before departing to Japan. Don\'t miss this opportunity to start your career in Japan. Apply now as slots are limited!',
            imageUrl: '/images/news/new-batch-recruitment-april-2024.jpg',
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Success Story: From Our Training Center to Toyota Motor Corporation',
            slug: 'success-story-toyota-employee',
            category: 'Success Stories',
            excerpt: 'Meet Budi Santoso, our alumnus who is now working at Toyota\'s manufacturing plant in Aichi Prefecture.',
            content: 'We are proud to share the success story of Budi Santoso, who graduated from our Technical Intern Training program in 2021. After completing intensive training at our center, Budi secured a position at Toyota Motor Corporation\'s manufacturing plant in Toyota City, Aichi. Today, he is a skilled production technician earning a competitive salary and has been promoted twice. Budi credits his success to the comprehensive training and support he received at our center. His story inspires many of our current trainees.',
            imageUrl: '/images/news/success-story-toyota-employee.jpg',
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Special Japanese Cultural Workshop Held for New Trainees',
            slug: 'japanese-cultural-workshop-2024',
            category: 'Training',
            excerpt: 'Our new batch participated in an intensive Japanese culture and etiquette workshop led by native Japanese instructors.',
            content: 'Last week, our training center hosted a special Japanese cultural workshop for our new batch of trainees. The two-day intensive program covered Japanese business etiquette, workplace culture, daily life customs, and communication styles. Native Japanese instructors provided hands-on training in proper greetings, table manners, and workplace interactions. Trainees also practiced common workplace scenarios through role-playing activities. This cultural preparation is essential for our trainees\' success and smooth integration into Japanese society.',
            imageUrl: '/images/news/japanese-cultural-workshop-2024.jpg',
            publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Nursing Care Program Expanded with New Hospital Partnerships',
            slug: 'nursing-care-program-expansion-2024',
            category: 'Programs',
            excerpt: 'We have partnered with 5 additional hospitals in Tokyo and Osaka, creating more opportunities for our Nursing Care graduates.',
            content: 'We are thrilled to announce the expansion of our Nursing Care program through new partnerships with five prestigious hospitals in Tokyo and Osaka. These partnerships will provide more job placements for our Nursing Care graduates and offer even better working conditions. The hospitals are specifically looking for dedicated caregivers who have completed our comprehensive training program. This expansion reflects the growing demand for qualified foreign caregivers in Japan\'s healthcare sector.',
            imageUrl: '/images/news/nursing-care-program-expansion-2024.jpg',
            publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Congratulations! 85% of Our Students Pass JLPT N4 Exam',
            slug: 'jlpt-n4-success-rate-2024',
            category: 'Achievements',
            excerpt: 'Outstanding results as 85% of our trainees successfully passed the Japanese Language Proficiency Test N4 level.',
            content: 'We are extremely proud to announce that 85% of our trainees who took the December 2023 JLPT N4 exam have passed! This exceptional success rate is a testament to the quality of our Japanese language instruction and the dedication of our students. Many students even achieved scores high enough to attempt N3 level. Our experienced Japanese language instructors use modern teaching methods and provide personalized support to ensure every student reaches their language goals. Congratulations to all successful candidates!',
            imageUrl: '/images/news/jlpt-n4-success-rate-2024.jpg',
            publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Grand Opening of New State-of-the-Art Training Facility',
            slug: 'new-training-facility-opening',
            category: 'Facilities',
            excerpt: 'Our new 3-story training facility equipped with modern classrooms, simulation labs, and dormitories is now operational.',
            content: 'We are excited to announce the grand opening of our brand new training facility! The state-of-the-art 3-story building features modern air-conditioned classrooms, computer labs, Japanese language learning rooms, technical skills simulation labs, and comfortable dormitories. The facility can accommodate up to 200 trainees and is equipped with the latest training equipment and technology. This investment demonstrates our commitment to providing world-class training for our students preparing to work in Japan.',
            imageUrl: '/images/news/new-training-facility-opening.jpg',
            publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Japan Job Fair 2024 - Meet Employers from 15 Japanese Companies',
            slug: 'japan-job-fair-2024',
            category: 'Events',
            excerpt: 'Don\'t miss the opportunity to meet representatives from 15 leading Japanese companies looking for skilled workers.',
            content: 'Mark your calendars! Our annual Japan Job Fair will be held on March 15, 2024, at our main training center. Representatives from 15 leading Japanese companies across various industries including manufacturing, construction, hospitality, and healthcare will be present. This is your chance to learn about job opportunities, ask questions directly to employers, and potentially secure interviews. The event is free for our registered trainees and includes company presentations, one-on-one consultations, and networking sessions. Register now!',
            imageUrl: '/images/news/japan-job-fair-2024.jpg',
            publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Alumni Homecoming: Graduates Share Their Japan Work Experience',
            slug: 'alumni-homecoming-2024',
            category: 'Events',
            excerpt: 'Our successful alumni returned home to share their experiences and inspire current trainees.',
            content: 'Last weekend, we hosted a special alumni homecoming event where graduates who have been working in Japan returned to share their experiences with current trainees. Alumni working at companies like Honda, Panasonic, and various hospitals shared valuable insights about working life in Japan, overcoming challenges, and achieving career success. The event was highly inspiring for our current batch and provided practical advice on cultural adaptation, workplace communication, and career growth in Japan. Thank you to all alumni who participated!',
            imageUrl: '/images/news/alumni-homecoming-2024.jpg',
            publishedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(news).values(sampleNews);
    
    console.log('✅ News seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});