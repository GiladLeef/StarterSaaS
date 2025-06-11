/**
 * Formats a date string or date object into a relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

/**
 * Formats a date string or date object into a human-readable format
 */
export function formatDate(
  dateString: string | Date, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }
): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

/**
 * Formats a date string or date object into a time string
 */
export function formatTime(
  dateString: string | Date, 
  options: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: 'numeric' 
  }
): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleTimeString(undefined, options);
}

/**
 * Returns true if the date is today
 */
export function isToday(dateString: string | Date): boolean {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Formats a date range as a string (e.g., "Jan 1 - Jan 5, 2023")
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date
): string {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // If same year
  if (start.getFullYear() === end.getFullYear()) {
    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString(undefined, { month: 'short' })}, ${start.getFullYear()}`;
    }
    // Different months, same year
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${start.getFullYear()}`;
  }
  
  // Different years
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
} 