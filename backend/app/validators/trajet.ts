import vine from '@vinejs/vine'

export const indexTrajetsValidator = vine.compile(
  vine.object({
    agencyId: vine.string().optional(),
    serviceType: vine.enum(['Jour', 'Nuit']).optional(),
    originCountry: vine.string().maxLength(2).optional(),
    destinationCountry: vine.string().maxLength(2).optional(),
    search: vine.string().optional(),
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
  })
)

// trip_id is a varchar like 'TR102898'
export const showTrajetValidator = vine.compile(
  vine.object({
    id: vine.string().minLength(1),
  })
)
