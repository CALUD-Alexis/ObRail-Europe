import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class HealthController {
  /**
   * GET /health
   * Returns the health status of the API and its dependencies
   */
  async check({ response }: HttpContext) {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: { status: 'unknown' as 'healthy' | 'unhealthy' | 'unknown', latency: 0 },
      },
    }

    // Check database connection
    try {
      const startTime = Date.now()
      await db.rawQuery('SELECT 1')
      const latency = Date.now() - startTime
      healthStatus.checks.database = { status: 'healthy', latency }
    } catch {
      healthStatus.checks.database = { status: 'unhealthy', latency: 0 }
      healthStatus.status = 'unhealthy'
    }

    const httpStatus = healthStatus.status === 'healthy' ? 200 : 503
    return response.status(httpStatus).json(healthStatus)
  }
}