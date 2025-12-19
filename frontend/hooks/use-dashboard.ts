"use client"

export function useDashboardData() {
  // Return static/mock data for the single-user dashboard
  const stats = {
    // Single user mode doesn't need organization/project stats
    // We can expose user-specific stats here if needed, like "days active" or "profile completeness"
    profileComplete: true, // simplified
  }

  return {
    stats,
    isLoading: false,
    error: null,
  }
}
