import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/admin-auth'
import { AnalyticsService } from '@/lib/analytics'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as an admin
    const token = request.cookies.get('admin-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminSession = await validateAdminSession(token)
    if (!adminSession) {
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
      recentSignups,
    ] = await Promise.all([
      AnalyticsService.getUserStats(startDate, endDate),
      AnalyticsService.getEventCounts(startDate, endDate),
      AnalyticsService.getPopularFeatures(10),
      db.user.findMany({
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
    ]);

    // Calculate conversion metrics
    const landingPageViews = await db.analyticsEvent.count({
      where: {
        eventName: 'page_view',
        page: '/',
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const totalSignups = userStats.totalUsers; // Assuming getUserStats returns total users in the period
    const conversionRate = landingPageViews > 0 ? (totalSignups / landingPageViews) * 100 : 0;


    return NextResponse.json({
      userStats: {
        ...userStats,
        totalSignups,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      eventCounts,
      popularFeatures,
      recentSignups
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics stats' },
      { status: 500 }
    )
  }
}
