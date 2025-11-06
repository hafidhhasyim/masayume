import { db } from '@/db';
import { programs } from '@/db/schema';

async function main() {
    const samplePrograms = [
        {
            title: 'Tokutei Ginou (特定技能) - Specified Skilled Worker Program',
            description: 'The Specified Skilled Worker visa allows foreign workers to work in 14 designated sectors including manufacturing, construction, nursing care, and hospitality. This program offers a clear pathway to long-term residence in Japan.',
            duration: '1-5 years',
            requirements: 'Japanese Language Proficiency Test (JLPT) N4 or equivalent, Technical skills assessment, Age 18-40',
            benefits: 'Competitive salary (¥150,000-¥300,000/month), Social insurance, Path to permanent residency, Family visa eligibility',
            imageUrl: '/images/programs/tokutei-ginou.jpg',
            isActive: true,
            createdAt: new Date('2024-10-15').toISOString(),
            updatedAt: new Date('2024-10-15').toISOString(),
        },
        {
            title: 'Ginou Jisshuusei (技能実習生) - Technical Intern Training Program',
            description: 'Technical Intern Training Program enables trainees to learn advanced skills and techniques in manufacturing, agriculture, construction, and other industries while working in Japan.',
            duration: '3-5 years',
            requirements: 'High school diploma, Basic Japanese language skills, Age 18-35, Technical background preferred',
            benefits: 'Monthly salary ¥120,000-¥180,000, Free accommodation, Skills certification, Return support',
            imageUrl: '/images/programs/ginou-jisshuusei.jpg',
            isActive: true,
            createdAt: new Date('2024-10-20').toISOString(),
            updatedAt: new Date('2024-10-20').toISOString(),
        },
        {
            title: 'Nursing Care (Kaigo) - Certified Caregiver Program',
            description: 'Work in Japan\'s growing healthcare sector as a certified caregiver in hospitals, nursing homes, and care facilities. Comprehensive training and certification provided.',
            duration: '3-5 years',
            requirements: 'JLPT N3, Caregiving certification or training, Physical fitness, Age 20-45',
            benefits: 'Salary ¥180,000-¥250,000/month, Full benefits, Professional certification, Career advancement',
            imageUrl: '/images/programs/nursing-care.jpg',
            isActive: true,
            createdAt: new Date('2024-11-01').toISOString(),
            updatedAt: new Date('2024-11-01').toISOString(),
        },
        {
            title: 'Manufacturing Industry - Production Worker Program',
            description: 'Join leading Japanese manufacturing companies in automotive, electronics, and machinery production. Gain experience with world-class manufacturing techniques and quality standards.',
            duration: '3 years',
            requirements: 'JLPT N4, Technical training, Mechanical aptitude, Age 18-40',
            benefits: 'Salary ¥150,000-¥220,000/month, Overtime pay, Skills training, Housing support',
            imageUrl: '/images/programs/manufacturing.jpg',
            isActive: true,
            createdAt: new Date('2024-11-10').toISOString(),
            updatedAt: new Date('2024-11-10').toISOString(),
        },
        {
            title: 'Construction Industry - Skilled Worker Program',
            description: 'Participate in Japan\'s infrastructure and building projects. Work alongside experienced professionals and earn internationally recognized construction certifications.',
            duration: '3-5 years',
            requirements: 'Construction experience, JLPT N4, Safety certifications, Age 20-45',
            benefits: 'Salary ¥160,000-¥280,000/month, Professional certifications, Project bonuses, Equipment training',
            imageUrl: '/images/programs/construction.jpg',
            isActive: true,
            createdAt: new Date('2024-11-20').toISOString(),
            updatedAt: new Date('2024-11-20').toISOString(),
        },
        {
            title: 'Hospitality & Tourism - Service Professional Program',
            description: 'Work in Japan\'s renowned hospitality industry in hotels, restaurants, and tourism facilities. Perfect for those passionate about customer service and Japanese culture.',
            duration: '2-3 years',
            requirements: 'JLPT N3, Hospitality experience, Customer service skills, Age 20-35',
            benefits: 'Salary ¥140,000-¥200,000/month, Tips, Language training, Cultural exchange',
            imageUrl: '/images/programs/hospitality.jpg',
            isActive: true,
            createdAt: new Date('2024-12-01').toISOString(),
            updatedAt: new Date('2024-12-01').toISOString(),
        }
    ];

    await db.insert(programs).values(samplePrograms);
    
    console.log('✅ Programs seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});