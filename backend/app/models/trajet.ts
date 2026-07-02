import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Trajet extends BaseModel {
  static table = 'trips'

  @column({ isPrimary: true })
  declare tripId: string

  @column()
  declare agencyId: string

  @column()
  declare originCity: string

  @column()
  declare destinationCity: string

  @column()
  declare originCountry: string

  @column()
  declare destinationCountry: string

  @column()
  declare trainType: string | null

  @column()
  declare serviceType: 'Jour' | 'Nuit' | null

  @column()
  declare distanceKm: number | null

  @column()
  declare departureTime: string | null

  @column()
  declare arrivalTime: string | null

  @column()
  declare carbonEmissionKg: number | null

  @column()
  declare frequencyPerWeek: number | null

  @column()
  declare dataSource: string

  @column()
  declare insertedAt: Date
}
