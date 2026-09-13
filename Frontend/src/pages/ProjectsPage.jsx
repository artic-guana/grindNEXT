import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ProjectForm from '../features/projects/ProjectForm.jsx';
import { projectApi } from '../api/project.api.js';
import { priorityBadgeVariant } from '../constants/priorities.js';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const response = await projectApi.list();
      setProjects(Array.isArray(response) ? response : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async (payload) => {
    try {
      setSubmitting(true);
      const project = await projectApi.create(payload);
      setProjects((items) => [project, ...items]);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Break larger goals into trackable quests."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New project
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : projects.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <Card className="h-full transition hover:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{project.name}</h3>
                    {project.description ? (
                      <p className="mt-2 text-sm text-slate-400">{project.description}</p>
                    ) : null}
                  </div>

                  <Badge variant={priorityBadgeVariant[project.priority] || 'default'}>
                    {project.priority}
                  </Badge>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>

                <ProgressBar
                  className="mt-2"
                  value={project.progress || 0}
                  color="emerald"
                />

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{project.tasks?.length || 0} tasks</span>
                  <span>{project.xpReward || 0} XP</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No projects yet" description="Create your first project." />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create project">
        <ProjectForm onSubmit={createProject} submitting={submitting} />
      </Modal>
    </div>
  );
}
