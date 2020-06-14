import { Update } from '../tgbot/type/mod.ts'
import { Context } from '../tgbot/context.ts'
import { Bot } from '../tgbot/bot.ts'
import config from '../config.js'

export const handler = async function (ctx: Context) {
  console.log(ctx ,'did')
}

const buzzilla = config.bots.buzzilla
export const buzz = new Bot(buzzilla.token)
buzz.on('message', handler)
// bot.launch()