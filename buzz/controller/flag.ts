import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import { argsWrapper, argsSettings } from '../../deps.ts'
import format from 'https://deno.land/x/date_fns/format/index.js'
import addDays from 'https://deno.land/x/date_fns/addDays/index.js'

const PartialOption = argsSettings.flags.PartialOption
const parser = argsWrapper
  .sub('clear', argsWrapper.describe('clear all flag'))
  .sub(
    'set',
    argsWrapper
      .describe('set a flag')
      .with(
        PartialOption('d', {
          type: argsSettings.types.Text,
          describe: 'deadline of flag',
          default: '0000',
        })
      )
    )

async function flag(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const { args } = cmd
  const res = parser.parse(args)
  if (res.error) {
    ctx.reply(res.error.toString())
  }
  const { rows: [user] } = await pool.query().select('*')
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
      let date
      if (res.value.value.d === '0000') {
        date = addDays(new Date(), 7)
      } else {
        date = new Date(res.value.value.d)
      }
      await pool
        .query()
        .insert([
          {
            name: res.value._[0],
            deadline_at: format(date, 'yyyy-MM-dd HH:mm:ss', {}),
            user_id: user.id,
          },
        ])
        .into('flags')
        .fetch()

      return await ctx.reply('ok, flag added')
    }
    case 'clear': {
      await pool.query().from('flags').where({ user_id: user.id }).del().fetch()
      return await ctx.reply('ok, clear all flag')
    }
    default: {
      const { rows } = await pool
        .query()
        .select(['id', 'name', 'deadline_at', 'updated_at'])
        .from('flags')
        .where({ user_id: user.id })
        .orderBy('deadline_at')
        .fetch()

    return await ctx.reply(
      rows
        .map(
          (t: any) =>
            `-------------------------- \n ${t.name} \n deadline: ${format(t.deadline_at, 'MM-dd HH:mm', {})} \n`
        )
        .join('\n')
      || 'no message')
    }
  }
}

export default flag
