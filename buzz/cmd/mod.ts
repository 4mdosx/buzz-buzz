import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import todo from './todo.ts'
import setting from './setting.ts'
import flag from './flag.ts'
import timer from './timer.ts'
import hash from './hash.ts'

async function hi(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const from = message?.from
  if (!from) {
    return await ctx.reply('???')
  }
  const query = pool.query().select('*').from('users').where({
    username: from.username,
  })
  const { rows: [user] } = await query.fetch()
  if (!user) {
    await pool
      .query()
      .insert([{ username: from.username }])
      .into('users')
      .fetch()
    ctx.reply('hi, newcomer')
  } else {
    ctx.reply('hi, old friend')
  }
}

export default {
  hi,
  todo,
  setting,
  flag,
  timer,
  hash
}
