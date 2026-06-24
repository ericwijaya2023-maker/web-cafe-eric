export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, menu, users } from '@/drizzle/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tipe = searchParams.get('tipe');
    const tanggal = searchParams.get('tanggal');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let conditions = [];
    if (status) conditions.push(eq(orders.status, status));
    if (tipe) conditions.push(eq(orders.tipe, tipe));
    if (tanggal) conditions.push(sql`DATE(${orders.createdAt}) = ${tanggal}`);

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db.select({
      id: orders.id, noMeja: orders.noMeja, tipe: orders.tipe,
      status: orders.status, total: orders.total, userId: orders.userId,
      createdAt: orders.createdAt, kasirNama: users.nama,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(limit).offset(offset);

    const [total] = await db.select({ count: sql`COUNT(*)` }).from(orders).where(where);

    return NextResponse.json({ success: true, data: rows, pagination: { page, limit, total: total.count } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { no_meja, tipe, items, user_id } = body;
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Minimal 1 item pesanan' }, { status: 400 });
    }
    let result;
    await db.transaction(async (tx) => {
      const [orderResult] = await tx.insert(orders).values({
        noMeja: no_meja || null, tipe: tipe || 'dine_in', status: 'pending', userId: user_id || null,
      });
      const orderId = orderResult.insertId;
      let total = 0;
      for (const item of items) {
        const [menuRow] = await tx.select().from(menu).where(eq(menu.id, item.menu_id)).limit(1);
        if (!menuRow) throw new Error(`Menu ID ${item.menu_id} tidak ditemukan`);
        const harga = parseFloat(menuRow.harga);
        const subtotal = harga * item.qty;
        total += subtotal;
        await tx.insert(orderItems).values({
          orderId, menuId: item.menu_id, qty: item.qty, harga: harga.toString(), subtotal: subtotal.toString(),
        });
      }
      await tx.update(orders).set({ total: total.toString() }).where(eq(orders.id, orderId));
      result = { orderId, total };
    });
    return NextResponse.json({ success: true, message: 'Pesanan berhasil dibuat', ...result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
