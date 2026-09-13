export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        className={`w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
