import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import useUser from '../hooks/useUser.ts'
import { Timer } from '../controller/timer.ts'

async function timer(ctx: Context, cmd: textCMD) {
  const { args } = cmd
  const time = Number(args[0])
  const name = args[1] || ''
  if (isNaN(time) ||  time < 0 || time > 3600) {
    return await ctx.reply('invalid time')
  }

  const user = await useUser(ctx)
  if (!user) {
    return await ctx.reply('???')
  }

  const timer = new Timer()
  timer.start(time * 1000, () => ctx.reply(`${time}s 到了! ${name}`))
  await ctx.reply('收到')
}

export default timer
