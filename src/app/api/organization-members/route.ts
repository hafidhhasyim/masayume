import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { eq, and, asc, desc } from 'drizzle-orm';

// Organization Members table schema
export const organizationMembers = sqliteTable('organization_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  position: text('position').notNull(),
  photoUrl: text('photo_url'),
  parentId: integer('parent_id'),
  order: integer('order').notNull().default(0),
  level: integer('level').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const parentId = searchParams.get('parent_id');
    const level = searchParams.get('level');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single record by ID
    if (id) {
      const memberId = parseInt(id);
      if (isNaN(memberId)) {
        return NextResponse.json(
          { error: 'Invalid ID format', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const member = await db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.id, memberId))
        .limit(1);

      if (member.length === 0) {
        return NextResponse.json(
          { error: 'Member not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(member[0], { status: 200 });
    }

    // List with filters
    let query = db.select().from(organizationMembers);

    // Apply filters
    const conditions = [];
    
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        conditions.push(eq(organizationMembers.parentId, null));
      } else {
        const parentIdNum = parseInt(parentId);
        if (!isNaN(parentIdNum)) {
          conditions.push(eq(organizationMembers.parentId, parentIdNum));
        }
      }
    }

    if (level !== null) {
      const levelNum = parseInt(level);
      if (!isNaN(levelNum) && levelNum >= 0 && levelNum <= 2) {
        conditions.push(eq(organizationMembers.level, levelNum));
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting: order ASC, then createdAt ASC
    const members = await query
      .orderBy(asc(organizationMembers.order), asc(organizationMembers.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, position, photoUrl, parentId, order, level } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!position || typeof position !== 'string' || position.trim() === '') {
      return NextResponse.json(
        { error: 'Position is required and must be a non-empty string', code: 'INVALID_POSITION' },
        { status: 400 }
      );
    }

    // Validate parentId if provided
    if (parentId !== undefined && parentId !== null) {
      const parentIdNum = parseInt(parentId);
      if (isNaN(parentIdNum)) {
        return NextResponse.json(
          { error: 'Parent ID must be a valid integer', code: 'INVALID_PARENT_ID' },
          { status: 400 }
        );
      }

      // Check if parent exists
      const parentExists = await db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.id, parentIdNum))
        .limit(1);

      if (parentExists.length === 0) {
        return NextResponse.json(
          { error: 'Parent member not found', code: 'PARENT_NOT_FOUND' },
          { status: 400 }
        );
      }
    }

    // Validate level if provided
    let validatedLevel = 0;
    if (level !== undefined && level !== null) {
      const levelNum = parseInt(level);
      if (isNaN(levelNum) || levelNum < 0 || levelNum > 2) {
        return NextResponse.json(
          { error: 'Level must be an integer between 0 and 2', code: 'INVALID_LEVEL' },
          { status: 400 }
        );
      }
      validatedLevel = levelNum;
    }

    // Validate order if provided
    let validatedOrder = 0;
    if (order !== undefined && order !== null) {
      const orderNum = parseInt(order);
      if (isNaN(orderNum)) {
        return NextResponse.json(
          { error: 'Order must be a valid integer', code: 'INVALID_ORDER' },
          { status: 400 }
        );
      }
      validatedOrder = orderNum;
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData: any = {
      name: name.trim(),
      position: position.trim(),
      photoUrl: photoUrl || null,
      parentId: parentId ? parseInt(parentId) : null,
      order: validatedOrder,
      level: validatedLevel,
      createdAt: now,
      updatedAt: now,
    };

    // Insert new member
    const newMember = await db
      .insert(organizationMembers)
      .values(insertData)
      .returning();

    return NextResponse.json(newMember[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const memberId = parseInt(id);

    // Check if member exists
    const existingMember = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.id, memberId))
      .limit(1);

    if (existingMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, position, photoUrl, parentId, order, level } = body;

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
    }

    // Validate position if provided
    if (position !== undefined) {
      if (typeof position !== 'string' || position.trim() === '') {
        return NextResponse.json(
          { error: 'Position must be a non-empty string', code: 'INVALID_POSITION' },
          { status: 400 }
        );
      }
    }

    // Validate parentId if provided
    if (parentId !== undefined) {
      if (parentId !== null) {
        const parentIdNum = parseInt(parentId);
        if (isNaN(parentIdNum)) {
          return NextResponse.json(
            { error: 'Parent ID must be a valid integer', code: 'INVALID_PARENT_ID' },
            { status: 400 }
          );
        }

        // Prevent circular reference
        if (parentIdNum === memberId) {
          return NextResponse.json(
            { error: 'Cannot set parent to self', code: 'CIRCULAR_REFERENCE' },
            { status: 400 }
          );
        }

        // Check if parent exists
        const parentExists = await db
          .select()
          .from(organizationMembers)
          .where(eq(organizationMembers.id, parentIdNum))
          .limit(1);

        if (parentExists.length === 0) {
          return NextResponse.json(
            { error: 'Parent member not found', code: 'PARENT_NOT_FOUND' },
            { status: 400 }
          );
        }
      }
    }

    // Validate level if provided
    if (level !== undefined && level !== null) {
      const levelNum = parseInt(level);
      if (isNaN(levelNum) || levelNum < 0 || levelNum > 2) {
        return NextResponse.json(
          { error: 'Level must be an integer between 0 and 2', code: 'INVALID_LEVEL' },
          { status: 400 }
        );
      }
    }

    // Validate order if provided
    if (order !== undefined && order !== null) {
      const orderNum = parseInt(order);
      if (isNaN(orderNum)) {
        return NextResponse.json(
          { error: 'Order must be a valid integer', code: 'INVALID_ORDER' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (position !== undefined) updateData.position = position.trim();
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;
    if (parentId !== undefined) updateData.parentId = parentId ? parseInt(parentId) : null;
    if (order !== undefined) updateData.order = parseInt(order);
    if (level !== undefined) updateData.level = parseInt(level);

    // Update member
    const updated = await db
      .update(organizationMembers)
      .set(updateData)
      .where(eq(organizationMembers.id, memberId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const memberId = parseInt(id);

    // Check if member exists
    const existingMember = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.id, memberId))
      .limit(1);

    if (existingMember.length === 0) {
      return NextResponse.json(
        { error: 'Member not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if member has children (subordinates)
    const children = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.parentId, memberId))
      .limit(1);

    if (children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete member with subordinates', code: 'HAS_SUBORDINATES' },
        { status: 400 }
      );
    }

    // Delete member
    const deleted = await db
      .delete(organizationMembers)
      .where(eq(organizationMembers.id, memberId))
      .returning();

    return NextResponse.json(
      {
        message: 'Member deleted successfully',
        member: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}