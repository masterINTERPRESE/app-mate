import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { gamificationService } from '@/lib/gamification';
import type { User } from '@/lib/auth';

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

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function getAuthenticatedUser(token: string): Promise<any | null> {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      if (!payload.sub) return null;

      const db = await readDb();
      const user = db.users.find((u) => u.id === payload.sub);
      return user || null;
    } catch (err) {
      return null;
    }
}


export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('session_token');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const user = await getAuthenticatedUser(tokenCookie.value);
    if (!user) {
      return NextResponse.json({ message: 'User not found or invalid token' }, { status: 401 });
    }

    const problemResult = await request.json();
    const { isCorrect, timeSeconds, difficulty } = problemResult;

    // --- Start of gamification logic ---
    user.stats.totalProblems++;
    if (isCorrect) {
      user.stats.correctAnswers++;
      user.stats.currentStreak++;
      user.stats.maxStreak = Math.max(user.stats.maxStreak, user.stats.currentStreak);
    } else {
      user.stats.currentStreak = 0;
    }

    if (user.stats.fastestTime === 0 || timeSeconds < user.stats.fastestTime) {
      user.stats.fastestTime = timeSeconds;
    }

    const totalTime = user.stats.averageTime * (user.stats.totalProblems - 1) + timeSeconds;
    user.stats.averageTime = totalTime / user.stats.totalProblems;

    const xpGained = gamificationService.calculateXP(
      isCorrect,
      timeSeconds,
      user.stats.currentStreak,
      difficulty,
    );
    const oldXP = user.xp;
    user.xp += xpGained;

    const newRank = gamificationService.getRankByXP(user.xp);
    user.rank = newRank.name;

    // (Achievements logic omitted for brevity, but would be similar)
    // --- End of gamification logic ---

    const db = await readDb();
    const userIndex = db.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      db.users[userIndex] = user;
      await writeDb(db);
    }

    const { passwordHash, ...userToReturn } = user;
    return NextResponse.json(userToReturn);

  } catch (error) {
    console.error('Update stats error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
