import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import TaskForm from '../features/tasks/TaskForm.jsx';
import TaskItem from '../features/tasks/TaskItem.jsx';
import { projectApi } from '../api/project.api.js';
import { taskApi } from '../api/task.api.js';
import { priorityBadgeVariant } from '../constants/priorities.js';
import { errorMessage } from '../lib/utils.js';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const refreshAll = useGrindNextStore((state) => state.refreshAll);
  const [project, setProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      setProject(await projectApi.get(id));
    } catch (error) {
      setError(errorMessage(error, 'Project not found.'));
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const resync = async () => {
    await projectApi.syncProgress(id);
    await load();
    await refreshAll();
  };

  const createTask = async (payload) => {
    await taskApi.create(payload);
    setOpen(false);
    await resync();
  };

  const completeTask = async (taskId) => {
    await taskApi.complete(taskId);
    await resync();
  };

  const deleteTask = async (taskId) => {
    await taskApi.remove(taskId);
    await resync();
  };

  const completeProject = async () => {
    await projectApi.complete(id);
    await load();
    await refreshAll();
  };

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!project) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        subtitle={project.description}
        action={<Button onClick={() => setOpen(true)}>Add task</Button>}
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Badge variant={priorityBadgeVariant[project.priority] || 'default'}>
              {project.priority}
            </Badge>
            <Badge variant={project.status === 'completed' ? 'success' : 'purple'}>
              {project.status}
            </Badge>
          </div>
          <span className="text-sm text-sky-300">{project.xpReward || 0} XP reward</span>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>

        <ProgressBar
          className="mt-2 h-2"
          value={project.progress || 0}
          color="emerald"
        />

        {project.status !== 'completed' ? (
          <Button className="mt-5" variant="secondary" onClick={completeProject}>
            Complete project
          </Button>
        ) : null}
      </Card>

      {project.tasks?.length ? (
        <div className="space-y-3">
          {project.tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No project tasks" description="Add a task to begin this project." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add project task">
        <TaskForm projectId={id} onSubmit={createTask} />
      </Modal>
    </div>
  );
}
