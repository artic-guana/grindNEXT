import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import SkillRadarChart from '../components/charts/SkillRadarChart.jsx';
import { skillApi } from '../api/skill.api.js';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function SkillsPage() {
  const storeSkills = useGrindNextStore((state) => state.skills);
  const dashboard = useGrindNextStore((state) => state.dashboard);
  const refreshAll = useGrindNextStore((state) => state.refreshAll);

  const [skills, setSkills] = useState(storeSkills);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '' });

  useEffect(() => {
    setSkills(storeSkills);
  }, [storeSkills]);

  const createSkill = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const skill = await skillApi.create({
      name: form.name.trim(),
      category: form.category.trim(),
    });

    setSkills((items) => [...items, skill]);
    setForm({ name: '', category: '' });
    setOpen(false);
    await refreshAll();
  };

  const removeSkill = async (id) => {
    await skillApi.remove(id);
    setSkills((items) => items.filter((skill) => skill._id !== id));
    await refreshAll();
  };

  const chart = dashboard?.skillChart || { labels: [], datasets: [{ data: [] }] };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills"
        subtitle="Track progression across the skills you are deliberately practicing."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add skill
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          {skills.length ? (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill._id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{skill.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                        {skill.category || 'Uncategorized'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="purple">Lv {skill.level}</Badge>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
                        onClick={() => removeSkill(skill._id)}
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <ProgressBar
                    value={skill.xp}
                    max={skill.target}
                    color="violet"
                  />

                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>{skill.xp || 0} XP</span>
                    <span>{skill.target || 0} target</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No skills yet" description="Add the first skill you want to level up." />
          )}
        </Card>

        <Card classname="h-30">
          <h3 className="mb-4 text-lg font-bold text-white">Skill radar</h3>
          <SkillRadarChart
            labels={chart.labels || []}
            data={chart.datasets?.[0]?.data || []}
          />
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add skill">
        <form className="space-y-4" onSubmit={createSkill}>
          <Input
            label="Skill"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            placeholder="Programming, Frontend, Database..."
          />
          <Button type="submit">Add skill</Button>
        </form>
      </Modal>
    </div>
  );
}
