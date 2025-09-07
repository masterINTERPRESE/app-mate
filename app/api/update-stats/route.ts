import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { gamificationService, type Achievement } from '@/lib/gamification';
import type { User } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    // Create a Supabase client that can work in Server Components, Route Handlers, and Server Actions.
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const user = session.user;

    // Fetch the user's profile from the database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ message: profileError.message }, { status: 500 });
    }

    const problemResult = await request.json();
    const { isCorrect, timeSeconds, difficulty } = problemResult;
    const currentUserStats = profile.stats;

    // --- Start of gamification logic ---
    currentUserStats.totalProblems = (currentUserStats.totalProblems || 0) + 1;
    if (isCorrect) {
      currentUserStats.correctAnswers = (currentUserStats.correctAnswers || 0) + 1;
      currentUserStats.currentStreak = (currentUserStats.currentStreak || 0) + 1;
      currentUserStats.maxStreak = Math.max(
        currentUserStats.maxStreak || 0,
        currentUserStats.currentStreak,
      );
    } else {
      currentUserStats.currentStreak = 0;
    }

    if (!currentUserStats.fastestTime || timeSeconds < currentUserStats.fastestTime) {
      currentUserStats.fastestTime = timeSeconds;
    }

    const totalTime = (currentUserStats.averageTime || 0) * (currentUserStats.totalProblems - 1) + timeSeconds;
    currentUserStats.averageTime = totalTime / currentUserStats.totalProblems;

    const xpGained = gamificationService.calculateXP(
      isCorrect,
      timeSeconds,
      currentUserStats.currentStreak,
      difficulty,
    );
    const oldXP = profile.xp || 0;
    const newXP = oldXP + xpGained;

    const oldRank = gamificationService.getRankByXP(oldXP);
    const newRank = gamificationService.getRankByXP(newXP);

    const userStatsForAchievements = {
      ...currentUserStats,
      totalXP: newXP,
      achievements: currentUserStats.achievements || [],
      rank: newRank,
    };

    const newAchievements = gamificationService.checkAchievements(userStatsForAchievements);

    newAchievements.forEach((newAchievement) => {
        const achievements = currentUserStats.achievements || [];
        const existingIndex = achievements.findIndex((a: Achievement) => a.id === newAchievement.id);
        if (existingIndex !== -1) {
            achievements[existingIndex] = { ...achievements[existingIndex], ...newAchievement };
        } else {
            achievements.push(newAchievement);
        }
        currentUserStats.achievements = achievements;
    });
    // --- End of gamification logic ---

    // Update the profile in the database
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        xp: newXP,
        rank: newRank.name,
        stats: currentUserStats,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
        return NextResponse.json({ message: updateError.message }, { status: 500 });
    }

    // Combine auth user data and profile data to return the full User object
    const userToReturn: User = {
        id: user.id,
        email: user.email!,
        createdAt: user.created_at!,
        name: updatedProfile.name,
        rank: updatedProfile.rank,
        xp: updatedProfile.xp,
        stats: updatedProfile.stats,
    };

    return NextResponse.json(userToReturn);

  } catch (error) {
      if (error instanceof Error) {
          return NextResponse.json({ message: `Update stats error: ${error.message}` }, { status: 500 });
      }
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
