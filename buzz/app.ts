import { Context } from '../tgbot/context.ts'
import { Bot } from '../tgbot/bot.ts'
import config from '../config.js'
import { textParser } from './textParser.ts'
import controller from './controller/mod.ts'

export const msgHandler = async function (ctx: Context) {
  const { message } = ctx.update
  if (message.text) {
    const cmd = textParser(message.text)
    if (message.chat.type === 'group') {
      switch (cmd.command) {
        case 'help':
          await ctx.telegram.sendMessage(message.chat.id, '在写了，在写了')
          break
        case 'hi':
          await controller.hi(ctx, cmd)
          break
        case 'td':
          await controller.todo(ctx, cmd)
          break
        case 'set':
          await controller.set(ctx, cmd)
          break
        case 'flag':
          await controller.flag(ctx, cmd)
          break
        default:
          await ctx.reply('收到不可用的命令，试试`/help`')
      }
    } else {
      await ctx.telegram.sendMessage(ctx.message?.chat.id!!, '功能开发中...')
    }
  }
}

const buzzilla = config.bots.buzzilla
export const buzz = new Bot(buzzilla.token)
buzz.on('message', msgHandler)
buzz.launch()
