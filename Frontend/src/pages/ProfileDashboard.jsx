import {
  BadgeCheck,
  Flame,
  PawPrint,
  Swords,
  Trophy,
  UserCircle2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Modal from '../components/ui/Modal.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import SkillRadarChart from '../components/charts/SkillRadarChart.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { profileApi } from '../api/profile.api.js';
import { initials } from '../lib/utils.js';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function ProfileDashboard() {
  const {
    profile,
    skills,
    achievements,
    activity,
    collectibles,
    refreshProfile,
  } = useGrindNextStore();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    avatar: profile.avatar || '',
  });

  useEffect(() => {
    setForm({
      name: profile.name || '',
      bio: profile.bio || '',
      avatar: profile.avatar || '',
    });
  }, [profile]);

  const owned = useMemo(
    () =>
      collectibles.map((entry) => ({
        ownedId: entry._id,
        level: entry.level || 1,
        xp: entry.xp || 0,
        nickname: entry.nickname || null,
        shiny: Boolean(entry.shiny),
        ...(entry.collectible || entry),
      })),
    [collectibles]
  );

  const animeCharacters = owned.filter((item) => item.category === 'anime');
  const pokemon = owned.filter((item) => item.category === 'pokemon');

  const saveProfile = async (event) => {
    event.preventDefault();
    await profileApi.updateMe(form);
    await refreshProfile();
    setEditOpen(false);
  };

  const chartLabels = skills.slice(0, 6).map((skill) => skill.name);
  const chartData = skills.slice(0, 6).map((skill) => skill.level);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Your progression, equipped companions, achievements, and skill growth."
        action={<Button variant="secondary" onClick={() => setEditOpen(true)}>Edit profile</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <Card>
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name || 'Profile avatar'}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-500/30"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}

              <div
                className={`${profile.avatar ? 'hidden' : 'flex'} h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-lg font-bold text-sky-200 ring-2 ring-sky-500/30`}
              >
                {initials(profile.name)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-white">{profile.name || 'User'}</h2>
                <p className="mt-1 text-sm text-slate-400">{profile.bio || 'No bio yet.'}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Level {profile.level}</span>
                <span>{profile.currentXp}/{profile.nextLevelXp} XP</span>
              </div>
              <ProgressBar
                className="mt-2 h-2"
                value={profile.currentXp}
                max={profile.nextLevelXp}
              />
            </div>
          </Card>

          <Card>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <Flame className="mx-auto h-5 w-5 text-orange-300" />
                <p className="mt-2 text-2xl font-bold text-white">{profile.streak}</p>
                <p className="text-xs text-slate-500">Current streak</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <Trophy className="mx-auto h-5 w-5 text-amber-300" />
                <p className="mt-2 text-2xl font-bold text-white">{profile.maxStreak}</p>
                <p className="text-xs text-slate-500">Best streak</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-white">Skill radar</h3>
            <SkillRadarChart labels={chartLabels} data={chartData} />
          </Card>
        </aside>

        <main className="space-y-6">
          <Card
            header={
              <div className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-sky-300" />
                <h3 className="text-lg font-bold text-white">Anime characters</h3>
              </div>
            }
          >
            {animeCharacters.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {animeCharacters.map((item) => (
                  <div key={item.ownedId} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-52 w-full object-cover origin-center"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center">
                        <UserCircle2 className="h-10 w-10 text-slate-600" />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-white">{item.name}</p>
                        <Badge variant={item.type === 'waifu' ? 'purple' : 'default'}>
                          {item.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.anime?.title || 'Anime character'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No anime characters owned" description="Purchase one from the shop." />
            )}
          </Card>

          <Card
            header={
              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-sky-300" />
                <h3 className="text-lg font-bold text-white">Pokémon companions</h3>
              </div>
            }
          >
            {pokemon.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pokemon.map((item) => (
                  <div key={item.ownedId} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div className="flex h-32 items-center justify-center">
                      {item.animatedImage || item.image ? (
                        <img
                          src={item.animatedImage || item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <PawPrint className="h-10 w-10 text-slate-600" />
                      )}
                    </div>
                    <p className="mt-3 font-semibold text-white">{item.nickname || item.name}</p>
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>Lv {item.level}</span>
                      <span className="capitalize">
                        {item.pokemon?.types?.join(' / ') || item.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No Pokémon companions owned" description="Purchase one from the shop." />
            )}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card
              header={
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-sky-300" />
                  <h3 className="text-lg font-bold text-white">Achievements</h3>
                </div>
              }
            >
              {achievements.length ? (
                <div className="space-y-3">
                  {achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement._id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <span className="text-sm text-slate-200">
                        {achievement.icon} {achievement.name}
                      </span>
                      <span className="text-xs text-sky-300">+{achievement.xpReward || 0} XP</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No achievement definitions loaded.</p>
              )}
            </Card>

            <Card header={<h3 className="text-lg font-bold text-white">Recent activity</h3>}>
              {activity.length ? (
                <div className="space-y-3">
                  {activity.slice(0, 6).map((item) => (
                    <div key={item._id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                      <p className="text-sm text-slate-200">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No recent activity.</p>
              )}
            </Card>
          </div>
        </main>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <form className="space-y-4" onSubmit={saveProfile}>
          <Input
            label="Name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <Input
            label="Avatar URL"
            value={form.avatar}
            onChange={(event) =>
              setForm((current) => ({ ...current, avatar: event.target.value }))
            }
            placeholder="https://..."
          />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Bio</span>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-500"
            />
          </label>
          <Button type="submit">Save changes</Button>
        </form>
      </Modal>
    </div>
  );
}
