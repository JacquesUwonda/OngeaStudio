import { db } from './db'

export interface AnalyticsEventData {
  eventType: 'page_view' | 'button_click' | 'feature_used' | 'user_action' | 'error'
  eventName: string
  page?: string
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
  userAgent?: string
  ipAddress?: string
}

export class AnalyticsService {
  static async trackEvent(data: AnalyticsEventData): Promise<void> {
    try {
      if (process.env.ANALYTICS_ENABLED !== 'true') {
        console.log('Analytics disabled, skipping event:', data.eventName)
        return
      }

      await db.analyticsEvent.create({
        data: {
          eventType: data.eventType,
          eventName: data.eventName,
          page: data.page,
          userId: data.userId,
          sessionId: data.sessionId,
          properties: data.properties || {},
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
        },
      })

      console.log(`Analytics event tracked: ${data.eventName}`)
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }

  // Convenience methods for common events
  static async trackPageView(page: string, userId?: string, sessionId?: string): Promise<void> {
    await this.trackEvent({
      eventType: 'page_view',
      eventName: 'page_view',
      page,
      userId,
      sessionId,
    })
  }

  static async trackButtonClick(buttonName: string, page: string, userId?: string, sessionId?: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'button_click',
      eventName: `button_click_${buttonName}`,
      page,
      userId,
      sessionId,
      properties,
    })
  }

  static async trackFeatureUsed(featureName: string, page: string, userId?: string, sessionId?: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'feature_used',
      eventName: `feature_${featureName}`,
      page,
      userId,
      sessionId,
      properties,
    })
  }

  static async trackUserAction(actionName: string, page: string, userId?: string, sessionId?: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventType: 'user_action',
      eventName: actionName,
      page,
      userId,
      sessionId,
      properties,
    })
  }

  // Analytics queries for dashboard
  static async getEventCounts(startDate?: Date, endDate?: Date) {
    const where = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    } : {}

    return db.analyticsEvent.groupBy({
      by: ['eventName'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })
  }

  static async getUserStats(startDate?: Date, endDate?: Date) {
    const where = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    } : {}

    const totalUsers = await db.user.count({ where })
    const totalEvents = await db.analyticsEvent.count({ where })
    const uniqueActiveUsers = await db.analyticsEvent.groupBy({
      by: ['userId'],
      where: { ...where, userId: { not: null } },
      _count: { userId: true },
    })

    return {
      totalUsers,
      totalEvents,
      activeUsers: uniqueActiveUsers.length,
    }
  }

  static async getPopularFeatures(limit = 10) {
    return db.analyticsEvent.groupBy({
      by: ['eventName'],
      where: {
        eventType: 'feature_used',
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    })
  }

  static async getDailyStats(days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return db.analyticsEvent.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }
}
