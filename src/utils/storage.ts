import { Task } from '../types';

export const loadTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem('todo_app_tasks');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  
  // Return some initial demo tasks if empty to give the user a great onboarding experience
  return [
    {
      id: 'demo-1',
      text: 'Design premium To-Do List UI 🎨',
      description: 'Implement typography hierarchy, elegant glassmorphic containers, and subtle micro-interactions.',
      completed: true,
      priority: 'high',
      category: 'Work',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'demo-2',
      text: 'Create modular React components',
      description: 'Extract TaskForm, TaskItem, TaskFilters, and TaskStats into clean TypeScript files.',
      completed: false,
      priority: 'high',
      category: 'Work',
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'demo-3',
      text: 'Restock fresh seasonal groceries 🛒',
      description: 'Pick up avocado, organic berries, Greek yogurt, spinach, and sourdough bread from the farmer\'s market.',
      completed: false,
      priority: 'medium',
      category: 'Shopping',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'demo-4',
      text: 'Go for a morning trail run 🏃‍♂️',
      description: 'Maintain a steady aerobic heart rate for 45 minutes along the greenwood loop.',
      completed: false,
      priority: 'low',
      category: 'Health',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }
  ];
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('todo_app_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};
