import { Context } from '../../tgbot/context.ts'


export interface User {
  id: number
  username: string
  created_at: string //2020-06-23T07:12:07.000Z
  updated_at: string
}

async function useUser (ctx: Context): Promise<User | null> {
  const { message, pool } = ctx
  const {
    rows: [user],
  } = await pool
    .query()
    .select('*')
    .from('users')
    .where({
      username: message?.from.username,
    })
    .fetch()

  return user ?? null
}

export default useUser