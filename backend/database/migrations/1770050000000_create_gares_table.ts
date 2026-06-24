import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gares'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('code', 20).nullable()
      table.string('city', 100).nullable()
      table.string('country', 2).notNullable()
      table.string('region', 100).nullable()
      table.string('type', 50).defaultTo('Principale') // Principale, Secondaire, Arrêt
      table.decimal('latitude', 10, 7).nullable()
      table.decimal('longitude', 10, 7).nullable()
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
