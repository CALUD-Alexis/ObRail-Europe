import type { HttpContext } from '@adonisjs/core/http'
import { registry } from '#services/metrics_service'

export default class MetricsController {
  async index({ response }: HttpContext) {
    const metrics = await registry.metrics()
    return response.header('Content-Type', registry.contentType).send(metrics)
  }
}
