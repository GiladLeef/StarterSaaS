/**
 * Safely extracts data from an API response accounting for different response formats
 * @param response The API response object
 * @param entityKey Optional key to extract a specific entity from the data
 * @returns The extracted data
 */
export function extractApiData<T>(response: any, entityKey?: string): T {
  if (!response) return null as unknown as T;
  
  // Handle different response structures
  // Case 1: response.data.entityKey - typical backend structure
  if (response.data && entityKey && response.data[entityKey]) {
    return response.data[entityKey] as T;
  }
  
  // Case 2: response.data - response already contains the data at the data property
  if (response.data) {
    return response.data as T;
  }
  
  // Case 3: response itself is the data (some APIs might directly return data)
  return response as T;
}

/**
 * Formats date to a relative time (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Formatted relative time
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
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
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}

/**
 * Safely filters an array handling non-array inputs
 * @param data The data to filter
 * @param predicate The filter predicate
 * @returns Filtered array or empty array if input is not an array
 */
export function safeFilter<T>(data: any, predicate: (item: T) => boolean): T[] {
  return Array.isArray(data) ? data.filter(predicate) : [];
} 