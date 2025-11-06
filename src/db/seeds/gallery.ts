import { db } from '@/db';
import { gallery } from '@/db/schema';

async function main() {
    const sampleGallery = [
        {
            title: 'Japanese Language Class - JLPT N4 Preparation',
            imageUrl: '/images/gallery/japanese-language-class.jpg',
            description: 'Students learning Japanese grammar and conversation with native instructor',
            category: 'activities',
            createdAt: new Date('2024-06-15').toISOString(),
            updatedAt: new Date('2024-06-15').toISOString(),
        },
        {
            title: 'Technical Skills Training - Manufacturing Practice',
            imageUrl: '/images/gallery/manufacturing-training.jpg',
            description: 'Hands-on training in manufacturing techniques and quality control',
            category: 'activities',
            createdAt: new Date('2024-07-20').toISOString(),
            updatedAt: new Date('2024-07-20').toISOString(),
        },
        {
            title: 'Cultural Workshop - Traditional Tea Ceremony',
            imageUrl: '/images/gallery/tea-ceremony-workshop.jpg',
            description: 'Trainees experiencing Japanese tea ceremony and traditional etiquette',
            category: 'activities',
            createdAt: new Date('2024-08-10').toISOString(),
            updatedAt: new Date('2024-08-10').toISOString(),
        },
        {
            title: 'Physical Training and Team Building Activities',
            imageUrl: '/images/gallery/team-building-activities.jpg',
            description: 'Morning exercises and group activities to build teamwork and discipline',
            category: 'activities',
            createdAt: new Date('2024-09-05').toISOString(),
            updatedAt: new Date('2024-09-05').toISOString(),
        },
        {
            title: 'Computer Skills and Digital Literacy Training',
            imageUrl: '/images/gallery/computer-skills-training.jpg',
            description: 'Students learning essential computer skills and Japanese software applications',
            category: 'activities',
            createdAt: new Date('2024-10-12').toISOString(),
            updatedAt: new Date('2024-10-12').toISOString(),
        },
        {
            title: 'Modern Air-Conditioned Classrooms',
            imageUrl: '/images/gallery/modern-classrooms.jpg',
            description: 'Spacious classrooms equipped with projectors and modern teaching aids',
            category: 'facilities',
            createdAt: new Date('2024-07-01').toISOString(),
            updatedAt: new Date('2024-07-01').toISOString(),
        },
        {
            title: 'Technical Skills Laboratory',
            imageUrl: '/images/gallery/technical-lab.jpg',
            description: 'Well-equipped simulation lab for practicing manufacturing and construction skills',
            category: 'facilities',
            createdAt: new Date('2024-08-15').toISOString(),
            updatedAt: new Date('2024-08-15').toISOString(),
        },
        {
            title: 'Comfortable Student Dormitory',
            imageUrl: '/images/gallery/student-dormitory.jpg',
            description: 'Clean and comfortable dormitory rooms with modern amenities',
            category: 'facilities',
            createdAt: new Date('2024-09-20').toISOString(),
            updatedAt: new Date('2024-09-20').toISOString(),
        },
        {
            title: 'Computer and Language Lab',
            imageUrl: '/images/gallery/computer-language-lab.jpg',
            description: 'State-of-the-art computer lab for language learning and skills training',
            category: 'facilities',
            createdAt: new Date('2024-10-25').toISOString(),
            updatedAt: new Date('2024-10-25').toISOString(),
        },
        {
            title: 'Graduation Ceremony - December 2023 Batch',
            imageUrl: '/images/gallery/graduation-ceremony-dec-2023.jpg',
            description: 'Proud graduates receiving certificates before departing to Japan',
            category: 'graduation',
            createdAt: new Date('2024-06-30').toISOString(),
            updatedAt: new Date('2024-06-30').toISOString(),
        },
        {
            title: 'Farewell Celebration with Families',
            imageUrl: '/images/gallery/farewell-celebration.jpg',
            description: 'Graduates celebrating with families before their journey to Japan',
            category: 'graduation',
            createdAt: new Date('2024-08-25').toISOString(),
            updatedAt: new Date('2024-08-25').toISOString(),
        },
        {
            title: 'Certificate Distribution and Photo Session',
            imageUrl: '/images/gallery/certificate-distribution.jpg',
            description: 'Official graduation ceremony with management and instructors',
            category: 'graduation',
            createdAt: new Date('2024-11-10').toISOString(),
            updatedAt: new Date('2024-11-10').toISOString(),
        }
    ];

    await db.insert(gallery).values(sampleGallery);
    
    console.log('✅ Gallery seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});