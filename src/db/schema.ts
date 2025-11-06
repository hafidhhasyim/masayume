import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Programs table - Japan internship/work programs
export const programs = sqliteTable('programs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  duration: text('duration').notNull(),
  requirements: text('requirements').notNull(),
  benefits: text('benefits').notNull(),
  imageUrl: text('image_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// News table - Announcements and updates
export const news = sqliteTable('news', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  imageUrl: text('image_url'),
  category: text('category').notNull(),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Graduates table - Success stories
export const graduates = sqliteTable('graduates', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  photoUrl: text('photo_url'),
  company: text('company').notNull(),
  position: text('position').notNull(),
  year: integer('year').notNull(),
  testimonial: text('testimonial').notNull(),
  country: text('country').notNull().default('Japan'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Gallery table - Photos and media
export const gallery = sqliteTable('gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Registrations table - Program applications
export const registrations = sqliteTable('registrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  registrationNumber: text('registration_number').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  education: text('education').notNull(),
  address: text('address').notNull(),
  programId: integer('program_id').notNull().references(() => programs.id),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Contact Messages table - Inquiries from visitors
export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});

// Site Settings table - Configuration key-value pairs
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Hero Sliders table - Homepage sliders
export const sliders = sqliteTable('sliders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  imageUrl: text('image_url').notNull(),
  buttonText: text('button_text'),
  buttonLink: text('button_link'),
  description: text('description'),
  image2Url: text('image2_url'),
  order: integer('order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Profile Sections table - Company profile content
export const profileSections = sqliteTable('profile_sections', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  section: text('section').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const organizationMembers = sqliteTable('organization_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  position: text('position').notNull(),
  photoUrl: text('photo_url'),
  parentId: integer('parent_id').references(() => organizationMembers.id),
  order: integer('order').notNull().default(0),
  level: integer('level').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});