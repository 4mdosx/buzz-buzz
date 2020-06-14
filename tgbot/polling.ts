import { Bot } from './bot.ts'

export class Polling {
  public started = false
  private offset = 0
  private limit = 10
  private timeout = 0
  private allowedUpdates = []
  constructor(private readonly bot: Bot) {
    this.init()
  }

  init() {
    this.started = true
    this.fetch()
  }

  async fetch() {
    const updates: any[] = await this.bot.tg.getUpdates({
      offset: this.offset,
      limit: this.limit,
      timeout: this.timeout,
      allowedUpdates: this.allowedUpdates,
    })
    await this.bot.handleUpdates(updates)

    if (updates.length > 0) {
      this.offset = updates[updates.length - 1].update_id + 1
    }

    if (this.started) {
      await this.fetch()
    }
  }

  destory() {
    this.started = false
  }
}
