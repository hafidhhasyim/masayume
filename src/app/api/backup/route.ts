import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import * as schema from "@/db/schema"

// GET - Export all data
export async function GET() {
  try {
    const [
      programs,
      news,
      graduates,
      gallery,
      sliders,
      registrations,
      contactMessages,
      organizationMembers,
      profileSections,
      siteSettings,
    ] = await Promise.all([
      db.select().from(schema.programs),
      db.select().from(schema.news),
      db.select().from(schema.graduates),
      db.select().from(schema.gallery),
      db.select().from(schema.sliders),
      db.select().from(schema.registrations),
      db.select().from(schema.contactMessages),
      db.select().from(schema.organizationMembers),
      db.select().from(schema.profileSections),
      db.select().from(schema.siteSettings),
    ])

    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        programs,
        news,
        graduates,
        gallery,
        sliders,
        registrations,
        contactMessages,
        organizationMembers,
        profileSections,
        siteSettings,
      },
    }

    return NextResponse.json(backup)
  } catch (error) {
    console.error("Backup error:", error)
    return NextResponse.json({ error: "Gagal membuat backup" }, { status: 500 })
  }
}

// POST - Import/Restore data
export async function POST(request: NextRequest) {
  try {
    const backup = await request.json()

    if (!backup.data) {
      return NextResponse.json({ error: "Format backup tidak valid" }, { status: 400 })
    }

    const { data } = backup

    // Clear existing data (optional - be careful!)
    // await db.delete(schema.programs)
    // await db.delete(schema.news)
    // ... etc

    // Insert data
    const results = []

    if (data.programs?.length > 0) {
      await db.delete(schema.programs)
      const inserted = await db.insert(schema.programs).values(data.programs).returning()
      results.push({ table: "programs", count: inserted.length })
    }

    if (data.news?.length > 0) {
      await db.delete(schema.news)
      const inserted = await db.insert(schema.news).values(data.news).returning()
      results.push({ table: "news", count: inserted.length })
    }

    if (data.graduates?.length > 0) {
      await db.delete(schema.graduates)
      const inserted = await db.insert(schema.graduates).values(data.graduates).returning()
      results.push({ table: "graduates", count: inserted.length })
    }

    if (data.gallery?.length > 0) {
      await db.delete(schema.gallery)
      const inserted = await db.insert(schema.gallery).values(data.gallery).returning()
      results.push({ table: "gallery", count: inserted.length })
    }

    if (data.sliders?.length > 0) {
      await db.delete(schema.sliders)
      const inserted = await db.insert(schema.sliders).values(data.sliders).returning()
      results.push({ table: "sliders", count: inserted.length })
    }

    if (data.registrations?.length > 0) {
      await db.delete(schema.registrations)
      const inserted = await db.insert(schema.registrations).values(data.registrations).returning()
      results.push({ table: "registrations", count: inserted.length })
    }

    if (data.contactMessages?.length > 0) {
      await db.delete(schema.contactMessages)
      const inserted = await db.insert(schema.contactMessages).values(data.contactMessages).returning()
      results.push({ table: "contactMessages", count: inserted.length })
    }

    if (data.organizationMembers?.length > 0) {
      await db.delete(schema.organizationMembers)
      const inserted = await db.insert(schema.organizationMembers).values(data.organizationMembers).returning()
      results.push({ table: "organizationMembers", count: inserted.length })
    }

    if (data.profileSections?.length > 0) {
      await db.delete(schema.profileSections)
      const inserted = await db.insert(schema.profileSections).values(data.profileSections).returning()
      results.push({ table: "profileSections", count: inserted.length })
    }

    if (data.siteSettings?.length > 0) {
      await db.delete(schema.siteSettings)
      const inserted = await db.insert(schema.siteSettings).values(data.siteSettings).returning()
      results.push({ table: "siteSettings", count: inserted.length })
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil direstore",
      results,
    })
  } catch (error) {
    console.error("Restore error:", error)
    return NextResponse.json({ error: "Gagal restore data" }, { status: 500 })
  }
}
