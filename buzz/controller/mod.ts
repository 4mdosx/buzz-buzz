import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'

async function hi(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const user = message?.from
  if (!user) {
    return await ctx.reply('???')
  }
  const query = pool.query().select('*').from('users').where({
    username: user.username
  })
  const { rows } = await query.fetch()
  if (rows.length === 0) {
    await pool.query().insert([{ username: user.username }]).into('users').fetch()
    ctx.reply('hi, newcomer')
  } else {
    ctx.reply('hi, old friend')
  }
}

export default {
  hi,
}
