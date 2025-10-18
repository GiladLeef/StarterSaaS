/**
 * Avatar utilities for generating and managing user profile pictures
 */

const AVATAR_STYLES = [
  'adventurer',
  'avataaars',
  'big-ears',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'micah',
  'miniavs',
  'notionists',
  'personas',
  'pixel-art'
] as const

const AVATAR_COLORS = [
  'b6e3f4',
  'c0aede',
  'd1d4f9',
  'ffd5dc',
  'ffdfbf'
] as const

/**
 * Generate a deterministic random avatar URL based on user email or ID
 */
export function generateDefaultAvatar(seed: string): string {
  // Use seed to deterministically select style and color
  const styleIndex = Math.abs(hashCode(seed)) % AVATAR_STYLES.length
  const colorIndex = Math.abs(hashCode(seed + 'color')) % AVATAR_COLORS.length
  
  const style = AVATAR_STYLES[styleIndex]
  const backgroundColor = AVATAR_COLORS[colorIndex]
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(name: string): string {
  if (!name) return '??'
  
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  
  return name.substring(0, 2).toUpperCase()
}

/**
 * Simple hash function for deterministic avatar generation
 */
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * Get avatar URL for a user, with fallback to generated avatar
 */
export function getUserAvatar(user: { email?: string; id?: string; avatar?: string; firstName?: string; lastName?: string }): string {
  if (user.avatar) {
    return user.avatar
  }
  
  // Generate avatar based on email or ID
  const seed = user.email || user.id || `${user.firstName || ''}${user.lastName || ''}`
  return generateDefaultAvatar(seed)
}

