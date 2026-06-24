import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Gare extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string | null

  @column()
  declare city: string | null

  @column()
  declare country: string

  @column()
  declare region: string | null

  @column()
  declare type: string

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
