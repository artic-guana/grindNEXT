import {
  Crown,
  Rabbit,
  Rocket,
  Footprints,
  Shield,
  Flame,
  Trophy,
  Swords,
  CircleCheckBig,
  FolderCheck,
  BriefcaseBusiness,
  Zap,
  ChevronsUp,
  Brain,
  Sparkles,
  Gem,
  PackageOpen,
} from 'lucide-react';

import flameAnimation from '../assets/icons/Fire Flame.json';

import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useGrindNextStore } from '../store/useGrindNextStore.js';

const achievementIcons = {
  Crown: Crown,
  Rabbit: Rabbit,
  Rocket: Rocket,
  Footprints: Footprints,
  Shield: Shield,
  Flame: Flame,
  flame: flameAnimation,
  Trophy: Trophy,
  Swords: Swords,
  'CircleCheckBig': CircleCheckBig,
  'FolderCheck': FolderCheck,
  'BriefcaseBusiness': BriefcaseBusiness,
  Zap: Zap,
  'ChevronsUp': ChevronsUp,
  Brain: Brain,
  Sparkles: Sparkles,
  Gem: Gem,
  'Package-open': PackageOpen,
};

export default function AchievementsPage() {
  const achievements = useGrindNextStore(
    (state) => state.achievements
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        subtitle="Milestones available across your GrindNEXT journey."
      />

      {achievements.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((achievement) => {
            const AchievementIcon =
              achievementIcons[achievement.icon] || Crown;

            return (
              <Card key={achievement._id}>
                <div className="flex items-center justify-between">
                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-2xl
                      bg-sky-500/10
                    "
                  >
                    <AchievementIcon
                      className="h-6 w-6 text-amber-300"
                    />
                  </div>

                  <Badge variant="success">
                    +{achievement.xpReward || 0} XP
                  </Badge>
                </div>

                <h3 className="mt-4 text-lg font-bold text-white">
                  {achievement.name}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {achievement.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">
                    {achievement.rarity || 'common'}
                  </span>

                  <span>
                    {achievement.coinReward || 0} coins
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No achievements configured"
          description="Run the backend seed to load achievement definitions."
        />
      )}
    </div>
  );
}