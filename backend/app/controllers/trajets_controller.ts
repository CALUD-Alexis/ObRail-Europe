import type { HttpContext } from '@adonisjs/core/http'
import Trajet from '#models/trajet'
import { indexTrajetsValidator, showTrajetValidator } from '#validators/trajet'

export default class TrajetsController {
  /**
   * GET /trajets
   * Returns a paginated list of trips with optional filtering
   */
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexTrajetsValidator)
    const { agencyId, serviceType, originCountry, destinationCountry, search, page = 1, limit = 20 } = payload

    const query = Trajet.query()

    if (agencyId) {
      query.where('agency_id', agencyId)
    }

    if (serviceType) {
      query.where('service_type', serviceType)
    }

    if (originCountry) {
      query.where('origin_country', originCountry)
    }

    if (destinationCountry) {
      query.where('destination_country', destinationCountry)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('origin_city', `%${search}%`)
          .orWhereILike('destination_city', `%${search}%`)
          .orWhereILike('agency_id', `%${search}%`)
      })
    }

    const trajets = await query.orderBy('trip_id').paginate(page, Math.min(limit, 100))
    return response.ok(trajets)
  }

  /**
   * GET /trajets/:id
   * Returns a single trip by trip_id (e.g. TR102898)
   */
  async show({ params, response }: HttpContext) {
    const { id } = await showTrajetValidator.validate(params)
    const trajet = await Trajet.find(id)

    if (!trajet) {
      return response.notFound({
        error: 'Trajet not found',
        message: `No trajet found with id ${id}`,
      })
    }

    return response.ok(trajet)
  }
}
