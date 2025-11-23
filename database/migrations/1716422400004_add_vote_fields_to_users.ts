import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'usuarios'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('curso').nullable()
            table.integer('voto_participante_id').unsigned().references('id').inTable('participantes').onDelete('SET NULL')
            table.text('mensaje').nullable()
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('curso')
            table.dropColumn('voto_participante_id')
            table.dropColumn('mensaje')
        })
    }
}
