import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trajets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('departure_station', 255).notNullable()
      table.string('arrival_station', 255).notNullable()
      table.time('departure_time').notNullable()
      table.time('arrival_time').notNullable()
      table.string('operator', 100).notNullable()
      table.enum('train_type', ['day', 'night']).notNullable()
      table.integer('duration_minutes').unsigned().notNullable()
      table.decimal('price', 10, 2).nullable()
      table.string('train_number', 50).nullable()
      table.string('departure_country', 100).nullable()
      table.string('arrival_country', 100).nullable()
      table.boolean('active').defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['departure_station', 'arrival_station'])
      table.index(['operator'])
      table.index(['train_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}