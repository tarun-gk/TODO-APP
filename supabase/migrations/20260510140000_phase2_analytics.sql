-- Add momentum_score to users
ALTER TABLE public.users ADD COLUMN momentum_score INTEGER DEFAULT 0;

-- Create DailyStats table
CREATE TABLE public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  tasks_created INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  completion_rate FLOAT DEFAULT 0.0,
  gp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Create StreakShields table
CREATE TABLE public.streak_shields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Enable RLS on new tables
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_shields ENABLE ROW LEVEL SECURITY;

-- DailyStats policies
CREATE POLICY "Users can view own daily stats" ON public.daily_stats
  FOR SELECT USING (auth.uid() = user_id);

-- StreakShields policies
CREATE POLICY "Users can view own streak shields" ON public.streak_shields
  FOR SELECT USING (auth.uid() = user_id);
