export default function PageHeader({ eyebrow = 'GrindNEXT', title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
