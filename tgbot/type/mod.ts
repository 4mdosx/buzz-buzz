interface GroupChat {
  type: 'group'
  id: number
  title: string
  all_members_are_administrators: boolean
}

interface PrivateChat {
  type: 'private'
  id: number
  first_name?: string
  last_name?: string
  username: string
}

export type Chat = PrivateChat | GroupChat
export interface User {
  id: number
  is_bot: boolean
  first_name?: string
  last_name?: string
  username: string
  language_code: 'en' | 'zh' | string
}

interface BaseMessage {
  message_id: number
  from: User
  chat: Chat
  date: number
  text?: string
  new_chat_participant?: User
  new_chat_member?: User
  new_chat_members?: User[]
}

export interface TextMessage extends BaseMessage {
  text: string
}

export interface InviteMessage extends BaseMessage {
  new_chat_participant: User
  new_chat_member: User
  new_chat_members: User[]
}

export type Message = TextMessage | InviteMessage
export interface Update {
  update_id: number
  message: Message
}

export interface ReplyParams {
  [key: string]: any
}
