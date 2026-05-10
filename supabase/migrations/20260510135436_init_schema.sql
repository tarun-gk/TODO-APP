CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name VARCHAR(30) NOT NULL,
  avatar_id INTEGER,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  gravity_points INTEGER DEFAULT 0,
  notification_time TIME,
  theme theme_type DEFAULT 'system',
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a public.users row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  notes TEXT,
  priority priority_level DEFAULT 'medium',
  due_date DATE DEFAULT CURRENT_DATE,
  due_time TIME,
  completed_at TIMESTAMPTZ,
  position INTEGER DEFAULT 0,
  recurrence_rule TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tasks are private to users" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);
