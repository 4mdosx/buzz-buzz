import { Migration } from 'https://deno.land/x/nessie/mod.ts'
import Dex from 'https://deno.land/x/dex/mod.ts'

const dex = Dex({ client: 'postgres' })
export const up: Migration = () => {
  let tableQuery = dex.schema
    .createTable('sign_logs', (table: any) => {
      table.increments('id').primary()
      table.text('comment')
      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.timestamps(null, true)
    })
    .toString()

  return tableQuery
}

export const down: Migration = () => {
  return dex.schema.dropTableIfExists('sign_logs')
}
