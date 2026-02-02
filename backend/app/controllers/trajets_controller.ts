import type { HttpContext } from '@adonisjs/core/http'
import Trajet from '#models/trajet'
import { indexTrajetsValidator, showTrajetValidator } from '#validators/trajet'

export default class TrajetsController {
  /**
   * GET /trajets
   * Returns a list of all trajets with optional filtering
   */
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(indexTrajetsValidator)
    const {
      operator,
      trainType,
      departureCountry,
      arrivalCountry,
      page = 1,
      limit = 20,
    } = payload

    const query = Trajet.query().where('active', true)

    if (operator) {
      query.where('operator', operator)
    }

    if (trainType) {
      query.where('trainType', trainType)
    }

    if (departureCountry) {
      query.where('departureCountry', departureCountry)
    }

    if (arrivalCountry) {
      query.where('arrivalCountry', arrivalCountry)
    }

    const trajets = await query.paginate(page, Math.min(limit, 100))

    return response.ok(trajets)
  }

  /**
   * GET /trajets/:id
   * Returns a single trajet by ID
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