import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { graduates } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single graduate by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const graduate = await db
        .select()
        .from(graduates)
        .where(eq(graduates.id, parseInt(id)))
        .limit(1);

      if (graduate.length === 0) {
        return NextResponse.json(
          { error: 'Graduate not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(graduate[0], { status: 200 });
    }

    // List graduates with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const year = searchParams.get('year');
    const country = searchParams.get('country');
    const sortField = searchParams.get('sort') ?? 'year';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(graduates);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(graduates.name, `%${search}%`),
          like(graduates.company, `%${search}%`),
          like(graduates.position, `%${search}%`)
        )
      );
    }

    if (year) {
      const yearInt = parseInt(year);
      if (!isNaN(yearInt)) {
        conditions.push(eq(graduates.year, yearInt));
      }
    }

    if (country) {
      conditions.push(eq(graduates.country, country));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortField === 'year' ? graduates.year : graduates.createdAt;
    query = query.orderBy(
      sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)
    );

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

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
    const { name, photoUrl, company, position, year, testimonial, country } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!company || typeof company !== 'string' || company.trim() === '') {
      return NextResponse.json(
        { error: 'Company is required and must be a non-empty string', code: 'MISSING_COMPANY' },
        { status: 400 }
      );
    }

    if (!position || typeof position !== 'string' || position.trim() === '') {
      return NextResponse.json(
        { error: 'Position is required and must be a non-empty string', code: 'MISSING_POSITION' },
        { status: 400 }
      );
    }

    if (!year || isNaN(parseInt(year))) {
      return NextResponse.json(
        { error: 'Year is required and must be a valid integer', code: 'INVALID_YEAR' },
        { status: 400 }
      );
    }

    if (!testimonial || typeof testimonial !== 'string' || testimonial.trim() === '') {
      return NextResponse.json(
        { error: 'Testimonial is required and must be a non-empty string', code: 'MISSING_TESTIMONIAL' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const timestamp = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      photoUrl: photoUrl || null,
      company: company.trim(),
      position: position.trim(),
      year: parseInt(year),
      testimonial: testimonial.trim(),
      country: country?.trim() || 'Japan',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newGraduate = await db
      .insert(graduates)
      .values(insertData)
      .returning();

    return NextResponse.json(newGraduate[0], { status: 201 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if graduate exists
    const existing = await db
      .select()
      .from(graduates)
      .where(eq(graduates.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Graduate not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, photoUrl, company, position, year, testimonial, country } = body;

    // Build update object with only provided fields
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (photoUrl !== undefined) {
      updates.photoUrl = photoUrl || null;
    }

    if (company !== undefined) {
      if (typeof company !== 'string' || company.trim() === '') {
        return NextResponse.json(
          { error: 'Company must be a non-empty string', code: 'INVALID_COMPANY' },
          { status: 400 }
        );
      }
      updates.company = company.trim();
    }

    if (position !== undefined) {
      if (typeof position !== 'string' || position.trim() === '') {
        return NextResponse.json(
          { error: 'Position must be a non-empty string', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
      updates.position = position.trim();
    }

    if (year !== undefined) {
      if (isNaN(parseInt(year))) {
        return NextResponse.json(
          { error: 'Year must be a valid integer', code: 'INVALID_YEAR' },
          { status: 400 }
        );
      }
      updates.year = parseInt(year);
    }

    if (testimonial !== undefined) {
      if (typeof testimonial !== 'string' || testimonial.trim() === '') {
        return NextResponse.json(
          { error: 'Testimonial must be a non-empty string', code: 'INVALID_TESTIMONIAL' },
          { status: 400 }
        );
      }
      updates.testimonial = testimonial.trim();
    }

    if (country !== undefined) {
      if (typeof country !== 'string' || country.trim() === '') {
        return NextResponse.json(
          { error: 'Country must be a non-empty string', code: 'INVALID_COUNTRY' },
          { status: 400 }
        );
      }
      updates.country = country.trim();
    }

    const updated = await db
      .update(graduates)
      .set(updates)
      .where(eq(graduates.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if graduate exists
    const existing = await db
      .select()
      .from(graduates)
      .where(eq(graduates.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Graduate not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(graduates)
      .where(eq(graduates.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Graduate deleted successfully',
        graduate: deleted[0],
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