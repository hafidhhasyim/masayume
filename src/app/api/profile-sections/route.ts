import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profileSections } from '@/db/schema';
import { eq, like, and, or, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(profileSections)
        .where(eq(profileSections.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Profile section not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0]);
    }

    // Single record by section name
    if (section) {
      const record = await db
        .select()
        .from(profileSections)
        .where(eq(profileSections.section, section))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Profile section not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0]);
    }

    // List with optional search and pagination
    let query = db.select().from(profileSections);

    if (search) {
      query = query.where(
        or(
          like(profileSections.title, `%${search}%`),
          like(profileSections.content, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, title, content, imageUrl } = body;

    // Validate required fields
    if (!section || typeof section !== 'string' || section.trim() === '') {
      return NextResponse.json(
        { error: 'Section is required and must be a non-empty string', code: 'MISSING_SECTION' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and must be a non-empty string', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    // Trim inputs
    const trimmedSection = section.trim();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // Check for duplicate section
    const existingSection = await db
      .select()
      .from(profileSections)
      .where(eq(profileSections.section, trimmedSection))
      .limit(1);

    if (existingSection.length > 0) {
      return NextResponse.json(
        { error: 'A profile section with this name already exists', code: 'DUPLICATE_SECTION' },
        { status: 400 }
      );
    }

    // Create new profile section
    const now = new Date().toISOString();
    const newProfileSection = await db
      .insert(profileSections)
      .values({
        section: trimmedSection,
        title: trimmedTitle,
        content: trimmedContent,
        imageUrl: imageUrl || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newProfileSection[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const profileSectionId = parseInt(id);

    // Check if profile section exists
    const existingSection = await db
      .select()
      .from(profileSections)
      .where(eq(profileSections.id, profileSectionId))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { error: 'Profile section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { section, title, content, imageUrl } = body;

    // Prepare updates object with proper typing
    const updates: {
      section?: string;
      title?: string;
      content?: string;
      imageUrl?: string | null;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add section if provided
    if (section !== undefined) {
      if (typeof section !== 'string' || section.trim() === '') {
        return NextResponse.json(
          { error: 'Section must be a non-empty string', code: 'INVALID_SECTION' },
          { status: 400 }
        );
      }

      const trimmedSection = section.trim();

      // Check if new section value already exists (excluding current record)
      const duplicateSection = await db
        .select()
        .from(profileSections)
        .where(
          and(
            eq(profileSections.section, trimmedSection),
            ne(profileSections.id, profileSectionId)
          )
        )
        .limit(1);

      if (duplicateSection.length > 0) {
        return NextResponse.json(
          { error: 'A profile section with this name already exists', code: 'DUPLICATE_SECTION' },
          { status: 400 }
        );
      }

      updates.section = trimmedSection;
    }

    // Validate and add title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    // Validate and add content if provided
    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim() === '') {
        return NextResponse.json(
          { error: 'Content must be a non-empty string', code: 'INVALID_CONTENT' },
          { status: 400 }
        );
      }
      updates.content = content.trim();
    }

    // Add imageUrl if provided
    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl || null;
    }

    // Update profile section
    const updated = await db
      .update(profileSections)
      .set(updates)
      .where(eq(profileSections.id, profileSectionId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const profileSectionId = parseInt(id);

    // Check if profile section exists
    const existingSection = await db
      .select()
      .from(profileSections)
      .where(eq(profileSections.id, profileSectionId))
      .limit(1);

    if (existingSection.length === 0) {
      return NextResponse.json(
        { error: 'Profile section not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete profile section
    const deleted = await db
      .delete(profileSections)
      .where(eq(profileSections.id, profileSectionId))
      .returning();

    return NextResponse.json({
      message: 'Profile section deleted successfully',
      data: deleted[0],
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}