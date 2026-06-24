import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, menu, users } from '@/drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [order] = await db.select({
      id: orders.id, noMeja: orders.noMeja, tipe: orders.tipe,
      status: orders.status, total: orders.total, userId: orders.userId,
      createdAt: orders.createdAt, kasirNama: users.nama,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id)).limit(1);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    const items = await db.select({
      id: orderItems.id, menuId: orderItems.menuId, qty: orderItems.qty,
      harga: orderItems.harga, subtotal: orderItems.subtotal,
      menuNama: menu.nama, kategori: menu.kategori,
    })
    .from(orderItems)
    .leftJoin(menu, eq(orderItems.menuId, menu.id))
    .where(eq(orderItems.orderId, id));

    return NextResponse.json({ success: true, data: { ...order, items } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    await db.update(orders).set({ status: body.status }).where(eq(orders.id, id));
    return NextResponse.json({ success: true, message: 'Status pesanan diupdate' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.transaction(async (tx) => {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id));
      await tx.delete(orders).where(eq(orders.id, id));
    });
    return NextResponse.json({ success: true, message: 'Pesanan dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
