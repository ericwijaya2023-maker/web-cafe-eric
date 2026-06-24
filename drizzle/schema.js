import { mysqlTable, int, varchar, decimal, timestamp, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('kasir'),
  nama: varchar('nama', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const menu = mysqlTable('menu', {
  id: int('id').autoincrement().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  kategori: varchar('kategori', { length: 20 }).notNull(),
  harga: decimal('harga', { precision: 10, scale: 2 }).notNull(),
  gambar: varchar('gambar', { length: 255 }),
  deskripsi: text('deskripsi'),
  status: varchar('status', { length: 20 }).default('tersedia'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  noMeja: varchar('no_meja', { length: 10 }),
  tipe: varchar('tipe', { length: 20 }).notNull().default('dine_in'),
  status: varchar('status', { length: 20 }).default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).default('0.00'),
  userId: int('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull(),
  menuId: int('menu_id').notNull(),
  qty: int('qty').notNull().default(1),
  harga: decimal('harga', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
});

export const payments = mysqlTable('payments', {
  id: int('id').autoincrement().primaryKey(),
  orderId: int('order_id').notNull().unique(),
  metode: varchar('metode', { length: 50 }).notNull(),
  jumlahBayar: decimal('jumlah_bayar', { precision: 10, scale: 2 }).notNull(),
  kembalian: decimal('kembalian', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
});
