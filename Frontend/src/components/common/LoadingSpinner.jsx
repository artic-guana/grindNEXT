import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', fullPage = false }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-slate-300 ${fullPage ? 'min-h-[60vh]' : 'py-10'}`}>
      <LoaderCircle className="h-5 w-5 animate-spin text-sky-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
