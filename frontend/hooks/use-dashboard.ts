"use client"

import { useResource } from "./use-resource"

export function useDashboardData() {
  const { data: organizations, isLoading: orgsLoading, error: orgsError } = useResource({
    endpoint: '/api/v1/organizations',
    dataKey: 'organizations',
  })
  
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useResource({
    endpoint: '/api/v1/projects',
    dataKey: 'projects',
  })
  
  const { data: invitations, isLoading: invitationsLoading, error: invitationsError } = useResource({
    endpoint: '/api/v1/invitations',
    dataKey: 'invitations',
  })

  const isLoading = orgsLoading || projectsLoading || invitationsLoading
  const error = orgsError || projectsError || invitationsError

  const stats = {
    organizations: organizations.length,
    totalProjects: projects.length,
    activeProjects: projects.filter((p: any) => p.status === 'active').length,
    pendingInvitations: invitations.filter((i: any) => i.status === 'pending').length,
  }

  return {
    organizations,
    projects,
    invitations,
    stats,
    isLoading,
    error,
  }
}

