import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Plus } from 'lucide-react';

import PageHeader from '../components/common/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

import TaskForm from '../features/tasks/TaskForm.jsx';
import TaskItem from '../features/tasks/TaskItem.jsx';

import { taskApi } from '../api/task.api.js';
import { errorMessage } from '../lib/utils.js';

import { useGrindNextStore } from '../store/useGrindNextStore.js';


export default function TasksPage() {
  const refreshAll = useGrindNextStore(
    (state) => state.refreshAll
  );

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [completingIds, setCompletingIds] = useState(
    new Set()
  );

  const [deletingIds, setDeletingIds] = useState(
    new Set()
  );

  const [error, setError] = useState('');


  const normalizeTask = (response) => {
    return (
      response?.task ??
      response?.data?.task ??
      response?.data ??
      response
    );
  };


  const normalizeTaskList = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.tasks)) {
      return response.tasks;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.tasks)) {
      return response.data.tasks;
    }

    return [];
  };


  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await taskApi.list();

      setTasks(
        normalizeTaskList(response)
      );
    } catch (err) {
      setError(
        errorMessage(
          err,
          'Could not load tasks.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    load();
  }, [load]);


  const visibleTasks = useMemo(() => {
    if (filter === 'all') {
      return tasks;
    }

    return tasks.filter(
      (task) => task.status === filter
    );
  }, [tasks, filter]);


  const createTask = async (payload) => {
    try {
      setSubmitting(true);
      setError('');

      const response = await taskApi.create(
        payload
      );

      const createdTask =
        normalizeTask(response);

      if (createdTask?._id) {
        setTasks((currentTasks) => [
          createdTask,
          ...currentTasks,
        ]);
      } else {
        await load();
      }

      setOpen(false);
    } catch (err) {
      setError(
        errorMessage(
          err,
          'Could not create task.'
        )
      );

      throw err;
    } finally {
      setSubmitting(false);
    }
  };


  const completeTask = async (id) => {
    if (completingIds.has(id)) {
      return;
    }

    const previousTask = tasks.find(
      (task) => task._id === id
    );

    if (!previousTask) {
      return;
    }

    if (previousTask.status === 'done') {
      return;
    }

    setCompletingIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    // Optimistic update:
    // immediately show the checkbox as completed.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === id
          ? {
              ...task,
              status: 'done',
              completedAt:
                new Date().toISOString(),
            }
          : task
      )
    );

    try {
      const response =
        await taskApi.complete(id);

      const updatedTask =
        normalizeTask(response);

      if (updatedTask?._id) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === id
              ? updatedTask
              : task
          )
        );
      }

      // Refresh XP, level, streak, coins,
      // achievements etc.
      await refreshAll();
    } catch (err) {
      // Roll back if API request fails.
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === id
            ? previousTask
            : task
        )
      );

      setError(
        errorMessage(
          err,
          'Could not complete task.'
        )
      );
    } finally {
      setCompletingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };


  const deleteTask = async (id) => {
    if (deletingIds.has(id)) {
      return;
    }

    const previousTasks = tasks;

    setDeletingIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });

    // Optimistic delete.
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task._id !== id
      )
    );

    try {
      await taskApi.remove(id);
    } catch (err) {
      setTasks(previousTasks);

      setError(
        errorMessage(
          err,
          'Could not delete task.'
        )
      );
    } finally {
      setDeletingIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle="Complete tasks to earn XP and keep your streak alive."
        action={
          <Button
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />

            New task
          </Button>
        }
      />


      <div className="flex flex-wrap gap-2">
        {[
          'all',
          'todo',
          'in-progress',
          'done',
        ].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setFilter(value)
            }
            className={`
              rounded-full
              border
              px-3
              py-1.5
              text-xs
              capitalize
              transition

              ${
                filter === value
                  ? `
                    border-sky-500
                    bg-sky-500/10
                    text-sky-200
                  `
                  : `
                    border-slate-700
                    text-slate-400
                    hover:border-slate-600
                    hover:text-slate-300
                  `
              }
            `}
          >
            {value === 'in-progress'
              ? 'In Progress'
              : value}
          </button>
        ))}
      </div>


      {error && !loading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}


      {loading ? (
        <LoadingSpinner />
      ) : visibleTasks.length ? (
        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
              completing={
                completingIds.has(task._id)
              }
              deleting={
                deletingIds.has(task._id)
              }
            />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={load}
        />
      ) : (
        <EmptyState
          title="No tasks found"
          description={
            filter === 'all'
              ? 'Create a task and start earning XP.'
              : `No ${filter.replace(
                  '-',
                  ' '
                )} tasks found.`
          }
        />
      )}


      <Modal
        open={open}
        onClose={() => {
          if (!submitting) {
            setOpen(false);
          }
        }}
        title="Create task"
      >
        <TaskForm
          onSubmit={createTask}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}