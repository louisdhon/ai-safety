import { writeFile, unlink } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

const ALLOWED_TYPES = ['audio/webm', 'audio/wav', 'audio/mp3'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Generate unique filename with UUID
    const filename = `${randomUUID()}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Store in tmp directory with unique name
    const path = join('/tmp', filename);
    await writeFile(path, buffer);
    
    // Schedule file cleanup after 5 minutes
    setTimeout(async () => {
      try {
        await unlink(path);
        console.log(`Cleaned up file: ${path}`);
      } catch (error) {
        console.error(`Failed to clean up file: ${path}`, error);
      }
    }, 5 * 60 * 1000);
    
    return NextResponse.json({ path });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}