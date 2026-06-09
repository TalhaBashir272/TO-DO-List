import { useState, useEffect } from 'react';
import { Task, TaskFilter, CATEGORIES } from './types';
import { loadTasks, saveTasks } from './utils/storage';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskItem from './components/TaskItem';

import { Sparkles, Calendar, ClipboardList, CheckSquare, Trash2, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<TaskFilter>({
    status: 'all',
    priority: 'all',
    category: 'all',
    searchQuery: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Active Focus Sprint timer states
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 Min Default Pomodoro Focus block
  const [timerActive, setTimerActive] = useState(false);

  // Sync to local storage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Focus Timer interval engine
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (!timerActive && timerSeconds !== 1500) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTimer = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(1500);
  };

  // Generate safe Unique IDs
  const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'task-' + Math.random().toString(36).substring(2, 11);
  };

  // Add or Edit save handler
  const handleSaveTask = (taskData: {
    text: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      // Editing Mode
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              text: taskData.text,
              description: taskData.description,
              priority: taskData.priority,
              category: taskData.category,
              dueDate: taskData.dueDate,
            }
          : t
      );
      setTasks(updated);
      setEditingTask(null);
    } else {
      // Adding Mode
      const newTask: Task = {
        id: generateId(),
        text: taskData.text,
        description: taskData.description || undefined,
        completed: false,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate || undefined,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
    }
  };

  // Mark tasks as completed/active
  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete individual task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  };

  // Duplicate task to speed up similar routines
  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: generateId(),
      text: `${task.text} (Copy)`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([duplicated, ...tasks]);
  };

  // Bulk Actions
  const handleClearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const handleMarkAllComplete = () => {
    setTasks(tasks.map((t) => ({ ...t, completed: true })));
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Format Current Date for header
  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Extract unique categories dynamically from actual tasks
  const dynamicCategories = Array.from(
    new Set(tasks.map((t) => t.category).filter(Boolean))
  ).sort() as string[];
  
  // Combine custom ones with static predefined list
  const categoryFilterList = Array.from(
    new Set([...CATEGORIES.filter((c) => c !== 'All'), ...dynamicCategories])
  ).sort() as string[];

  // Statistics summaries
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Perform multi-criteria filtering and sorting on arrays
  const processedTasks = tasks
    .filter((task) => {
      // Search Box filter
      const query = filter.searchQuery.toLowerCase();
      const matchesSearch =
        task.text.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      // Status Filter
      const matchesStatus =
        filter.status === 'all' ||
        (filter.status === 'completed' && task.completed) ||
        (filter.status === 'active' && !task.completed);

      // Priority Filter
      const matchesPriority =
        filter.priority === 'all' || task.priority === filter.priority;

      // Category Filter
      const matchesCategory =
        filter.category === 'all' || task.category === filter.category;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (filter.sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (filter.sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (filter.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return filter.sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-[#F1F3F6] px-4 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Responsive Header block of the Bento Theme */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-650 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none mb-1.5 flex items-center gap-2">
                TaskFlow Pro
              </h1>
              <p className="text-slate-500 text-sm font-bold">
                Personal Dashboard • {getTodayDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs self-stretch sm:self-auto">
            <div className="text-right pl-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Developer Mode</p>
              <p id="developer-badge" className="text-xs font-black text-indigo-600">v2.4.0 Stable</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
              TS
            </div>
          </div>
        </header>

        {/* 12-Column Responsive Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          
          {/* LEFT WING: Task Formulation and active lists queue */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            
            {/* Expanded Create Form */}
            <TaskForm
              onSave={handleSaveTask}
              editingTask={editingTask}
              onCancelEdit={handleCancelEdit}
            />

            {/* Quick selectors categories navigation */}
            <TaskFilters
              filter={filter}
              onChange={setFilter}
              categories={categoryFilterList}
            />

            {/* Main Action Task Grid */}
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-250 border-slate-100 shadow-xs flex flex-col gap-5">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Active Tasks
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold">Priority level list tracking</p>
                </div>
                <span className="text-[10px] font-black tracking-wide text-indigo-605 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl uppercase">
                  Priority Queue
                </span>
              </div>

              {/* Bulk command rails */}
              {tasks.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Bulk Controls
                  </span>
                  <div className="flex gap-2">
                    <button
                      id="bulk-complete-btn"
                      onClick={handleMarkAllComplete}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs hover:border-slate-300"
                    >
                      <ListChecks className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-600" />
                      Select All
                    </button>
                    <button
                      id="bulk-clear-completed-btn"
                      onClick={handleClearCompleted}
                      className="px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer transition-colors"
                      disabled={tasks.filter((t) => t.completed).length === 0}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      Clear Completed
                    </button>
                  </div>
                </div>
              )}

              {/* Fluid dynamic cards mapping */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {processedTasks.length > 0 ? (
                    processedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEdit={(t) => setEditingTask(t)}
                        onDelete={handleDeleteTask}
                        onDuplicate={handleDuplicateTask}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-slate-50/50 border border-slate-100 rounded-3xl p-10 text-center"
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <CheckSquare className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 mb-1">
                        {tasks.length === 0 ? "You're all caught up!" : 'No tasks matched guidelines'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {tasks.length === 0
                          ? 'Start building your routine by formulating your premier tasks above.'
                          : 'Try checking different priority criteria, categories or clear your search query.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT WING: Re-styled Bento Statistics and visualizations */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">

            {/* Project Velocity (Indigo statistics chart) */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-6 lg:p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100/30 min-h-[280px]">
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight leading-none text-white">Project Velocity</h3>
                <p className="text-indigo-200 text-xs font-semibold">Active tasks distributed by Category</p>
              </div>
              
              {/* Dynamic SVGs Category Graph */}
              <div className="h-32 flex items-end justify-between gap-3 px-2 pt-6">
                {['Personal', 'Work', 'Shopping', 'Health', 'Other'].map((cat) => {
                  const count = tasks.filter(t => t.category === cat && !t.completed).length;
                  const maxVal = Math.max(...['Personal', 'Work', 'Shopping', 'Health', 'Other'].map(c => tasks.filter(t => t.category === c && !t.completed).length), 1);
                  const heightPercent = count > 0 ? (count / maxVal) * 100 : 8; // min height fallback for spacing
                  
                  return (
                    <div key={cat} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-indigo-500/40 rounded-t-xl relative overflow-hidden flex items-end" style={{ height: '80%' }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="w-full bg-white rounded-t-xl flex items-center justify-center shadow-inner"
                        >
                          {count > 0 && <span className="text-[10px] text-indigo-700 font-extrabold pb-1 sm:block hidden">{count}</span>}
                        </motion.div>
                      </div>
                      <span className="text-[10px] font-black tracking-wider uppercase text-indigo-200 shrink-0">
                        {cat.slice(0, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Stats Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Daily Cap Progress Ring */}
              <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-xs border border-slate-205 border-slate-100 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">DAILY CAP</p>
                  <p className="text-xl font-extrabold text-slate-800">{completionPercentage}%</p>
                </div>
                
                {/* SVG Circle progress */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      className="stroke-slate-100"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {totalCount > 0 && (
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="stroke-indigo-600"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={238}
                        initial={{ strokeDashoffset: 238 }}
                        animate={{ strokeDashoffset: 238 - (238 * completionPercentage) / 100 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <div className="absolute text-slate-900 font-extrabold text-sm">
                    {completedCount}/{totalCount}
                  </div>
                </div>
                <p className="text-slate-450 text-[10px] font-bold text-slate-400">Tasks Completed today</p>
              </div>

              {/* Focus Session / Active Sprint Stopwatch */}
              <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 shadow-xs flex flex-col justify-between text-white min-h-[220px] relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Focusing
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">ACTIVE SPRINT</p>
                  <p className="text-sm font-bold text-slate-350">Tactical Focus block</p>
                </div>

                <div className="py-2">
                  <div className="text-3xl font-mono font-black tracking-tight leading-none text-white">
                    {formatTimer()}
                  </div>
                  <p className="text-[10px] text-slate-550 mt-1 uppercase text-slate-500 font-bold">Recommended pomodoro timer</p>
                </div>

                {/* Stopwatch controls */}
                <div className="flex gap-2 relative z-10">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="flex-1 py-1.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
                  >
                    {timerActive ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={handleResetTimer}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black transition-all cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Component Hierarchy visualization block */}
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-xs border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Component Hierarchy</h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">React App • useState Local Persistence</p>
              </div>
              
              {/* Component graph tags */}
              <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono font-black">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">App</span>
                <span className="text-slate-300">→</span>
                <span className="px-2 py-1 bg-slate-50 text-slate-650 rounded-lg border border-slate-100">Form</span>
                <span className="text-slate-300">→</span>
                <span className="px-2 py-1 bg-slate-50 text-slate-650 rounded-lg border border-slate-100">Filters</span>
                <span className="text-slate-300">→</span>
                <span className="px-2 py-1 bg-indigo-600 text-white rounded-lg shadow-xs">Item</span>
              </div>
            </div>

            {/* Keep the Momentum Celebration Card */}
            <div className="bg-emerald-500 rounded-[2.5rem] p-6 lg:p-8 flex items-center justify-between gap-6 shadow-xl shadow-emerald-100/40 text-white relative overflow-hidden">
              <div className="space-y-1 relative z-10">
                <h3 className="text-xl font-extrabold tracking-tight leading-none text-white">Keep the momentum</h3>
                <p className="text-emerald-100 text-xs font-bold leading-relaxed max-w-[240px]">
                  {completedCount > 0 
                    ? `You've completed ${completedCount} outstanding routine items today. Sensational job!`
                    : "Formulate and check off your very first task above to jumpstart your active productivity streak!"
                  }
                </p>
              </div>
              <div className="w-16 h-16 bg-white/15 rounded-3xl flex items-center justify-center text-3xl shadow-inner relative z-10 shrink-0 select-all">
                🔥
              </div>
              {/* Stylized background grid pattern */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
