import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch top 50 users by momentum score
  const { data: topUsers } = await supabase
    .from('users')
    .select('id, display_name, avatar_id, current_streak, momentum_score')
    .order('momentum_score', { ascending: false })
    .limit(50);

  // Determine current user's rank if not in top 50
  let currentUserStats = topUsers?.find(u => u.id === user.id);
  let currentUserRank = topUsers?.findIndex(u => u.id === user.id) ?? -1;

  if (!currentUserStats) {
    // Current user is not in top 50, fetch them explicitly
    const { data: me } = await supabase
      .from('users')
      .select('id, display_name, avatar_id, current_streak, momentum_score')
      .eq('id', user.id)
      .single();
    
    if (me) {
      currentUserStats = me;
      // Approximate rank based on score
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gt('momentum_score', me.momentum_score);
      currentUserRank = (count || 0);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-[3rem_1fr_4rem_5rem] items-center gap-4 border-b border-zinc-200 bg-zinc-50 p-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="text-center">Rank</div>
          <div>Productivity Ninja</div>
          <div className="flex justify-center" title="Current Streak"><Flame className="h-4 w-4" /></div>
          <div className="text-right" title="Momentum Score">Score</div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {topUsers?.map((u, index) => {
            const isMe = u.id === user.id;
            return (
              <div 
                key={u.id} 
                className={cn(
                  "grid grid-cols-[3rem_1fr_4rem_5rem] items-center gap-4 p-4 transition-colors",
                  isMe ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
              >
                <div className="flex justify-center">
                  {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> : 
                   index === 1 ? <Trophy className="h-5 w-5 text-zinc-400" /> :
                   index === 2 ? <Trophy className="h-5 w-5 text-amber-600" /> :
                   <span className="text-sm font-medium text-zinc-500">{index + 1}</span>}
                </div>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate font-medium flex items-center gap-2">
                    {u.display_name}
                    {isMe && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">YOU</span>}
                  </div>
                </div>
                <div className="flex justify-center text-sm font-semibold text-orange-500">
                  {u.current_streak > 0 ? u.current_streak : '-'}
                </div>
                <div className="text-right text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {u.momentum_score.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {currentUserStats && (
        <div className="fixed bottom-16 left-0 right-0 md:bottom-0 md:left-64 z-40 border-t border-zinc-200 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  #{currentUserRank + 1}
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Your Ranking</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Keep it up to climb higher!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{currentUserStats.momentum_score}</p>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Momentum</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
