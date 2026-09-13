import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export default function TaskForm({ projectId = null, onSubmit, submitting = false }) {
  const [form, setForm] = useState(initialForm);

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    await onSubmit({
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || undefined,
      project: projectId || undefined,
    });

    setForm(initialForm);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Input
        label="Title"
        value={form.title}
        onChange={update('title')}
        placeholder="What needs to be done?"
        required
      />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-200">Description</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={update('description')}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500"
          placeholder="Optional details"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
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
        {submitting ? 'Creating...' : 'Create task'}
      </Button>
    </form>
  );
}
