import { NextResponse } from 'next/server';
import { subDays, format } from 'date-fns';
import { getDb } from '@/lib/mongodb/client';

export async function GET(request: Request) {
  // Protect this route, usually with an Authorization header
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const yesterday = subDays(new Date(), 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  // Fetch all users
  const users = await db.collection('users').find().toArray();
  
  if (!users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  const results = [];

  for (const user of users) {
    // 1. Get tasks created and completed yesterday
    const tasks = await db.collection('tasks').find({
      user_id: user._id.toString(),
      due_date: yesterdayStr
    }).toArray();

    const tasksCreated = tasks?.length || 0;
    const tasksCompleted = tasks?.filter((t) => t.completed_at !== null).length || 0;
    const completionRate = tasksCreated > 0 ? tasksCompleted / tasksCreated : 0.0;
    const gpEarned = tasksCompleted * 10; // 10 GP per task

    // 2. Insert into daily_stats
    await db.collection('daily_stats').updateOne(
      { user_id: user._id.toString(), date: yesterdayStr },
      { $set: {
          user_id: user._id.toString(),
          date: yesterdayStr,
          tasks_created: tasksCreated,
          tasks_completed: tasksCompleted,
          completion_rate: completionRate,
          gp_earned: gpEarned,
        }
      },
      { upsert: true }
    );

    // 3. Evaluate Streak
    let newCurrentStreak = user.current_streak || 0;
    let newBestStreak = user.best_streak || 0;
    let shieldUsed = false;

    if (tasksCompleted > 0) {
      newCurrentStreak += 1;
      if (newCurrentStreak > newBestStreak) {
        newBestStreak = newCurrentStreak;
      }
    } else {
      // Check for active streak shields
      const shields = await db.collection('streak_shields')
        .find({ user_id: user._id.toString(), used_at: null })
        .sort({ acquired_at: 1 })
        .limit(1)
        .toArray();

      if (shields && shields.length > 0 && newCurrentStreak > 0) {
        // Use shield
        await db.collection('streak_shields').updateOne(
          { _id: shields[0]._id },
          { $set: { used_at: new Date().toISOString() } }
        );
        shieldUsed = true;
        // Streak is preserved, do not increment or reset
      } else {
        newCurrentStreak = 0;
      }
    }

    // 4. Calculate Momentum Score
    // momentum = (current_streak * 3) + (weekly_tasks * 1) + (7_day_avg_completion * 100)
    const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i + 1), 'yyyy-MM-dd'));
    const weekStats = await db.collection('daily_stats')
      .find({
        user_id: user._id.toString(),
        date: { $in: last7Days }
      }).toArray();

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
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: {
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          total_tasks_completed: (user.total_tasks_completed || 0) + tasksCompleted,
          gravity_points: (user.gravity_points || 0) + gpEarned,
          momentum_score: momentumScore,
          last_active_date: tasksCompleted > 0 ? yesterdayStr : user.last_active_date,
        }
      }
    );

    results.push({
      userId: user._id.toString(),
      streak: newCurrentStreak,
      momentum: momentumScore,
      shieldUsed,
    });
  }

  return NextResponse.json({ success: true, processed: results.length, results });
}
