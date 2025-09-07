import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { createHmac } from 'crypto';
import { ACHIEVEMENTS } from '@/lib/gamification';
import type { User } from '@/lib/auth'; // We'll need to update this type later

const dbPath = path.join(process.cwd(), 'db.json');
const SECRET_KEY = process.env.AUTH_SECRET || 'your-default-secret-key-for-development';
const ADMIN_EMAIL = 'isaac290906@gmail.com';

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function hashPassword(password: string) {
  const hmac = createHmac('sha256', SECRET_KEY);
  hmac.update(password);
  return hmac.digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Email, password, and name are required' }, { status: 400 });
    }

    const db = await readDb();

    const existingUser = db.users.find((user: any) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const userRole = email === ADMIN_EMAIL ? 'admin' : 'user';

    const newUserInDb = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      passwordHash: hashedPassword,
      name,
      role: userRole,
      rank: "Soldado",
      xp: 0,
      createdAt: new Date().toISOString(),
      stats: {
        totalProblems: 0,
        correctAnswers: 0,
        currentStreak: 0,
        maxStreak: 0,
        averageTime: 0,
        fastestTime: 0,
        achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
      },
    };

    db.users.push(newUserInDb);
    await writeDb(db);

    const { passwordHash, ...userToReturn } = newUserInDb;

    return NextResponse.json(userToReturn, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
