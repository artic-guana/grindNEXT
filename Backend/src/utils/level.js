export function xpRequiredForLevel(level) {
  const safeLevel = Math.max(1, level);

  return Math.floor(
    500 * Math.pow(safeLevel, 1.35)
  );
}

// Converts lifetime XP into current level + progress toward next level.
export function getLevelState(totalXp = 0) {
  let level = 1;
  let remaining = Math.max(0, totalXp);

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }

  const nextLevelXp = xpRequiredForLevel(level);

  return {
    level,
    currentXp: remaining,
    nextLevelXp,
    progressPercent: Math.min(
      100,
      Math.round((remaining / nextLevelXp) * 100)
    ),
  };
}
