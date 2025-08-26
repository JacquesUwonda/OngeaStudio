import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AnalyticsService } from '@/lib/analytics'
import { validateSession } from '@/lib/auth'

const trackEventSchema = z.object({
  eventType: z.enum(['page_view', 'button_click', 'feature_used', 'user_action', 'error']),
  eventName: z.string(),
  page: z.string().optional(),
  sessionId: z.string().optional(),
  properties: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, eventName, page, sessionId, properties } = trackEventSchema.parse(body)

    // Get user from session if available
    const token = request.cookies.get('auth-token')?.value
    let userId: string | undefined

    if (token) {
      const session = await validateSession(token)
      userId = session?.userId
    }

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     undefined

    // Track the event
    await AnalyticsService.trackEvent({
      eventType,
      eventName,
      page,
      userId,
      sessionId,
      properties,
      userAgent,
      ipAddress,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
