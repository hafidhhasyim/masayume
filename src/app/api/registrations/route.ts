import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { registrations, programs } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const registrationNumber = searchParams.get('registration_number');

    // Single registration by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const registration = await db
        .select()
        .from(registrations)
        .where(eq(registrations.id, parseInt(id)))
        .limit(1);

      if (registration.length === 0) {
        return NextResponse.json(
          { error: 'Registration not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(registration[0], { status: 200 });
    }

    // Single registration by registration number
    if (registrationNumber) {
      const registration = await db
        .select()
        .from(registrations)
        .where(eq(registrations.registrationNumber, registrationNumber))
        .limit(1);

      if (registration.length === 0) {
        return NextResponse.json(
          { error: 'Registration not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(registration[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const programId = searchParams.get('program_id');

    let query = db.select().from(registrations);

    const conditions = [];

    // Search across multiple fields
    if (search) {
      const searchCondition = or(
        like(registrations.fullName, `%${search}%`),
        like(registrations.email, `%${search}%`),
        like(registrations.phone, `%${search}%`),
        like(registrations.registrationNumber, `%${search}%`)
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    // Filter by status
    if (status) {
      conditions.push(eq(registrations.status, status));
    }

    // Filter by program
    if (programId) {
      if (isNaN(parseInt(programId))) {
        return NextResponse.json(
          { error: 'Valid program ID is required', code: 'INVALID_PROGRAM_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(registrations.programId, parseInt(programId)));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(registrations.createdAt))
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
    const { fullName, email, phone, dateOfBirth, education, address, programId, status, notes } = body;

    // Validate required fields
    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required', code: 'MISSING_FULL_NAME' },
        { status: 400 }
      );
    }

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    if (!phone || phone.trim() === '') {
      return NextResponse.json(
        { error: 'Phone is required', code: 'MISSING_PHONE' },
        { status: 400 }
      );
    }

    if (!dateOfBirth || dateOfBirth.trim() === '') {
      return NextResponse.json(
        { error: 'Date of birth is required', code: 'MISSING_DATE_OF_BIRTH' },
        { status: 400 }
      );
    }

    if (!education || education.trim() === '') {
      return NextResponse.json(
        { error: 'Education is required', code: 'MISSING_EDUCATION' },
        { status: 400 }
      );
    }

    if (!address || address.trim() === '') {
      return NextResponse.json(
        { error: 'Address is required', code: 'MISSING_ADDRESS' },
        { status: 400 }
      );
    }

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required', code: 'MISSING_PROGRAM_ID' },
        { status: 400 }
      );
    }

    // Validate programId is a valid integer
    if (isNaN(parseInt(programId.toString()))) {
      return NextResponse.json(
        { error: 'Valid program ID is required', code: 'INVALID_PROGRAM_ID' },
        { status: 400 }
      );
    }

    // Check if program exists
    const program = await db
      .select()
      .from(programs)
      .where(eq(programs.id, parseInt(programId.toString())))
      .limit(1);

    if (program.length === 0) {
      return NextResponse.json(
        { error: 'Program not found', code: 'PROGRAM_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Generate registration number
    const currentYear = new Date().getFullYear();
    const yearPrefix = `REG-${currentYear}-`;

    // Get the latest registration for this year
    const latestRegistrations = await db
      .select()
      .from(registrations)
      .where(like(registrations.registrationNumber, `${yearPrefix}%`))
      .orderBy(desc(registrations.registrationNumber))
      .limit(1);

    let sequentialNumber = 1;
    if (latestRegistrations.length > 0) {
      const latestNumber = latestRegistrations[0].registrationNumber;
      const numberPart = latestNumber.split('-')[2];
      sequentialNumber = parseInt(numberPart) + 1;
    }

    const registrationNumber = `${yearPrefix}${sequentialNumber.toString().padStart(3, '0')}`;

    // Create registration
    const now = new Date().toISOString();
    const newRegistration = await db
      .insert(registrations)
      .values({
        registrationNumber,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        dateOfBirth: dateOfBirth.trim(),
        education: education.trim(),
        address: address.trim(),
        programId: parseInt(programId.toString()),
        status: status && status.trim() !== '' ? status.trim() : 'pending',
        notes: notes ? notes.trim() : null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newRegistration[0], { status: 201 });
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

    // Check if registration exists
    const existingRegistration = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, parseInt(id)))
      .limit(1);

    if (existingRegistration.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, dateOfBirth, education, address, programId, status, notes } = body;

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add optional fields
    if (fullName !== undefined) {
      if (fullName.trim() === '') {
        return NextResponse.json(
          { error: 'Full name cannot be empty', code: 'EMPTY_FULL_NAME' },
          { status: 400 }
        );
      }
      updates.fullName = fullName.trim();
    }

    if (email !== undefined) {
      if (email.trim() === '') {
        return NextResponse.json(
          { error: 'Email cannot be empty', code: 'EMPTY_EMAIL' },
          { status: 400 }
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }
      updates.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (phone.trim() === '') {
        return NextResponse.json(
          { error: 'Phone cannot be empty', code: 'EMPTY_PHONE' },
          { status: 400 }
        );
      }
      updates.phone = phone.trim();
    }

    if (dateOfBirth !== undefined) {
      if (dateOfBirth.trim() === '') {
        return NextResponse.json(
          { error: 'Date of birth cannot be empty', code: 'EMPTY_DATE_OF_BIRTH' },
          { status: 400 }
        );
      }
      updates.dateOfBirth = dateOfBirth.trim();
    }

    if (education !== undefined) {
      if (education.trim() === '') {
        return NextResponse.json(
          { error: 'Education cannot be empty', code: 'EMPTY_EDUCATION' },
          { status: 400 }
        );
      }
      updates.education = education.trim();
    }

    if (address !== undefined) {
      if (address.trim() === '') {
        return NextResponse.json(
          { error: 'Address cannot be empty', code: 'EMPTY_ADDRESS' },
          { status: 400 }
        );
      }
      updates.address = address.trim();
    }

    if (programId !== undefined) {
      if (isNaN(parseInt(programId.toString()))) {
        return NextResponse.json(
          { error: 'Valid program ID is required', code: 'INVALID_PROGRAM_ID' },
          { status: 400 }
        );
      }

      // Check if program exists
      const program = await db
        .select()
        .from(programs)
        .where(eq(programs.id, parseInt(programId.toString())))
        .limit(1);

      if (program.length === 0) {
        return NextResponse.json(
          { error: 'Program not found', code: 'PROGRAM_NOT_FOUND' },
          { status: 400 }
        );
      }

      updates.programId = parseInt(programId.toString());
    }

    if (status !== undefined) {
      updates.status = status.trim();
    }

    if (notes !== undefined) {
      updates.notes = notes ? notes.trim() : null;
    }

    const updated = await db
      .update(registrations)
      .set(updates)
      .where(eq(registrations.id, parseInt(id)))
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

    // Check if registration exists
    const existingRegistration = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, parseInt(id)))
      .limit(1);

    if (existingRegistration.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(registrations)
      .where(eq(registrations.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Registration deleted successfully',
        registration: deleted[0],
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