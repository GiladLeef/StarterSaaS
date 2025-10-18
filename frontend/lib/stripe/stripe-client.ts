/**
 * DRY Stripe Client for Frontend
 * Handles all Stripe-related operations with consistent patterns
 */

import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Get Stripe instance (singleton pattern for DRY)
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    
    if (!publishableKey) {
      console.error('Stripe publishable key not configured')
      return Promise.resolve(null)
    }
    
    stripePromise = loadStripe(publishableKey)
  }
  
  return stripePromise
}

/**
 * Create checkout session and redirect to Stripe
 */
export interface CheckoutSessionParams {
  planName: string
  billingInterval: 'monthly' | 'yearly'
  organizationId: string
}

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<{ sessionId: string; sessionUrl: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const response = await fetch(`${apiUrl}/api/v1/billing/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create checkout session')
  }

  const data = await response.json()
  return data.data
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(params: CheckoutSessionParams) {
  try {
    const { sessionUrl } = await createCheckoutSession(params)
    
    // Redirect to Stripe Checkout
    window.location.href = sessionUrl
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(organizationId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const response = await fetch(
    `${apiUrl}/api/v1/billing/subscription/status?organizationId=${organizationId}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get subscription status')
  }

  const data = await response.json()
  return data.data
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const response = await fetch(`${apiUrl}/api/v1/billing/subscription/${subscriptionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to cancel subscription')
  }

  return await response.json()
}

