export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'border-sky-400/20 bg-sky-500/10 text-sky-200',
    success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
    danger: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
    purple: 'border-violet-400/20 bg-violet-500/10 text-violet-200',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
