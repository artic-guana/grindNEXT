import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import useAuth from '../hooks/useAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      await login(form);
      navigate(location.state?.from || '/', { replace: true });
    } catch {
      // Store exposes the API error below.
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <Card className="w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Welcome back</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Sign in to GrindNEXT</h1>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          New here?{' '}
          <Link className="text-sky-300 hover:text-sky-200" to="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
