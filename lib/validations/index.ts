import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  display_name: z.string().min(1, 'Display name is required').max(30, 'Display name too long'),
  avatar_id: z.number().int().min(1).max(8).default(1),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Task schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  notes: z.string().max(5000).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().optional(),
  due_time: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  notes: z.string().max(5000).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  due_date: z.string().optional(),
  due_time: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int().min(0),
  })),
});

// Profile schemas
export const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(30).optional(),
  avatar_id: z.number().int().min(1).max(8).optional(),
  notification_time: z.string().optional().nullable(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

// Stats schemas
export const dailyStatsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(14),
});

export const heatmapQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(12).default(12),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
