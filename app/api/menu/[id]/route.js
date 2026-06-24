import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menu } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [row] = await db.select().from(menu).where(eq(menu.id, id)).limit(1);
    if (!row) {
      return NextResponse.json({ success: false, message: 'Menu tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: row });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
