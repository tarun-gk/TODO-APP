import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { subDays, format } from 'date-fns';

export async function GET(request: Request) {
  // Protect this route, usually with an Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createServiceClient();
  const yesterday = subDays(new Date(), 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  // Fetch all users
  const { data: users, error: usersError } = await supabase.from('users').select('*');
  if (usersError || !users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  const results = [];

  for (const user of users) {
    // 1. Get tasks created and completed yesterday
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, completed_at')
      .eq('user_id', user.id)
      .eq('due_date', yesterdayStr);

    const tasksCreated = tasks?.length || 0;
    const tasksCompleted = tasks?.filter((t) => t.completed_at !== null).length || 0;
    const completionRate = tasksCreated > 0 ? tasksCompleted / tasksCreated : 0.0;
    const gpEarned = tasksCompleted * 10; // 10 GP per task

    // 2. Insert into daily_stats
    await supabase.from('daily_stats').upsert({
      user_id: user.id,
      date: yesterdayStr,
      tasks_created: tasksCreated,
      tasks_completed: tasksCompleted,
      completion_rate: completionRate,
      gp_earned: gpEarned,
    }, { onConflict: 'user_id, date' });

    // 3. Evaluate Streak
    let newCurrentStreak = user.current_streak;
    let newBestStreak = user.best_streak;
    let shieldUsed = false;

    if (tasksCompleted > 0) {
      newCurrentStreak += 1;
      if (newCurrentStreak > newBestStreak) {
        newBestStreak = newCurrentStreak;
      }
    } else {
      // Check for active streak shields
      const { data: shields } = await supabase
        .from('streak_shields')
        .select('*')
        .eq('user_id', user.id)
        .is('used_at', null)
        .order('acquired_at', { ascending: true })
        .limit(1);

      if (shields && shields.length > 0 && newCurrentStreak > 0) {
        // Use shield
        await supabase
          .from('streak_shields')
          .update({ used_at: new Date().toISOString() })
          .eq('id', shields[0].id);
        shieldUsed = true;
        // Streak is preserved, do not increment or reset
      } else {
        newCurrentStreak = 0;
      }
    }

    // 4. Calculate Momentum Score
    // momentum = (current_streak * 3) + (weekly_tasks * 1) + (7_day_avg_completion * 100)
    const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i + 1), 'yyyy-MM-dd'));
    const { data: weekStats } = await supabase
      .from('daily_stats')
      .select('tasks_completed, completion_rate')
      .eq('user_id', user.id)
      .in('date', last7Days);

    let weeklyTasks = 0;
    let weeklyRateSum = 0;
    
    if (weekStats) {
      weekStats.forEach(stat => {
        weeklyTasks += stat.tasks_completed;
        weeklyRateSum += stat.completion_rate;
      });
    }

    const avgCompletion = weekStats && weekStats.length > 0 ? weeklyRateSum / weekStats.length : 0;
    const momentumScore = Math.floor((newCurrentStreak * 3) + weeklyTasks + (avgCompletion * 100));

    // 5. Update user profile
    await supabase
      .from('users')
      .update({
        current_streak: newCurrentStreak,
        best_streak: newBestStreak,
        total_tasks_completed: user.total_tasks_completed + tasksCompleted,
        gravity_points: user.gravity_points + gpEarned,
        momentum_score: momentumScore,
        last_active_date: tasksCompleted > 0 ? yesterdayStr : user.last_active_date,
      })
      .eq('id', user.id);

    results.push({
      userId: user.id,
      streak: newCurrentStreak,
      momentum: momentumScore,
      shieldUsed,
    });
  }

  return NextResponse.json({ success: true, processed: results.length, results });
}
