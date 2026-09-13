import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import useAuth from '../hooks/useAuth.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      await signup(form);
      navigate('/', { replace: true });
    } catch {
      // Store exposes the API error below.
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <Card className="w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Start your grind</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Create an account</h1>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Name"
            autoComplete="name"
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
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
            autoComplete="new-password"
            minLength={8}
            required
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link className="text-sky-300 hover:text-sky-200" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
