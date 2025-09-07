import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createHmac } from 'crypto';
import * as jose from 'jose';

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

function hashPassword(password: string) {
  const hmac = createHmac('sha256', SECRET_KEY);
  hmac.update(password);
  return hmac.digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const db = await readDb();
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const hashedPassword = hashPassword(password);
    if (hashedPassword !== user.passwordHash) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT, including the user's role in the payload
    const token = await new jose.SignJWT({ sub: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const { passwordHash, ...userToReturn } = user;

    const response = NextResponse.json(userToReturn);

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
