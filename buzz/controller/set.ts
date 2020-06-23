import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'

async function set(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const { args } = cmd
  const [name, values] = args
  if (!name) {
    return await ctx.reply('???')
  }
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

  if (!values) {
    const { rows: [settings] } = await pool.query()
    .select('*')
    .from('settings')
    .where({
      name,
      user_id: user.id,
    })
    .fetch()
    if (settings) {
      return await ctx.reply(`settings ${name}: ${settings.values}`)
    } else {
      return await ctx.reply('???')
    }
  }

  await pool
    .query()
    .insert([
      {
        name,
        values,
        user_id: user.id,
      },
    ])
    .into('settings')
    .fetch()
  return await ctx.reply(`fine, ${name} = ${values}`)
}

export default set
