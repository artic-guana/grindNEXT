import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

export default function ProjectForm({ onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    await onSubmit({
      ...form,
      name: form.name.trim(),
      dueDate: form.dueDate || undefined,
    });

    setForm({ name: '', description: '', priority: 'medium', dueDate: '' });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input label="Project name" value={form.name} onChange={update('name')} required />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={update('description')}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-200">Priority</span>
          <select
            value={form.priority}
            onChange={update('priority')}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <Input label="Due date" type="date" value={form.dueDate} onChange={update('dueDate')} />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create project'}
      </Button>
    </form>
  );
}
