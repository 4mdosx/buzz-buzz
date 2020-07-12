import { Context } from '../../tgbot/context.ts'
import { textCMD } from '../textParser.ts'
import { argsWrapper, argsSettings } from '../../deps.ts'
import format from 'https://deno.land/x/date_fns/format/index.js'

const PartialOption = argsSettings.flags.PartialOption
const parser = argsWrapper
  .sub('today', argsWrapper.describe('today todo'))
  .sub('done', argsWrapper.describe('done todo'))
  .sub(
    'inc',
    argsWrapper.describe("increase todo' progress").with(
      PartialOption('s', {
        type: argsSettings.types.FiniteNumber,
        describe: 'step',
        default: 1,
      })
    )
  )
  .sub(
    'new',
    argsWrapper
      .describe('create todo')
      .with(
        PartialOption('n', {
          type: argsSettings.types.Text,
          describe: 'number code of todo',
          default: '0000',
        })
      )
      .with(
        PartialOption('s', {
          type: argsSettings.types.FiniteNumber,
          describe: 'start of todo',
          default: 0,
        })
      )
      .with(
        PartialOption('e', {
          type: argsSettings.types.FiniteNumber,
          describe: 'end of todo',
          default: 1,
        })
      )
  )

async function todo(ctx: Context, cmd: textCMD) {
  const { message, pool } = ctx
  const { args } = cmd
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

  switch (res.tag) {
    case 'new':
      let number_code = res.value.value.n
      if (number_code === '0000') {
        const {
          rows: [{ count }],
        } = await pool
          .query()
          .count('id')
          .from('todos')
          .where({ user_id: user.id })
          .where('created_at', '>', new Date().toISOString().slice(0, 10))
          .fetch()
        number_code = new Date().toISOString().slice(8, 10) + String(count)
      }
      await pool
        .query()
        .insert([
          {
            number_code,
            name: res.value._[0],
            user_id: user.id,
            start: Math.abs(res.value.value.s),
            end: Math.max(
              Math.abs(res.value.value.s),
              Math.abs(res.value.value.e)
            ),
          },
        ])
        .into('todos')
        .fetch()
      return await ctx.reply('ok, todo added')
    case 'inc': {
      const number_code = res.value._[0]
      const {
        rows: [todo],
      } = await pool
        .query()
        .select('*')
        .from('todos')
        .where({ user_id: user.id, number_code })
        .fetch()

      if (!todo) ctx.reply('???')
      await pool
        .query()
        .update({
          start: todo.start + res.value.value.s,
          updated_at: new Date().toISOString(),
        })
        .from('todos')
        .where({ user_id: user.id, number_code })
        .fetch()
    }
    default: {
      const { rows } = await pool
        .query()
        .select([
          'number_code',
          'name',
          'start',
          'end',
          'created_at',
          'updated_at',
        ])
        .from('todos as t')
        .where({ user_id: user.id })
        .whereRaw('t.start < t.end')
        .orderBy('created_at')
        .fetch()
      return await ctx.reply(
        rows
          .map(
            (t: any) =>
              `-------------------------- \n ${t.number_code.padEnd(10, ' ')} ${(t.start + '/' + t.end).padEnd(10, ' ')} c:${format(t.created_at, 'MM-dd', {})}     u:${format(t.created_at, 'MM-dd HH:mm', {})} \n${t.name}`
          )
          .join('\n')
      )
    }
  }
}

export default todo
