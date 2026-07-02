import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class StatsController {
  /**
   * GET /stats/volumes
   * Returns statistics computed from the trips table
   */
  async volumes({ response }: HttpContext) {
    const [totalResult, byServiceType, byAgency, byOriginCountry, avgDistance, avgCarbon] =
      await Promise.all([
        db.from('trips').count('* as total').first(),
        db.from('trips').select('service_type').count('* as count').groupBy('service_type').orderBy('count', 'desc'),
        db.from('trips').select('agency_id').count('* as count').groupBy('agency_id').orderBy('count', 'desc').limit(10),
        db.from('trips').select('origin_country').count('* as count').groupBy('origin_country').orderBy('count', 'desc').limit(10),
        db.from('trips').whereNotNull('distance_km').avg('distance_km as average').first(),
        db.from('trips').whereNotNull('carbon_emission_kg').avg('carbon_emission_kg as average').first(),
      ])

    const total = Number(totalResult?.total) || 0
    const dayCount = byServiceType.find((r: any) => r.service_type === 'Jour')?.count ?? 0
    const nightCount = byServiceType.find((r: any) => r.service_type === 'Nuit')?.count ?? 0

    return response.ok({
      total,
      byServiceType: byServiceType.map((item: any) => ({
        serviceType: item.service_type,
        count: Number(item.count),
        percentage: total > 0 ? ((Number(item.count) / total) * 100).toFixed(1) : '0',
      })),
      dayPercentage: total > 0 ? ((Number(dayCount) / total) * 100).toFixed(1) : '0',
      nightPercentage: total > 0 ? ((Number(nightCount) / total) * 100).toFixed(1) : '0',
      topAgencies: byAgency.map((item: any) => ({
        agencyId: item.agency_id,
        count: Number(item.count),
      })),
      topOriginCountries: byOriginCountry.map((item: any) => ({
        country: item.origin_country,
        count: Number(item.count),
      })),
      averages: {
        distanceKm: Number(avgDistance?.average).toFixed(1) || null,
        carbonEmissionKg: Number(avgCarbon?.average).toFixed(2) || null,
      },
    })
  }
}
