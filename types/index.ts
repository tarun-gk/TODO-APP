// ============================================
// Antigravity — Core Type Definitions
// ============================================

export interface Profile {
  id: string;
  display_name: string;
  avatar_id: number;
  current_streak: number;
  best_streak: number;
  total_tasks_completed: number;
  gravity_points: number;
  notification_time: string | null;
  theme: 'light' | 'dark' | 'system';
  last_active_date: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  due_time: string | null;
  completed_at: string | null;
  position: number;
  recurrence_rule: string | null;
  tags: string[];
  deleted_at: string | null;
  created_at: string;
}

export interface DailyStats {
  id: string;
  user_id: string;
  date: string;
  tasks_created: number;
  tasks_completed: number;
  completion_rate: number;
  gp_earned: number;
}

export interface StreakShield {
  id: string;
  user_id: string;
  acquired_at: string;
  used_at: string | null;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  created_at: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  display_name: string;
  avatar_id: number;
  current_streak: number;
  momentum_score: number;
  rank: number;
}

// Daily challenge
export interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  target: number;
  type: 'complete_tasks' | 'complete_before_time' | 'streak_maintain';
}

// Create/Update DTOs
export interface CreateTaskInput {
  title: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  due_time?: string;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  due_time?: string;
  tags?: string[];
}

export interface UpdateProfileInput {
  display_name?: string;
  avatar_id?: number;
  notification_time?: string;
  theme?: 'light' | 'dark' | 'system';
}
