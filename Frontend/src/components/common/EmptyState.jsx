import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Create your first item to get started.',
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-12 text-center">
      <Inbox className="mx-auto h-8 w-8 text-slate-500" />
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
