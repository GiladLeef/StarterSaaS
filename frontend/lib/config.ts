// Application configuration from environment variables
export const appConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'StarterSaaS',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@startersaas.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  defaultAvatar: process.env.NEXT_PUBLIC_DEFAULT_AVATAR || '/avatars/default.jpg',
  defaultAdminAvatar: process.env.NEXT_PUBLIC_ADMIN_AVATAR || '/avatars/admin.jpg',
  defaultUserAvatar: process.env.NEXT_PUBLIC_USER_AVATAR || '/avatars/user.jpg',
  
  // Contact information
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '123 SaaS Street, San Francisco, CA 94105',
  companyPhone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+1 (555) 123-4567',
  
  // Social media links  
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com',
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com',
}

export default appConfig

