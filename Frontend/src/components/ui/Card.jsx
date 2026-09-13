export default function Card({ children, className = '', header, footer }) {
  return (
    <section className={`rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-[0_16px_45px_rgba(2,6,23,0.22)] backdrop-blur-sm ${className}`}>
      {header ? <div className="mb-4">{header}</div> : null}
      {children}
      {footer ? <div className="mt-4">{footer}</div> : null}
    </section>
  );
}
