import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { news } from '@/db/schema';
import { eq, like, or, and, isNotNull, desc } from 'drizzle-orm';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    // Single news by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const newsItem = await db
        .select()
        .from(news)
        .where(eq(news.id, parseInt(id)))
        .limit(1);

      if (newsItem.length === 0) {
        return NextResponse.json(
          { error: 'News not found', code: 'NEWS_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(newsItem[0], { status: 200 });
    }

    // Single news by slug
    if (slug) {
      const newsItem = await db
        .select()
        .from(news)
        .where(eq(news.slug, slug))
        .limit(1);

      if (newsItem.length === 0) {
        return NextResponse.json(
          { error: 'News not found', code: 'NEWS_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(newsItem[0], { status: 200 });
    }

    // List all news with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    let query = db.select().from(news);

    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(news.title, `%${search}%`),
          like(news.content, `%${search}%`),
          like(news.excerpt, `%${search}%`)
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(news.category, category));
    }

    // Published filter
    if (published === 'true') {
      conditions.push(isNotNull(news.publishedAt));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(news.createdAt))
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
    const { title, content, excerpt, category, slug, imageUrl, publishedAt } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    if (!excerpt || excerpt.trim() === '') {
      return NextResponse.json(
        { error: 'Excerpt is required', code: 'MISSING_EXCERPT' },
        { status: 400 }
      );
    }

    if (!category || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const newsSlug = slug && slug.trim() !== '' ? slug.trim() : generateSlug(title);

    // Check if slug is unique
    const existingNews = await db
      .select()
      .from(news)
      .where(eq(news.slug, newsSlug))
      .limit(1);

    if (existingNews.length > 0) {
      return NextResponse.json(
        { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 400 }
      );
    }

    // Prepare data for insertion
    const timestamp = new Date().toISOString();
    const newsData = {
      title: title.trim(),
      slug: newsSlug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
      imageUrl: imageUrl?.trim() || null,
      publishedAt: publishedAt?.trim() || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newNews = await db.insert(news).values(newsData).returning();

    return NextResponse.json(newNews[0], { status: 201 });
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

    // Check if news exists
    const existingNews = await db
      .select()
      .from(news)
      .where(eq(news.id, parseInt(id)))
      .limit(1);

    if (existingNews.length === 0) {
      return NextResponse.json(
        { error: 'News not found', code: 'NEWS_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, slug, content, excerpt, imageUrl, category, publishedAt } = body;

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Update fields if provided
    if (title !== undefined) {
      if (title.trim() === '') {
        return NextResponse.json(
          { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (content !== undefined) {
      if (content.trim() === '') {
        return NextResponse.json(
          { error: 'Content cannot be empty', code: 'INVALID_CONTENT' },
          { status: 400 }
        );
      }
      updates.content = content.trim();
    }

    if (excerpt !== undefined) {
      if (excerpt.trim() === '') {
        return NextResponse.json(
          { error: 'Excerpt cannot be empty', code: 'INVALID_EXCERPT' },
          { status: 400 }
        );
      }
      updates.excerpt = excerpt.trim();
    }

    if (category !== undefined) {
      if (category.trim() === '') {
        return NextResponse.json(
          { error: 'Category cannot be empty', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = category.trim();
    }

    if (slug !== undefined) {
      const newSlug = slug.trim();
      if (newSlug === '') {
        return NextResponse.json(
          { error: 'Slug cannot be empty', code: 'INVALID_SLUG' },
          { status: 400 }
        );
      }

      // Check if slug is unique (excluding current news)
      const duplicateSlug = await db
        .select()
        .from(news)
        .where(and(eq(news.slug, newSlug), eq(news.id, parseInt(id))))
        .limit(1);

      if (duplicateSlug.length === 0) {
        const existingSlug = await db
          .select()
          .from(news)
          .where(eq(news.slug, newSlug))
          .limit(1);

        if (existingSlug.length > 0) {
          return NextResponse.json(
            { error: 'Slug already exists', code: 'DUPLICATE_SLUG' },
            { status: 400 }
          );
        }
      }

      updates.slug = newSlug;
    }

    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl?.trim() || null;
    }

    if (publishedAt !== undefined) {
      updates.publishedAt = publishedAt?.trim() || null;
    }

    const updatedNews = await db
      .update(news)
      .set(updates)
      .where(eq(news.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedNews[0], { status: 200 });
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

    // Check if news exists
    const existingNews = await db
      .select()
      .from(news)
      .where(eq(news.id, parseInt(id)))
      .limit(1);

    if (existingNews.length === 0) {
      return NextResponse.json(
        { error: 'News not found', code: 'NEWS_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(news)
      .where(eq(news.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'News deleted successfully',
        deleted: deleted[0],
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