import { Trash2 } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';
import { priorityBadgeVariant } from '../../constants/priorities.js';
import { formatDate } from '../../lib/utils.js';

export default function TaskItem({ task, onComplete, onDelete }) {
  const done = task.status === 'done';

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex min-w-0 gap-3">
        <input
          type="checkbox"
          checked={done}
          disabled={done}
          onChange={() => !done && onComplete(task._id)}
          className="mt-1 h-4 w-4 accent-sky-500"
        />

        <div className="min-w-0">
          <p className={`font-medium ${done ? 'text-slate-500 line-through' : 'text-white'}`}>
            {task.title}
          </p>

          {task.description ? (
            <p className="mt-1 text-sm text-slate-400">{task.description}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={priorityBadgeVariant[task.priority] || 'default'}>
              {task.priority}
            </Badge>
            <Badge variant={done ? 'success' : 'purple'}>{task.status}</Badge>
            <span className="text-xs text-sky-300">+{task.xpReward || 0} XP</span>
            {task.dueDate ? (
              <span className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(task._id)}
        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300"
        aria-label={`Delete ${task.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
