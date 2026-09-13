export default function ProgressBar({ value = 0, max = 100, color = 'sky', className = '' }) {
  const safeMax = Number(max) > 0 ? Number(max) : 1;
  const percent = Math.min(100, Math.max(0, (Number(value || 0) / safeMax) * 100));

  const colors = {
    sky: 'from-sky-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
  };

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color] || colors.sky}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
