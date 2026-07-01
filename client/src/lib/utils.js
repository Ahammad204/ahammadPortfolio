/** Merge class names, filtering out falsy values */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** Format date to readable string */
export function formatDate(date) {
  if (!date) return 'Present';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Truncate text to maxLength */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
