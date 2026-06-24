import vine from '@vinejs/vine'

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

export const showTrajetValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)

export const createTrajetValidator = vine.compile(
  vine.object({
    departureStation: vine.string().maxLength(255),
    arrivalStation: vine.string().maxLength(255),
    departureTime: vine.string(),
    arrivalTime: vine.string(),
    operator: vine.string().maxLength(100),
    trainType: vine.enum(['day', 'night']),
    durationMinutes: vine.number().positive(),
    price: vine.number().positive().optional(),
    trainNumber: vine.string().maxLength(50).optional(),
    departureCountry: vine.string().maxLength(2).optional(),
    arrivalCountry: vine.string().maxLength(2).optional(),
    active: vine.boolean().optional(),
  })
)

export const updateTrajetValidator = vine.compile(
  vine.object({
    departureStation: vine.string().maxLength(255).optional(),
    arrivalStation: vine.string().maxLength(255).optional(),
    departureTime: vine.string().optional(),
    arrivalTime: vine.string().optional(),
    operator: vine.string().maxLength(100).optional(),
    trainType: vine.enum(['day', 'night']).optional(),
    durationMinutes: vine.number().positive().optional(),
    price: vine.number().positive().optional(),
    trainNumber: vine.string().maxLength(50).optional(),
    departureCountry: vine.string().maxLength(2).optional(),
    arrivalCountry: vine.string().maxLength(2).optional(),
    active: vine.boolean().optional(),
  })
)
