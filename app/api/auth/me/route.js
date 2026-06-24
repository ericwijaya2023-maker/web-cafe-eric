export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    const user = JSON.parse(session.value);
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
  }
}
