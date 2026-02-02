import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class StatsController {
  /**
   * GET /stats/volumes
   * Returns statistics about train volumes
   */
  async volumes({ response }: HttpContext) {
    const totalTrajets = await db.from('trajets').where('active', true).count('* as total')

    const byTrainType = await db
      .from('trajets')
      .where('active', true)
      .select('train_type')
      .count('* as count')
      .groupBy('train_type')

    const byOperator = await db
      .from('trajets')
      .where('active', true)
      .select('operator')
      .count('* as count')
      .groupBy('operator')
      .orderBy('count', 'desc')

    const byCountry = await db
      .from('trajets')
      .where('active', true)
      .select('departure_country')
      .count('* as count')
      .groupBy('departure_country')
      .orderBy('count', 'desc')

    const avgDuration = await db
      .from('trajets')
      .where('active', true)
      .avg('duration_minutes as average')

    const avgPrice = await db
      .from('trajets')
      .where('active', true)
      .whereNotNull('price')
      .avg('price as average')

    return response.ok({
      total: Number(totalTrajets[0]?.total) || 0,
      byTrainType: byTrainType.map((item) => ({
        type: item.train_type,
        count: Number(item.count),
      })),
      byOperator: byOperator.map((item) => ({
        operator: item.operator,
        count: Number(item.count),
      })),
      byDepartureCountry: byCountry.map((item) => ({
        country: item.departure_country,
        count: Number(item.count),
      })),
      averages: {
        durationMinutes: Math.round(Number(avgDuration[0]?.average) || 0),
        price: Number(avgPrice[0]?.average)?.toFixed(2) || null,
      },
    })
  }
}