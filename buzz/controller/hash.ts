import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import { bcrypt } from '../../deps.ts'

async function hash (ctx: Context, cmd: textCMD) {
  const { args } = cmd
  const [value] = args

  const text = await bcrypt.hash(value)

  return await ctx.reply(text.slice(-15))
}

export default hash