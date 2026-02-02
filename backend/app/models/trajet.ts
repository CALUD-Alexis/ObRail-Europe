import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Trajet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare departureStation: string

  @column()
  declare arrivalStation: string

  @column()
  declare departureTime: string

  @column()
  declare arrivalTime: string

  @column()
  declare operator: string

  @column()
  declare trainType: 'day' | 'night'

  @column()
  declare durationMinutes: number

  @column()
  declare price: number | null

  @column()
  declare trainNumber: string | null

  @column()
  declare departureCountry: string | null

  @column()
  declare arrivalCountry: string | null

  @column()
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}