import { Coins, Flame, Menu, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useGrindNextStore } from '../../store/useGrindNextStore.js';

const links = [
  ['/', 'Home'],
  ['/workspace', 'Workspace'],
  ['/shop', 'Shop'],
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, profile, logout } = useGrindNextStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <p className="text-[15px] font-bold uppercase text-sky-300">GrindNEXT</p>
          </div>
        </NavLink>

        {isAuthenticated ? (
          <>
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 text-sm text-slate-300 xl:flex">
              {links.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? 'text-white' : 'transition hover:text-white'
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" className="hidden px-3 py-2 sm:inline-flex" onClick={logout}>
                Logout
              </Button>
              <button
                type="button"
                className="rounded-lg border border-slate-700 p-2 xl:hidden"
                onClick={() => setMobileOpen((value) => !value)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </>
        ) : (
          <NavLink to="/login">
            <Button className="px-4 py-2">Login</Button>
          </NavLink>
        )}
      </div>

      {isAuthenticated && mobileOpen ? (
        <nav className="border-t border-slate-800 px-4 py-3 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">
            {[...links, ['/achievements', 'Achievements'], ['/profile', 'Profile']].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {label}
              </NavLink>
            ))}
            <Button variant="ghost" className="justify-start" onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
