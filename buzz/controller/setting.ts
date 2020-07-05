import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import { argsWrapper } from '../../deps.ts'

const parser = argsWrapper
  .sub('set', argsWrapper.describe('set key-value'))
  .sub('get', argsWrapper.describe('get key-value'))
  .sub('slist', argsWrapper.describe('get all key-value'))

async function setting(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const { args } = cmd
  args.unshift(cmd.command || 'slist')
  const res = parser.parse(args)
  if (res.error) {
    ctx.reply(res.error.toString())
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
    ctx.reply('???')
    return
  }

  switch (res.tag) {
    case 'set': {
      const name = args[1]
      const values = args[2]
      if (!name || !values) {
        return await ctx.reply('???')
      }

      const {
        rows: [setting],
      } = await pool
        .query()
        .select('*')
        .from('settings')
        .where({
          name,
          user_id: user.id,
        })
        .fetch()

      if (setting) {
        await pool
          .query()
          .where({ name, user_id: user.id, id: setting.id })
          .update({ values })
          .into('settings')
          .fetch()
      } else {
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
      }

      return await ctx.reply(`fine, ${name} = ${values}`)
    }
    case 'get': {
      const name = args[1]
      if (!name) {
        return await ctx.reply('???')
      }

      const {
        rows: [setting],
      } = await pool
        .query()
        .select('*')
        .from('settings')
        .where({
          name,
          user_id: user.id,
        })
        .fetch()

      if (setting) {
        return await ctx.reply(`the ${setting.name} = ${setting.values}`)
      } else {
        return await ctx.reply(`not fount ${name}`)
      }
    }
    default: {
      const { rows } = await pool
        .query()
        .select('*')
        .from('settings')
        .where({
          user_id: user.id,
        })
        .fetch()

      const res = rows.map((s: any) => `${s.name}: ${s.values}`).join('\n')
      return await ctx.reply(res)
    }
  }
}

export default setting