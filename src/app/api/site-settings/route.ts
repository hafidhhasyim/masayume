import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const key = searchParams.get('key');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Single setting by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const setting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.id, parseInt(id)))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json({ 
          error: 'Setting not found',
          code: "SETTING_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(setting[0], { status: 200 });
    }

    // Single setting by key
    if (key && !search) {
      const setting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json({ 
          error: 'Setting not found',
          code: "SETTING_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(setting[0], { status: 200 });
    }

    // List with optional search
    let query = db.select().from(siteSettings);

    if (search) {
      query = query.where(
        or(
          like(siteSettings.key, `%${search}%`),
          like(siteSettings.value, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    // Validate required fields
    if (!key || typeof key !== 'string' || key.trim() === '') {
      return NextResponse.json({ 
        error: "Key is required and must be a non-empty string",
        code: "MISSING_KEY" 
      }, { status: 400 });
    }

    if (!value || typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({ 
        error: "Value is required and must be a non-empty string",
        code: "MISSING_VALUE" 
      }, { status: 400 });
    }

    // Check if key already exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "A setting with this key already exists",
        code: "DUPLICATE_KEY" 
      }, { status: 400 });
    }

    // Create new setting
    const now = new Date().toISOString();
    const newSetting = await db.insert(siteSettings)
      .values({
        key: key.trim(),
        value: value.trim(),
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newSetting[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const keyParam = searchParams.get('key');

    if (!id && !keyParam) {
      return NextResponse.json({ 
        error: "Either ID or key parameter is required",
        code: "MISSING_IDENTIFIER" 
      }, { status: 400 });
    }

    if (id && isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { key, value } = body;

    // Validate at least one field to update
    if (!key && !value) {
      return NextResponse.json({ 
        error: "At least one field (key or value) must be provided for update",
        code: "NO_UPDATE_FIELDS" 
      }, { status: 400 });
    }

    // Find existing setting
    let existingSetting;
    if (id) {
      existingSetting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.id, parseInt(id)))
        .limit(1);
    } else {
      existingSetting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, keyParam!))
        .limit(1);
    }

    if (existingSetting.length === 0) {
      return NextResponse.json({ 
        error: 'Setting not found',
        code: "SETTING_NOT_FOUND" 
      }, { status: 404 });
    }

    // If updating key, check for duplicates
    if (key && key.trim() !== '' && key.trim() !== existingSetting[0].key) {
      const duplicate = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key.trim()))
        .limit(1);

      if (duplicate.length > 0) {
        return NextResponse.json({ 
          error: "A setting with this key already exists",
          code: "DUPLICATE_KEY" 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (key && key.trim() !== '') {
      updates.key = key.trim();
    }

    if (value !== undefined && value !== null) {
      updates.value = typeof value === 'string' ? value.trim() : String(value);
    }

    // Update setting
    const whereCondition = id 
      ? eq(siteSettings.id, parseInt(id))
      : eq(siteSettings.key, keyParam!);

    const updated = await db.update(siteSettings)
      .set(updates)
      .where(whereCondition)
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const key = searchParams.get('key');

    if (!id && !key) {
      return NextResponse.json({ 
        error: "Either ID or key parameter is required",
        code: "MISSING_IDENTIFIER" 
      }, { status: 400 });
    }

    if (id && isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if setting exists
    let existingSetting;
    if (id) {
      existingSetting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.id, parseInt(id)))
        .limit(1);
    } else {
      existingSetting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key!))
        .limit(1);
    }

    if (existingSetting.length === 0) {
      return NextResponse.json({ 
        error: 'Setting not found',
        code: "SETTING_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete setting
    const whereCondition = id 
      ? eq(siteSettings.id, parseInt(id))
      : eq(siteSettings.key, key!);

    const deleted = await db.delete(siteSettings)
      .where(whereCondition)
      .returning();

    return NextResponse.json({ 
      message: 'Setting deleted successfully',
      setting: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}