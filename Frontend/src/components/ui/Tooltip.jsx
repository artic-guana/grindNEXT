export default function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 shadow-lg group-hover:block">
        {label}
      </span>
    </span>
  );
}
