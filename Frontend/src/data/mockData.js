/*
  Historical filename kept to match the existing project structure.

  The application no longer uses mock user/game records. These are safe empty
  defaults only, so failed API requests never fabricate a user, XP, projects,
  achievements, or collectibles.
*/

export const emptyProfile = {
  name: '',
  bio: '',
  avatar: '',
  level: 1,
  currentXp: 0,
  totalXp: 0,
  nextLevelXp: 500,
  coins: 0,
  streak: 0,
  maxStreak: 0,
  lastActiveDate: null,
  equippedCharacter: null,
  equippedPokemon: null,
};

export const emptyDashboard = {
  profile: emptyProfile,
  stats: {
    tasksCompleted: 0,
    projectsCompleted: 0,
    achievementsUnlocked: 0,
    collectibles: 0,
  },
  skillChart: {
    labels: [],
    datasets: [{ label: 'Skill Level', data: [] }],
  },
};
