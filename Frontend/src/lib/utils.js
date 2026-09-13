export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function initials(name = 'User') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';
}

export function formatDate(value) {
  if (!value) return 'No date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function errorMessage(error, fallback = 'Something went wrong.') {
  return error?.response?.data?.message || error?.userMessage || error?.message || fallback;
}
