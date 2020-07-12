import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import { argsWrapper } from '../../deps.ts'
import useUser from '../hooks/useUser.ts'
import { Settings } from '../controller/setting.ts'

const parser = argsWrapper
  .sub('set', argsWrapper.describe('set key-value'))
  .sub('get', argsWrapper.describe('get key-value'))
  .sub('slist', argsWrapper.describe('get all key-value'))

async function setting(ctx: Context, cmd: textCMD) {
  const { pool } = ctx
  const { args } = cmd
  args.unshift(cmd.command || 'slist')
  const res = parser.parse(args)
  if (res.error) {
    ctx.reply(res.error.toString())
  }

  const user = await useUser(ctx)
  if (!user) {
    return await ctx.reply('???')
  }

  const settingsController = new Settings(ctx, user)
  switch (res.tag) {
    case 'set': {
      const name = args[1]
      const values = args[2]
      await settingsController.set(name, values)

      return await ctx.reply(`fine, ${name} = ${values}`)
    }
    case 'get': {
      const name = args[1]
      const setting = await settingsController.get(name)

      if (setting) {
        return await ctx.reply(`the ${setting.name} = ${setting.values}`)
      } else {
        return await ctx.reply(`not fount ${name}`)
      }
    }
    default: {
      const { rows } = await settingsController.fetch()

      const res = rows.map((s: any) => `${s.name}: ${s.values}`).join('\n')
      return await ctx.reply(res)
    }
  }
}

export default setting