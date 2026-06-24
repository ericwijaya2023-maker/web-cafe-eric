export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ success: false, message: 'File tidak ditemukan' }, { status: 400 });
    }
    const ext = file.name.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ success: false, message: 'Format file harus: ' + allowed.join(', ') }, { status: 400 });
    }

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudinary = await import('cloudinary').then(m => m.v2);
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const buffer = Buffer.from(await file.arrayBuffer());
      const b64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder: 'web-cafe-eric' });
      return NextResponse.json({ success: true, url: result.secure_url });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), 'public', 'images', 'uploads');
    const filepath = path.join(dir, filename);
    await mkdir(dir, { recursive: true });
    await writeFile(filepath, buffer);
    return NextResponse.json({ success: true, url: `/images/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
