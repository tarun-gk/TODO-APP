// ============================================
// Streak Calculation Engine
// ============================================

import { format, subDays, parseISO } from 'date-fns';

/**
 * Calculate streak based on completion history.
 * Rules:
 * - Streak increments if ≥ 1 task completed on date D
 * - Streak resets to 0 if no task completed on D-1 AND no active shield
 * - Shield auto-consumes on missed day if available
 * - best_streak updates whenever current_streak exceeds it
 */
export function calculateStreak(
  completionDates: string[], // Array of dates (YYYY-MM-DD) with completions
  currentStreak: number,
  bestStreak: number,
  hasShield: boolean
): {
  newStreak: number;
  newBestStreak: number;
  shieldUsed: boolean;
} {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const completedToday = completionDates.includes(today);
  const completedYesterday = completionDates.includes(yesterday);

  let newStreak = currentStreak;
  let shieldUsed = false;

  if (completedToday) {
    // If completed today, increment streak if it wasn't already counted
    if (!completedYesterday && currentStreak > 0) {
      // Missed yesterday but completed today
      if (hasShield) {
        // Shield saves the streak
        shieldUsed = true;
        newStreak = currentStreak + 1;
      } else {
        // Streak resets, start fresh from 1
        newStreak = 1;
      }
    } else if (completedYesterday) {
      newStreak = currentStreak + 1;
    } else {
      // First day or streak was already 0
      newStreak = Math.max(currentStreak, 1);
    }
  } else {
    // Not completed today yet - check if streak should reset
    if (!completedYesterday && currentStreak > 0) {
      if (hasShield) {
        shieldUsed = true;
        // Shield preserves streak
      } else {
        newStreak = 0;
      }
    }
  }

  const newBestStreak = Math.max(bestStreak, newStreak);

  return { newStreak, newBestStreak, shieldUsed };
}

/**
 * Check if a streak is in danger (≥ 3 day streak and no tasks today).
 */
export function isStreakInDanger(
  currentStreak: number,
  tasksCompletedToday: number
): boolean {
  return currentStreak >= 3 && tasksCompletedToday === 0;
}

/**
 * Calculate gravity points earned from a task completion.
 * +10 GP per task, +50 GP bonus for streak ≥ 7 days
 */
export function calculateGPEarned(
  currentStreak: number,
  isFirstTaskOfDay: boolean
): number {
  let gp = 10; // Base GP per task

  // Bonus for maintaining a 7+ day streak (awarded once per day)
  if (currentStreak >= 7 && isFirstTaskOfDay) {
    gp += 50;
  }

  return gp;
}
