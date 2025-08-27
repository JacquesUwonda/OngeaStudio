'use client'

import { useCallback } from 'react'
import { usePathname } from 'next/navigation'

export interface AnalyticsEvent {
  eventType: 'page_view' | 'button_click' | 'feature_used' | 'user_action' | 'error'
  eventName: string
  page?: string
  properties?: Record<string, any>
}

export function useAnalytics() {
  const pathname = usePathname()

  const track = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Get session ID from cookie or generate one
      const sessionId = getSessionId()

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          page: event.page || pathname,
          sessionId,
        }),
      })
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }, [pathname])

  // Convenience methods for common events
  const trackButtonClick = useCallback((buttonName: string, properties?: Record<string, any>) => {
    track({
      eventType: 'button_click',
      eventName: `button_click_${buttonName}`,
      properties,
    })
  }, [track])

  const trackFeatureUsed = useCallback((featureName: string, properties?: Record<string, any>) => {
    track({
      eventType: 'feature_used',
      eventName: `feature_${featureName}`,
      properties,
    })
  }, [track])

  const trackUserAction = useCallback((actionName: string, properties?: Record<string, any>) => {
    track({
      eventType: 'user_action',
      eventName: actionName,
      properties,
    })
  }, [track])

  const trackError = useCallback((errorName: string, properties?: Record<string, any>) => {
    track({
      eventType: 'error',
      eventName: `error_${errorName}`,
      properties,
    })
  }, [track])

  return {
    track,
    trackButtonClick,
    trackFeatureUsed,
    trackUserAction,
    trackError,
  }
}

// Helper function to get or create session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem('analytics-session-id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('analytics-session-id', sessionId)
  }
  return sessionId
}
