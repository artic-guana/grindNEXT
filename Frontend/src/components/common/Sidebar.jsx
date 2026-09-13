import {
  BriefcaseBusiness,
  Crown,
  LayoutDashboard,
  ListChecks,
  NotebookTabs,
  ShoppingBag,
  Sparkles,
  Target,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/tasks', 'Tasks', ListChecks],
  ['/projects', 'Projects', BriefcaseBusiness],
  ['/workspace', 'Workspace', NotebookTabs],
  ['/skills', 'Skills', Target],
  ['/collection', 'Collection', Sparkles],
  ['/achievements', 'Achievements', Crown],
  ['/shop', 'Shop', ShoppingBag],
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <nav className="space-y-1">
          {items.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-200'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
