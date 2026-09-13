import { Coins, Flame, Sparkles, Star, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import SkillRadarChart from '../components/charts/SkillRadarChart.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-sky-300" />
      </div>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile, projects, achievements, activity, dashboard } = useGrindNextStore();

  const chart = dashboard?.skillChart || { labels: [], datasets: [{ data: [] }] };

  return (
    <div>
      <PageHeader
        title={profile.name ? `Welcome back, ${profile.name}` : 'Dashboard'}
        subtitle="Track your momentum across tasks, projects, skills, achievements, and collectibles."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Level" value={profile.level} hint="Current rank" icon={Star} />
        <StatCard label="Coins" value={profile.coins} hint="Spend in the shop" icon={Coins} />
        <StatCard label="Streak" value={`${profile.streak}d`} hint={`Best ${profile.maxStreak}d`} icon={Flame} />
        <StatCard label="Total XP" value={profile.totalXp} hint="Lifetime progress" icon={TrendingUp} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card
          header={
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Progress</p>
                <h3 className="mt-1 text-xl font-bold text-white">Current level</h3>
              </div>
              <Badge variant="purple">Lv {profile.level}</Badge>
            </div>
          }
        >
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{profile.currentXp} XP</span>
            <span>{profile.nextLevelXp} XP</span>
          </div>
          <ProgressBar
            className="mt-3 h-2"
            value={profile.currentXp}
            max={profile.nextLevelXp}
          />
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Skills</p>
                <h3 className="mt-1 text-xl font-bold text-white">Power map</h3>
              </div>
              <Target className="h-5 w-5 text-sky-300" />
            </div>
          }
        >
          <SkillRadarChart
            labels={chart.labels || []}
            data={chart.datasets?.[0]?.data || []}
          />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Active projects</h3>
              <Link className="text-xs text-sky-300 hover:text-sky-200" to="/projects">
                View all
              </Link>
            </div>
          }
        >
          {projects.length ? (
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block rounded-xl border border-slate-800 bg-slate-950/40 p-3 hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{project.name}</p>
                    <span className="text-xs text-slate-400">{project.progress}%</span>
                  </div>
                  <ProgressBar className="mt-3" value={project.progress} color="emerald" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState title="No projects yet" description="Create a project to start tracking progress." />
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Recent activity</h3>
              <Sparkles className="h-5 w-5 text-sky-300" />
            </div>
          }
        >
          {activity.length ? (
            <div className="space-y-3">
              {activity.slice(0, 6).map((item) => (
                <div key={item._id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <p className="text-sm text-slate-200">{item.description}</p>
                  <div className="mt-2 flex gap-3 text-xs">
                    {item.xpChange ? <span className="text-sky-300">+{item.xpChange} XP</span> : null}
                    {item.coinChange ? <span className="text-amber-300">+{item.coinChange} coins</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No activity yet" description="Complete tasks and projects to build your feed." />
          )}
        </Card>
      </div>

      {achievements.length ? (
        <div className="mt-6">
          <Card>
            <div className="flex flex-wrap gap-3">
              {achievements.slice(0, 6).map((achievement) => (
                <div key={achievement._id} className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <span className="mr-2">{achievement.icon}</span>
                  <span className="text-sm text-slate-300">{achievement.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
