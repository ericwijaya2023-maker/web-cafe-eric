export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, payments, menu, users } from '@/drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tglAwal = searchParams.get('tgl_awal');
    const tglAkhir = searchParams.get('tgl_akhir');

    const hasDateFilter = tglAwal && tglAkhir;
    let orderDateCondition;
    let paymentDateCondition;
    if (hasDateFilter) {
      orderDateCondition = sql`DATE(${orders.createdAt}) BETWEEN ${tglAwal} AND ${tglAkhir}`;
      paymentDateCondition = sql`DATE(${payments.createdAt}) BETWEEN ${tglAwal} AND ${tglAkhir}`;
    } else {
      orderDateCondition = undefined;
      paymentDateCondition = undefined;
    }
    const [totalOrders] = await db.select({ total: sql`COUNT(*)` })
      .from(orders)
      .where(orderDateCondition);
    const [totalRevenue] = await db.select({ total: sql`COALESCE(SUM(${payments.jumlahBayar}), 0)` })
      .from(payments)
      .where(paymentDateCondition);
    const [totalMenu] = await db.select({ total: sql`COUNT(*)` }).from(menu);

    const ordersByDay = await db.select({
      tanggal: sql`DATE(${orders.createdAt})`,
      jumlah: sql`COUNT(*)`,
      pendapatan: sql`COALESCE(SUM(${orders.total}), 0)`,
    })
    .from(orders)
    .where(hasDateFilter
      ? sql`DATE(${orders.createdAt}) BETWEEN ${tglAwal} AND ${tglAkhir}`
      : sql`DATE(${orders.createdAt}) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`)
    .groupBy(sql`DATE(${orders.createdAt})`)
    .orderBy(sql`DATE(${orders.createdAt})`);

    const recentOrders = await db.select({
      id: orders.id, noMeja: orders.noMeja, tipe: orders.tipe, total: orders.total,
      status: orders.status, createdAt: orders.createdAt, kasirNama: users.nama,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

    return NextResponse.json({ success: true, data: {
      totalOrders: totalOrders.total, totalRevenue: totalRevenue.total, totalMenu: totalMenu.total,
      ordersByDay, recentOrders,
    }});
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
