import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

// Define sliders table schema
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const slider = await db
        .select()
        .from(sliders)
        .where(eq(sliders.id, parseInt(id)))
        .limit(1);

      if (slider.length === 0) {
        return NextResponse.json(
          { error: 'Slider not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(slider[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('is_active');

    let query = db.select().from(sliders);
    const conditions = [];

    // Filter by active status
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(sliders.isActive, isActiveValue));
    }

    // Search across title and subtitle
    if (search) {
      conditions.push(
        or(
          like(sliders.title, `%${search}%`),
          like(sliders.subtitle, `%${search}%`)
        )
      );
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Always sort by order ASC
    const results = await query
      .orderBy(asc(sliders.order))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { title, subtitle, imageUrl, buttonText, buttonLink, description, image2Url, order, isActive } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!subtitle || typeof subtitle !== 'string' || subtitle.trim() === '') {
      return NextResponse.json(
        { error: 'Subtitle is required and must be a non-empty string', code: 'INVALID_SUBTITLE' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Prepare data with defaults and sanitization
    const now = new Date().toISOString();
    const insertData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      buttonText: buttonText ? buttonText.trim() : null,
      buttonLink: buttonLink ? buttonLink.trim() : null,
      description: description ? description.trim() : null,
      image2Url: image2Url ? image2Url.trim() : null,
      order: order !== undefined ? parseInt(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: now,
      updatedAt: now,
    };

    const newSlider = await db.insert(sliders).values(insertData).returning();

    return NextResponse.json(newSlider[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if slider exists
    const existingSlider = await db
      .select()
      .from(sliders)
      .where(eq(sliders.id, parseInt(id)))
      .limit(1);

    if (existingSlider.length === 0) {
      return NextResponse.json(
        { error: 'Slider not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, subtitle, imageUrl, buttonText, buttonLink, description, image2Url, order, isActive } = body;

    // Validate fields if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (subtitle !== undefined && (typeof subtitle !== 'string' || subtitle.trim() === '')) {
      return NextResponse.json(
        { error: 'Subtitle must be a non-empty string', code: 'INVALID_SUBTITLE' },
        { status: 400 }
      );
    }

    if (imageUrl !== undefined && (typeof imageUrl !== 'string' || imageUrl.trim() === '')) {
      return NextResponse.json(
        { error: 'Image URL must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (buttonText !== undefined) updateData.buttonText = buttonText ? buttonText.trim() : null;
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink ? buttonLink.trim() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (image2Url !== undefined) updateData.image2Url = image2Url ? image2Url.trim() : null;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedSlider = await db
      .update(sliders)
      .set(updateData)
      .where(eq(sliders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedSlider[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if slider exists
    const existingSlider = await db
      .select()
      .from(sliders)
      .where(eq(sliders.id, parseInt(id)))
      .limit(1);

    if (existingSlider.length === 0) {
      return NextResponse.json(
        { error: 'Slider not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedSlider = await db
      .delete(sliders)
      .where(eq(sliders.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Slider deleted successfully',
        slider: deletedSlider[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}