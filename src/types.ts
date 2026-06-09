export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
}

export interface TaskFilter {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | Priority;
  category: string; // 'all' or specific category
  searchQuery: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export const CATEGORIES = ['All', 'Personal', 'Work', 'Shopping', 'Health', 'Education', 'Other'] as const;
