import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments, orders } from '@/drizzle/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    const metode = searchParams.get('metode');
    const tanggal = searchParams.get('tanggal');

    let conditions = [];
    if (metode) conditions.push(eq(payments.metode, metode));
    if (tanggal) conditions.push(sql`DATE(${payments.createdAt}) = ${tanggal}`);
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db.select({
      id: payments.id, orderId: payments.orderId, metode: payments.metode,
      jumlahBayar: payments.jumlahBayar, kembalian: payments.kembalian,
      createdAt: payments.createdAt, tipe: orders.tipe, total: orders.total,
    })
    .from(payments)
    .leftJoin(orders, eq(payments.orderId, orders.id))
    .where(where)
    .orderBy(desc(payments.createdAt))
    .limit(limit).offset(offset);

    const [total] = await db.select({ count: sql`COUNT(*)` }).from(payments).where(where);
    return NextResponse.json({ success: true, data: rows, pagination: { page, limit, total: total.count } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { order_id, metode, jumlah_bayar } = body;
    if (!order_id || !metode || !jumlah_bayar) {
      return NextResponse.json({ success: false, message: 'Data pembayaran tidak lengkap' }, { status: 400 });
    }
    let result;
    await db.transaction(async (tx) => {
      const [order] = await tx.select().from(orders).where(eq(orders.id, order_id)).limit(1);
      if (!order) throw new Error('Pesanan tidak ditemukan');
      const total = parseFloat(order.total);
      const bayar = parseFloat(jumlah_bayar);
      const kembalian = bayar - total;
      if (metode === 'tunai' && kembalian < 0) throw new Error('Jumlah bayar kurang dari total');
      await tx.insert(payments).values({
        orderId: order_id, metode, jumlahBayar: jumlah_bayar, kembalian: kembalian < 0 ? '0' : kembalian.toString(),
      });
      await tx.update(orders).set({ status: 'dibayar' }).where(eq(orders.id, order_id));
      result = { total, jumlah_bayar: bayar, kembalian: kembalian < 0 ? 0 : kembalian };
    });
    return NextResponse.json({ success: true, message: 'Pembayaran berhasil', data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
