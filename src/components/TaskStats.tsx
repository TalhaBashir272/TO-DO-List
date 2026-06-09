import { Task } from '../types';
import { CheckCircle2, Circle, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = total - completedCount;
  const completionPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'high').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      {/* Percentage Circle / Progress card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between col-span-1 sm:col-span-1"
      >
        <div className="space-y-1">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Progress</span>
          <h3 className="text-3xl font-bold text-stone-900 tracking-tight">{completionPercentage}%</h3>
          <p className="text-xs text-stone-400">of tasks cleared</p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${completionPercentage}, 100` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-emerald-500"
              strokeWidth="3.5"
              strokeDasharray={`${completionPercentage}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="text-xs font-semibold text-emerald-600">{completedCount}/{total}</span>
        </div>
      </motion.div>

      {/* Pending Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4"
      >
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <Circle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">To-Do</span>
          <h3 className="text-2xl font-bold text-stone-900">{pendingCount}</h3>
          <p className="text-xs text-stone-400">tasks awaiting</p>
        </div>
      </motion.div>

      {/* Completed Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4"
      >
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Completed</span>
          <h3 className="text-2xl font-bold text-stone-900">{completedCount}</h3>
          <p className="text-xs text-stone-400">tasks finished</p>
        </div>
      </motion.div>

      {/* Urgent Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4"
      >
        <div className={`p-3 rounded-xl transition-colors ${highPriorityPending > 0 ? 'bg-rose-50 text-rose-600' : 'bg-stone-50 text-stone-400'}`}>
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Urgent</span>
          <h3 className={`text-2xl font-bold ${highPriorityPending > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
            {highPriorityPending}
          </h3>
          <p className="text-xs text-stone-400">high-priority unfinished</p>
        </div>
      </motion.div>
    </div>
  );
}
