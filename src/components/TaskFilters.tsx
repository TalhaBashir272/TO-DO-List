import { TaskFilter, Priority, CATEGORIES } from '../types';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskFiltersProps {
  filter: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  categories: string[];
}

export default function TaskFilters({ filter, onChange, categories }: TaskFiltersProps) {
  const setFilterValue = <K extends keyof TaskFilter>(key: K, value: TaskFilter[K]) => {
    onChange({ ...filter, [key]: value });
  };

  const statusOptions: { value: TaskFilter['status']; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'To-Do' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions: { value: 'all' | Priority; label: string }[] = [
    { value: 'all', label: 'Any Priority' },
    { value: 'low', label: 'Low Only' },
    { value: 'medium', label: 'Medium Only' },
    { value: 'high', label: 'High Only' },
  ];

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-xs space-y-4 mb-6">
      {/* Primary search and status filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search tasks by title or description..."
            value={filter.searchQuery}
            onChange={(e) => setFilterValue('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:border-indigo-505 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white transition-all duration-150 font-medium"
          />
        </div>

        {/* Status Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              id={`status-filter-${opt.value}`}
              onClick={() => setFilterValue('status', opt.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all duration-150 cursor-pointer ${
                filter.status === opt.value
                  ? 'bg-indigo-650 bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filtering & sorting controls */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        {/* Category Select */}
        <div className="space-y-1.5">
          <label htmlFor="category-select" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Category
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={filter.category}
              onChange={(e) => setFilterValue('category', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/90 px-3 py-2 rounded-xl text-xs text-slate-700 font-bold focus:outline-hidden focus:border-indigo-505 hover:border-slate-350 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Select */}
        <div className="space-y-1.5">
          <label htmlFor="priority-select" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Priority
          </label>
          <select
            id="priority-select"
            value={filter.priority}
            onChange={(e) => setFilterValue('priority', e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200/90 px-3 py-2 rounded-xl text-xs text-slate-700 font-bold focus:outline-hidden focus:border-indigo-550 hover:border-slate-350 cursor-pointer"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Select */}
        <div className="space-y-1.5">
          <label htmlFor="sort-select" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            Sort By
          </label>
          <select
            id="sort-select"
            value={filter.sortBy}
            onChange={(e) => setFilterValue('sortBy', e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200/90 px-3 py-2 rounded-xl text-xs text-slate-705 font-bold focus:outline-hidden focus:border-indigo-550 hover:border-slate-355 cursor-pointer"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority Tier</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="space-y-1.5 self-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block sm:invisible">
            Order
          </span>
          <button
            id="sort-order-toggle"
            onClick={() => setFilterValue('sortOrder', filter.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 font-bold transition-colors cursor-pointer animate-none"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
