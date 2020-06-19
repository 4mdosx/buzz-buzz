import Telegram from './telegram.ts'
import { Message, Chat, Update, ReplyParams } from './type/mod.ts'
import { getPool } from '../db/client.ts'

export class Context {
  public readonly message?: Message
  public readonly chat?: Chat
  public readonly pool = getPool()

  constructor(
    public readonly update: Update,
    public readonly telegram: Telegram
  ) {
    this.message = update.message
    this.chat = this.message?.chat
  }

  public reply(
    text: string,
    params?: ReplyParams
  ): Promise<Message> | undefined {
    if (this.message !== undefined && this.chat !== undefined) {
      return this.telegram.sendMessage(this.chat.id, text, {
        reply_to_message_id: this.message.message_id,
        ...params,
      })
    }
  }
}
