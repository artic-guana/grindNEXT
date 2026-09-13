import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">404</p>
      <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-400">
        The route you requested does not exist.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
