import { Migration } from 'https://deno.land/x/nessie/mod.ts'
import { Schema } from 'https://deno.land/x/nessie/qb.ts'

export const up: Migration<Schema> = ({ queryBuilder }) => {
  console.log(queryBuilder)
  queryBuilder.create('users', (table) => {
    table.id()
    table.string('username', 100).nullable().unique()
    table.timestamps()
  })

  queryBuilder.queryString(
    "INSERT INTO users VALUES (DEFAULT, 'Deno', DEFAULT, DEFAULT);"
  )

  return queryBuilder.query
}

export const down: Migration<Schema> = ({ queryBuilder }) => {
  return queryBuilder.drop('users')
}
