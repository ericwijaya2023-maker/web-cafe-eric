import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseLoginInput, verifyPassword } from '@/lib/auth';
import { users } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { loginInput } = await request.json();
    const parsed = parseLoginInput(loginInput);
    if (!parsed) {
      return NextResponse.json({ success: false, message: 'Format login salah. Gunakan: username(!@#$%)password' }, { status: 400 });
    }
    const { username, password } = parsed;
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Username tidak ditemukan' }, { status: 401 });
    }
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
    }
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const secondsUntilMidnight = Math.floor((midnight - now) / 1000);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, nama: user.nama },
    });
    response.cookies.set('session', JSON.stringify({ id: user.id, username: user.username, role: user.role, nama: user.nama }), {
      httpOnly: true, secure: false, sameSite: 'lax', path: '/',
      maxAge: secondsUntilMidnight,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
