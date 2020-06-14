import { ClientPostgreSQL } from 'https://deno.land/x/nessie/mod.ts'
import iconfig from './config.js'

const clientOptions = {
  migrationFolder: './db/migrations',
  seedFolder: './db/seeds',
}

const clientPg = new ClientPostgreSQL(clientOptions, iconfig.pg)

const config = {
  client: clientPg,
  exposeQueryBuilder: true,
}

export default config
