export function clampXp(value) {
  const xp = Number(value);
  if (!Number.isFinite(xp)) return 0;
  return Math.max(0, Math.floor(xp));
}

export function projectXpFromPriority(priority) {
  const table = {
    low: 100,
    medium: 250,
    high: 500,
    urgent: 800,
  };

  return table[priority] ?? table.medium;
}

export function taskXpFromPriority(priority) {
  const table = {
    low: 10,
    medium: 25,
    high: 50,
    urgent: 80,
  };

  return table[priority] ?? table.medium;
}
