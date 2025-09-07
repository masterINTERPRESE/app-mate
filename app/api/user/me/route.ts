import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const dbPath = path.join(process.cwd(), 'db.json');
const SECRET_KEY = process.env.AUTH_SECRET || 'your-default-secret-key-for-development';
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);

async function readDb(): Promise<{ users: any[] }> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('session_token');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const token = tokenCookie.value;
    let payload;
    try {
      const { payload: verifiedPayload } = await jose.jwtVerify(token, JWT_SECRET);
      payload = verifiedPayload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    if (!payload.sub) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    const db = await readDb();
    const user = db.users.find((u) => u.id === payload.sub);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...userToReturn } = user;

    return NextResponse.json(userToReturn);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
