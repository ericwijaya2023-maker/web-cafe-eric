import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { menu } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;
    const search = searchParams.get('search') || '';

    let query = db.select().from(menu);
    let countQuery = db.select({ count: sql`COUNT(*)` }).from(menu);

    if (search) {
      query = query.where(sql`nama LIKE ${'%' + search + '%'}`);
      countQuery = countQuery.where(sql`nama LIKE ${'%' + search + '%'}`);
    }

    const rows = await query.orderBy(menu.kategori, menu.nama).limit(limit).offset(offset);
    const [total] = await countQuery;
    const [totalAll] = await db.select({ count: sql`COUNT(*)` }).from(menu);

    return NextResponse.json({
      success: true, data: rows,
      pagination: { page, limit, total: total.count, totalAll: totalAll.count },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, kategori, harga, deskripsi, gambar, status } = body;
    if (!nama || !kategori || !harga) {
      return NextResponse.json({ success: false, message: 'Nama, kategori, dan harga wajib diisi' }, { status: 400 });
    }
    const [result] = await db.insert(menu).values({
      nama, kategori, harga, deskripsi: deskripsi || null, gambar: gambar || null, status: status || 'tersedia',
    });
    return NextResponse.json({ success: true, message: 'Menu berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nama, kategori, harga, deskripsi, gambar, status } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID menu diperlukan' }, { status: 400 });
    }
    await db.update(menu).set({ nama, kategori, harga, deskripsi: deskripsi || null, gambar: gambar || null, status: status || 'tersedia' }).where(eq(menu.id, id));
    return NextResponse.json({ success: true, message: 'Menu berhasil diupdate' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID menu diperlukan' }, { status: 400 });
    }
    await db.delete(menu).where(eq(menu.id, id));
    return NextResponse.json({ success: true, message: 'Menu berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
