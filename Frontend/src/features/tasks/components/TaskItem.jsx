import {
  CalendarDays,
  Check,
  LoaderCircle,
  Trash2,
} from 'lucide-react';

import Badge from '../../components/ui/Badge.jsx';


function formatDueDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: 'numeric',
      month: 'short',
    }
  ).format(date);
}


function getPriorityVariant(priority) {
  switch (priority) {
    case 'urgent':
      return 'danger';

    case 'high':
      return 'warning';

    case 'medium':
      return 'info';

    case 'low':
      return 'default';

    default:
      return 'default';
  }
}


export default function TaskItem({
  task,
  onComplete,
  onDelete,
  completing = false,
  deleting = false,
}) {
  const completed =
    task.status === 'done';

  const dueDate = formatDueDate(
    task.dueDate
  );


  const handleCheckboxChange = (
    event
  ) => {
    // Prevent event bubbling into any
    // clickable parent component.
    event.stopPropagation();

    if (
      completed ||
      completing ||
      deleting
    ) {
      return;
    }

    onComplete?.(task._id);
  };


  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (deleting) {
      return;
    }

    onDelete?.(task._id);
  };


  return (
    <div
      className={`
        group
        flex
        items-start
        gap-4
        rounded-2xl
        border
        p-4
        transition-all
        duration-200

        ${
          completed
            ? `
              border-slate-800
              bg-slate-900/30
            `
            : `
              border-slate-800
              bg-slate-900/60
              hover:border-slate-700
              hover:bg-slate-900/80
            `
        }
      `}
    >
      {/* Checkbox */}
      <div className="pt-0.5">
        <label
          className={`
            relative
            flex
            h-5
            w-5
            items-center
            justify-center

            ${
              completed ||
              completing ||
              deleting
                ? 'cursor-default'
                : 'cursor-pointer'
            }
          `}
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <input
            type="checkbox"
            checked={completed}
            disabled={
              completed ||
              completing ||
              deleting
            }
            onChange={
              handleCheckboxChange
            }
            className="peer sr-only"
          />

          <span
            className={`
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-md
              border
              transition-all

              ${
                completed
                  ? `
                    border-sky-500
                    bg-sky-500
                  `
                  : `
                    border-slate-600
                    bg-slate-950
                    peer-hover:border-sky-500
                  `
              }

              ${
                completing
                  ? 'opacity-70'
                  : ''
              }
            `}
          >
            {completing ? (
              <LoaderCircle
                className="
                  h-3.5
                  w-3.5
                  animate-spin
                  text-white
                "
              />
            ) : completed ? (
              <Check
                className="
                  h-3.5
                  w-3.5
                  stroke-[3]
                  text-white
                "
              />
            ) : null}
          </span>
        </label>
      </div>


      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`
              font-medium
              transition

              ${
                completed
                  ? `
                    text-slate-500
                    line-through
                  `
                  : 'text-slate-100'
              }
            `}
          >
            {task.title}
          </h3>


          {task.priority && (
            <Badge
              variant={getPriorityVariant(
                task.priority
              )}
            >
              {task.priority}
            </Badge>
          )}


          {task.status && (
            <Badge
              variant={
                completed
                  ? 'success'
                  : 'default'
              }
            >
              {task.status ===
              'in-progress'
                ? 'In Progress'
                : task.status}
            </Badge>
          )}
        </div>


        {task.description && (
          <p
            className={`
              mt-1
              text-sm
              leading-6

              ${
                completed
                  ? 'text-slate-600'
                  : 'text-slate-400'
              }
            `}
          >
            {task.description}
          </p>
        )}


        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span
            className={
              completed
                ? 'text-slate-600'
                : 'text-amber-300'
            }
          >
            +{task.xpReward || 0} XP
          </span>


          {dueDate && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />

              {dueDate}
            </span>
          )}


          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map(
                (tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="
                      rounded-md
                      bg-slate-800
                      px-1.5
                      py-0.5
                      text-slate-400
                    "
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>


      {/* Delete */}
      <button
        type="button"
        disabled={deleting}
        onClick={handleDelete}
        aria-label={`Delete ${task.title}`}
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-slate-500
          opacity-60
          transition

          hover:bg-red-500/10
          hover:text-red-400
          hover:opacity-100

          disabled:cursor-not-allowed
          disabled:opacity-40

          md:opacity-0
          md:group-hover:opacity-100
        "
      >
        {deleting ? (
          <LoaderCircle
            className="h-4 w-4 animate-spin"
          />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}