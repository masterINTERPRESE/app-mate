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
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const token = tokenCookie.value;
    let payload;
    try {
      const { payload: verifiedPayload } = await jose.jwtVerify(token, JWT_SECRET);
      payload = verifiedPayload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Check for admin role
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const db = await readDb();

    // Return all users, but without their password hashes
    const usersToReturn = db.users.map(user => {
        const { passwordHash, ...rest } = user;
        return rest;
    });

    return NextResponse.json(usersToReturn);
  } catch (error) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
