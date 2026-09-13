import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useOutsideClick from '../../hooks/useOutsideClick.js';

export default function Dropdown({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOutsideClick(ref, () => setOpen(false));

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-200"
      >
        <span>{selected?.label || label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 min-w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
