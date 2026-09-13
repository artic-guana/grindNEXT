import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-7 w-7 text-rose-300" />
      <p className="mt-3 text-sm text-rose-100">{message}</p>
      {onRetry ? (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
