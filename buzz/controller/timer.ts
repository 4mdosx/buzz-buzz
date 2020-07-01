import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'

async function timer(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const { args } = cmd
  const time = Number(args[0])
  const name = args[1] || ''
  if (isNaN(time) ||  time < 0 || time > 3600) {
    return await ctx.reply('invalid time')
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

  if (!user) {
    return await ctx.reply('???')
  }
  await ctx.reply('收到')

  setTimeout(() => {
    ctx.reply(`${time}s 到了! ${name}`)
  }, time * 1000)
}

export default timer
