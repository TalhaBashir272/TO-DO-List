import React from 'react';
import { Task } from '../types';
import { Calendar, Trash2, Edit3, Copy, AlertCircle, Circle, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
}: TaskItemProps) {
  
  // Format due date elegantly
  const formatDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate + 'T12:00:00'); // avoid timezone shifts
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Determine if task is overdue
  const checkOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return task.dueDate < todayStr;
  };

  const isOverdue = checkOverdue();

  // Priority layout settings
  const priorityStyles = {
    low: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    medium: {
      dot: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-800 border-amber-100',
    },
    high: {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-100',
    },
  };

  const activeStyles = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.2 }}
      id={`task-item-${task.id}`}
      className={`group p-4 sm:p-5 rounded-3xl border transition-all duration-250 relative overflow-hidden ${
        task.completed
          ? 'border-slate-100 bg-white/40 opacity-70'
          : 'border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-205 hover:shadow-xs'
      }`}
    >
      {/* Visual priority bar on left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${activeStyles.dot}`} />

      <div className="flex items-start gap-4">
        {/* Custom Circular Checkbox */}
        <button
          type="button"
          id={`toggle-task-btn-${task.id}`}
          onClick={() => onToggleComplete(task.id)}
          className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer select-none shrink-0 mt-0.5 ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'border-slate-300 hover:border-indigo-500 bg-white hover:scale-105'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* Task Details Area */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Task Name */}
            <h4
              id={`task-title-text-${task.id}`}
              className={`text-sm sm:text-base font-bold leading-snug break-words pr-2 ${
                task.completed
                  ? 'text-slate-400 line-through decoration-slate-300'
                  : 'text-slate-850'
              }`}
            >
              {task.text}
            </h4>

            {/* Custom Badges (Priority & Category) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[10px] font-black px-2.5 py-0.5 border rounded-lg capitalize tracking-wider ${activeStyles.badge}`}>
                {task.priority}
              </span>
              <span className="text-[10px] font-black px-2.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200/60 rounded-lg">
                {task.category}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              id={`task-desc-text-${task.id}`}
              className={`text-xs leading-relaxed max-w-xl break-words ${
                task.completed ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Footer Metrics (Due Date, Date created) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[11px] text-slate-400 font-mono">
            {task.dueDate && (
              <div
                id={`task-due-date-badge-${task.id}`}
                className={`flex items-center gap-1.5 ${
                  isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                <span>Due: {formatDueDate()}</span>
                {isOverdue && <span className="uppercase text-[9px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 font-sans tracking-wide">Overdue</span>}
              </div>
            )}
            
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Controls Menu */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 self-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
          {/* Duplicate task */}
          <button
            id={`duplicate-task-btn-${task.id}`}
            onClick={() => onDuplicate(task)}
            title="Duplicate Task"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          {/* Edit task */}
          <button
            id={`edit-task-btn-${task.id}`}
            disabled={task.completed}
            onClick={() => onEdit(task)}
            title="Edit Task"
            className={`p-1.5 rounded-xl transition-all border border-transparent ${
              task.completed
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-800 hover:bg-white hover:border-slate-200 cursor-pointer'
            }`}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete task */}
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 border border-transparent rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
