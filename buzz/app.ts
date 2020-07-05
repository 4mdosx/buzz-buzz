import { Context } from '../tgbot/context.ts'
import { Bot } from '../tgbot/bot.ts'
import config from '../config.js'
import { textParser } from './textParser.ts'
import controller from './controller/mod.ts'

export const msgHandler = async function (ctx: Context) {
  const { message } = ctx.update
  if (message.text) {
    const cmd = textParser(message.text)
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
      case 'flag':
        await controller.flag(ctx, cmd)
        break
      case 'timer':
        await controller.timer(ctx, cmd)
        break
      case 'set':
        await controller.setting(ctx, cmd)
        break
      case 'get':
        await controller.setting(ctx, cmd)
        break
      case 'slist':
        await controller.setting(ctx, cmd)
        break
      default:
        await ctx.reply('收到不可用的命令，试试`/help`')
    }
  }
}

const buzzilla = config.bots.buzzilla
export const buzz = new Bot(buzzilla.token)
buzz.on('message', msgHandler)
buzz.launch()
