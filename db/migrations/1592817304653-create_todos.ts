import { Migration } from 'https://deno.land/x/nessie/mod.ts'
import Dex from 'https://deno.land/x/dex/mod.ts'

const dex = Dex({ client: 'postgres' })
export const up: Migration = () => {
  let tableQuery = dex.schema
    .createTable('todos', (table: any) => {
      table.increments('id').primary()
      table.text('number_code')
      table.text('name')
      table.integer('start').defaultTo(0)
      table.integer('end').defaultTo(1)
      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.timestamps(null, true)
    })
    .toString()

  return tableQuery
}

export const down: Migration = () => {
  return dex.schema
  .dropTableIfExists("todos").toString()
}
