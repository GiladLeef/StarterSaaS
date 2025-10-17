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
 * Safely filters an array handling non-array inputs
 * @param data The data to filter
 * @param predicate The filter predicate
 * @returns Filtered array or empty array if input is not an array
 */
export function safeFilter<T>(data: any, predicate: (item: T) => boolean): T[] {
  return Array.isArray(data) ? data.filter(predicate) : [];
}
