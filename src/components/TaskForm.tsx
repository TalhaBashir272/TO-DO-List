import React, { useState, useEffect } from 'react';
import { Task, Priority, CATEGORIES } from '../types';
import { Plus, X, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskFormProps {
  onSave: (taskData: {
    text: string;
    description: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

export default function TaskForm({ onSave, editingTask, onCancelEdit }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string>('Personal');
  const [dueDate, setDueDate] = useState<string>('');
  
  const [error, setError] = useState('');

  // Synchronize when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate || '');
      setIsOpen(true);
      setError('');
    } else if (!isOpen) {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setText('');
    setDescription('');
    setPriority('medium');
    setCategory('Personal');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Task title is required');
      return;
    }
    
    onSave({
      text: text.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
    });

    resetForm();
    if (!editingTask) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (editingTask && onCancelEdit) {
      onCancelEdit();
    } else {
      setIsOpen(false);
    }
  };

  const priorityColors = {
    low: 'border-emerald-250 bg-emerald-50/50 text-emerald-800 focus-within:ring-emerald-400',
    medium: 'border-amber-250 bg-amber-50/50 text-amber-850 focus-within:ring-amber-400',
    high: 'border-rose-250 bg-rose-50/50 text-rose-800 focus-within:ring-rose-400',
  };

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isOpen && !editingTask ? (
          <motion.button
            key="collapsed-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="expand-task-form-btn"
            onClick={() => setIsOpen(true)}
            className="w-full py-5 px-6 bg-white hover:bg-slate-50 border border-slate-200 rounded-[2rem] shadow-xs text-slate-500 font-bold text-sm flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-650 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-slate-500 group-hover:text-slate-800 transition-colors">What needs to be accomplished?</span>
            </div>
            <span className="text-[10px] font-black tracking-widest bg-slate-100 group-hover:bg-indigo-550 group-hover:text-white px-2.5 py-1 rounded-lg uppercase transition-all">
              Add Task
            </span>
          </motion.button>
        ) : (
          <motion.form
            key="expanded-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="task-submit-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 id="form-heading" className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {editingTask ? 'Modify Active Task' : 'Configure New Task'}
              </h3>
              <button
                type="button"
                id="close-task-form-btn"
                onClick={handleCancel}
                className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Error Alert */}
            <div className="space-y-1.5">
              <label htmlFor="task-title-input" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Task Title *
              </label>
              <input
                id="task-title-input"
                type="text"
                placeholder="e.g. Complete quarterly documentation"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full px-4 py-3 text-slate-800 placeholder-slate-400 text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  error ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200'
                }`}
                autoFocus
              />
              {error && (
                <p id="task-form-error" className="text-xs text-rose-600 font-bold">
                  {error}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="task-desc-input" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Detailed Notes (Optional)
              </label>
              <textarea
                id="task-desc-input"
                placeholder="List context, key metrics, sub-items, or useful references..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Select via interactive buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Priority level
                </span>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                    const isSelected = priority === p;
                    const borderColors = {
                      low: isSelected ? 'border-emerald-500 bg-emerald-50 text-emerald-850' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300',
                      medium: isSelected ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300',
                      high: isSelected ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300',
                    };
                    return (
                      <button
                        key={p}
                        id={`priority-btn-${p}`}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 text-center text-xs font-black capitalize border rounded-xl transition-all cursor-pointer ${borderColors[p]} ${
                          isSelected ? 'shadow-xs scale-[1.01]' : ''
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date Option */}
              <div className="space-y-1.5">
                <label htmlFor="task-due-date-input" className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id="task-due-date-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs text-slate-750 font-bold rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Category Placement
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.filter(c => c !== 'All').map((c) => {
                  const isSelected = category === c;
                  return (
                    <button
                      key={c}
                      id={`category-pill-${c.toLowerCase()}`}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-150'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                id="cancel-submission-btn"
                onClick={handleCancel}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-task-btn"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                {editingTask ? 'Apply Changes' : 'Formulate Task'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
