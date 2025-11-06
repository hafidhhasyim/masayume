import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { programs } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single program by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, parseInt(id)))
        .limit(1);

      if (program.length === 0) {
        return NextResponse.json(
          { error: 'Program not found', code: 'PROGRAM_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(program[0], { status: 200 });
    }

    // List programs with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('is_active');

    let query = db.select().from(programs);
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(programs.title, `%${search}%`),
          like(programs.description, `%${search}%`),
          like(programs.duration, `%${search}%`)
        )
      );
    }

    // Active status filter
    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      conditions.push(eq(programs.isActive, isActive));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Execute query with pagination and ordering
    const results = await query
      .orderBy(desc(programs.createdAt))
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
    const { title, description, duration, requirements, benefits, imageUrl, isActive } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required and must be a non-empty string', code: 'INVALID_DESCRIPTION' },
        { status: 400 }
      );
    }

    if (!duration || typeof duration !== 'string' || duration.trim() === '') {
      return NextResponse.json(
        { error: 'Duration is required and must be a non-empty string', code: 'INVALID_DURATION' },
        { status: 400 }
      );
    }

    if (!requirements || typeof requirements !== 'string' || requirements.trim() === '') {
      return NextResponse.json(
        { error: 'Requirements is required and must be a non-empty string', code: 'INVALID_REQUIREMENTS' },
        { status: 400 }
      );
    }

    if (!benefits || typeof benefits !== 'string' || benefits.trim() === '') {
      return NextResponse.json(
        { error: 'Benefits is required and must be a non-empty string', code: 'INVALID_BENEFITS' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData: any = {
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      requirements: requirements.trim(),
      benefits: benefits.trim(),
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdAt: now,
      updatedAt: now,
    };

    // Add optional imageUrl if provided
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      insertData.imageUrl = imageUrl.trim();
    }

    // Insert into database
    const newProgram = await db.insert(programs).values(insertData).returning();

    return NextResponse.json(newProgram[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if program exists
    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found', code: 'PROGRAM_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get update data
    const body = await request.json();
    const { title, description, duration, requirements, benefits, imageUrl, isActive } = body;

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Add fields if provided and valid
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '') {
        return NextResponse.json(
          { error: 'Description must be a non-empty string', code: 'INVALID_DESCRIPTION' },
          { status: 400 }
        );
      }
      updateData.description = description.trim();
    }

    if (duration !== undefined) {
      if (typeof duration !== 'string' || duration.trim() === '') {
        return NextResponse.json(
          { error: 'Duration must be a non-empty string', code: 'INVALID_DURATION' },
          { status: 400 }
        );
      }
      updateData.duration = duration.trim();
    }

    if (requirements !== undefined) {
      if (typeof requirements !== 'string' || requirements.trim() === '') {
        return NextResponse.json(
          { error: 'Requirements must be a non-empty string', code: 'INVALID_REQUIREMENTS' },
          { status: 400 }
        );
      }
      updateData.requirements = requirements.trim();
    }

    if (benefits !== undefined) {
      if (typeof benefits !== 'string' || benefits.trim() === '') {
        return NextResponse.json(
          { error: 'Benefits must be a non-empty string', code: 'INVALID_BENEFITS' },
          { status: 400 }
        );
      }
      updateData.benefits = benefits.trim();
    }

    if (imageUrl !== undefined) {
      if (imageUrl === null || imageUrl === '') {
        updateData.imageUrl = null;
      } else if (typeof imageUrl === 'string') {
        updateData.imageUrl = imageUrl.trim();
      } else {
        return NextResponse.json(
          { error: 'Image URL must be a string or null', code: 'INVALID_IMAGE_URL' },
          { status: 400 }
        );
      }
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
          { status: 400 }
        );
      }
      updateData.isActive = isActive;
    }

    // Update program
    const updatedProgram = await db
      .update(programs)
      .set(updateData)
      .where(eq(programs.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProgram[0], { status: 200 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if program exists
    const existingProgram = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(id)))
      .limit(1);

    if (existingProgram.length === 0) {
      return NextResponse.json(
        { error: 'Program not found', code: 'PROGRAM_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete program
    const deletedProgram = await db
      .delete(programs)
      .where(eq(programs.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Program deleted successfully',
        program: deletedProgram[0],
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