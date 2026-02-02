import vine from '@vinejs/vine'

/**
 * Validator for GET /trajets query parameters
 */
export const indexTrajetsValidator = vine.compile(
  vine.object({
    operator: vine.string().optional(),
    trainType: vine.enum(['day', 'night']).optional(),
    departureCountry: vine.string().optional(),
    arrivalCountry: vine.string().optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
  })
)

/**
 * Validator for GET /trajets/:id params
 */
export const showTrajetValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)