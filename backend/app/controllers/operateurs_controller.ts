import type { HttpContext } from '@adonisjs/core/http'
import Operateur from '#models/operateur'

export default class OperateursController {
  /**
   * GET /api/operateurs
   */
  async index({ request, response }: HttpContext) {
    const { country, active = true, page = 1, limit = 50 } = request.qs()

    const query = Operateur.query()
    if (country) query.where('country', country)
    if (active !== undefined) query.where('active', active === 'false' ? false : true)

    const operateurs = await query.orderBy('name').paginate(Number(page), Math.min(Number(limit), 200))
    return response.ok(operateurs)
  }

  /**
   * GET /api/operateurs/:id
   */
  async show({ params, response }: HttpContext) {
    const operateur = await Operateur.find(params.id)
    if (!operateur) {
      return response.notFound({ error: 'Operateur not found', message: `No operateur found with id ${params.id}` })
    }
    return response.ok(operateur)
  }

  /**
   * POST /api/operateurs
   */
  async create({ request, response }: HttpContext) {
    const data = request.only(['name', 'code', 'country', 'typeService', 'website', 'active'])
    const operateur = await Operateur.create({ ...data, active: data.active ?? true })
    return response.created(operateur)
  }

  /**
   * PUT /api/operateurs/:id
   */
  async update({ params, request, response }: HttpContext) {
    const operateur = await Operateur.find(params.id)
    if (!operateur) {
      return response.notFound({ error: 'Operateur not found', message: `No operateur found with id ${params.id}` })
    }
    const data = request.only(['name', 'code', 'country', 'typeService', 'website', 'active'])
    operateur.merge(data)
    await operateur.save()
    return response.ok(operateur)
  }

  /**
   * DELETE /api/operateurs/:id
   */
  async destroy({ params, response }: HttpContext) {
    const operateur = await Operateur.find(params.id)
    if (!operateur) {
      return response.notFound({ error: 'Operateur not found', message: `No operateur found with id ${params.id}` })
    }
    await operateur.delete()
    return response.noContent()
  }
}
