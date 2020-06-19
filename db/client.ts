import { Pool } from "../deps.ts";
import config from '../config.js'
import Dex from 'https://deno.land/x/dex/mod.ts'

export const dex = Dex({ client: 'postgres' })

async function initPool () {
  const pool = new Pool(config.pg as any)

  await pool.connect()
  return {
    query () {
      const build = dex.queryBuilder()
      build.fetch = async () => await pool.query(build.toString())
      return build
    }
  }
}

const pool = await initPool()

export function getPool () {
  return pool
}
