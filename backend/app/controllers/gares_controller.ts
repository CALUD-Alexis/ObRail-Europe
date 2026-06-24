import type { HttpContext } from '@adonisjs/core/http'
import Gare from '#models/gare'

export default class GaresController {
  /**
   * GET /api/gares
   */
  async index({ request, response }: HttpContext) {
    const { country, active = true, page = 1, limit = 50 } = request.qs()

    const query = Gare.query()
    if (country) query.where('country', country)
    if (active !== undefined) query.where('active', active === 'false' ? false : true)

    const gares = await query.orderBy('name').paginate(Number(page), Math.min(Number(limit), 200))
    return response.ok(gares)
  }

  /**
   * GET /api/gares/:id
   */
  async show({ params, response }: HttpContext) {
    const gare = await Gare.find(params.id)
    if (!gare) {
      return response.notFound({ error: 'Gare not found', message: `No gare found with id ${params.id}` })
    }
    return response.ok(gare)
  }

  /**
   * POST /api/gares
   */
  async create({ request, response }: HttpContext) {
    const data = request.only(['name', 'code', 'city', 'country', 'region', 'type', 'latitude', 'longitude', 'active'])
    const gare = await Gare.create({ ...data, active: data.active ?? true })
    return response.created(gare)
  }

  /**
   * PUT /api/gares/:id
   */
  async update({ params, request, response }: HttpContext) {
    const gare = await Gare.find(params.id)
    if (!gare) {
      return response.notFound({ error: 'Gare not found', message: `No gare found with id ${params.id}` })
    }
    const data = request.only(['name', 'code', 'city', 'country', 'region', 'type', 'latitude', 'longitude', 'active'])
    gare.merge(data)
    await gare.save()
    return response.ok(gare)
  }

  /**
   * DELETE /api/gares/:id
   */
  async destroy({ params, response }: HttpContext) {
    const gare = await Gare.find(params.id)
    if (!gare) {
      return response.notFound({ error: 'Gare not found', message: `No gare found with id ${params.id}` })
    }
    await gare.delete()
    return response.noContent()
  }
}
