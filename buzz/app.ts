import { Context } from '../tgbot/context.ts'
import { Bot } from '../tgbot/bot.ts'
import config from '../config.js'
import { textParser } from './textParser.ts'
import cmdHandle from './cmd/mod.ts'

export const msgHandler = async function (ctx: Context) {
  const { message } = ctx.update
  if (message.text) {
    const cmd = textParser(message.text)
    switch (cmd.command) {
      case 'help':
        await ctx.telegram.sendMessage(message.chat.id, '在写了，在写了')
        break
      case 'hi':
        await cmdHandle.hi(ctx, cmd)
        break
      case 'td':
        await cmdHandle.todo(ctx, cmd)
        break
      case 'flag':
        await cmdHandle.flag(ctx, cmd)
        break
      case 'timer':
        await cmdHandle.timer(ctx, cmd)
        break
      case 'hash':
        await cmdHandle.hash(ctx, cmd)
        break
      case 'set':
        await cmdHandle.setting(ctx, cmd)
        break
      case 'get':
        await cmdHandle.setting(ctx, cmd)
        break
      case 'slist':
        await cmdHandle.setting(ctx, cmd)
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
