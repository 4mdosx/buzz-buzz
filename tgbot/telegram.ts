import Client from './httpClient.ts'

export default class Telegram {
  private readonly client: Client
  constructor (token: string) {
    this.client = new Client(token)
  }

  async getMe () {
    return await this.client.get(`/getMe`)
  }

  async getUpdates (params?: any) {
    return await this.client.get(`/getUpdates`, params)
  }

  async sendMessage (chat_id: number | string, text: String, options = {}) {
    return await this.client.post(`/sendMessage`, { body: { chat_id, text, ...options } })
  }

  async deleteMessage (chat_id: number | string, message_id: number) {
    return await this.client.post('/deleteMessage', { body: { chat_id, message_id } })
  }
}