import { Pool } from '../deps.ts'
import config from '../config.js'
import Dex from 'https://deno.land/x/dex/mod.ts'

export const dex = Dex({ client: 'postgres' })
async function initPool() {
  const pool = new Pool(config.pg as any)
  const debug = config.dexDebug

  await pool.connect()
  return {
    query() {
      const build = dex.queryBuilder()
      build.fetch = async () => {
        const queryString = build.toString()
        if (debug) {
          console.log(queryString)
        }
        return await pool.query(queryString)
      }
      return build
    }
  }
}

const pool = await initPool()

export function getPool() {
  return pool
}
