import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { AnalyticsService } from '@/lib/analytics'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated (you might want to add admin role check)
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await validateSession(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get query parameters for date range
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const endDate = new Date()

    // Get various analytics stats
    const [
      userStats,
      eventCounts,
      popularFeatures,
      dailyStats,
    ] = await Promise.all([
      AnalyticsService.getUserStats(startDate, endDate),
      AnalyticsService.getEventCounts(startDate, endDate),
      AnalyticsService.getPopularFeatures(10),
      AnalyticsService.getDailyStats(days),
    ])

    // Get additional user metrics
    const totalSignups = await db.user.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const recentSignups = await db.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        spokenLanguage: true,
        learningLanguage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // Calculate conversion metrics
    const pageViews = await db.analyticsEvent.count({
      where: {
        eventName: 'page_view',
        page: '/',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const signupClicks = await db.analyticsEvent.count({
      where: {
        eventName: 'button_click_signup',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const conversionRate = pageViews > 0 ? (totalSignups / pageViews * 100) : 0

    return NextResponse.json({
      userStats: {
        ...userStats,
        totalSignups,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      eventCounts,
      popularFeatures,
      dailyStats,
      recentSignups,
      metrics: {
        pageViews,
        signupClicks,
        conversionRate,
      },
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}
