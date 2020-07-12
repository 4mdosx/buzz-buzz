import { User } from '../hooks/useUser.ts'
import { Context } from '../../tgbot/context.ts'
import { Pool } from '../../deps.ts'

export class Settings {
  constructor (readonly ctx: Context, readonly user: User) {
  }
  async set (name: string, values: any) {
    if (!name || !values) {
      return this.ctx.throw('invalid name or value')
    }

    const pool = this.ctx.pool
    const {
      rows: [setting],
    } = await pool
      .query()
      .select('*')
      .from('settings')
      .where({
        name,
        user_id: this.user.id,
      })
      .fetch()

    if (setting) {
      await pool
        .query()
        .where({ name, user_id: this.user.id, id: setting.id })
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
            user_id: this.user.id,
          },
        ])
        .into('settings')
        .fetch()
    }
  }
  async get (name: string) {
    if (!name) {
      return this.ctx.throw('error name')
    }
    const pool = this.ctx.pool

    const {
      rows: [setting],
    } = await pool
      .query()
      .select('*')
      .from('settings')
      .where({
        name,
        user_id: this.user.id,
      })
      .fetch()

    return setting
  }
  async fetch () {
    const pool = this.ctx.pool

    return await pool
      .query()
      .select('*')
      .from('settings')
      .where({
        user_id: this.user.id,
      })
      .fetch()
  }
}