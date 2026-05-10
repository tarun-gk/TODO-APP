// ============================================
// Momentum Score Calculator
// ============================================

/**
 * Momentum Score Formula:
 * (current_streak × 3) + (weekly_tasks_completed × 1) + (7_day_avg_completion_rate × 100)
 * 
 * This rewards:
 * - Consistency (streak)
 * - Volume (weekly tasks)
 * - Efficiency (completion rate)
 */
export function calculateMomentumScore(
  currentStreak: number,
  weeklyTasksCompleted: number,
  sevenDayAvgCompletionRate: number
): number {
  const streakComponent = currentStreak * 3;
  const volumeComponent = weeklyTasksCompleted * 1;
  const efficiencyComponent = Math.round(sevenDayAvgCompletionRate * 100);

  return streakComponent + volumeComponent + efficiencyComponent;
}

/**
 * Calculate 7-day average completion rate from daily stats.
 */
export function calculateAvgCompletionRate(
  dailyStats: Array<{ tasks_created: number; tasks_completed: number }>
): number {
  if (dailyStats.length === 0) return 0;

  const totalRate = dailyStats.reduce((sum, day) => {
    if (day.tasks_created === 0) return sum;
    return sum + (day.tasks_completed / day.tasks_created);
  }, 0);

  return totalRate / dailyStats.length;
}

/**
 * Calculate weekly tasks completed from daily stats.
 */
export function calculateWeeklyCompleted(
  dailyStats: Array<{ tasks_completed: number }>
): number {
  return dailyStats.reduce((sum, day) => sum + day.tasks_completed, 0);
}
