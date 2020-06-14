import Telegram from './telegram.ts'
import { Polling } from './polling.ts'
import { logger } from '../logger.ts'
import { Update } from './type/mod.ts'
import { Context } from './context.ts'

export class Bot {
  readonly tg: Telegram
  private handlerMap: Map<string, Function> = new Map()
  private readonly options: object
  private polling: Polling | null = null

  constructor (token: string, options: object = {}) {
    this.tg = new Telegram(token)
    this.options = options
  }

  async handleUpdate (update: Update) {
    logger.info(`Processing update ${update.update_id}`)
    if (update.message) {
      const handler = this.handlerMap.get('message')
      if (handler) {
        await handler(new Context(update, this.tg))
      }
    } else {
      const handler = this.handlerMap.get('default')
      if (handler) {
        await handler(new Context(update, this.tg))
      } else {
        logger.warning(update)
      }
    }
  }

  async handleUpdates (updates: Update[]) {
    updates.forEach(u => this.handleUpdate(u))
  }

  on (name: 'message' | 'default' | string, handler: Function) {
    this.handlerMap.set(name, handler)
  }

  public async launch(): Promise<void> {
    const botInfo = await this.tg.getMe()

    logger.info(`Launching ${botInfo.username}`)

    if (this.polling) return
    this.polling = new Polling(this)
  }

  public stop () {
    this.polling?.destory()
    this.polling = null
  }
}