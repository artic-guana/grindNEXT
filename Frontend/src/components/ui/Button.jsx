export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const styles = {
    primary:
      'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/15 hover:from-sky-400 hover:to-blue-500',
    secondary:
      'border border-slate-700 bg-slate-800/80 text-slate-100 hover:bg-slate-700',
    ghost:
      'border border-transparent bg-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/70',
    danger:
      'border border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant] || styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
